import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon: string;
  extraInfo: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    icon: {
      type: String,
    },
    extraInfo: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>("Category", categorySchema);
