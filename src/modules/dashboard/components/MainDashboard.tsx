import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardWidget } from '../../../shared/components/CardWidget';
import { Users, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { getStats } from '../../../shared/services/api';
import './MainDashboard.css';

export const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customerCount: 0,
    envCount: 0,
    activeTickets: 0,
    pendingTasks: 0,
    userCount: 0,
    questionsCount: 0,
    examsCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div className="main-dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Global platform overview across all modules.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <CardWidget 
          title="Total Customers" 
          value={stats.customerCount} 
          icon={<Users />} 
          onClick={() => navigate('/customers')}
        />
        <CardWidget 
          title="Total Users (Integration)" 
          value={stats.userCount} 
          icon={<Users />} 
        />
        <CardWidget 
          title="Total Questions (Integration)" 
          value={stats.questionsCount} 
          icon={<CheckCircle />} 
        />
        <CardWidget 
          title="Total Exams (Integration)" 
          value={stats.examsCount} 
          icon={<CheckCircle />} 
        />
        <CardWidget 
          title="Provisioned Environments" 
          value={stats.envCount} 
          icon={<Server />} 
          onClick={() => navigate('/environments')}
        />
        <CardWidget 
          title="Open Jira Tickets" 
          value={stats.activeTickets} 
          icon={<AlertTriangle />} 
          onClick={() => navigate('/environments')}
        />
        <CardWidget 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={<CheckCircle />} 
          onClick={() => navigate('/success')}
        />
      </div>

      <div className="dashboard-content-grid">
        <div className="card">
          <h3>System Status</h3>
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            <span>All systems operational</span>
          </div>
          <p className="status-desc">Last checked: Just now</p>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="btn-secondary" onClick={() => navigate('/customers')}>Add Customer</button>
            <button className="btn-secondary" onClick={() => navigate('/environments')}>Provision Environment</button>
            <button className="btn-secondary" onClick={() => navigate('/environments')}>Log Ticket</button>
            <button className="btn-secondary" onClick={() => navigate('/success')}>View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};
