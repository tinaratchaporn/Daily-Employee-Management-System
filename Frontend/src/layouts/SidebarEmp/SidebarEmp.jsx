import "./SidebarEmp.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
const initPage = "EmpDashboard";

function SidebarEmp() {
  const [tab, setTab] = useState("");

  useEffect(() => {
    setTab(initPage);
  }, []);


  const EmpNotificationRef = useRef();
  const EmpSettingsRef = useRef();
  const EmpAbout2Ref = useRef();
  const EmpUserRef = useRef();

  useEffect(() => {
    if (tab === "EmpNotifications") {
      EmpNotificationRef.current.click();
    } else if (tab === "EmpSet") {
      EmpSettingsRef.current.click();
    } else if (tab === "EmpUser") {
      EmpUserRef.current.click();
    } else if (tab === "about2"){
      EmpAbout2Ref.current.click();
    }
  }, [tab]);
  return (
    <div className="sidebar-Emp">
      <div className="sidebar">
        <div className="sidebar-menu">
          
         

          <Link to="/EmpNotifications" ref={EmpNotificationRef}>
            <button
              className="btn btn-link"
              style={{ color: "white", textDecoration: "none" }}
              onClick={() => setTab("EmpNotifications")}
            >
              <span className="bi bi-bell-fill">
                &nbsp;&nbsp;&nbsp;การแจ้งเตือน
              </span>
            </button>
          </Link>


          <Link to="/EmpSet" ref={EmpSettingsRef}>
            <button
              className="btn btn-link"
              style={{ color: "white", textDecoration: "none" }}
              onClick={() => setTab("Settings")}
            >
              <span class="bi bi-file-earmark-fill">
                &nbsp;&nbsp;&nbsp;ลงงาน / ลางาน
              </span>
            </button>
          </Link>


          <Link to="/EmpUser" ref={EmpUserRef}>
            <button
              className="btn btn-link"
              style={{ color: "white", textDecoration: "none" }}
              onClick={() => setTab("EmpUser")}
            >
              <span className="bi bi-person-circle"> &nbsp;&nbsp;&nbsp;ออกจากระบบ</span>
            </button>
          </Link>


          <Link to="/about2" ref={EmpAbout2Ref}>
            <button
              className="btn btn-link"
              style={{ color: "white", textDecoration: "none" }}
              onClick={() => setTab("about2")}
            >
              <span className="bi bi-info-circle"> &nbsp;&nbsp;&nbsp;About</span>
            </button>
          </Link>
        


        </div>
      </div>
    </div>
  );
}

export default SidebarEmp;
