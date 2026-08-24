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

  if (Number.isNaN(value.getTime())) return "-";

  return value.toLocaleDateString("th-TH", {
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
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadData = async () => {
    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const [leaves, works] = await Promise.all([
        axios.get(`${API_URL}/leaves`),
        axios.get(`${API_URL}/chooseworks`),
      ]);

      setLeaveRequests(getItems(leaves.data));
      setWorkSchedules(getItems(works.data));
    } catch (error) {
      console.error("Error loading notification data:", error);

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
    const updatingKey = `${type}-${item._id}`;

    setUpdatingId(updatingKey);

    setMessage({
      type: "",
      text: "",
    });

    try {
      await axios.put(`${API_URL}/${endpoint}/${item._id}`, {
        status,
      });

      // สร้าง notification หลังจากเปลี่ยนสถานะสำเร็จ
      try {
        await axios.post(`${API_URL}/notifications`, {
          username: item.username,
          date: item.date,
          type:
            type === "leave"
              ? item.type || "Leave request"
              : "Work schedule",
          status,
        });
      } catch (notificationError) {
        console.error(
          "Error creating notification:",
          notificationError
        );
      }

      const updateItems = (items) =>
        items.map((request) =>
          request._id === item._id
            ? {
                ...request,
                status,
              }
            : request
        );

      if (type === "leave") {
        setLeaveRequests(updateItems);
      } else {
        setWorkSchedules(updateItems);
      }

      setMessage({
        type: "success",
        text:
          status === "Approved"
            ? "อนุมัติเรียบร้อยแล้ว"
            : "ปฏิเสธเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error updating status:", error);

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
      <span
        className={`notification-status ${value.toLowerCase()}`}
      >
        {value === "Approved"
          ? "อนุมัติแล้ว"
          : value === "Rejected"
          ? "ปฏิเสธแล้ว"
          : "รออนุมัติ"}
      </span>
    );
  };

  const actions = (type, item) => {
    if (!isPending(item.status)) {
      return (
        <span className="notification-dash">
          -
        </span>
      );
    }

    const updatingKey = `${type}-${item._id}`;
    const isUpdating = updatingId === updatingKey;

    return (
      <div className="notification-actions">
        <button
          type="button"
          className="notification-approve-button"
          disabled={isUpdating}
          onClick={() =>
            updateStatus(type, item, "Approved")
          }
        >
          {isUpdating ? "กำลัง..." : "อนุมัติ"}
        </button>

        <button
          type="button"
          className="notification-reject-button"
          disabled={isUpdating}
          onClick={() =>
            updateStatus(type, item, "Rejected")
          }
        >
          {isUpdating ? "กำลัง..." : "ปฏิเสธ"}
        </button>
      </div>
    );
  };

  const pendingCount = [
    ...leaveRequests,
    ...workSchedules,
  ].filter((item) => isPending(item.status)).length;

  return (
    <main className="notification-page">
      <section className="notification-page-header">
        <div>
          <p className="notification-eyebrow">
            WORKMATE ADMINISTRATION
          </p>

          <h1>คำขอและการแจ้งเตือน</h1>

          <p>
            ตรวจสอบและดำเนินการคำขอจากพนักงาน
          </p>
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
        <article className="notification-summary-card">
          <span>คำขอลางาน</span>
          <strong>{leaveRequests.length}</strong>
          <small>รายการ</small>
        </article>

        <article className="notification-summary-card">
          <span>รายการลงงาน</span>
          <strong>{workSchedules.length}</strong>
          <small>รายการ</small>
        </article>

        <article className="notification-summary-card">
          <span>รอดำเนินการ</span>
          <strong>{pendingCount}</strong>
          <small>รายการ</small>
        </article>
      </section>

      {message.text && (
        <div
          className={`notification-message ${message.type}`}
        >
          {message.text}
        </div>
      )}

      {/* Leave Requests */}
      <section className="notification-content-card">
        <div className="notification-section-heading">
          <div>
            <h2>คำขอลางาน</h2>
            <p>รายการคำขอลางานจากพนักงาน</p>
          </div>

          <span className="notification-count">
            {leaveRequests.length} รายการ
          </span>
        </div>

        <div className="notification-table-wrapper">
          <table className="notification-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>พนักงาน</th>
                <th>ประเภทการลา</th>
                <th>วันที่ขอลา</th>
                <th>สถานะ</th>
                <th className="notification-actions-heading">
                  จัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="notification-empty-state"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="notification-empty-state"
                  >
                    ไม่มีข้อมูลคำขอลางาน
                  </td>
                </tr>
              ) : (
                leaveRequests.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="notification-employee">
                        <div className="notification-avatar">
                          {(item.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {item.username || "-"}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>{item.type || "-"}</td>

                    <td>{formatDate(item.date)}</td>

                    <td>
                      {statusBadge(item.status)}
                    </td>

                    <td>
                      {actions("leave", item)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Work Schedules */}
      <section className="notification-content-card">
        <div className="notification-section-heading">
          <div>
            <h2>รายการลงงาน</h2>
            <p>รายการบันทึกการลงงานจากพนักงาน</p>
          </div>

          <span className="notification-count">
            {workSchedules.length} รายการ
          </span>
        </div>

        <div className="notification-table-wrapper">
          <table className="notification-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>พนักงาน</th>
                <th>วันที่ลงงาน</th>
                <th>สถานะ</th>
                <th className="notification-actions-heading">
                  จัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="notification-empty-state"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : workSchedules.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="notification-empty-state"
                  >
                    ไม่มีข้อมูลการลงงาน
                  </td>
                </tr>
              ) : (
                workSchedules.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="notification-employee">
                        <div className="notification-avatar">
                          {(item.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {item.username || "-"}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>{formatDate(item.date)}</td>

                    <td>
                      {statusBadge(item.status)}
                    </td>

                    <td>
                      {actions("work", item)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Notification;