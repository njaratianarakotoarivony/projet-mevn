import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Montant dans la plus petite unité de la devise (ex: centimes)
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'eur',
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    method: {
      type: String,
      default: 'card',
    },
    description: {
      type: String,
    },
    // Références Stripe
    stripePaymentIntentId: {
      type: String,
    },
    stripeChargeId: {
      type: String,
    },
    refundId: {
      type: String,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ reservationId: 1 });

export default model('Payment', paymentSchema);
