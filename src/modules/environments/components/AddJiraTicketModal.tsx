import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddJiraTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  environmentId: string;
}

export const AddJiraTicketModal: React.FC<AddJiraTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ticketId: '',
    title: '',
    type: 'Task',
    status: 'To Do',
    status: 'To Do',
    priority: 'Medium',
    assignee: '',
    customerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchCustomers();
    }
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

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/customers');
      const data = await res.json();
      setCustomers(data);
      if (data.length > 0 && !formData.customerId) {
        setFormData(prev => ({ ...prev, customerId: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch customers', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ ticketId: '', title: '', type: 'Task', status: 'To Do', priority: 'Medium', assignee: '', customerId: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Jira Ticket">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Customer</label>
          <select 
            className="form-input" 
            required 
            value={formData.customerId}
            onChange={e => setFormData({...formData, customerId: e.target.value})}
          >
            <option value="" disabled>Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Ticket ID (e.g. QOMP-102)</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.ticketId}
            onChange={e => setFormData({...formData, ticketId: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Ticket Title</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select 
            className="form-input"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="Task">Task</option>
            <option value="Bug">Bug</option>
            <option value="Incident">Incident</option>
            <option value="Story">Story</option>
          </select>
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
          <label>Status</label>
          <select 
            className="form-input"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
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
            {loading ? 'Saving...' : 'Save Ticket'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
