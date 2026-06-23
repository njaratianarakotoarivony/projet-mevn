import Stripe from 'stripe';
import Payment from '../models/Payment.js';

// Client Stripe instancié paresseusement : la clé est lue à l'usage, pas au
// chargement du module (qui survient avant dotenv.config() via la gateway).
let stripeClient = null;
const getStripe = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

// POST /api/payment/pay  (authentifié)
// Crée un PaymentIntent (remplace l'API legacy `charges`) et persiste la
// transaction. Renvoie le `clientSecret` que le frontend confirme côté client.
const processPayment = async (req, res, next) => {
  try {
    const { amount, currency, reservationId, description } = req.body;
    const userId = req.user.userId;

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency,
      description: description || 'Paiement réservation hôtel',
      metadata: {
        userId: String(userId),
        ...(reservationId ? { reservationId: String(reservationId) } : {}),
      },
      automatic_payment_methods: { enabled: true },
    });

    const payment = await Payment.create({
      userId,
      reservationId: reservationId || undefined,
      amount,
      currency,
      description,
      status: 'pending',
      stripePaymentIntentId: intent.id,
    });

    res.status(201).json({
      success: true,
      clientSecret: intent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payment/refund  (authentifié)  body: { paymentIntentId }
const refundPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'paymentIntentId requis' });
    }

    const refund = await getStripe().refunds.create({ payment_intent: paymentIntentId });

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { status: 'refunded', refundId: refund.id }
    );

    res.json({ success: true, refund });
  } catch (error) {
    next(error);
  }
};

// POST /api/payment/webhook  (public, signature Stripe vérifiée)
// Confirme l'état réel du paiement de façon fiable (côté serveur).
const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event = req.body;

  // Vérification de signature si le secret est configuré (recommandé en prod).
  if (webhookSecret) {
    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        req.header('stripe-signature'),
        webhookSecret
      );
    } catch (err) {
      return res.status(400).send(`Webhook signature invalide : ${err.message}`);
    }
  }

  try {
    const intent = event.data?.object;
    if (event.type === 'payment_intent.succeeded' && intent) {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: 'succeeded', stripeChargeId: intent.latest_charge }
      );
    } else if (event.type === 'payment_intent.payment_failed' && intent) {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: 'failed' }
      );
    }
    res.json({ received: true });
  } catch (error) {
    // On renvoie 200 pour éviter les retries en boucle ; l'erreur est loggée.
    console.error('[webhook] traitement échoué :', error.message);
    res.json({ received: true });
  }
};

export { processPayment, refundPayment, handleWebhook };
