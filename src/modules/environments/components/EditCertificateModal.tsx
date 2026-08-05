import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface EditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certId: string, data: any) => Promise<void>;
  initialData: any;
}

export const EditCertificateModal: React.FC<EditCertificateModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    domain: '',
    issuer: '',
    validFrom: '',
    validTo: '',
    status: 'Valid'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        domain: initialData.domain || '',
        issuer: initialData.issuer || '',
        validFrom: initialData.validFrom || '',
        validTo: initialData.validTo || '',
        status: initialData.status || 'Valid'
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit SSL Certificate">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Domain</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.domain}
            onChange={e => setFormData({...formData, domain: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Issuer Authority</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={formData.issuer}
            onChange={e => setFormData({...formData, issuer: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Valid From</label>
          <input 
            type="date" 
            className="form-input" 
            required 
            value={formData.validFrom}
            onChange={e => setFormData({...formData, validFrom: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Valid To (Expiry)</label>
          <input 
            type="date" 
            className="form-input" 
            required 
            value={formData.validTo}
            onChange={e => setFormData({...formData, validTo: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select 
            className="form-input" 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="Valid">Valid</option>
            <option value="Expired">Expired</option>
            <option value="Revoked">Revoked</option>
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
