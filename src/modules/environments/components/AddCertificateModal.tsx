import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  environmentId: string;
}

export const AddCertificateModal: React.FC<AddCertificateModalProps> = ({ isOpen, onClose, onSubmit, environmentId }) => {
  const [formData, setFormData] = useState({
    domain: '',
    issuer: '',
    validFrom: '',
    validTo: '',
    status: 'Valid'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ domain: '', issuer: '', validFrom: '', validTo: '', status: 'Valid' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add SSL Certificate">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Domain</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. *.gems.edu"
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
            placeholder="e.g. Let's Encrypt, DigiCert"
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
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Certificate'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
