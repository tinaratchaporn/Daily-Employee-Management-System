import { useEffect, useState } from "react";
import axios from "axios";
import "./EmpNoti.css";

function EmpNoti() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลการแจ้งเตือน
  useEffect(() => {
    fetch("http://localhost:9000/api/data/getNotification")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Notifications:", data);
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันสำหรับอัปเดตสถานะการแจ้งเตือน
  const handleApproval = async (notificationId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/data/updateNotification/${notificationId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId
              ? { ...notif, status: newStatus }
              : notif
          )
        );
        console.log("Notification status updated successfully");
      } else {
        console.error("Failed to update notification status");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // ฟังก์ชันสำหรับลบการแจ้งเตือน
  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/data/deleteNotification/${notificationId}`
      );
      if (response.data.success) {
        // ลบการแจ้งเตือนจาก state
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif._id !== notificationId)
        );
        console.log("Notification deleted successfully");
      } else {
        console.error("Failed to delete notification", response.data);
      }
    } catch (error) {
      console.error("Error deleting notification:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลดการแจ้งเตือน...</div>;
  }

  return (
    <div className="EmpNoti-container">
      <h1>การแจ้งเตือน</h1>
      {notifications.length === 0 ? (
        <p>ไม่มีการแจ้งเตือน</p>
      ) : (
        <table className="notification-table">
          <thead>
            <tr>
              <th>#</th>
              <th>วันที่</th>
              <th>ประเภทการลา</th>
              <th>สถานะ</th>
              <th>เหตุผล</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif, index) => (
              <tr key={notif._id} className={`status-${notif.status?.toLowerCase()}`}>
                <td>{index + 1}</td>
                <td>{new Date(notif.date).toLocaleDateString("th-TH")}</td>
                <td>{notif.type}</td>
                <td>
                  <span
                    className={
                      notif.status === "Approved"
                        ? "status-approved"
                        : notif.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {notif.status === "Approved"
                      ? "อนุมัติ"
                      : notif.status === "Rejected"
                      ? "ปฏิเสธ"
                      : "รอดำเนินการ"}
                  </span>
                </td>
                <td>{notif.reason || "ไม่มีเหตุผลระบุ"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(notif._id)} // เรียกฟังก์ชันลบ
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmpNoti;
