import "./Logout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function User({ setRole, setToken }) {
  const navigate = useNavigate(); // กำหนด navigate
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser); // ตรวจสอบข้อมูลที่ได้จาก localStorage
    if (storedUser) {
      setUser(storedUser); // หากมีข้อมูลผู้ใช้ให้ตั้งค่าใน state
    } else {
      // ถ้าไม่มีข้อมูลผู้ใช้ใน localStorage แสดงข้อความ
      console.log("ไม่มีข้อมูลผู้ใช้ใน localStorage");
    }
  }, []);

  const Logout = () => {
    // ยืนยันก่อนออกจากระบบ
    const confirmLogout = window.confirm("คุณต้องการออกจากระบบหรือไม่?");
    if (confirmLogout) {
      // ลบ token และ user จาก localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user"); // ลบข้อมูลผู้ใช้

      // รีเซ็ต state ใน app.js
      setToken("");
      setRole("");

      // เปลี่ยนเส้นทางไปหน้า login
      navigate("/login");
    }
  };

  return (
    <div className="user-container">
      <div className="profile-container">
        <div className="section">
          <div className="profile-section">
            <div>
              {/* แสดงข้อมูลจาก state ที่ดึงมาจาก localStorage */}
              {user ? (
                <>
                  <h2>{user.username}</h2>
                  <p>{user.role}</p>
                </>
              ) : (
                <p>กำลังโหลดข้อมูล...</p> // ถ้าไม่มีข้อมูล ให้แสดงข้อความนี้
              )}
            </div>
          </div>
          <section>
            <div className="card">
              <h4>รายละเอียด</h4>
              <p>แผนก: {user?.department || "Not Available"}</p>
              <p>เบอร์โทรศัพท์: {user?.phone || "Not Available"}</p>
              <p>E-mail: {user?.email || "Not Available"}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="logout-container">
        <button type="button" className="btn btn-danger" onClick={Logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default User;
