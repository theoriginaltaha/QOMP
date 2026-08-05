import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, file?: File) => Promise<void>;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [inputType, setInputType] = useState<'link' | 'file'>('link');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Document Link',
    url: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (inputType === 'file' && selectedFile) {
        await onSubmit(formData, selectedFile);
      } else {
        await onSubmit(formData);
      }
      setFormData({ title: '', type: 'Document Link', url: '' });
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer Resource">
      <form onSubmit={handleSubmit} className="modal-form">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            type="button" 
            className={inputType === 'link' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setInputType('link'); setFormData({ ...formData, type: 'Document Link' }); }}
          >
            External Link
          </button>
          <button 
            type="button" 
            className={inputType === 'file' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setInputType('file'); setFormData({ ...formData, type: 'Uploaded File' }); }}
          >
            File Upload
          </button>
        </div>

        <div className="form-group">
          <label>Resource Title</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g., Kickoff Meeting Recording"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {inputType === 'link' ? (
          <>
            <div className="form-group">
              <label>Resource Type</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                list="resource-types"
              />
              <datalist id="resource-types">
                <option value="Zoom Recording" />
                <option value="Drive Link" />
                <option value="Screenshot Link" />
                <option value="Document Link" />
              </datalist>
            </div>
            <div className="form-group">
              <label>URL</label>
              <input 
                type="url" 
                className="form-input" 
                required 
                placeholder="https://..."
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Resource Type</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                list="file-types"
              />
              <datalist id="file-types">
                <option value="Uploaded File" />
                <option value="Screenshot Image" />
                <option value="Video File" />
              </datalist>
            </div>
            <div className="form-group">
              <label>Select File</label>
              <input 
                type="file" 
                className="form-input" 
                required 
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </>
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
