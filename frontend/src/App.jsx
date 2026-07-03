import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addOrUpdateTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        const task = tasks.find((t) => t._id === editId);

        await axios.put(`${API_URL}/${editId}`, {
          title,
          description,
          completed: task.completed,
        });

        setEditId(null);
      } else {
        await axios.post(API_URL, {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task._id);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="container">
      <h1>📋 MERN Task Management Dashboard</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={addOrUpdateTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="stats">
        <div className="stat-card total">
          <h3>Total</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="stat-card completed">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>
      </div>

      <h2>My Tasks</h2>

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-buttons">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
      </div>

      {tasks
        .filter((task) =>
          task.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((task) => {
          if (filter === "Completed") return task.completed;
          if (filter === "Pending") return !task.completed;
          return true;
        })
        .map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              {task.completed ? "✅ Completed" : "🟡 Pending"}
            </p>

            <div className="buttons">
              <button onClick={() => editTask(task)}>
                ✏️ Edit
              </button>

              <button onClick={() => toggleComplete(task)}>
                {task.completed ? "Undo" : "Complete"}
              </button>

              <button onClick={() => deleteTask(task._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;