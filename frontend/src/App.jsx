import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUserGraduate,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import api from "./services/api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get("students/");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const addStudent = async () => {
    if (!name.trim() || !department.trim() || !age) {
      toast.error("Please fill all fields");
      return;
    }

    if (Number(age) <= 0) {
      toast.error("Age must be greater than 0");
      return;
    }

    try {
      await api.post("students/", {
        name: name.trim(),
        age: Number(age),
        department: department.trim(),
      });

      await fetchStudents();
      toast.success("Student added successfully!");

      setName("");
      setAge("");
      setDepartment("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
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
      toast.error("Please fill all fields");
      return;
    }

    if (Number(age) <= 0) {
      toast.error("Age must be greater than 0");
      return;
    }

    try {
      await api.put(`students/${editingId}/`, {
        name: name.trim(),
        age: Number(age),
        department: department.trim(),
      });

      await fetchStudents();
      toast.success("Student updated successfully!");

      setEditingId(null);
      setName("");
      setAge("");
      setDepartment("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  // Delete student
 
  // Open delete confirmation modal
const deleteStudent = (student) => {
  console.log("Delete button clicked");

  setStudentToDelete(student);

  setShowDeleteModal(true);

  setTimeout(() => {
    console.log("showDeleteModal should now be true");
  }, 100);
};

// Confirm delete
const confirmDelete = async () => {
  try {
    setIsDeleting(true);
    await api.delete(`students/${studentToDelete.id}/`);

    await fetchStudents();

    toast.success("Student deleted successfully!");

    setStudentToDelete(null);

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong.");
  }finally{
    setIsDeleting(false);
  }
};

// Cancel delete
const cancelDelete = () => {
  setShowDeleteModal(false);
  setStudentToDelete(null);
};

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setDepartment("");
  };

const filteredStudents = students.filter((student) =>
  student.name.toLowerCase().includes(search.toLowerCase()) ||
  student.department.toLowerCase().includes(search.toLowerCase())
);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && showDeleteModal) {
      cancelDelete();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [showDeleteModal]);

  return (
  <div className="app">

    <Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 3000,
    style: {
      background: "#1f2937",
      color: "#fff",
      borderRadius: "12px",
      padding: "14px",
      fontSize: "15px",
    },
    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
    <div className="dashboard">

      {/* Header */}
      <header className="header">
        <div>
          <h1 className="header-title">
          <FaUserGraduate />
          Student Management System
         </h1>

          <p>Manage student records efficiently</p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h2>{students.length}</h2>
            <span>Total Students</span>
          </div>

          <div className="stat-card">
            <h2>
              {new Set(students.map((s) => s.department)).size}
            </h2>
            <span>Departments</span>
          </div>

          
        </div>
      </header>

      <div className="main-content">

        {/* Left Panel */}

        <section className="form-card">

          <h2 className="section-title">
          {editingId ? (
            <>
              <FaEdit /> Update Student
            </>
          ) : (
            <>
              <FaPlus /> Add Student
            </>
          )}
         </h2>

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Age"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <div className="form-buttons">

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
              >
                Cancel
              </button>
            )}

          </div>

        </section>

        {/* Right Panel */}

        <section className="list-card">

          <div className="list-header">

  <h2 className="section-title">
    <FaUserGraduate />
    Student List
  </h2>

  <div className="search-container">
    <FaSearch className="search-icon" />

    <input
      className="search-box"
      type="text"
      placeholder="Search students..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

</div>

          {filteredStudents.length === 0? (
            <div className="empty-state">
              <h3>No Students Found</h3>
              <p>Add your first student.</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div className="student-card" key={student.id}>

                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>

                <div className="student-info">

                  <h3>{student.name}</h3>

                  <p>
                     {student.age} Years
                  </p>

                  <span className="department">
                      <FaBuilding />
                    {student.department}
                  </span>

                </div>

                <div className="actions">

                  <button
                    className="edit-btn"
                    onClick={() => editStudent(student)}
                  >
                      <>
                        <FaEdit />
                        Edit
                      </>
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteStudent(student)}
                  >
                    <>
                      <FaTrash />
                      Delete
                    </>
                  </button>

                </div>

              </div>
            ))
          )}

        </section>

      </div>

    </div>

   
    {showDeleteModal && studentToDelete && (
  <div
    className="modal-overlay"
    onClick={cancelDelete}
  >
    <div
      className="delete-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-icon">
        <FaTrash />
      </div>

     <h2>Delete Student</h2>

      <p>
        This action <strong>cannot be undone.</strong>
        <br />
        <br />
        Are you sure you want to permanently delete
        <br />
        <strong>"{studentToDelete.name}"</strong>?
      </p>

          <div className="modal-buttons">
      <button
        className="cancel-modal-btn"
        onClick={cancelDelete}
        disabled={isDeleting}
      >
        <FaTimes />
        Cancel
      </button>

      <button
        className="confirm-delete-btn"
        onClick={confirmDelete}
        disabled={isDeleting}
      >
        <FaTrash />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>

    </div>
  </div>
)}

  </div>
);
}

export default App;