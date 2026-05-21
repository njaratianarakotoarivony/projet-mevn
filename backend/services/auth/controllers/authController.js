import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export default { register, login };
