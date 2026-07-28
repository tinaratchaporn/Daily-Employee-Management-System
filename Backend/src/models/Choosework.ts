import mongoose, { Schema } from "mongoose";

const Choosework : Schema = new Schema({
    username: String,
    name: String,
    department: String,
    task: String,
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    date: { type: Date, default: Date.now }
  }, { collection: "emp_Choosework" });
  

  export default mongoose.model('Choosework', Choosework);
  