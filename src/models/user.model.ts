import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  password: string;
  refreshToken?: string;
  role: number;
  otp?: number;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface JwtDecodeToken {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: number;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true, // Cloudinary URL
    },
    coverImage: {
      type: String, // Cloudinary URL
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    otp: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process?.env?.REFRESH_TOKEN_SECRET ?? "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Create the User model with specific document type and methods
export default mongoose.model<IUser>("User", userSchema);
