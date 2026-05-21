import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Standard', 'Luxe', 'Suite'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Room', roomSchema);
