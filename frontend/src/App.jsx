import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get("students/");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const addStudent = async () => {
    if (!name.trim() || !department.trim() || !age) {
      alert("Please fill all fields");
      return;
    }

    if (Number(age) <= 0) {
      alert("Age must be greater than 0");
      return;
    }

    try {
      await api.post("students/", {
        name: name.trim(),
        age: Number(age),
        department: department.trim(),
      });

      await fetchStudents();

      setName("");
      setAge("");
      setDepartment("");
    } catch (error) {
      console.error(error);
    }
  };

  // Load student into form
  const editStudent = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(student.age);
    setDepartment(student.department);
  };

  // Update student
  const updateStudent = async () => {
    if (!name.trim() || !department.trim() || !age) {
      alert("Please fill all fields");
      return;
    }

    if (Number(age) <= 0) {
      alert("Age must be greater than 0");
      return;
    }

    try {
      await api.put(`students/${editingId}/`, {
        name: name.trim(),
        age: Number(age),
        department: department.trim(),
      });

      await fetchStudents();

      setEditingId(null);
      setName("");
      setAge("");
      setDepartment("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    const ok = window.confirm("Delete this student?");

    if (!ok) return;

    try {
      await api.delete(`students/${id}/`);
      await fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setDepartment("");
  };

  return (
    <div className="container">
      <h1 className="title">🎓 Student Management System</h1>

      <h2>{editingId ? "Update Student" : "Add Student"}</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Age"
        min="1"
        max="120"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <br />
      <br />

      <button
        className={editingId ? "update-btn" : "add-btn"}
        onClick={editingId ? updateStudent : addStudent}
      >
        {editingId ? "Update Student" : "Add Student"}
      </button>

      {editingId && (
        <button
          className="cancel-btn"
          onClick={cancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      )}

      <hr />

      <h2>Student List</h2>

      {students.length === 0 ? (
        <p className="empty">No students added yet.</p>
      ) : (
        students.map((student) => (
          <div className="student-card" key={student.id}>
            <div className="student-info">
              <h3>{student.name}</h3>
              <p>
                Age: {student.age} | Department: {student.department}
              </p>
            </div>

            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => editStudent(student)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;