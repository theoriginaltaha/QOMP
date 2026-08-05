import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getEnvironmentById, createCertificate, createJiraTicket } from '../services/api';
import { AddCertificateModal } from './AddCertificateModal';
import { EditCertificateModal } from './EditCertificateModal';
import { AddJiraTicketModal } from './AddJiraTicketModal';
import { ManageAccessModal } from './ManageAccessModal';
import { EditEnvironmentModal } from './EditEnvironmentModal';

import { EnvironmentHeader } from './details/EnvironmentHeader';
import { EnvironmentConfigCards } from './details/EnvironmentConfigCards';
import { SslCertificatesSection } from './details/SslCertificatesSection';

export const EnvironmentDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [environment, setEnvironment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showCertModal, setShowCertModal] = useState(false);
  const [showEditCertModal, setShowEditCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showEditEnvModal, setShowEditEnvModal] = useState(false);

  useEffect(() => {
    if (id) loadEnvironment(id);
  }, [id]);

  const loadEnvironment = async (envId: string) => {
    try {
      setLoading(true);
      const data = await getEnvironmentById(envId);
      setEnvironment(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCert = async (data: any) => {
    await createCertificate(id!, data);
    await loadEnvironment(id!);
  };

  const handleUpdateCert = async (certId: string, data: any) => {
    try {
      const res = await fetch(`/api/certificates/${certId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadEnvironment(id!);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCert = async (certId: string) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await fetch(`/api/certificates/${certId}`, { method: 'DELETE' });
        await loadEnvironment(id!);
      } catch (error) {
        console.error('Error deleting cert', error);
      }
    }
  };



  const handleUpdateEnvironment = async (envId: string, data: any) => {
    try {
      const res = await fetch(`/api/environments/${envId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadEnvironment(id!);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEnvironment = async () => {
    if (window.confirm(`Are you sure you want to permanently delete the environment ${environment.name}? This will destroy all associated certificates and tickets.`)) {
      try {
        await fetch(`/api/environments/${id}`, { method: 'DELETE' });
        navigate('/environments');
      } catch (error) {
        console.error('Error deleting environment', error);
      }
    }
  };



  if (loading) return <div>Loading environment details...</div>;
  if (!environment) return <div>Environment not found</div>;

  return (
    <div className="environments-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => navigate('/environments')}>
        <ArrowLeft size={20} /> Back to Environments
      </div>

      <EnvironmentHeader 
        environment={environment}
        onEdit={() => setShowEditEnvModal(true)}
        onManageAccess={() => setShowAccessModal(true)}
        onDelete={handleDeleteEnvironment}
      />

      <EnvironmentConfigCards environment={environment} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <SslCertificatesSection 
          certificates={environment.certificates}
          onAddCert={() => setShowCertModal(true)}
          onEditCert={(cert) => { setSelectedCert(cert); setShowEditCertModal(true); }}
          onDeleteCert={handleDeleteCert}
        />
      </div>

      <AddCertificateModal isOpen={showCertModal} onClose={() => setShowCertModal(false)} onSubmit={handleAddCert} environmentId={environment.id} />
      {showEditCertModal && selectedCert && (
        <EditCertificateModal isOpen={showEditCertModal} onClose={() => { setShowEditCertModal(false); setSelectedCert(null); }} onSubmit={handleUpdateCert} initialData={selectedCert} />
      )}
      <ManageAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} environmentName={environment.name} />
      {showEditEnvModal && (
        <EditEnvironmentModal isOpen={showEditEnvModal} onClose={() => setShowEditEnvModal(false)} onSubmit={handleUpdateEnvironment} initialData={environment} />
      )}

    </div>
  );
};
