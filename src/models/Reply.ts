import mongoose, { Document, Schema } from 'mongoose';

interface IReplies {
  content: string;
}

interface IReply extends Document {
  provider: 'gmail' | 'outlook';
  emailId: string;
  content: string;
  tag: 'interested' | 'not interested' | 'more information';
  replies: IReplies[];
}

const RepliesSchema = new Schema({
  content: { type: String, required: true },
});

const ReplySchema = new Schema({
  provider: { type: String, enum: ['gmail', 'outlook'], required: true },
  emailId: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, enum: ['interested', 'not interested', 'more information'], required: true },
  replies: { type: [RepliesSchema], default: [] },
});

const Reply = mongoose.model<IReply>('Reply', ReplySchema);
export default Reply;
export { IReplies, IReply };
