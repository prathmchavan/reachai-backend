import mongoose, { Document, Schema, Types } from 'mongoose';
import { IProvider } from './Provider';

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  providers: Types.Array<IProvider>;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  providers: [{ type: Schema.Types.ObjectId, ref: 'Provider' }]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
