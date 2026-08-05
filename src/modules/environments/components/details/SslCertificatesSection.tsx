import React from 'react';

interface SslCertificatesSectionProps {
  certificates: any[];
  onAddCert: () => void;
  onEditCert: (cert: any) => void;
  onDeleteCert: (certId: string) => void;
}

export const SslCertificatesSection: React.FC<SslCertificatesSectionProps> = ({ certificates, onAddCert, onEditCert, onDeleteCert }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>SSL Certificates</h3>
        <button className="btn-primary" onClick={onAddCert}>Add Cert</button>
      </div>
      {(!certificates || certificates.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No certificates configured.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Domain</th>
              <th style={{ padding: '0.5rem' }}>Expires</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert: any) => (
              <tr key={cert.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem' }}>{cert.domain}</td>
                <td style={{ padding: '0.5rem' }}>{cert.validTo}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span className={`tag-pill ${cert.status === 'Valid' ? 'tag-success' : 'tag-warning'}`}>{cert.status}</span>
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                    onClick={() => onEditCert(cert)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    onClick={() => onDeleteCert(cert.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
