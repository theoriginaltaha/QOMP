import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface SchoolsSectionProps {
  schools: any[];
  onAddSchool: () => void;
  onEditSchool: (school: any) => void;
  onAddContactToSchool: (schoolId: string) => void;
  onEditContact: (contact: any) => void;
  onDeleteContact: (contactId: string, contactName: string) => void;
}

export const SchoolsSection: React.FC<SchoolsSectionProps> = ({ 
  schools, onAddSchool, onEditSchool, onAddContactToSchool, onEditContact, onDeleteContact 
}) => {
  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Schools / Branches</h3>
        <button className="btn-primary" onClick={onAddSchool}>Add School</button>
      </div>
      {schools.length === 0 ? (
        <p className="text-secondary">No schools added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {schools.map((school: any) => (
            <div key={school.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{school.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Code: {school.code} | Stage: {school.educationalStage} | City: {school.city}</div>
                  </div>
                  <button 
                    className="icon-btn" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    title="Edit School"
                    onClick={() => onEditSchool(school)}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <span className="badge">{school.status}</span>
              </div>

              {(school.studentPortalUrl || school.teacherPortalUrl) && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  {school.studentPortalUrl && (
                    <a href={formatUrl(school.studentPortalUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                      🎓 Student Portal
                    </a>
                  )}
                  {school.teacherPortalUrl && (
                    <a href={formatUrl(school.teacherPortalUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                      👨‍🏫 Teacher Portal
                    </a>
                  )}
                </div>
              )}

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>School Contacts</h4>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                    onClick={() => onAddContactToSchool(school.id)}
                  >
                    + Add Contact
                  </button>
                </div>
                
                {(!school.contacts || school.contacts.length === 0) ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>No contacts assigned to this school.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {school.contacts.map((c: any) => (
                      <div key={c.id} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <strong>{c.name}</strong>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => onEditContact(c)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                              title="Edit Contact"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => onDeleteContact(c.id, c.name)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0 }}
                              title="Delete Contact"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {c.jobTitle && <div>{c.jobTitle}</div>}
                        <div style={{ color: 'var(--text-secondary)' }}>{c.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
