import mongoose, { Schema } from 'mongoose';

const EmpDetailsSchema: Schema = new Schema({
  userId: String,
  username: String,
  password: String,
  name: String,
  department: String,
  phone: String,
  email: String,
  role: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  sick: { type: String, default: "0" },
  vacation: { type: String, default: "0" },
  date: { type: Date, default: Date.now },
  hrs: { type: Number, default: "0" }, // ชั่วโมงทำงาน (ถ้ามี)
  workday: { type: Number, default: "0" } // วันทำงาน
}, { collection: "emp_details" });

export default mongoose.model('EmpDetails', EmpDetailsSchema);

