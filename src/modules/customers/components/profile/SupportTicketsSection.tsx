import React from 'react';
import { Ticket, ExternalLink, Download } from 'lucide-react';

interface SupportTicketsSectionProps {
  tickets: any[];
}

export const SupportTicketsSection: React.FC<SupportTicketsSectionProps> = ({ tickets }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket size={20} color="var(--primary-color)" />
          Support Tickets (Customer Portal)
        </h3>
      </div>
      
      {(!tickets || tickets.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No support tickets submitted by this customer.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.map((ticket: any) => (
            <div key={ticket.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>{ticket.title}</strong>
                <span className={`tag-pill tag-${ticket.status === 'Open' ? 'warning' : 'success'}`}>
                  {ticket.status}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {ticket.description}
              </p>
              
              {ticket.attachmentUrl && (
                <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  <a 
                    href={ticket.attachmentUrl.startsWith('http') ? ticket.attachmentUrl : `${ticket.attachmentUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                  >
                    {ticket.attachmentUrl.startsWith('/uploads') ? <Download size={16} /> : <ExternalLink size={16} />}
                    View Attachment
                  </a>
                </div>
              )}
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Submitted: {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
