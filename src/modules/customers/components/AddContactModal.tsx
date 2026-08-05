import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  schoolId?: string;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSubmit, schoolId }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    isPrimary: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = schoolId ? { ...formData, schoolId } : formData;
      await onSubmit(submitData);
      setFormData({ name: '', jobTitle: '', email: '', phone: '', isPrimary: false });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Contact">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.jobTitle}
            onChange={e => setFormData({...formData, jobTitle: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            className="form-input" 
            required 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            className="form-input" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            id="isPrimary"
            checked={formData.isPrimary}
            onChange={e => setFormData({...formData, isPrimary: e.target.checked})}
          />
          <label htmlFor="isPrimary">Mark as Primary Contact</label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
