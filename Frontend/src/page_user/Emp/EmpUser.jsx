import "./EmpUser.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EmpUser({ setRole, setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    if (!window.confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setToken("");
    setRole("");

    navigate("/", { replace: true });
  };

  const displayName = user?.name || user?.username || "Employee";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="emp-user-page">
      <section className="emp-user-header-card">
        <div>
          <p className="emp-user-eyebrow">WORKMATE EMPLOYEE</p>
          <h1>โปรไฟล์ของฉัน</h1>
          <p>ตรวจสอบข้อมูลบัญชีผู้ใช้งานของคุณ</p>
        </div>
      </section>

      <section className="emp-profile-card">
        {loading ? (
          <div className="emp-user-loading">กำลังโหลดข้อมูล...</div>
        ) : !user ? (
          <div className="emp-user-loading">
            ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่
          </div>
        ) : (
          <>
            <div className="emp-profile-summary">
              <div className="emp-profile-avatar">{initial}</div>

              <div>
                <h2>{displayName}</h2>
                <p>@{user.username || "-"}</p>
                <span className="emp-role-badge">Employee</span>
              </div>
            </div>

            <div className="emp-profile-details">
              <div className="emp-profile-detail">
                <span>แผนก</span>
                <strong>{user.department || "-"}</strong>
              </div>

              <div className="emp-profile-detail">
                <span>เบอร์โทรศัพท์</span>
                <strong>{user.phone || "-"}</strong>
              </div>

              <div className="emp-profile-detail">
                <span>อีเมล</span>
                <strong>{user.email || "-"}</strong>
              </div>

              <div className="emp-profile-detail">
                <span>เลขประจำตัวประชาชน</span>
                <strong>{user.userId || "-"}</strong>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="emp-user-logout-card">
        <div>
          <h2>ออกจากระบบ</h2>
          <p>คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานต่อ</p>
        </div>

        <button
          type="button"
          className="emp-logout-button"
          onClick={handleLogout}
        >
          ออกจากระบบ
        </button>
      </section>
    </main>
  );
}

export default EmpUser;