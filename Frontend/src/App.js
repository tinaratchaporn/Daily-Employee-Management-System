import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Layout from "./layouts/Layout/Layout";
import Employees from "./pages/Employees/Employees";
import WorkingS from "./pages/WorkingStatus/WorkingS";
import Notification from "./pages/Notifications/Notification";
import User from "./pages/User/Logout";
import Login from "./pages/Login/Login";
import LayoutEmp from "./layouts/LayoutEmp/LayoutEmp";
import EmpSet from "./page_user/EmpSet/EmpSet";
import EmpNoti from "./page_user/EmpNoti/EmpNoti";
import EmpUser from "./page_user/Emp/EmpUser";

import About from "./layouts/Sidebar/About.jsx"
import About2 from "./layouts/SidebarEmp/About2.jsx"


function App() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  // ถ้าไม่มี token หรือ role ให้ไปหน้า Login
  // if (!token || !role) {
  //   return <Login setToken={setToken} setRole={setRole} />;
  // }

  return (
    <Routes>
      {/* สำหรับ Admin */}
      {role === "admin" ? (
        <Route element={<Layout />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/working-status" element={<WorkingS />} />
          <Route path="/notifications" element={<Notification />} />
          <Route
            path="/user"
            element={<User setToken={setToken} setRole={setRole} />}
          />
          {/* หากไม่พบ route ก็ให้ redirect ไปหน้าแรก */}
          <Route path="*" element={<Navigate to="/employees" />} />
          <Route path="/about" element={<About />} />
        </Route>
      ) : (
        /* สำหรับ Employee */
        <Route element={<LayoutEmp />}>
          <Route path="/EmpSet" element={<EmpSet />} />
         
          <Route path="/EmpNotifications" element={<EmpNoti />} />
          <Route
            path="/EmpUser"
            element={<EmpUser setToken={setToken} setRole={setRole} />}
          />
          {/* หากไม่พบ route ก็ให้ redirect ไปหน้าแรก */}
          <Route path="*" element={<Navigate to="/EmpSet" />} />
          <Route path="/about2" element={<About2 />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
