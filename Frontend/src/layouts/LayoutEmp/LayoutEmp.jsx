import { Outlet } from "react-router-dom";
import SidebarEmp from "../SidebarEmp/SidebarEmp";
import "./LayoutEmp.css";

function LayoutEmp() {
  return (
    <div className="layout-emp">
      <SidebarEmp />

      <main className="layout-emp-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutEmp;