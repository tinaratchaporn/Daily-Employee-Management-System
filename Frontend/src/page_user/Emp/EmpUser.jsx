import "./EmpUser.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function User({ setRole, setToken }) {
  const navigate = useNavigate(); // กำหนด navigate
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับการโหลด

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser); // ตรวจสอบข้อมูลที่ได้จาก localStorage
    if (storedUser) {
      setUser(storedUser); // หากมีข้อมูลผู้ใช้ให้ตั้งค่าใน state
      setLoading(false); // เปลี่ยนเป็น false เมื่อข้อมูลโหลดเสร็จ
    } else {
      // ถ้าไม่มีข้อมูลผู้ใช้ใน localStorage แสดงข้อความ
      console.log("ไม่มีข้อมูลผู้ใช้ใน localStorage");
      setLoading(false); // เปลี่ยนเป็น false เมื่อไม่พบข้อมูล
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
              {loading ? (
                <p>กำลังโหลดข้อมูล...</p> // ถ้ากำลังโหลดข้อมูล
              ) : user ? (
                <>
                  <h2>{user.username}</h2>
                  <p>{user.role}</p>
                </>
              ) : (
                <p>ไม่พบข้อมูลผู้ใช้</p> // หากไม่พบข้อมูลจาก localStorage
              )}
            </div>
          </div>
          <section>
            <div className="card">
              <h4>รายละเอียด</h4>
              <p>ตำแหน่ง: {user?.department || "Not Available"}</p>
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
