import "./Login.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Images/workmate-logo.png";

function Login({ setToken, setRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRole = location.pathname.includes("/admin")
    ? "admin"
    : "Employee";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:9000/api/auth/login",
        {
          username: username.trim(),
          password,
        }
      );

      if (!data.token || !data.user) {
        throw new Error("ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง");
      }

      const userRole = data.user.role;

      // ตรวจสอบว่าบัญชีตรงกับหน้าที่เลือกหรือไม่
      if (
        (selectedRole === "admin" && userRole !== "admin") ||
        (selectedRole === "Employee" && userRole !== "Employee")
      ) {
        setError("บัญชีนี้ไม่สามารถเข้าสู่หน้านี้ได้");
        return;
      }

      // บันทึกข้อมูลการเข้าสู่ระบบ
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.userId || "");
      localStorage.setItem("role", userRole);

      setToken(data.token);
      setRole(userRole);

      // ไปหน้าตาม Role
      if (userRole === "admin") {
        navigate("/employees", { replace: true });
      } else {
        navigate("/EmpSet", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else if (error.response?.status === 400) {
        setError(
          error.response.data?.error ||
            "กรุณาตรวจสอบข้อมูลอีกครั้ง"
        );
      } else if (!error.response) {
        setError(
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
        );
      } else {
        setError(
          "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main className="login-page">
      <div className="login-bg-circle" />

      <section className="login-card">

        {/* ปุ่มกลับ */}
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          disabled={loading}
        >
          <span className="back-arrow">←</span>
          <span>กลับ</span>
        </button>

        {/* Header */}
        <div className="login-header">
          <img
            src={logo}
            alt="WorkMate"
            className="login-logo"
          />

          <h1>ยินดีต้อนรับ</h1>

          <p>เข้าสู่ระบบ WorkMate</p>
        </div>

        {/* Role */}
        <div className="login-role">
          <span className="role-label">
            กำลังเข้าสู่ระบบในฐานะ
          </span>

          <span className="role-badge">
            {selectedRole === "admin"
              ? "Administrator"
              : "Employee"}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="input-group">
            <label htmlFor="username">
              ชื่อผู้ใช้
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="กรอกชื่อผู้ใช้"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">
              รหัสผ่าน
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="กรอกรหัสผ่าน"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                disabled={loading}
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <p className="login-footer">
          WorkMate Employee Management System
        </p>
      </section>
    </main>
  );
}

export default Login;