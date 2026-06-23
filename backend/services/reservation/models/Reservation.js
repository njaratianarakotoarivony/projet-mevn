import { Schema, model } from 'mongoose';

const reservationSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    // Prix total calculé à la réservation (nb nuits x prix) — Phase 3
    totalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmée', 'annulée', 'terminée'],
      default: 'confirmée',
    },
  },
  { timestamps: true }
);

// Pour les requêtes de disponibilité / détection de chevauchement (Phase 3)
reservationSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });
reservationSchema.index({ userId: 1 });

export default model('Reservation', reservationSchema);
