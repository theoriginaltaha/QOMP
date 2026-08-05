import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface MainContactsSectionProps {
  contacts: any[];
  onAddContact: () => void;
  onEditContact: (contact: any) => void;
  onDeleteContact: (contactId: string, contactName: string) => void;
}

export const MainContactsSection: React.FC<MainContactsSectionProps> = ({ 
  contacts, onAddContact, onEditContact, onDeleteContact 
}) => {
  const mainContacts = contacts.filter((c: any) => !c.schoolId);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Main Contacts</h3>
        <button className="btn-secondary" onClick={onAddContact}>Add Contact</button>
      </div>
      {mainContacts.length === 0 ? (
        <p className="text-secondary">No main contacts added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mainContacts.map((contact: any) => (
            <div key={contact.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong>{contact.name}</strong> {contact.isPrimary && <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}>(Primary)</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => onEditContact(contact)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                    title="Edit Contact"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteContact(contact.id, contact.name)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0 }}
                    title="Delete Contact"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{contact.jobTitle}</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>📧 {contact.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
