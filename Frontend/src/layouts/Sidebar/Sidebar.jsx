import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const initPage = "Dashboard";

function Sidebar({ role }) {
  const [tab, setTab] = useState(initPage);

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
       
        <Link to="/employees">
          <button
            className={tab === "Employees" ? "active" : ""}
            onClick={() => setTab("Employees")}
          >
            <span className="bi bi-people-fill"> &nbsp;&nbsp;พนักงาน</span>
          </button>
        </Link>
        <Link to="/working-status">
          <button
            className={tab === "Working Status" ? "active" : ""}
            onClick={() => setTab("Working Status")}
          >
            <span className="bi bi-clock-history">&nbsp; สถานะการทำงาน</span>
          </button>
        </Link>
      
        <Link to="/notifications">
          <button
            className={tab === "Notifications" ? "active" : ""}
            onClick={() => setTab("Notifications")}
          >
            <span className="bi bi-bell-fill"> &nbsp;การแจ้งเตือน</span>
          </button>
        </Link>
       
        <Link to="/user">
          <button
            className={tab === "User" ? "active" : ""}
            onClick={() => setTab("User")}
          >
            <span className="bi bi-person-circle"> &nbsp; ออกจากระบบ</span>
          </button>
        </Link>

        <Link to="/about">
          <button
            className={tab === "About" ? "active" : ""}
            onClick={() => setTab("About")}
          >
            <span className="bi bi-info-circle"> &nbsp; About</span>
          </button>
        </Link>


      </div>
    </div>
  );
}

export default Sidebar;
