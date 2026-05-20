import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'sales';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password pre-save
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Since password has select: false, this.password will only exist if we explicitly select it.
  // In the compare method, this.password is evaluated.
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUserDocument>('User', UserSchema);
export default User;
