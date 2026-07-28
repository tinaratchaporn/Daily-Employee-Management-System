import "./Notification.css";
import { useEffect, useState } from "react";

function Notification() {
  const [leaveRequests, setLeaveRequests] = useState([]); // เก็บข้อมูลคำขอลางาน
  const [workSchedules, setWorkSchedules] = useState([]); // เก็บข้อมูลการลงงาน
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  useEffect(() => {
    // ดึงข้อมูลคำขอลางาน
    fetch("http://localhost:9000/api/data/getLeaveRequests")
      .then((response) => response.json())
      .then((data) => {
        console.log("Leave Requests:", data); // เพิ่มการ log ข้อมูล
        setLeaveRequests(data); // ตั้งค่าข้อมูลคำขอลางาน
      })
      .catch((error) => {
        console.error("Error fetching leave requests:", error);
      });

    // ดึงข้อมูลการลงงานจาก API
    fetch("http://localhost:9000/api/data/getChoosework")
      .then((response) => response.json())
      .then((data) => {
        console.log("Work Schedules:", data); // เพิ่มการ log ข้อมูล
        setWorkSchedules(data); // ตั้งค่าข้อมูลการลงงาน
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching work schedules:", error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันสำหรับการส่งการแจ้งเตือน
  const sendNotification = (notification) => {
    fetch("http://localhost:9000/api/data/createNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Notification sent successfully");
        } else {
          console.error("Failed to send notification");
        }
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  // ฟังก์ชันอนุมัติคำขอ
  const handleApprove = (leaveRequestusername) => {
    fetch(
      `http://localhost:9000/api/data/updateLeaveRequest/${leaveRequestusername}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Approved" }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("คำขอได้รับการอนุมัติแล้ว");
          // อัปเดตคำขอใน state
          setLeaveRequests((prev) =>
            prev.map((request) =>
              request._id === leaveRequestusername
                ? { ...request, status: "Approved" }
                : request
            )
          );

          // สร้างการแจ้งเตือน
          const notification = {
            username: data.request.username,
            date: data.request.date,
            type: data.request.type,
            status: "Approved",
          };

          sendNotification(notification);
        } else {
          alert("เกิดข้อผิดพลาดในการอนุมัติคำขอ");
        }
      })
      .catch((error) => {
        console.error("Error approving leave request:", error);
      });
  };

  // ฟังก์ชันปฏิเสธคำขอ
  const handleReject = (leaveRequestusername) => {
    fetch(
      `http://localhost:9000/api/data/updateLeaveRequest/${leaveRequestusername}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Rejected" }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("คำขอได้รับการปฏิเสธแล้ว");
          // อัปเดตคำขอใน state
          setLeaveRequests((prev) =>
            prev.map((request) =>
              request._id === leaveRequestusername
                ? { ...request, status: "Rejected" }
                : request
            )
          );

          // สร้างการแจ้งเตือน
          const notification = {
            username: data.request.username,
            date: data.request.date,
            type: data.request.type,
            status: "Rejected",
          };

          sendNotification(notification);
        } else {
          alert("เกิดข้อผิดพลาดในการปฏิเสธคำขอ");
        }
      })
      .catch((error) => {
        console.error("Error rejecting leave request:", error);
      });
  };

  // ฟังก์ชันอนุมัติการลงงาน
  const handleApproveWork = (workScheduleId) => {
    fetch(`http://localhost:9000/api/data/updatestatuswork/${workScheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Work schedule has been approved");

          // Update the work schedule in the state
          setWorkSchedules((prev) =>
            prev.map((schedule) =>
              schedule._id === workScheduleId
                ? { ...schedule, status: "Approved" }
                : schedule
            )
          );

          // Create a notification for approval
          const notification = {
            username: data.schedule.username,
            date: data.schedule.date,
            type: "Work Schedule",
            status: "Approved",
          };

          sendNotification(notification);
        } else {
          alert("Error approving the work schedule");
        }
      })
      .catch((error) => {
        console.error("Error approving work schedule:", error);
      });
  };

  // ฟังก์ชันปฏิเสธการลงงาน
  const handleRejectWork = (workScheduleId) => {
    fetch(`http://localhost:9000/api/data/updatestatuswork/${workScheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Work schedule has been rejected");

          // Update the work schedule in the state
          setWorkSchedules((prev) =>
            prev.map((schedule) =>
              schedule._id === workScheduleId
                ? { ...schedule, status: "Rejected" }
                : schedule
            )
          );

          // Create a notification for rejection
          const notification = {
            username: data.schedule.username,
            date: data.schedule.date,
            type: "Work Schedule",
            status: "Rejected",
          };

          sendNotification(notification);
        } else {
          alert("Error rejecting the work schedule");
        }
      })
      .catch((error) => {
        console.error("Error rejecting work schedule:", error);
      });
  };

  // แสดงผลลัพธ์
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notification">
      <div className="leave-requests">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">คำขอลางาน</h5>
            <div className="scrollable-content">
              <table>
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อพนักงาน</th>
                    <th>ประเภทการลา</th>
                    <th>วันที่ขอลา</th>
                    <th>สถานะ</th>
                    <th>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length > 0 ? (
                    leaveRequests.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.username}</td>
                        <td>{item.type}</td>
                        <td>
                          {new Date(item.date).toLocaleDateString("th-TH")}
                        </td>
                        <td>{item.status}</td>
                        <td>
                          {item.status === "Pending" && (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleApprove(item._id)}
                              >
                                อนุมัติ
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleReject(item._id)}
                              >
                                ปฏิเสธ
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">ไม่มีข้อมูลคำขอลางาน</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="work-schedules">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">การลงงาน</h5>
            <div className="scrollable-content">
              <table>
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อพนักงาน</th>
                    <th>วันที่ลงงาน</th>
                    <th>สถานะ</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {workSchedules.length > 0 ? (
                    workSchedules.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.username}</td>
                        <td>
                          {new Date(item.date).toLocaleDateString("th-TH")}
                        </td>
                        <td>{item.status}</td>
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">ไม่มีข้อมูลการลงงาน</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
