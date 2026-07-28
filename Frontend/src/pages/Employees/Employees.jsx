import { useState, useEffect } from "react";
import axios from "axios";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    phone: "",
    email: "",
    userId: "", // Add userId field for the Thai ID number
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initData(); // ดึงข้อมูลพนักงานเมื่อเริ่มต้น
  }, []);
  
  // ฟังก์ชันในการดึงข้อมูลพนักงานจากเซิร์ฟเวอร์
  const initData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/data/getEmployee");
  
      // กรองพนักงานที่มี role เป็น "Employee" เท่านั้น
      const filteredEmployees = response.data.filter(employee => employee.role === "Employee");
      
      // อัปเดต state ของ employees ให้แสดงเฉพาะพนักงานที่มี role เป็น "Employee"
      setEmployees(filteredEmployees); // อัปเดตข้อมูลใน state
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleShow = () => setShowAddEmployee(true);
  const handleClose = () => {
    setShowAddEmployee(false);
    setNewEmployee({
      name: "",
      department: "",
      phone: "",
      email: "",
      userId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // ตรวจสอบให้เป็นตัวเลขและยาวไม่เกิน 10 ตัว
      if (/^\d*$/.test(value) && value.length <= 10) {
        setNewEmployee((prevState) => ({ ...prevState, [name]: value })); // เก็บค่า phone เป็น string
      }
      return; // ออกจากฟังก์ชันหาก field คือ phone
    }

    if (name === "userId") {
      // ตรวจสอบให้เป็นตัวเลขและยาวไม่เกิน 13 ตัว
      if (/^\d*$/.test(value) && value.length <= 13) {
        setNewEmployee((prevState) => ({ ...prevState, [name]: value }));
      }
      return;
    }

    // กรณีอื่นๆ
    setNewEmployee((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (
      !newEmployee.name ||
      !newEmployee.department ||
      !newEmployee.phone ||
      !newEmployee.email ||
      !newEmployee.userId
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/data/addEmployee",
        newEmployee
      );
      setEmployees((prevEmployees) => [...prevEmployees, response.data]); // อัปเดตข้อมูลทันทีหลังจากเพิ่ม
      handleClose();
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.response ? error.response.data : error.message
      );
      alert("Error adding employee. Please try again.");
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:9000/api/data/updateEmployee/${selectedEmployee._id}`,
        selectedEmployee
      );
      const updatedEmployee = response.data;

      // อัปเดตข้อมูลพนักงานในหน้าเว็บทันที
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === updatedEmployee._id ? updatedEmployee : emp
        )
      );
      setIsModalOpen(false); // ปิด modal เมื่ออัปเดตเสร็จ
    } catch (error) {
      console.error("Error updating employee:", error.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(
          `http://localhost:9000/api/data/deleteEmployee/${employeeId}`
        );

        // เรียกฟังก์ชันเพื่อดึงข้อมูลใหม่จากฐานข้อมูล
        initData();
      } catch (error) {
        console.error("Error deleting employee:", error.message);
      }
    }
  };

  return (
    <div className="Employees">
      <h1 className="title">ข้อมูลพนักงาน</h1>
      <div className="menu">
        <button className="button-add" onClick={handleShow}>
          Add Employee
        </button>
      </div>

      {showAddEmployee && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add New Employee</h2>
            <form className="form" onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone} // ใช้ค่า string ที่มาจาก state
                  onChange={handleInputChange}
                  maxLength="10" // จำกัดจำนวนตัวเลขสูงสุดเป็น 10
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thai ID:</label>
                <input
                  type="text"
                  name="userId"
                  value={newEmployee.userId}
                  onChange={handleInputChange}
                  maxLength="13"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Add Employee</button>
                <button type="button" onClick={handleClose}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && selectedEmployee && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit Employee</h2>
            <form className="form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={selectedEmployee.department}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedEmployee.phone}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phone: e.target.value,
                    })
                  }
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Thai ID:</label>
                <input
                  type="text"
                  name="userId"
                  value={selectedEmployee.userId}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      userId: e.target.value,
                    })
                  }
                  maxLength="13"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Update Employee</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.phone}</td>
              <td>{employee.email}</td>
              <td>
                <button onClick={() => handleEditClick(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
