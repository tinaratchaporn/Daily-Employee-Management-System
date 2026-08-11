import { useEffect, useState } from "react";
import axios from "axios";
import "./EmpSet.css";

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
    ? date
    : value.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

function EmpSet() {
  const [employee, setEmployee] = useState(null);
  const [workDate, setWorkDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [department, setDepartment] = useState("");
  const [task, setTask] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage({
        type: "error",
        text: "ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่",
      });
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setEmployee(user);
      setDepartment(user.department || "");
    } catch {
      setMessage({
        type: "error",
        text: "ไม่สามารถอ่านข้อมูลผู้ใช้งานได้",
      });
      setLoading(false);
    }
  }, []);

  const loadSchedules = async (username) => {
    if (!username) return;

    setLoading(true);

    try {
      const { data } = await axios.get(`${API_URL}/chooseworks/employee`, {
        params: { username },
      });

      setScheduleList(getItems(data));
    } catch (error) {
      console.error("Error loading schedules:", error);
      setMessage({
        type: "error",
        text: "ไม่สามารถโหลดรายการงานของคุณได้",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.username) {
      loadSchedules(employee.username);
    }
  }, [employee]);

  const handleWorkSubmit = async (event) => {
    event.preventDefault();

    if (!employee?.username || !workDate || !department.trim() || !task.trim()) {
      setMessage({
        type: "error",
        text: "กรุณากรอกข้อมูลการทำงานให้ครบถ้วน",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    const workData = {
      userId: employee.userId,
      username: employee.username,
      name: employee.name || employee.username,
      department: department.trim(),
      task: task.trim(),
      date: workDate,
      status: "Pending",
    };

    try {
      const { data } = await axios.post(`${API_URL}/chooseworks`, workData);
      const savedWork = data?.data || data?.schedule || data || workData;

      setScheduleList((previous) => [savedWork, ...previous]);
      setTask("");

      setMessage({
        type: "success",
        text: "ส่งรายการลงงานเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error submitting work:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "ไม่สามารถส่งรายการลงงานได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (event) => {
    event.preventDefault();

    if (!employee?.username || !leaveDate || !leaveReason.trim() || !leaveType) {
      setMessage({
        type: "error",
        text: "กรุณากรอกข้อมูลการลาให้ครบถ้วน",
      });
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/leaves`, {
        userId: employee.userId,
        username: employee.username,
        name: employee.name || employee.username,
        date: leaveDate,
        reason: leaveReason.trim(),
        type: leaveType,
        status: "Pending",
      });

      setLeaveDate("");
      setLeaveReason("");
      setLeaveType("");
      setShowLeaveModal(false);

      setMessage({
        type: "success",
        text: "ส่งคำขอลาเรียบร้อยแล้ว กรุณารอการอนุมัติ",
      });
    } catch (error) {
      console.error("Error submitting leave:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "ไม่สามารถส่งคำขอลาได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="emp-set-page">
      <section className="emp-set-header-card">
        <div>
          <p className="emp-set-eyebrow">WORKMATE EMPLOYEE</p>
          <h1>บันทึกงานและคำขอลา</h1>
          <p>
            {employee?.name
              ? `สวัสดี ${employee.name} จัดการรายการของคุณได้จากหน้านี้`
              : "จัดการรายการทำงานและคำขอลาของคุณ"}
          </p>
        </div>

        <button
          type="button"
          className="emp-leave-button"
          onClick={() => setShowLeaveModal(true)}
        >
          ยื่นคำขอลา
        </button>
      </section>

      {message.text && (
        <div className={`emp-message ${message.type}`}>{message.text}</div>
      )}

      <section className="emp-work-card">
        <div className="emp-card-heading">
          <div>
            <h2>บันทึกการลงงาน</h2>
            <p>กรอกรายละเอียดงานที่ปฏิบัติในแต่ละวัน</p>
          </div>
        </div>

        <form className="emp-work-form" onSubmit={handleWorkSubmit}>
          <label>
            วันที่ปฏิบัติงาน
            <input
              type="date"
              value={workDate}
              onChange={(event) => setWorkDate(event.target.value)}
              disabled={submitting}
              required
            />
          </label>

          <label>
            แผนก
            <input
              type="text"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="ระบุแผนก"
              disabled={submitting}
              required
            />
          </label>

          <label className="emp-form-full">
            รายละเอียดงาน
            <textarea
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="อธิบายงานที่ปฏิบัติในวันนี้"
              disabled={submitting}
              required
            />
          </label>

          <div className="emp-form-actions">
            <button
              type="submit"
              className="emp-submit-button"
              disabled={submitting}
            >
              {submitting ? "กำลังส่งข้อมูล..." : "ส่งรายการลงงาน"}
            </button>
          </div>
        </form>
      </section>

      <section className="emp-history-card">
        <div className="emp-card-heading">
          <div>
            <h2>ประวัติรายการลงงาน</h2>
            <p>รายการที่คุณบันทึกไว้ทั้งหมด</p>
          </div>

          <button
            type="button"
            className="emp-refresh-button"
            onClick={() => loadSchedules(employee?.username)}
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "รีเฟรช"}
          </button>
        </div>

        <div className="emp-history-wrapper">
          <div className="emp-history-list">
            <div className="emp-history-row emp-history-head">
              <span>วันที่</span>
              <span>แผนก</span>
              <span>รายละเอียดงาน</span>
              <span>สถานะ</span>
            </div>

            {loading ? (
              <div className="emp-history-empty">กำลังโหลดข้อมูล...</div>
            ) : scheduleList.length === 0 ? (
              <div className="emp-history-empty">ยังไม่มีรายการลงงาน</div>
            ) : (
              scheduleList.map((item, index) => (
                <div
                  className="emp-history-row"
                  key={item._id || `${item.date}-${index}`}
                >
                  <span>{formatDate(item.date)}</span>
                  <span>{item.department || "-"}</span>
                  <span>{item.task || "-"}</span>
                  <span className={`emp-status ${(item.status || "Pending").toLowerCase()}`}>
                    {item.status === "Approved"
                      ? "อนุมัติแล้ว"
                      : item.status === "Rejected"
                        ? "ปฏิเสธแล้ว"
                        : "รอตรวจสอบ"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {showLeaveModal && (
        <div
          className="emp-modal-overlay"
          onMouseDown={() => !submitting && setShowLeaveModal(false)}
        >
          <section
            className="emp-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="emp-modal-heading">
              <div>
                <p className="emp-set-eyebrow">LEAVE REQUEST</p>
                <h2>ยื่นคำขอลา</h2>
              </div>

              <button
                type="button"
                className="emp-close-button"
                onClick={() => setShowLeaveModal(false)}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form className="emp-leave-form" onSubmit={handleLeaveSubmit}>
              <label>
                วันที่ลา
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(event) => setLeaveDate(event.target.value)}
                  disabled={submitting}
                  required
                />
              </label>

              <label>
                ประเภทการลา
                <select
                  value={leaveType}
                  onChange={(event) => setLeaveType(event.target.value)}
                  disabled={submitting}
                  required
                >
                  <option value="">เลือกประเภทการลา</option>
                  <option value="Sick">ลาป่วย</option>
                  <option value="Vacation">ลากิจ</option>
                  <option value="Other">อื่น ๆ</option>
                </select>
              </label>

              <label>
                เหตุผลการลา
                <textarea
                  value={leaveReason}
                  onChange={(event) => setLeaveReason(event.target.value)}
                  placeholder="ระบุเหตุผลการลา"
                  disabled={submitting}
                  required
                />
              </label>

              <div className="emp-modal-actions">
                <button
                  type="button"
                  className="emp-cancel-button"
                  onClick={() => setShowLeaveModal(false)}
                  disabled={submitting}
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="emp-submit-button"
                  disabled={submitting}
                >
                  {submitting ? "กำลังส่ง..." : "ส่งคำขอลา"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default EmpSet;