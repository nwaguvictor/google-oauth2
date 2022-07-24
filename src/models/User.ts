import { model, Schema, Types } from 'mongoose';

interface IUser {
  _id?: Types.ObjectId;
  username?: string;
  email?: string;
  password?: string;
  googleId?: string;
}

const User = model<IUser>(
  'User',
  new Schema<IUser>({
    username: String,
    email: String,
    password: String,
    googleId: String,
  })
);

export { User, IUser };
