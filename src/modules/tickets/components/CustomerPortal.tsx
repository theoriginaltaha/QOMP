import React, { useState, useEffect } from 'react';
import { Ticket, Send, ShieldAlert } from 'lucide-react';
import '../../auth/components/Login.css'; // Reuse login styling

export const CustomerPortal: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    link: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('customerId', formData.customerId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.link) formDataToSend.append('link', formData.link);
      if (file) formDataToSend.append('file', file);

      const res = await fetch(`http://localhost:3000/api/customers/${formData.customerId}/tickets/support`, {
        method: 'POST',
        body: formDataToSend
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ customerId: '', title: '', description: '', link: '' });
        setFile(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <Ticket size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h2>Customer Support Portal</h2>
          <p>Submit a support ticket and our team will get back to you.</p>
        </div>

        {success ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-success-light)', borderRadius: '8px', color: 'var(--color-success)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Ticket Submitted Successfully!</h3>
            <p>Your support request has been logged. We will contact you soon.</p>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>Submit Another Ticket</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Select Your Organization</label>
              <select 
                className="form-input"
                required
                value={formData.customerId}
                onChange={e => setFormData({...formData, customerId: e.target.value})}
              >
                <option value="" disabled>Select your organization</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Issue Title</label>
              <input 
                type="text"
                className="form-input"
                placeholder="Brief summary of the issue"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea 
                className="form-input"
                placeholder="Provide as much detail as possible..."
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Attachment URL (Optional)</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. google.drive.com/..."
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Upload File (Optional)</label>
              <input 
                type="file"
                className="form-input"
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={14} /> Secure Support Portal
        </div>
      </div>
    </div>
  );
};
