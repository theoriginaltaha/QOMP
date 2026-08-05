import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData: any;
}

export const EditPortalsModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    websiteUrl: initialData.websiteUrl || '',
    studentPortalUrl: initialData.studentPortalUrl || '',
    teacherPortalUrl: initialData.teacherPortalUrl || ''
  });
  const [loading, setLoading] = useState(false);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer Portals & Links">
      <form onSubmit={handleSubmit} className="modal-form">
        
        <div className="form-group">
          <label>Main Website URL</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., website.com"
            value={formData.websiteUrl}
            onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Student Portal URL</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., student.website.com"
            value={formData.studentPortalUrl}
            onChange={e => setFormData({...formData, studentPortalUrl: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Teacher Portal URL</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., teacher.website.com"
            value={formData.teacherPortalUrl}
            onChange={e => setFormData({...formData, teacherPortalUrl: e.target.value})}
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Portals'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
