import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Standard', 'Luxe', 'Suite', 'Familiale'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    available: {
      type: Boolean,
      default: true,
    },
    amenities: [{
      type: String,
    }],
    images: [{
      type: String,
    }],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Accélère les recherches par type et disponibilité
roomSchema.index({ type: 1, available: 1 });

export default model('Room', roomSchema);
