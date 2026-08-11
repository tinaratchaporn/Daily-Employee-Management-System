import mongoose, { Schema } from "mongoose";

const LeaveSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["Sick", "Vacation", "Other"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    collection: "emp_leave",
  }
);

export default mongoose.model("EmpLeave", LeaveSchema);