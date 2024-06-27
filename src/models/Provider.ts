import mongoose, { Document, Schema } from 'mongoose';

export interface IProvider extends Document {
  provider: 'gmail' | 'outlook';
  email: string;
  accessToken: string;
  refreshToken: string;
}

const ProviderSchema = new Schema({
  provider: { type: String, enum: ['gmail', 'outlook'], required: true },
  email: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
});

const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);

export default Provider;
