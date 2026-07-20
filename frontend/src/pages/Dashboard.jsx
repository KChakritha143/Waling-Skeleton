import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { Plus, Trash2, Calendar, CheckSquare, Square, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user, authFetch } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      setTasks(data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!title) {
      setActionError('Task title is required');
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      setTasks([data, ...tasks]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setActionSuccess('Task created successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
      }

      setTasks(tasks.map(t => t._id === task._id ? data : t));
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    setActionError('');
    try {
      const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete task');
      }

      setTasks(tasks.filter(t => t._id !== id));
      setActionSuccess('Task deleted successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>User Task Space</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Welcome back, <span style={{ color: '#a5b4fc', fontWeight: '500' }}>{user?.name}</span>. Secure session active.
          </p>
        </div>
      </div>

      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckSquare size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="task-creator-card">
        <h3>Create New Task</h3>
        <form onSubmit={handleAddTask} className="task-form-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskTitle">Task Name</label>
            <input
              id="taskTitle"
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="E.g., Complete security audit report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="taskDueDate">Due Date</label>
            <input
              id="taskDueDate"
              type="date"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem' }}>
            <label htmlFor="taskDescription">Task Description</label>
            <input
              id="taskDescription"
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Additional details and notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', alignSelf: 'stretch' }}>
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </form>
      </div>
      <div className="tasks-section">
        <div className="tasks-grid-header">
          <h2>Your Tasks</h2>
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} registered</span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo />
            <h4>No tasks found</h4>
            <p>Get started by creating your very first task above!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-card-content">
                  <div className="task-checkbox-container">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      {task.completed ? (
                        <CheckSquare size={20} color="var(--status-success)" />
                      ) : (
                        <Square size={20} color="var(--text-muted)" />
                      )}
                    </button>
                  </div>
                  
                  <div className="task-details">
                    <span className="task-title">{task.title}</span>
                    {task.description && <span className="task-desc">{task.description}</span>}
                    <div className="task-meta">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="date-badge">
                          <Calendar />
                          <span>{formatDate(task.dueDate)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="btn btn-danger btn-icon"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
