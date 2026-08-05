import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  customerId: string;
}

export const AddEnvironmentModal: React.FC<AddEnvironmentModalProps> = ({ isOpen, onClose, onSubmit, customerId }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Production',
    url: '',
    ipAddress: '',
    dbVersion: '',
    appVersion: '',
    status: 'Running',
    lastDeployment: new Date().toISOString().split('T')[0],
    pedDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', type: 'Production', url: '', ipAddress: '', dbVersion: '', appVersion: '', status: 'Running', lastDeployment: new Date().toISOString().split('T')[0], pedDate: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provision New Environment">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Environment Name</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select 
            className="form-input"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="UAT">UAT</option>
            <option value="Dev">Development</option>
          </select>
        </div>
        <div className="form-group">
          <label>Access URL</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. ksaa.com or https://ksaa.com"
            value={formData.url}
            onChange={e => setFormData({...formData, url: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>IP Address</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.ipAddress}
            onChange={e => setFormData({...formData, ipAddress: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Database Engine & Version</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. PostgreSQL 14"
            value={formData.dbVersion}
            onChange={e => setFormData({...formData, dbVersion: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>App Version</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. v2.1.0"
            value={formData.appVersion}
            onChange={e => setFormData({...formData, appVersion: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>PED Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={formData.pedDate}
            onChange={e => setFormData({...formData, pedDate: e.target.value})}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Environment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
