import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
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
  },
  status: {
    type: String,
    enum: ['confirmée', 'annulée', 'terminée'],
    default: 'confirmée',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Reservation', reservationSchema);
