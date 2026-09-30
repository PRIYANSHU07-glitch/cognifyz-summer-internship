import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // New state variables to track which task is being edited
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const API_URL = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask = { title: newTaskTitle, completed: false };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]); 
      setNewTaskTitle('');        
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id)); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- Start editing a specific task ---
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  // --- Save the updated task back to the server ---
  const handleUpdateTask = async (id) => {
    if (!editTitle) return;

    const updatedTask = { title: editTitle, completed: false };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      
      setTasks(tasks.map(task => (task.id === id ? data : task)));
      setEditingId(null); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h2>Task 5: API Integration</h2>
        <p className="app-description">
          <strong>Objective:</strong> Introduce server-client communication through a RESTful API. 
          This full-stack dashboard utilizes a React front-end to perform real-time CRUD operations against a Spring Boot back-end and an H2 database.
        </p>
      </header>
      
      <form onSubmit={handleAddTask} className="task-form">
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="Enter a new task..."
          className="task-input"
        />
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {/* If this task is being edited, show the text box. Otherwise, show normal text. */}
            {editingId === task.id ? (
              <div className="edit-mode">
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="task-input edit-input"
                />
                <button onClick={() => handleUpdateTask(task.id)} className="save-btn">Save</button>
                <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
              </div>
            ) : (
              <>
                <span className="task-text">{task.title}</span>
                <div className="button-group">
                  <button onClick={() => startEditing(task)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;