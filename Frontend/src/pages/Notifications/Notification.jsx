import "./Notification.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:9000/api";

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

const isPending = (status) =>
  String(status || "Pending").toLowerCase() === "pending";

function Notification() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [leaves, works] = await Promise.all([
        axios.get(`${API_URL}/leaves`),
        axios.get(`${API_URL}/chooseworks`),
      ]);

      setLeaveRequests(getItems(leaves.data));
      setWorkSchedules(getItems(works.data));
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถโหลดข้อมูลคำขอได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (type, item, status) => {
    const endpoint = type === "leave" ? "leaves" : "chooseworks";

    setUpdatingId(item._id);
    setMessage({ type: "", text: "" });

    try {
      await axios.put(`${API_URL}/${endpoint}/${item._id}`, { status });

      try {
        await axios.post(`${API_URL}/notifications`, {
          username: item.username,
          date: item.date,
          type: type === "leave" ? item.type || "Leave request" : "Work schedule",
          status,
        });
      } catch (notificationError) {
        console.error(notificationError);
      }

      const updateItems = (items) =>
        items.map((request) =>
          request._id === item._id ? { ...request, status } : request
        );

      if (type === "leave") {
        setLeaveRequests(updateItems);
      } else {
        setWorkSchedules(updateItems);
      }

      setMessage({
        type: "success",
        text: status === "Approved" ? "อนุมัติเรียบร้อยแล้ว" : "ปฏิเสธเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setUpdatingId("");
    }
  };

  const statusBadge = (status) => {
    const value = status || "Pending";

    return (
      <span className={`notification-status ${value.toLowerCase()}`}>
        {value === "Approved"
          ? "อนุมัติแล้ว"
          : value === "Rejected"
            ? "ปฏิเสธแล้ว"
            : "รออนุมัติ"}
      </span>
    );
  };

  const actions = (type, item) => {
    if (!isPending(item.status)) return <span className="notification-dash">-</span>;

    const isUpdating = updatingId === item._id;

    return (
      <div className="notification-actions">
        <button
          type="button"
          className="notification-approve-button"
          disabled={isUpdating}
          onClick={() => updateStatus(type, item, "Approved")}
        >
          อนุมัติ
        </button>

        <button
          type="button"
          className="notification-reject-button"
          disabled={isUpdating}
          onClick={() => updateStatus(type, item, "Rejected")}
        >
          ปฏิเสธ
        </button>
      </div>
    );
  };

  const pendingCount = [...leaveRequests, ...workSchedules].filter((item) =>
    isPending(item.status)
  ).length;

  return (
    <main className="notification-page">
      <section className="notification-page-header">
        <div>
          <p className="notification-eyebrow">WORKMATE ADMINISTRATION</p>
          <h1>คำขอและการแจ้งเตือน</h1>
          <p>ตรวจสอบและดำเนินการคำขอจากพนักงาน</p>
        </div>

        <button
          type="button"
          className="notification-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
        </button>
      </section>

      <section className="notification-summary">
        <div>
          <span>คำขอลางาน</span>
          <strong>{leaveRequests.length}</strong>
          <small>รายการ</small>
        </div>

        <div>
          <span>รายการลงงาน</span>
          <strong>{workSchedules.length}</strong>
          <small>รายการ</small>
        </div>

        <div>
          <span>รอดำเนินการ</span>
          <strong>{pendingCount}</strong>
          <small>รายการ</small>
        </div>
      </section>

      {message.text && (
        <div className={`notification-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="notification-content-card">
        <div className="notification-section-heading">
          <div>
            <h2>คำขอลางาน</h2>
            <p>รายการคำขอลางานจากพนักงาน</p>
          </div>
          <span className="notification-count">{leaveRequests.length} รายการ</span>
        </div>

        <div className="notification-list-wrapper">
          <div className="notification-list leave-list">
            <div className="notification-list-row notification-list-head">
              <span>ลำดับ</span>
              <span>พนักงาน</span>
              <span>ประเภทการลา</span>
              <span>วันที่ขอลา</span>
              <span>สถานะ</span>
              <span>จัดการ</span>
            </div>

            {loading ? (
              <div className="notification-list-empty">กำลังโหลดข้อมูล...</div>
            ) : leaveRequests.length === 0 ? (
              <div className="notification-list-empty">ไม่มีข้อมูลคำขอลางาน</div>
            ) : (
              leaveRequests.map((item, index) => (
                <div className="notification-list-row" key={item._id || index}>
                  <span>{index + 1}</span>
                  <span>{item.username || "-"}</span>
                  <span>{item.type || "-"}</span>
                  <span>{formatDate(item.date)}</span>
                  <span>{statusBadge(item.status)}</span>
                  <span>{actions("leave", item)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="notification-content-card">
        <div className="notification-section-heading">
          <div>
            <h2>รายการลงงาน</h2>
            <p>รายการบันทึกการลงงานจากพนักงาน</p>
          </div>
          <span className="notification-count">{workSchedules.length} รายการ</span>
        </div>

        <div className="notification-list-wrapper">
          <div className="notification-list work-list">
            <div className="notification-list-row notification-list-head">
              <span>ลำดับ</span>
              <span>พนักงาน</span>
              <span>วันที่ลงงาน</span>
              <span>สถานะ</span>
              <span>จัดการ</span>
            </div>

            {loading ? (
              <div className="notification-list-empty">กำลังโหลดข้อมูล...</div>
            ) : workSchedules.length === 0 ? (
              <div className="notification-list-empty">ไม่มีข้อมูลการลงงาน</div>
            ) : (
              workSchedules.map((item, index) => (
                <div className="notification-list-row" key={item._id || index}>
                  <span>{index + 1}</span>
                  <span>{item.username || "-"}</span>
                  <span>{formatDate(item.date)}</span>
                  <span>{statusBadge(item.status)}</span>
                  <span>{actions("work", item)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Notification;