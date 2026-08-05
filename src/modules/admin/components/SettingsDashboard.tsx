import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Modal } from '../../../shared/components/Modal';

export const SettingsDashboard: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Add User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');

  // Permissions Form State
  const [perms, setPerms] = useState({
    Customers: false,
    CustomerSuccess: false,
    Environments: false,
    Settings: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      setShowAddUser(false);
      setName(''); setEmail(''); setPassword(''); setRole('User');
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const openPermissionsModal = (user: any) => {
    setSelectedUser(user);
    const newPerms = { Customers: false, CustomerSuccess: false, Environments: false, Settings: false };
    user.permissions.forEach((p: any) => {
      if (p.moduleName in newPerms) {
        (newPerms as any)[p.moduleName] = p.canRead;
      }
    });
    setPerms(newPerms);
    setShowPermissions(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    const permissionsArray = Object.entries(perms)
      .filter(([_, canRead]) => canRead)
      .map(([moduleName, canRead]) => ({
        moduleName,
        canRead,
        canWrite: canRead // For MVP, we'll just give write access if they have read access
      }));

    try {
      await fetch(`/api/users/${selectedUser.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: permissionsArray })
      });
      setShowPermissions(false);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  if (!hasPermission('Settings')) {
    return <div>You do not have permission to view this page.</div>;
  }

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Settings & Admin</h1>
          <p>Manage users and their module permissions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddUser(true)}>Add User</button>
      </header>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>Email</th>
              <th style={{ padding: '0.5rem' }}>Role</th>
              <th style={{ padding: '0.5rem' }}>Access</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem' }}><strong>{u.name}</strong></td>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span className={`tag-pill ${u.role === 'Admin' ? 'tag-warning' : 'tag-info'}`}>{u.role}</span>
                </td>
                <td style={{ padding: '0.5rem', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {u.role === 'Admin' ? (
                    <span className="tag-pill tag-success">Full Access</span>
                  ) : u.permissions.length === 0 ? (
                    <span className="tag-pill">No Access</span>
                  ) : (
                    u.permissions.map((p: any) => (
                      <span key={p.id} className="tag-pill">{p.moduleName}</span>
                    ))
                  )}
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {u.role !== 'Admin' && (
                    <button className="btn-secondary" onClick={() => openPermissionsModal(u)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                      Manage Permissions
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User">
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Name</label>
            <input className="form-input" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Temporary Password</label>
            <input type="password" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="User">Regular User (Needs Permissions)</option>
              <option value="Admin">System Admin (Full Access)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create User</button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={showPermissions} onClose={() => setShowPermissions(false)} title={`Manage Permissions for ${selectedUser?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Select the modules this user can access:</p>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={perms.Customers} onChange={e => setPerms({...perms, Customers: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
            <strong>Customers (CRM)</strong>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={perms.CustomerSuccess} onChange={e => setPerms({...perms, CustomerSuccess: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
            <strong>Customer Success</strong>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={perms.Environments} onChange={e => setPerms({...perms, Environments: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
            <strong>Environments (Infrastructure)</strong>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={perms.Settings} onChange={e => setPerms({...perms, Settings: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
            <strong>Settings (Admin Panel)</strong>
          </label>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowPermissions(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSavePermissions}>Save Permissions</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
