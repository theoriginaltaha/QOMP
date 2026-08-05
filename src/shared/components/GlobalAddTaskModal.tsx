import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface GlobalAddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const GlobalAddTaskModal: React.FC<GlobalAddTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    assignee: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsersAndCustomers();
    }
  }, [isOpen]);

  const fetchUsersAndCustomers = async () => {
    try {
      const [usersRes, customersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/customers')
      ]);
      const usersData = await usersRes.json();
      const customersData = await customersRes.json();
      
      setUsers(usersData);
      setCustomers(customersData);

      setFormData(prev => ({
        ...prev,
        assignee: prev.assignee || (usersData.length > 0 ? usersData[0].id : ''),
        customerId: prev.customerId || (customersData.length > 0 ? customersData[0].id : '')
      }));
    } catch (error) {
      console.error('Failed to fetch data for task modal', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ customerId: customers.length > 0 ? customers[0].id : '', title: '', priority: 'Medium', status: 'Pending', dueDate: '', assignee: users.length > 0 ? users[0].id : '' });
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
