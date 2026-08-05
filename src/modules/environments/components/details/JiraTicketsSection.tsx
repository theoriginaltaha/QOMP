import React from 'react';

interface JiraTicketsSectionProps {
  tickets: any[];
  onAddTicket: () => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const JiraTicketsSection: React.FC<JiraTicketsSectionProps> = ({ tickets, onAddTicket, onDeleteTicket }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Jira Infrastructure Tickets</h3>
        <button className="btn-primary" onClick={onAddTicket}>Log Ticket</button>
      </div>
      {(!tickets || tickets.length === 0) ? (
        <p style={{ color: 'var(--text-secondary)' }}>No tickets found for this environment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tickets.map((ticket: any) => (
            <div key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong>{ticket.ticketId}: {ticket.title}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assignee: {ticket.assignee} | Priority: {ticket.priority}</div>
              </div>
              <div>
                <span className="tag-pill tag-info" style={{ marginRight: '1rem' }}>{ticket.status}</span>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                  onClick={() => onDeleteTicket(ticket.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
