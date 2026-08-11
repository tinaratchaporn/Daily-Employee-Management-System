import { useEffect, useState } from "react";
import axios from "axios";
import "./Employees.css";

const API_URL = "http://localhost:9000/api/employees";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const emptyEmployee = {
  name: "",
  username: "",
  password: "",
  department: "",
  phone: "",
  email: "",
  userId: "",
  role: "Employee",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(emptyEmployee);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(API_URL, getAuthConfig());

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถโหลดข้อมูลพนักงานได้",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData(emptyEmployee);
    setMessage({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || "",
      username: employee.username || "",
      password: "",
      department: employee.department || "",
      phone: employee.phone || "",
      email: employee.email || "",
      userId: employee.userId || "",
      role: "Employee",
    });
    setMessage({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(emptyEmployee);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    if (name === "userId" && (!/^\d*$/.test(value) || value.length > 13)) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.department.trim() ||
      !formData.phone ||
      !formData.email.trim() ||
      !formData.userId
    ) {
      setMessage({
        type: "error",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
      return false;
    }

    if (!editingEmployee && (!formData.username.trim() || !formData.password)) {
      setMessage({
        type: "error",
        text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
      });
      return false;
    }

    if (!editingEmployee && formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      });
      return false;
    }

    if (formData.phone.length !== 10) {
      setMessage({
        type: "error",
        text: "เบอร์โทรศัพท์ต้องมี 10 หลัก",
      });
      return false;
    }

    if (formData.userId.length !== 13) {
      setMessage({
        type: "error",
        text: "เลขบัตรประชาชนต้องมี 13 หลัก",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const employeeData = {
      name: formData.name.trim(),
      department: formData.department.trim(),
      phone: formData.phone,
      email: formData.email.trim(),
      userId: formData.userId,
      role: "Employee",
    };

    try {
      if (editingEmployee) {
        await axios.put(
          `${API_URL}/${editingEmployee._id}`,
          employeeData,
          getAuthConfig()
        );

        setMessage({
          type: "success",
          text: "แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว",
        });
      } else {
        await axios.post(
          API_URL,
          {
            ...employeeData,
            username: formData.username.trim(),
            password: formData.password,
          },
          getAuthConfig()
        );

        setMessage({
          type: "success",
          text: "เพิ่มพนักงานและสร้างบัญชีเข้าสู่ระบบเรียบร้อยแล้ว",
        });
      }

      closeModal();
      await loadEmployees();
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "ไม่สามารถบันทึกข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`ต้องการลบข้อมูลของ ${employee.name} ใช่หรือไม่?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${employee._id}`, getAuthConfig());

      setEmployees((previousEmployees) =>
        previousEmployees.filter((item) => item._id !== employee._id)
      );

      setMessage({
        type: "success",
        text: "ลบข้อมูลพนักงานเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "ไม่สามารถลบข้อมูลพนักงานได้",
      });
    }
  };

  return (
    <main className="employees-page">
      <section className="employees-header">
        <div>
          <p className="employees-eyebrow">WORKMATE ADMINISTRATION</p>
          <h1>จัดการข้อมูลพนักงาน</h1>
          <p className="employees-subtitle">
            เพิ่มพนักงานพร้อมสร้างบัญชีสำหรับเข้าสู่ระบบ
          </p>
        </div>

        <button
          type="button"
          className="employee-primary-button"
          onClick={openAddModal}
        >
          <span>+</span>
          เพิ่มพนักงาน
        </button>
      </section>

      {message.text && (
        <div className={`employee-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="employees-card">
        <div className="employees-card-header">
          <div>
            <h2>รายชื่อพนักงาน</h2>
            <p>ทั้งหมด {employees.length} คน</p>
          </div>

          <button
            type="button"
            className="employee-refresh-button"
            onClick={loadEmployees}
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
          </button>
        </div>

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>พนักงาน</th>
                <th>แผนก</th>
                <th>เบอร์โทรศัพท์</th>
                <th>อีเมล</th>
                <th className="employee-actions-heading">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="employee-empty-state">
                    กำลังโหลดข้อมูลพนักงาน...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="employee-empty-state">
                    ยังไม่มีข้อมูลพนักงาน
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="employee-name-cell">
                        <div className="employee-avatar">
                          {(employee.name || "?").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>
                          <span>Username: {employee.username || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td>{employee.department || "-"}</td>
                    <td>{employee.phone || "-"}</td>
                    <td>{employee.email || "-"}</td>
                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          className="employee-edit-button"
                          onClick={() => openEditModal(employee)}
                        >
                          แก้ไข
                        </button>

                        <button
                          type="button"
                          className="employee-delete-button"
                          onClick={() => handleDelete(employee)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="employee-modal-overlay" onMouseDown={closeModal}>
          <section
            className="employee-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="employee-modal-header">
              <div>
                <p className="employees-eyebrow">
                  {editingEmployee ? "UPDATE EMPLOYEE" : "NEW EMPLOYEE"}
                </p>
                <h2>
                  {editingEmployee ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
                </h2>
              </div>

              <button
                type="button"
                className="employee-close-button"
                onClick={closeModal}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="employee-form-grid">
                {!editingEmployee && (
                  <>
                    <label>
                      ชื่อผู้ใช้
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="สำหรับเข้าสู่ระบบ"
                        autoComplete="username"
                        disabled={submitting}
                        required
                      />
                    </label>

                    <label>
                      รหัสผ่าน
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="อย่างน้อย 6 ตัวอักษร"
                        autoComplete="new-password"
                        disabled={submitting}
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  ชื่อ-นามสกุล
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </label>

                <label>
                  แผนก
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </label>

                <label>
                  เบอร์โทรศัพท์
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    maxLength="10"
                    disabled={submitting}
                    required
                  />
                </label>

                <label>
                  อีเมล
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={submitting}
                    required
                  />
                </label>

                <label className="employee-form-full">
                  เลขบัตรประชาชน
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    maxLength="13"
                    disabled={submitting}
                    required
                  />
                </label>
              </div>

              <div className="employee-form-actions">
                <button
                  type="button"
                  className="employee-cancel-button"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="employee-primary-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "กำลังบันทึก..."
                    : editingEmployee
                      ? "บันทึกการแก้ไข"
                      : "เพิ่มพนักงาน"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Employees;