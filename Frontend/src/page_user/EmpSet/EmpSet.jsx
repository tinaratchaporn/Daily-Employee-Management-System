import { useState, useEffect } from "react";
import "./EmpSet.css";

function WorkSchedule() {
  const [workDate, setWorkDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("");
  const [task, setTask] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [employee, setEmployee] = useState(null);  // ใช้สำหรับเก็บข้อมูลพนักงานที่ล็อกอิน
  const [submitStatus, setSubmitStatus] = useState(null);

  const [leaveDate, setLeaveDate] = useState(""); 
  const [leaveReason, setLeaveReason] = useState(""); 
  const [leaveType, setLeaveType] = useState(""); 
  const [leaveStatus, setLeaveStatus] = useState("Pending"); 
  const [leaveName, setLeaveName] = useState(""); 

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // ดึงข้อมูลพนักงานจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("user"));
    if (storedEmployee) {
      setEmployee(storedEmployee); // ตั้งค่าข้อมูลพนักงานที่ล็อกอิน
    } else {
      console.log("ไม่มีข้อมูลพนักงานใน localStorage");
    }
  }, []);

  // ดึงงานที่เลือกจาก API เมื่อพนักงานล็อกอิน
  useEffect(() => {
    if (employee) {
      fetch(`http://localhost:9000/api/data/getChooseworkEmployee?username=${employee.username}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('th-TH'),
          }));
          setScheduleList(formattedData);  // ตั้งค่าตารางการลงงานจากข้อมูลที่ดึงมา
        })
        .catch((error) => {
          console.error("Error fetching work schedules:", error);
        });
    }
  }, [employee]);  // เมื่อ `employee` เปลี่ยนแปลงหรือพนักงานล็อกอินเข้ามาใหม่จะดึงข้อมูลใหม่

  // ฟังก์ชันการส่งงาน
  const handleWorkSubmit = (event) => {
    event.preventDefault();

    if (!workDate || !department || !task || !employee) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const requestData = {
      userId: employee.userId,  // ใช้ userId ของพนักงานที่ล็อกอิน
      username: employee.username, // ใช้ username ของพนักงานที่ล็อกอิน
      name: employee.name,       // ใช้ name ของพนักงานที่ล็อกอิน
      department,
      task,
      date: workDate,
    };

    fetch("http://localhost:9000/api/data/Choosework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSubmitStatus("ลงงานสำเร็จ");
        setScheduleList((prev) => [...prev, requestData]);  // เพิ่มงานใหม่ในตาราง
        setDepartment("");
        setTask("");
      })
      .catch((error) => {
        setSubmitStatus("เกิดข้อผิดพลาดในการลงงาน");
        console.error("Error submitting work schedule:", error);
      });
  };

  // ฟังก์ชันการส่งลางาน
  const handleLeaveSubmit = (event) => {
    event.preventDefault();

    if (!leaveDate || !leaveReason || !leaveName || !leaveType || !employee) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const leaveRequest = {
      username: leaveName, 
      reason: leaveReason, 
      date: leaveDate,
      type: leaveType, 
      status: leaveStatus, 
    };

    fetch("http://localhost:9000/api/data/createLeaveRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaveRequest),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("คำขอลาได้รับการส่งแล้ว");
          setShowLeaveModal(false);
        } else {
          alert("เกิดข้อผิดพลาดในการส่งคำขอ");
        }
      })
      .catch(error => {
        console.error("Error submitting leave request:", error);
      });
  };

  return (
    <div className="work-schedule-container">
      <h1>แบบฟอร์มปฏิบัติงานและลางาน</h1>

      <div className="form-container">
        <div className="form-section">
          <h2>ฟอร์มลงงาน</h2>
          <form onSubmit={handleWorkSubmit}>
            <label>วันที่:</label>
            <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required />
            <label>แผนก:</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            <label>งานที่ต้องทำ:</label>
            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} required />
            <button type="submit">ลงงาน</button>
          </form>
        </div>

        <div className="form-section-leave">
          <button onClick={() => setShowLeaveModal(true)} className="leave-request-btn">
            ขอลา
          </button>
        </div>
      </div>

      {submitStatus && <p className="submit-status">{submitStatus}</p>}

      <h2 className="ngantchoose">งานที่เลือก</h2>
      <table>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>แผนก</th>
            <th>งาน</th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.length > 0 ? (
            scheduleList.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.department}</td>
                <td>{item.task}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">ยังไม่มีงานลงทะเบียน</td>
            </tr>
          )}
        </tbody>
      </table>

      {showLeaveModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>ฟอร์มขอลางาน</h2>
            <form onSubmit={handleLeaveSubmit}>
              <label>ชื่อพนักงาน:</label>
              <input
                type="text"
                value={leaveName}
                onChange={(e) => setLeaveName(e.target.value)}
                required
                placeholder="กรุณากรอกชื่อของคุณ"
              />
              <label>วันที่ลา:</label>
              <input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
              <label>เหตุผลการลา:</label>
              <textarea  value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
              <label>ประเภทการลา:</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                <option value="">เลือกประเภทการลา</option>
                <option value="Sick">ลาป่วย</option>
                <option value="Vacation">ลากิจ</option>
                <option value="Other">อื่นๆ</option>
              </select>
              <button type="submit">ขอลา</button>
              <button type="button" onClick={() => setShowLeaveModal(false)} className="close-modal-btn">ปิด</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkSchedule;
