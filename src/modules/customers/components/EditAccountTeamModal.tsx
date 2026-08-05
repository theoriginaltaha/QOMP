import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData: any;
}

export const EditAccountTeamModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    accountManager: '',
    customerSuccessManager: '',
    supportOwner: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        accountManager: initialData.accountManager || 'Unassigned',
        customerSuccessManager: initialData.customerSuccessManager || 'Unassigned',
        supportOwner: initialData.supportOwner || 'Unassigned'
      });
      fetchUsers();
    }
  }, [isOpen, initialData]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Account Team">
      <form onSubmit={handleSubmit} className="modal-form">
        
        <div className="form-group">
          <label>Account Manager</label>
          <select 
            className="form-input" 
            value={formData.accountManager}
            onChange={e => setFormData({...formData, accountManager: e.target.value})}
          >
            <option value="Unassigned">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Customer Success Manager (CSM)</label>
          <select 
            className="form-input" 
            value={formData.customerSuccessManager}
            onChange={e => setFormData({...formData, customerSuccessManager: e.target.value})}
          >
            <option value="Unassigned">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Support Owner</label>
          <select 
            className="form-input" 
            value={formData.supportOwner}
            onChange={e => setFormData({...formData, supportOwner: e.target.value})}
          >
            <option value="Unassigned">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
