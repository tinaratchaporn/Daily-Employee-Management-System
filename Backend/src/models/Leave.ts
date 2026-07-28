import mongoose, { Schema } from "mongoose";

const LeaveSchema: Schema = new Schema({
  username: { type: String, required: true }, // เพิ่ม username
  status: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default: 'Pending' },
  type: { type: String, enum: ['Sick', 'Vacation', 'Other'], required: true },
  date: { type: Date, required: true }, // วันที่ขอลา
  reason: { type: String, required: true }, // เหตุผลการลา
}, { collection: "emp_leave" });

export default mongoose.model('EmpLeave', LeaveSchema);
