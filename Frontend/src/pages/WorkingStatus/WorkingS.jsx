import "./WorkingS.css";
import { useState, useEffect } from "react";
import axios from "axios";

function WorkingS() {
  const [employees, setEmployees] = useState([]); // เก็บข้อมูลพนักงานทั้งหมด
  const [filteredEmployees, setFilteredEmployees] = useState([]); // เก็บข้อมูลพนักงานที่กรองตามชื่อ
  const [searchTerm, setSearchTerm] = useState(""); // เก็บคำค้นหาจากผู้ใช้

  useEffect(() => {
    // ดึงข้อมูลพนักงานจาก API
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/data/getempinfoForworkDays");
        if (response.data && Array.isArray(response.data.data)) {
          // ตรวจสอบข้อมูลทั้งหมดที่ได้รับ
          console.log(response.data.data); // เพิ่มการตรวจสอบค่าจาก API

          setEmployees(response.data.data);  // เก็บข้อมูลทั้งหมดจาก API ที่กรองแล้ว
          setFilteredEmployees(response.data.data); // กำหนดข้อมูลทั้งหมดให้เป็นค่าต้นฉบับ
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // ฟังก์ชันสำหรับค้นหาพนักงาน
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // ค้นหาพนักงานที่มีชื่อที่ตรงกับคำค้นหา
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchValue)
    );
    setFilteredEmployees(filtered); // อัปเดตข้อมูลที่กรอง
  };

  return (
    <div className="WorkingS-container">
      <div className="daily-contract-container">
        <h1>จำนวนชั่วโมงทำงานและรายได้</h1>

        {/* ฟอร์มค้นหาพนักงาน */}
        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหาชื่อพนักงาน"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {/* ตารางข้อมูลพนักงาน */}
        <table className="daily-contract-table">
          <thead>
            <tr>
              <th>ชื่อพนักงาน</th>
              <th>แผนก</th>
              <th>ชั่วโมงทำงาน</th>
              <th>วันทำงาน</th>
              <th>รายได้</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredEmployees) && filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.username}>
                  <td>{employee.name}</td>
                  <td>{employee.department || "-"}</td>
                  <td>{employee.hrs || "-"}</td>
                  <td>{employee.workday || "-"}</td>
                  <td>{employee.earnings !== "NaN" ? `${employee.earnings} บาท` : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkingS;
