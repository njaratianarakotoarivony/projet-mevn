import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'votre_cle_stripe');

const processPayment = async (req, res, next) => {
  try {
    const { amount, currency, source, description } = req.body;
    
    if (!amount || !currency || !source) {
      return res.status(400).json({ message: 'Montant, devise et source requis' });
    }
    
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description: description || 'Paiement réservation hôtel',
    });
    
    res.json({ success: true, charge });
  } catch (error) {
    next(error);
  }
};

const refundPayment = async (req, res, next) => {
  try {
    const { chargeId } = req.body;
    
    if (!chargeId) {
      return res.status(400).json({ message: 'ID de transaction requis' });
    }
    
    const refund = await stripe.refunds.create({
      charge: chargeId,
    });
    
    res.json({ success: true, refund });
  } catch (error) {
    next(error);
  }
};

export { processPayment, refundPayment };
