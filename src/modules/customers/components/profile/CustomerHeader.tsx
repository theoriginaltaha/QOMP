import React, { useState, useRef, useEffect } from 'react';
import { Settings, Archive } from 'lucide-react';

interface CustomerHeaderProps {
  customer: any;
  onDelete: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ customer, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-header card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'visible' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>{customer.name} ({customer.code})</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{customer.industry} | {customer.subscriptionType} Plan</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className={`tag-pill ${customer.status === 'Active' ? 'tag-success' : 'tag-warning'}`}>
          {customer.status}
        </span>
        
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <Settings size={20} />
          </button>
          
          {showMenu && (
            <div style={{ 
              position: 'absolute', 
              top: '110%', 
              right: 0, 
              background: 'white', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '0.5rem',
              zIndex: 10,
              minWidth: '180px'
            }}>
              <button 
                onClick={() => { setShowMenu(false); onDelete(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: '4px'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Archive size={16} /> Archive Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
