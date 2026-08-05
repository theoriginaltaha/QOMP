import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  initialData: any;
}

export const EditContactModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    isPrimary: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        jobTitle: initialData.jobTitle || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        isPrimary: initialData.isPrimary || false
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(initialData.id, formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Contact">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Name</label>
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
          <label>Email</label>
          <input 
            type="email" 
            className="form-input" 
            required 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="text" 
            className="form-input" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        {!initialData.schoolId && (
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={e => setFormData({...formData, isPrimary: e.target.checked})}
            />
            <label htmlFor="isPrimary" style={{ margin: 0 }}>Primary Contact</label>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
