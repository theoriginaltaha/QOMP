import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  initialData: any;
}

export const EditEnvironmentModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Production',
    url: '',
    ipAddress: '',
    dbVersion: '',
    appVersion: '',
    status: 'Running',
    lastDeployment: '',
    pedDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Production',
        url: initialData.url || '',
        ipAddress: initialData.ipAddress || '',
        dbVersion: initialData.dbVersion || '',
        appVersion: initialData.appVersion || '',
        status: initialData.status || 'Running',
        lastDeployment: initialData.lastDeployment || '',
        pedDate: initialData.pedDate || ''
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Environment Details">
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
            <option value="QA">QA</option>
            <option value="Development">Development</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select 
            className="form-input"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="Running">Running</option>
            <option value="Stopped">Stopped</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Error">Error</option>
          </select>
        </div>

        <div className="form-group">
          <label>Access URL</label>
          <input 
            type="text" 
            className="form-input" 
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
            value={formData.ipAddress}
            onChange={e => setFormData({...formData, ipAddress: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Database Engine & Version</label>
          <input 
            type="text" 
            className="form-input" 
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
            placeholder="e.g. v2.1.0"
            value={formData.appVersion}
            onChange={e => setFormData({...formData, appVersion: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Last Deployment Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={formData.lastDeployment}
            onChange={e => setFormData({...formData, lastDeployment: e.target.value})}
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
