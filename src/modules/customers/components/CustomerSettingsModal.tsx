import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';

interface CustomerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSettingsModal: React.FC<CustomerSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('industries');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Customer Settings">
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
        <button 
          type="button" 
          onClick={() => setActiveTab('industries')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            cursor: 'pointer', 
            borderBottom: activeTab === 'industries' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'industries' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'industries' ? 600 : 400
          }}
        >
          Industries
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('slas')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            cursor: 'pointer', 
            borderBottom: activeTab === 'slas' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'slas' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'slas' ? 600 : 400
          }}
        >
          Default SLAs
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('tags')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            cursor: 'pointer', 
            borderBottom: activeTab === 'tags' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'tags' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'tags' ? 600 : 400
          }}
        >
          Custom Tags
        </button>
      </div>

      <div style={{ minHeight: '200px' }}>
        {activeTab === 'industries' && (
          <div>
            <h4>Manage Industry Categories</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Define the available B2B industry sectors for customer profiles.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" className="form-input" placeholder="New Industry Name" />
              <button className="btn-primary" style={{ padding: '0.4rem 1rem' }}>Add</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Education</span>
                <span style={{ color: 'var(--color-danger)', cursor: 'pointer' }}>Remove</span>
              </li>
              <li style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Healthcare</span>
                <span style={{ color: 'var(--color-danger)', cursor: 'pointer' }}>Remove</span>
              </li>
              <li style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Technology</span>
                <span style={{ color: 'var(--color-danger)', cursor: 'pointer' }}>Remove</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'slas' && (
          <div>
            <h4>Default Service Level Agreements (SLAs)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Configure the standard response and resolution times applied to new customers.
            </p>
            <div className="form-group">
              <label>Default Response Time (Hours)</label>
              <input type="number" className="form-input" defaultValue={4} />
            </div>
            <div className="form-group">
              <label>Default Resolution Time (Hours)</label>
              <input type="number" className="form-input" defaultValue={24} />
            </div>
            <button className="btn-primary" style={{ marginTop: '0.5rem' }}>Save SLA Rules</button>
          </div>
        )}

        {activeTab === 'tags' && (
          <div>
            <h4>Customer Tagging System</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Create global tags to better categorize and filter customers.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="tag-pill tag-primary">VIP</span>
              <span className="tag-pill tag-warning">At Risk</span>
              <span className="tag-pill tag-success">Strategic Partner</span>
              <span className="tag-pill tag-default" style={{ borderStyle: 'dashed', cursor: 'pointer' }}>+ Add Tag</span>
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};
