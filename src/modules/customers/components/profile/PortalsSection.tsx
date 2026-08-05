import React from 'react';

interface PortalsSectionProps {
  customer: any;
  onEditPortals: () => void;
}

export const PortalsSection: React.FC<PortalsSectionProps> = ({ customer, onEditPortals }) => {
  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Portals & Links</h3>
        <button className="btn-secondary" onClick={onEditPortals}>Edit Portals</button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {customer.websiteUrl ? (
          <a href={formatUrl(customer.websiteUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>
            🌍 Main Website
          </a>
        ) : null}
        {customer.studentPortalUrl ? (
          <a href={formatUrl(customer.studentPortalUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>
            🎓 Student Portal
          </a>
        ) : null}
        {customer.teacherPortalUrl ? (
          <a href={formatUrl(customer.teacherPortalUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>
            👨‍🏫 Teacher Portal
          </a>
        ) : null}
        
        {!customer.websiteUrl && !customer.studentPortalUrl && !customer.teacherPortalUrl && (
          <p className="text-secondary" style={{ margin: 0 }}>No main portal links configured.</p>
        )}
      </div>
    </div>
  );
};
