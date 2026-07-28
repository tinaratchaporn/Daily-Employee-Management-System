import EmpDetails from '../models/Employee';
import Choosework from '../models/Choosework';
import EmpLeave from '../models/Leave';


// ฟังก์ชันการคัดลอกข้อมูลไปยัง emp_leave โดยใช้ userId
export async function copyEmpDetailsToEmpLeaveByUserId(userId: string): Promise<void> {
  try {
    // ค้นหาข้อมูลพนักงานตาม userId
    const employee = await EmpDetails.findOne({ userId });

    if (!employee) {
      console.log(`ไม่พบพนักงานที่มี userId: ${userId}`);
      return;
    }

    const { name, department, status } = employee;

    const newLeaveRecord = new EmpLeave({
      userId,
      name,
      department,
      status,
      type: 'Sick',  // หรือ 'Vacation' ขึ้นอยู่กับกรณี
      reason: 'Leave reason here', // เพิ่มเหตุผลการลา
    });

    await newLeaveRecord.save();
    console.log(`บันทึกข้อมูลของ ${name} ลงใน emp_leave`);
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการคัดลอกข้อมูล:', err);
  }
}

// ฟังก์ชันการคัดลอกข้อมูลไปยัง emp_choosework โดยใช้ userId
export async function copyEmpDetailsToChooseworkByUserId(userId: string): Promise<void> {
  try {
    // ค้นหาข้อมูลพนักงานตาม userId
    const employee = await EmpDetails.findOne({ userId });

    if (!employee) {
      console.log(`ไม่พบพนักงานที่มี userId: ${userId}`);
      return;
    }

    const { name, department, status } = employee;

    const newWorkRecord = new Choosework({
      userId,
      name,
      department,
      task: 'Task details here', // คุณอาจจะมีฟิลด์ที่เกี่ยวข้องกับงาน
      status,
    });

    await newWorkRecord.save();
    console.log(`บันทึกข้อมูลของ ${name} ลงใน emp_choosework`);
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการคัดลอกข้อมูล:', err);
  }
}
