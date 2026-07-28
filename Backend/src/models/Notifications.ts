import mongoose, { Document, Schema } from "mongoose";

// กำหนด interface สำหรับ Notification เพื่อให้แน่ใจว่า type ของข้อมูลถูกต้อง
interface INotification extends Document {
  username: string;
  date: Date;
  type: string;
  status: string;
  reason?: string;
}

// สร้าง Schema สำหรับ Notification
const NotificationSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    reason: { type: String, required: false },
  },
  { timestamps: true } // เพิ่ม timestamps (createdAt, updatedAt) อัตโนมัติ
);

// สร้างและ export model โดยใช้ interface INotification
const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
