import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddRenewalModal: React.FC<AddRenewalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    renewalDate: '',
    status: 'Upcoming',
    owner: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ renewalDate: '', status: 'Upcoming', owner: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Renewal Record">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Renewal Date</label>
          <input 
            type="date" 
            className="form-input" 
            required 
            value={formData.renewalDate}
            onChange={e => setFormData({...formData, renewalDate: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select 
            className="form-input"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="Upcoming">Upcoming</option>
            <option value="At Risk">At Risk</option>
            <option value="Renewed">Renewed</option>
            <option value="Churned">Churned</option>
          </select>
        </div>
        <div className="form-group">
          <label>Owner (Account Manager)</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.owner}
            onChange={e => setFormData({...formData, owner: e.target.value})}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Renewal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
