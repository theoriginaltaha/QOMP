import React, { useState, useEffect } from 'react';
import { Ticket, Plus } from 'lucide-react';
import { AddJiraTicketModal } from '../../environments/components/AddJiraTicketModal';

export const JiraDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/tickets/jira');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTicket = async (data: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/customers/${data.customerId}/tickets/jira`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await loadTickets();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Jira ticket?')) {
      try {
        await fetch(`http://localhost:3000/api/tickets/jira/${id}`, { method: 'DELETE' });
        await loadTickets();
      } catch (error) {
        console.error('Error deleting ticket', error);
      }
    }
  };

  if (loading) return <div>Loading Jira Tickets...</div>;

  return (
    <div className="environments-container">
      <div className="header-actions">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={28} color="var(--primary-color)" />
            Jira Tickets
          </h1>
          <p className="subtitle">Manage and track all Jira issues across customers</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Ticket
        </button>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{ticket.ticketId}</td>
                <td>{ticket.customer?.name || 'N/A'}</td>
                <td>{ticket.title}</td>
                <td>{ticket.type}</td>
                <td><span className={`tag-pill tag-${ticket.status === 'Done' ? 'success' : 'warning'}`}>{ticket.status}</span></td>
                <td>{ticket.priority}</td>
                <td>{ticket.assignee || 'Unassigned'}</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleDeleteTicket(ticket.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No Jira tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddJiraTicketModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddTicket} environmentId="" />
    </div>
  );
};
