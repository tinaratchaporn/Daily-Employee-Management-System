import React, { createContext, useState, useContext } from "react";

// สร้าง Context สำหรับ Authentication
const AuthContext = createContext();

// สร้าง Provider ที่จะใช้ห่อส่วนประกอบ (components) ต่างๆ
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [token, setToken] = useState(null); // เก็บ Token สำหรับ API

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook สำหรับเรียกใช้งาน Context ได้ง่าย
export const useAuth = () => useContext(AuthContext);
