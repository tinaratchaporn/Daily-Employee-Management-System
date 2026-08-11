import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUser } from "react-icons/fa";
import logo from "../../Images/workmate-logo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div className="home-bg-circle" />

      <section className="home-content">
        <img
          src={logo}
          alt="WorkMate"
          className="home-logo"
        />

        <h1>WorkMate</h1>

        <p className="home-subtitle">
          Daily Employee Management System
        </p>

        <p className="home-description">
          กรุณาเลือกประเภทผู้ใช้งาน
        </p>

        <div className="workspace-container">
          <button
            className="workspace-card"
            onClick={() => navigate("/login/admin")}
          >
            <div className="workspace-icon">
              <FaUserTie />
            </div>

            <div className="workspace-info">
              <h2>Administrator</h2>
              <span>Continue →</span>
            </div>
          </button>

          <button
            className="workspace-card"
            onClick={() => navigate("/login/employee")}
          >
            <div className="workspace-icon">
              <FaUser />
            </div>

            <div className="workspace-info">
              <h2>Employee</h2>
              <span>Continue →</span>
            </div>
          </button>
        </div>

        <footer className="home-footer">
          © 2026 WorkMate
        </footer>
      </section>
    </main>
  );
}

export default Home;