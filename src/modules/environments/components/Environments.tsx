import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnvironments } from '../services/api';
import './Environments.css';

export const Environments: React.FC = () => {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    try {
      setLoading(true);
      const data = await getEnvironments();
      setEnvironments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading environments...</div>;

  return (
    <div className="environments-container">
      <header className="environments-header">
        <div>
          <h1>Infrastructure & Environments</h1>
          <p>Global view of all provisioned environments across clients.</p>
        </div>
      </header>

      <div className="card">
        {environments.length === 0 ? (
          <p>No environments provisioned yet.</p>
        ) : (
          <table className="environments-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>ENVIRONMENT</th>
                <th>TYPE</th>
                <th>STATUS</th>
                <th>DB VERSION</th>
                <th>APP VERSION</th>
              </tr>
            </thead>
            <tbody>
              {environments.map(env => (
                <tr key={env.id} onClick={() => navigate(`/environments/${env.id}`)} style={{ cursor: 'pointer' }}>
                  <td><strong>{env.customer?.name}</strong></td>
                  <td>{env.name}</td>
                  <td><span className="tag-pill tag-info">{env.type}</span></td>
                  <td>
                    <span className={`tag-pill ${env.status === 'Running' ? 'tag-success' : 'tag-warning'}`}>
                      {env.status}
                    </span>
                  </td>
                  <td>{env.dbVersion}</td>
                  <td>{env.appVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
