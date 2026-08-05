import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Server, Bell, Search, Settings, Activity, LogOut, Trash2, PlusCircle, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalAddTaskModal } from './GlobalAddTaskModal';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [personalNotifs, setPersonalNotifs] = useState<any[]>([]);
  const [showGlobalTaskModal, setShowGlobalTaskModal] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ customers: any[], schools: any[] }>({ customers: [], schools: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        setStats(await statsRes.json());

        if (user?.id) {
          const notifsRes = await fetch(`/api/users/${user.id}/notifications`);
          setPersonalNotifs(await notifsRes.json());
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    };
    fetchNotifications();

    // Refresh notifications every 10 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 10000);

    // Click outside handler for dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults({ customers: [], schools: [] });
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults({
          customers: data.customers || [],
          schools: data.schools || []
        });
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    const debounce = setTimeout(() => {
      fetchSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReadNotification = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await fetch(`/api/notifications/${notif.id}/read`, { method: 'PATCH' });
        setPersonalNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error(error);
      }
    }
    
    if (notif.link) {
      navigate(notif.link);
    }
    setShowNotifications(false);
  };

  const handleGlobalTaskSubmit = async (data: any) => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Optionally trigger a re-fetch of stats or just let the interval handle it
    } catch (error) {
      console.error('Failed to create global task', error);
    }
  };

  const unreadCount = personalNotifs.filter(n => !n.isRead).length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>QOMP</h2>
          <span className="version">v1.0</span>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              
              {hasPermission('Customers') && (
                <NavLink to="/customers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                  <Users size={20} />
                  <span>Customers</span>
                </NavLink>
              )}

              {hasPermission('CustomerSuccess') && (
                <NavLink to="/success" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                  <Activity size={20} />
                  <span>Customer Success</span>
                </NavLink>
              )}
              
              {hasPermission('Environments') && (
                <NavLink to="/environments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                  <Server size={20} />
                  <span>Environments</span>
                </NavLink>
              )}

              <NavLink to="/jira" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Ticket size={20} />
                <span>Jira Tickets</span>
              </NavLink>

              {hasPermission('Settings') && (
                <>
                  <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                  </NavLink>
                  <NavLink to="/recycle-bin" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Trash2 size={20} />
                    <span>Recycle Bin</span>
                  </NavLink>
                </>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <header className="topbar">
          <div className="search-container" ref={searchRef} style={{ position: 'relative' }}>
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Global Search..." 
              className="search-input" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
            />
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div style={{ position: 'absolute', top: '120%', left: 0, width: '100%', minWidth: '300px', background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>
                  Search Results
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {searchResults.customers.length === 0 && searchResults.schools.length === 0 ? (
                    <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No results found.</div>
                  ) : (
                    <>
                      {searchResults.customers.length > 0 && (
                        <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f1f5f9' }}>
                          Customers
                        </div>
                      )}
                      {searchResults.customers.map((customer: any) => (
                        <div 
                          key={`cust-${customer.id}`} 
                          style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                          onClick={() => {
                            navigate(`/customers/${customer.id}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                        >
                          <strong style={{ color: 'var(--primary-color)' }}>{customer.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Code: {customer.code} | {customer.industry}</span>
                        </div>
                      ))}
                      
                      {searchResults.schools.length > 0 && (
                        <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f1f5f9' }}>
                          Schools / Branches
                        </div>
                      )}
                      {searchResults.schools.map((school: any) => (
                        <div 
                          key={`school-${school.id}`} 
                          style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                          onClick={() => {
                            navigate(`/customers/${school.customerId}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                        >
                          <strong style={{ color: 'var(--primary-color)' }}>{school.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>School Code: {school.code} | Customer: {school.customer?.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="topbar-actions">
            
            {hasPermission('CustomerSuccess') && (
              <button 
                className="btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '1rem' }}
                onClick={() => setShowGlobalTaskModal(true)}
              >
                <PlusCircle size={16} />
                Add Task
              </button>
            )}

            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} style={{ position: 'relative' }}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -2, right: -2, background: 'var(--color-danger)', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{ position: 'absolute', top: '120%', right: 0, width: '300px', background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: '#f8fafc', fontWeight: 600 }}>
                    Notifications
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Personal Notifications */}
                      {personalNotifs.map(notif => (
                        <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: notif.isRead ? 'transparent' : '#e0f2fe' }} onClick={() => handleReadNotification(notif)}>
                          <div style={{ fontSize: '0.9rem', fontWeight: notif.isRead ? 400 : 600, color: notif.isRead ? 'var(--text-secondary)' : 'var(--primary-color)' }}>Mention @{user?.name}</div>
                          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: notif.isRead ? 0.7 : 1 }}>{notif.message}</div>
                        </div>
                      ))}

                      {/* Global Stats */}
                      {stats && stats.pendingTasks > 0 && (
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => {navigate('/success'); setShowNotifications(false);}}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>You have {stats.pendingTasks} pending tasks in the system</div>
                        </div>
                      )}
                      {stats && stats.activeTickets > 0 && (
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => {navigate('/environments'); setShowNotifications(false);}}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{stats.activeTickets} open infrastructure tickets</div>
                        </div>
                      )}
                      
                      {personalNotifs.length === 0 && (!stats || (stats.pendingTasks === 0 && stats.activeTickets === 0)) && (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No notifications.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
            <div className="user-profile">
              <div className="avatar" title={user?.name}>{user?.name?.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {hasPermission('CustomerSuccess') && (
        <GlobalAddTaskModal 
          isOpen={showGlobalTaskModal} 
          onClose={() => setShowGlobalTaskModal(false)} 
          onSubmit={handleGlobalTaskSubmit} 
        />
      )}
    </div>
  );
};

export default Layout;
