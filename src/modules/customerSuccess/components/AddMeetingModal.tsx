import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddMeetingModal: React.FC<AddMeetingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Sync',
    date: '',
    status: 'Scheduled',
    organizer: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', type: 'Sync', date: '', status: 'Scheduled', organizer: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Meeting">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Meeting Title</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Meeting Type</label>
          <select 
            className="form-input"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="Sync">Sync</option>
            <option value="QBR">QBR (Quarterly Business Review)</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Escalation">Escalation</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date & Time</label>
          <input 
            type="datetime-local" 
            className="form-input" 
            required 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Organizer</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.organizer}
            onChange={e => setFormData({...formData, organizer: e.target.value})}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Meeting'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
