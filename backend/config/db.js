import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_management';
    await connect(mongoURI);
    console.log('MongoDB connecté avec succès.');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
};

export default connectDB;
