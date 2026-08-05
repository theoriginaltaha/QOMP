import React, { useState, useEffect } from 'react';
import { CardWidget } from '../../../shared/components/CardWidget';
import { getTasks, getMeetings, getRenewals, updateTaskStatus } from '../services/api';
import './SuccessDashboard.css';

export const SuccessDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tData, mData, rData] = await Promise.all([
        getTasks(),
        getMeetings(),
        getRenewals()
      ]);
      setTasks(tData);
      setMeetings(mData);
      setRenewals(rData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Customer Success Overview</h1>
        <p>Global view of all tasks, meetings, and upcoming renewals.</p>
      </header>

      <div className="dashboard-grid">
        <CardWidget 
          title="Total Open Tasks" 
          value={tasks.filter(t => t.status !== 'Completed').length.toString()} 
          trend="down" 
          trendValue="2 closed today" 
        />
        <CardWidget 
          title="Upcoming Meetings" 
          value={meetings.filter(m => m.status === 'Scheduled').length.toString()} 
          trend="up" 
          trendValue="Next: Tomorrow" 
        />
        <CardWidget 
          title="Renewals at Risk" 
          value={renewals.filter(r => r.status === 'At Risk').length.toString()} 
          trend="neutral" 
          trendValue="Needs attention" 
        />
      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Global Tasks List */}
        <div className="card">
          <h2>All Tasks</h2>
          {tasks.length === 0 ? <p>No tasks found.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.5rem' }}>Task</th>
                  <th style={{ padding: '0.5rem' }}>Due</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                  <th style={{ padding: '0.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>{task.customer?.name}</td>
                    <td style={{ padding: '0.5rem' }}>{task.title}</td>
                    <td style={{ padding: '0.5rem' }}>{task.dueDate}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span className={`tag-pill ${task.status === 'Completed' ? 'tag-success' : 'tag-warning'}`}>{task.status}</span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {task.status !== 'Completed' && (
                        <button 
                          onClick={() => handleUpdateTask(task.id, 'Completed')}
                          style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Global Renewals List */}
        <div className="card">
          <h2>Upcoming Renewals</h2>
          {renewals.length === 0 ? <p>No renewals found.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.5rem' }}>Value</th>
                  <th style={{ padding: '0.5rem' }}>Date</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {renewals.map((renewal) => (
                  <tr key={renewal.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>{renewal.customer?.name}</td>
                    <td style={{ padding: '0.5rem' }}>{renewal.contractValue}</td>
                    <td style={{ padding: '0.5rem' }}>{renewal.renewalDate}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span className={`tag-pill tag-warning`}>{renewal.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
