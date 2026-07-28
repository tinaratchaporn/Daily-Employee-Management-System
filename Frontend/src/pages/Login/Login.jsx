import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9000/api/data/login",
        {
          username,
          password,
        }
      );

      if (response.data.token) {
        setToken(response.data.token);
        setRole(response.data.user.role);

        // เก็บข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user.userId);

        // Navigate based on role
        if (response.data.user.role === "admin") {
          navigate("/employees");
        } else if (response.data.user.role === "Employee") {
          navigate("/EmpSet");
        } else {
          setError("บทบาทของคุณไม่ได้รับการสนับสนุน");
        }
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">ชื่อผู้ใช้</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="กรอกชื่อผู้ใช้"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">รหัสผ่าน</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="กรอกรหัสผ่าน"
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
};

export default Login;
