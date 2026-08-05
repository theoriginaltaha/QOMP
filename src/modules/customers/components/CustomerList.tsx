import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '../models/types';
import { getCustomers, createCustomer } from '../services/api';
import { DataTable } from '../../../shared/components/DataTable';
import { Badge } from '../../../shared/components/Badge';
import { Settings } from 'lucide-react';
import { CustomerSettingsModal } from './CustomerSettingsModal';
import './CustomerList.css';

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', type: 'B2B', industry: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(formData);
      setShowForm(false);
      setFormData({ name: '', code: '', type: 'B2B', industry: '' });
      loadCustomers(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Suspended': return 'danger';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Customer Name', render: (c: Customer) => <strong>{c.name}</strong> },
    { key: 'industry', header: 'Industry' },
    { 
      key: 'status', 
      header: 'Status', 
      render: (c: Customer) => <Badge variant={getStatusBadgeVariant(c.status)}>{c.status}</Badge> 
    },
    { key: 'contractEndDate', header: 'Contract End' }
  ];

  return (
    <div className="customer-list-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage your B2B clients, their contracts, and statuses.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => setShowSettingsModal(true)} style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={18} />
            Settings
          </button>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Customer'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Add New Customer (Saved to SQLite DB)</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Name" 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{ padding: '0.5rem' }}
            />
            <input 
              type="text" 
              placeholder="Code (e.g., GEMS)" 
              required
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
              style={{ padding: '0.5rem' }}
            />
            <input 
              type="text" 
              placeholder="Industry" 
              required
              value={formData.industry} 
              onChange={e => setFormData({...formData, industry: e.target.value})} 
              style={{ padding: '0.5rem' }}
            />
            <button type="submit" className="btn-primary">Save to Database</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading data from backend...</p>
      ) : (
        <DataTable 
          data={customers} 
          columns={columns} 
          onRowClick={(customer) => navigate(`/customers/${customer.id}`)} 
        />
      )}

      <CustomerSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </div>
  );
};
