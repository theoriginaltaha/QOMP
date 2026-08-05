import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

interface ResourcesSectionProps {
  resources: any[];
  onAddResource: () => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources, onAddResource, onDeleteResource }) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'Zoom Recording': return '🎥';
      case 'Drive Link': return '📁';
      case 'Screenshot Link': return '🖼️';
      case 'Document Link': return '📄';
      default: return '🔗';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Customer Resources & Links</h3>
        <button className="btn-primary" onClick={onAddResource}>Add Resource</button>
      </div>
      {(!resources || resources.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No resources added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {resources.map((res: any) => (
            <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{getIconForType(res.type)}</div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{res.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type: {res.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary" 
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} /> Open
                </a>
                <button 
                  onClick={() => onDeleteResource(res.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.2rem' }}
                  title="Delete Resource"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
