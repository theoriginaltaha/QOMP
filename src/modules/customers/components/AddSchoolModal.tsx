import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    educationalStage: 'University',
    city: '',
    status: 'Active',
    studentPortalUrl: '',
    teacherPortalUrl: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ 
        code: '', name: '', educationalStage: 'University', city: '', status: 'Active', 
        studentPortalUrl: '', teacherPortalUrl: '', coordinatorName: '', coordinatorEmail: '', coordinatorPhone: '' 
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New School/Branch">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>School Name</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Branch Code</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.code}
            onChange={e => setFormData({...formData, code: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select 
            className="form-input"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Student Portal URL (Optional)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., student.university.com"
            value={formData.studentPortalUrl}
            onChange={e => setFormData({...formData, studentPortalUrl: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Teacher Portal URL (Optional)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., teacher.university.com"
            value={formData.teacherPortalUrl}
            onChange={e => setFormData({...formData, teacherPortalUrl: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Educational Stage</label>
          <select 
            className="form-input"
            value={formData.educationalStage}
            onChange={e => setFormData({...formData, educationalStage: e.target.value})}
          >
            <option value="K-12">K-12</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Higher Ed">Higher Education</option>
          </select>
        </div>
        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
        </div>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Coordinator Details (Optional)</h4>
        
        <div className="form-group">
          <label>Coordinator Name</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., Dr. Ahmed"
            value={formData.coordinatorName}
            onChange={e => setFormData({...formData, coordinatorName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Coordinator Phone</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., +2010..."
            value={formData.coordinatorPhone}
            onChange={e => setFormData({...formData, coordinatorPhone: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Coordinator Email</label>
          <input 
            type="email" 
            className="form-input" 
            placeholder="e.g., ahmed@university.com"
            value={formData.coordinatorEmail}
            onChange={e => setFormData({...formData, coordinatorEmail: e.target.value})}
          />
        </div>

        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save School'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
