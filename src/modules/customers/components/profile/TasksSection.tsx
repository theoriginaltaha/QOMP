import React from 'react';

interface TasksSectionProps {
  tasks: any[];
  onAddTask: () => void;
  onUpdateTask: (taskId: string, status: string) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({ tasks, onAddTask, onUpdateTask }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Success Tasks</h3>
        <button className="btn-primary" onClick={onAddTask}>Add Task</button>
      </div>
      {(!tasks || tasks.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No tasks pending.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.map((task: any) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select 
                  value={task.status}
                  onChange={(e) => onUpdateTask(task.id, e.target.value)}
                  style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'white', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {task.dueDate} | Assignee: {task.assignee}</div>
                </div>
              </div>
              <div>
                <span className={`tag-pill ${task.status === 'Completed' ? 'tag-success' : 'tag-warning'}`}>{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
