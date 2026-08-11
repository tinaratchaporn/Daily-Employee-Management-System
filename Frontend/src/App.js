import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./App.css";

import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout/Layout";
import LayoutEmp from "./layouts/LayoutEmp/LayoutEmp";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

import Employees from "./pages/Employees/Employees";
import WorkingS from "./pages/WorkingStatus/WorkingS";
import Notification from "./pages/Notifications/Notification";
import User from "./pages/User/Logout";

import EmpSet from "./page_user/EmpSet/EmpSet";
import EmpNoti from "./page_user/EmpNoti/EmpNoti";
import EmpUser from "./page_user/Emp/EmpUser";

import About from "./layouts/Sidebar/About";
import About2 from "./layouts/SidebarEmp/About2";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function App() {
  const storedUser = getStoredUser();

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [role, setRole] = useState(
    () => storedUser?.role || localStorage.getItem("role") || ""
  );

  const isAdmin = role === "admin";
  const isLoggedIn = Boolean(token && role);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login/:type"
        element={<Login setToken={setToken} setRole={setRole} />}
      />

      {isLoggedIn && isAdmin && (
        <Route element={<Layout />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/working-status" element={<WorkingS />} />
          <Route path="/notifications" element={<Notification />} />
          <Route
            path="/user"
            element={<User setToken={setToken} setRole={setRole} />}
          />
          <Route path="/about" element={<About />} />
        </Route>
      )}

      {isLoggedIn && !isAdmin && (
        <Route element={<LayoutEmp />}>
          <Route path="/EmpSet" element={<EmpSet />} />
          <Route path="/EmpNotifications" element={<EmpNoti />} />
          <Route
            path="/EmpUser"
            element={<EmpUser setToken={setToken} setRole={setRole} />}
          />
          <Route path="/about2" element={<About2 />} />
        </Route>
      )}

      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to={isAdmin ? "/employees" : "/EmpSet"} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;