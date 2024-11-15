import mongoose, { Schema } from "mongoose";

interface IFields extends Document {
  name: string;
  type: "FIELD" | "IMAGE";
  image?: string;
  field?: string;
  defaultValue?: boolean;
  createdBy: mongoose.Types.ObjectId;
  isActive?: boolean;
}

const fieldsSchema = new Schema<IFields>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["FIELD", "IMAGE"],
    },
    image: {
      type: String,
    },
    field: {
      type: String,
    },
    defaultValue: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean, // cloudinary url
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFields>("Fields", fieldsSchema);
