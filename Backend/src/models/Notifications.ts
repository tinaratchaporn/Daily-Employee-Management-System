import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  username: string;
  date: Date;
  type: string;
  status: string;
  reason?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    username: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);