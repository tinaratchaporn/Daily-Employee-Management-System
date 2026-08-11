import { useEffect, useState } from "react";
import axios from "axios";
import "./EmpNoti.css";

const API_URL = "http://localhost:9000/api/notifications";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const getItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatDate = (date) => {
  if (!date) return "-";

  const value = new Date(date);

  return Number.isNaN(value.getTime())
    ? "-"
    : value.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

function EmpNoti() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const loadNotifications = async () => {
    if (!storedUser?.username) {
      setLoading(false);
      setMessage({
        type: "error",
        text: "ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await axios.get(`${API_URL}/employee`, {
        ...getAuthConfig(),
        params: { username: storedUser.username },
      });

      setNotifications(getItems(data));
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถโหลดการแจ้งเตือนได้",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    if (!window.confirm("ต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?")) {
      return;
    }

    setDeletingId(notificationId);

    try {
      await axios.delete(`${API_URL}/${notificationId}`, getAuthConfig());

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== notificationId)
      );

      setMessage({
        type: "success",
        text: "ลบการแจ้งเตือนเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถลบการแจ้งเตือนได้",
      });
    } finally {
      setDeletingId("");
    }
  };

  const getStatusLabel = (status) => {
    if (status === "Approved") return "อนุมัติแล้ว";
    if (status === "Rejected") return "ปฏิเสธแล้ว";
    return "รอดำเนินการ";
  };

  return (
    <main className="emp-noti-page">
      <section className="emp-noti-header-card">
        <div>
          <p className="emp-noti-eyebrow">WORKMATE EMPLOYEE</p>
          <h1>การแจ้งเตือนของฉัน</h1>
          <p>ติดตามสถานะคำขอลาและรายการลงงานของคุณ</p>
        </div>

        <button
          type="button"
          className="emp-noti-refresh-button"
          onClick={loadNotifications}
          disabled={loading}
        >
          {loading ? "กำลังโหลด..." : "รีเฟรช"}
        </button>
      </section>

      {message.text && (
        <div className={`emp-noti-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="emp-noti-content-card">
        <div className="emp-noti-content-heading">
          <div>
            <h2>รายการแจ้งเตือน</h2>
            <p>ทั้งหมด {notifications.length} รายการ</p>
          </div>

          <span className="emp-noti-count">{notifications.length} รายการ</span>
        </div>

        <div className="emp-noti-list-wrapper">
          <div className="emp-noti-list">
            <div className="emp-noti-row emp-noti-list-head">
              <span>วันที่</span>
              <span>ประเภท</span>
              <span>รายละเอียด</span>
              <span>สถานะ</span>
              <span>จัดการ</span>
            </div>

            {loading ? (
              <div className="emp-noti-empty">กำลังโหลดการแจ้งเตือน...</div>
            ) : notifications.length === 0 ? (
              <div className="emp-noti-empty">ไม่มีการแจ้งเตือน</div>
            ) : (
              notifications.map((notification) => (
                <div className="emp-noti-row" key={notification._id}>
                  <span>{formatDate(notification.date)}</span>
                  <span>{notification.type || "-"}</span>
                  <span>{notification.reason || notification.message || "-"}</span>
                  <span>
                    <span
                      className={`emp-noti-status ${String(
                        notification.status || "Pending"
                      ).toLowerCase()}`}
                    >
                      {getStatusLabel(notification.status)}
                    </span>
                  </span>
                  <span>
                    <button
                      type="button"
                      className="emp-noti-delete-button"
                      onClick={() => handleDelete(notification._id)}
                      disabled={deletingId === notification._id}
                    >
                      {deletingId === notification._id ? "กำลังลบ..." : "ลบ"}
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default EmpNoti;