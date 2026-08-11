import "./WorkingS.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL =
  "http://localhost:9000/api/chooseworks/getempinfoForworkDays";

function WorkingS() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(API_URL);

      const employeeData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setEmployees(
        employeeData.filter(
          (employee) => !employee.role || employee.role === "Employee"
        )
      );
    } catch (requestError) {
      console.error("Error fetching working status:", requestError);
      setError("ไม่สามารถโหลดข้อมูลการทำงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return employees;

    return employees.filter((employee) =>
      [employee.name, employee.department, employee.username]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [employees, searchTerm]);

  const formatValue = (value, suffix = "") => {
    if (value === undefined || value === null || value === "") return "-";
    return `${value}${suffix}`;
  };

  const formatEarnings = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return "-";
    }

    return `${Number(value).toLocaleString("th-TH")} บาท`;
  };

  return (
    <main className="working-status-page">
      <section className="working-status-header">
        <div>
          <p className="working-status-eyebrow">WORKMATE ADMINISTRATION</p>
          <h1>สถานะการทำงาน</h1>
          <p>ตรวจสอบชั่วโมงทำงาน วันทำงาน และรายได้ของพนักงาน</p>
        </div>

        <button
          type="button"
          className="working-refresh-button"
          onClick={loadEmployees}
          disabled={loading}
        >
          {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
        </button>
      </section>

      <section className="working-summary-grid">
        <article className="working-summary-card">
          <span>พนักงานทั้งหมด</span>
          <strong>{employees.length}</strong>
          <small>คน</small>
        </article>

        <article className="working-summary-card">
          <span>ชั่วโมงทำงานรวม</span>
          <strong>
            {employees.reduce(
              (total, employee) => total + (Number(employee.hrs) || 0),
              0
            )}
          </strong>
          <small>ชั่วโมง</small>
        </article>

        <article className="working-summary-card">
          <span>วันทำงานรวม</span>
          <strong>
            {employees.reduce(
              (total, employee) => total + (Number(employee.workday) || 0),
              0
            )}
          </strong>
          <small>วัน</small>
        </article>
      </section>

      <section className="working-table-card">
        <div className="working-table-toolbar">
          <div>
            <h2>ข้อมูลการทำงานของพนักงาน</h2>
            <p>แสดง {filteredEmployees.length} รายการ</p>
          </div>

          <label className="working-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="ค้นหาชื่อ แผนก หรือชื่อผู้ใช้"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </div>

        {error && <div className="working-error">{error}</div>}

        <div className="working-table-wrapper">
          <table className="working-table">
            <thead>
              <tr>
                <th>พนักงาน</th>
                <th>แผนก</th>
                <th>ชั่วโมงทำงาน</th>
                <th>วันทำงาน</th>
                <th>รายได้</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="working-empty-state">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="working-empty-state">
                    ไม่พบข้อมูลพนักงาน
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id || employee.username}>
                    <td>
                      <div className="working-employee">
                        <div className="working-avatar">
                          {(employee.name || "?").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{employee.name || "-"}</strong>
                          <span>{employee.username || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td>{employee.department || "-"}</td>
                    <td>{formatValue(employee.hrs, " ชั่วโมง")}</td>
                    <td>{formatValue(employee.workday, " วัน")}</td>
                    <td className="working-earnings">
                      {formatEarnings(employee.earnings)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default WorkingS;