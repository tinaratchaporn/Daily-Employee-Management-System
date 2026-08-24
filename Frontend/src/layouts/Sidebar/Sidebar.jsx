import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaClock,
  FaBell,
  FaUserCircle,
  FaInfoCircle,
} from "react-icons/fa";
import logo from "../../Images/workmate-logo.png";

function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src={logo}
          alt="WorkMate"
          className="sidebar-logo"
        />

        <div>
          <h2>WorkMate</h2>
          <span>{role || "Administrator"}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaUsers />
          <span>พนักงาน</span>
        </NavLink>

        <NavLink
          to="/working-status"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaClock />
          <span>สถานะการทำงาน</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaBell />
          <span>การแจ้งเตือน</span>
        </NavLink>

        <NavLink
          to="/user"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaUserCircle />
          <span>บัญชีผู้ใช้</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaInfoCircle />
          <span>เกี่ยวกับระบบ</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>WorkMate</span>
        <small>© 2026</small>
      </div>
    </aside>
  );
}

export default Sidebar;