import React from 'react';
import { Modal } from '../../../shared/components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  environmentName: string;
}

export const ManageAccessModal: React.FC<Props> = ({ isOpen, onClose, environmentName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Access: ${environmentName}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure SSH, VPN, and database access for this environment.
        </p>
        
        <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>SSH Access</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No SSH keys have been provisioned.</p>
          <button className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => alert('SSH Key integration is coming soon in the next update!')}>+ Add SSH Key</button>
        </div>

        <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>VPN Users</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>0 users connected.</p>
          <button className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => alert('VPN Profile provisioning is coming soon in the next update!')}>+ Provision VPN Profile</button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
};
