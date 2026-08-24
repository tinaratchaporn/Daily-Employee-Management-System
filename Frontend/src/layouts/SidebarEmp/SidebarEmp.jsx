import "./SidebarEmp.css";
import { NavLink } from "react-router-dom";

function SidebarEmp() {
  return (
    <aside className="sidebar-emp">

      {/* Brand */}
      <div className="sidebar-emp-brand">
        <div className="sidebar-emp-brand-text">
          <h2>WorkMate</h2>
          <span>Employee</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-emp-menu">

        <NavLink
          to="/EmpNotifications"
          className={({ isActive }) =>
            `sidebar-emp-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-bell-fill"></i>
          <span>การแจ้งเตือน</span>
        </NavLink>

        <NavLink
          to="/EmpSet"
          className={({ isActive }) =>
            `sidebar-emp-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-file-earmark-fill"></i>
          <span>ลงงาน / ลางาน</span>
        </NavLink>

        <NavLink
          to="/EmpUser"
          className={({ isActive }) =>
            `sidebar-emp-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-person-circle"></i>
          <span>บัญชีผู้ใช้</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `sidebar-emp-link ${isActive ? "active" : ""}`
          }
        >
          <i className="bi bi-info-circle"></i>
          <span>About</span>
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="sidebar-emp-footer">
        <span>WorkMate</span>
        <small>© 2026</small>
      </div>

    </aside>
  );
}

export default SidebarEmp;