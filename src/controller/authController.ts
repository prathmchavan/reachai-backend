import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response) => {
  const { name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, username, password: hashedPassword });

  try {
    await user.save();
    const accessToken = jwt.sign({ id: user.username }, JWT_SECRET);
    res.json({ accessToken });
  } catch (error : string | any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
  res.json({ accessToken });
};
