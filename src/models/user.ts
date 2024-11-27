import mongoose from 'mongoose';

// Interface for User document
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Export the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
