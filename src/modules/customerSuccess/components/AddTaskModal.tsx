import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    assignee: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users');
      const data = await res.json();
      setUsers(data);
      if (data.length > 0 && !formData.assignee) {
        setFormData(prev => ({ ...prev, assignee: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', priority: 'Medium', status: 'Pending', dueDate: '', assignee: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Task Title</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select 
            className="form-input"
            value={formData.priority}
            onChange={e => setFormData({...formData, priority: e.target.value})}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input 
            type="date" 
            className="form-input" 
            required 
            value={formData.dueDate}
            onChange={e => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Assignee</label>
          <select 
            className="form-input" 
            required 
            value={formData.assignee}
            onChange={e => setFormData({...formData, assignee: e.target.value})}
          >
            <option value="" disabled>Select User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
