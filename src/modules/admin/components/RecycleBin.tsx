import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { RefreshCw, Trash2 } from 'lucide-react';

export const RecycleBin: React.FC = () => {
  const { hasPermission } = useAuth();
  const [deletedCustomers, setDeletedCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecycleBin();
  }, []);

  const loadRecycleBin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/recycle-bin/customers');
      const data = await res.json();
      setDeletedCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to restore ${name}?`)) {
      try {
        await fetch(`/api/customers/${id}/restore`, { method: 'PATCH' });
        loadRecycleBin();
      } catch (error) {
        console.error('Error restoring customer', error);
      }
    }
  };

  const handleHardDelete = async (id: string, name: string) => {
    if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY DELETE ${name} and all of their related data (environments, tasks, meetings)? This cannot be undone.`)) {
      try {
        await fetch(`/api/customers/${id}/hard`, { method: 'DELETE' });
        loadRecycleBin();
      } catch (error) {
        console.error('Error permanently deleting customer', error);
      }
    }
  };

  if (!hasPermission('Settings')) {
    return <div>You do not have permission to view the Recycle Bin.</div>;
  }

  if (loading) return <div>Loading Recycle Bin...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Recycle Bin</h1>
        <p>Manage soft-deleted customers. You can restore them to the CRM or permanently delete them.</p>
      </header>

      <div className="card">
        {deletedCustomers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Trash2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>The recycle bin is currently empty.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Customer Name</th>
                <th style={{ padding: '0.5rem' }}>Code</th>
                <th style={{ padding: '0.5rem' }}>Deleted At</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedCustomers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem' }}><strong>{c.name}</strong></td>
                  <td style={{ padding: '0.5rem' }}>{c.code}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(c.deletedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleRestore(c.id, c.name)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <RefreshCw size={14} /> Restore
                    </button>
                    <button 
                      className="btn-primary" 
                      onClick={() => handleHardDelete(c.id, c.name)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'var(--color-danger)' }}
                    >
                      Delete Permanently
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
