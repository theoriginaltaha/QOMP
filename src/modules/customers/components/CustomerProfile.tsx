import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, createContact, createSchool } from '../services/api';
import { createResource, deleteResource } from '../services/api';
import { AddContactModal } from './AddContactModal';
import { EditContactModal } from './EditContactModal';
import { AddSchoolModal } from './AddSchoolModal';
import { EditSchoolModal } from './EditSchoolModal';
import { EditPortalsModal } from './EditPortalsModal';
import { EditAccountTeamModal } from './EditAccountTeamModal';
import { AddResourceModal } from './AddResourceModal';

// Success & Environments
import { createTask, createMeeting, createRenewal, updateTaskStatus } from '../../customerSuccess/services/api';
import { AddTaskModal } from '../../customerSuccess/components/AddTaskModal';
import { AddMeetingModal } from '../../customerSuccess/components/AddMeetingModal';
import { AddRenewalModal } from '../../customerSuccess/components/AddRenewalModal';
import { createEnvironment } from '../../environments/services/api';
import { AddEnvironmentModal } from '../../environments/components/AddEnvironmentModal';

// Micro Components
import { CustomerHeader } from './profile/CustomerHeader';
import { CustomerKPIs } from './profile/CustomerKPIs';
import { TasksSection } from './profile/TasksSection';
import { MeetingsSection } from './profile/MeetingsSection';
import { PortalsSection } from './profile/PortalsSection';
import { ResourcesSection } from './profile/ResourcesSection';
import { SchoolsSection } from './profile/SchoolsSection';
import { MainContactsSection } from './profile/MainContactsSection';
import { RenewalsSection } from './profile/RenewalsSection';
import { EnvironmentsSection } from './profile/EnvironmentsSection';
import { AccountTeamSection } from './profile/AccountTeamSection';
import { CustomerSettingsSection } from './profile/CustomerSettingsSection';
import { SupportTicketsSection } from './profile/SupportTicketsSection';

import './CustomerProfile.css';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState<any>(null);
  const [selectedSchoolIdForContact, setSelectedSchoolIdForContact] = useState<string | undefined>(undefined);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false);
  const [selectedSchoolForEdit, setSelectedSchoolForEdit] = useState<any>(null);
  const [showEditPortalsModal, setShowEditPortalsModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [showAccountTeamModal, setShowAccountTeamModal] = useState(false);

  useEffect(() => {
    if (id) loadCustomer(id);
  }, [id]);

  const loadCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const data = await getCustomerById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (data: any) => {
    await createContact(id!, data);
    await loadCustomer(id!);
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (window.confirm(`Are you sure you want to delete ${contactName}?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/contacts/${contactId}`, { method: 'DELETE' });
        if (res.ok) await loadCustomer(id!);
      } catch (error) {
        console.error('Failed to delete contact', error);
      }
    }
  };

  const handleUpdateContact = async (contactId: string, data: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadCustomer(id!);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSchool = async (data: any) => {
    await createSchool(id!, data);
    await loadCustomer(id!);
  };

  const handleUpdateSchool = async (schoolId: string, data: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/schools/${schoolId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) await loadCustomer(id!);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (data: any) => {
    await createTask(id!, data);
    await loadCustomer(id!);
  };

  const handleUpdateTask = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
    await loadCustomer(id!);
  };

  const handleAddMeeting = async (data: any) => {
    await createMeeting(id!, data);
    await loadCustomer(id!);
  };

  const handleAddRenewal = async (data: any) => {
    await createRenewal(id!, data);
    await loadCustomer(id!);
  };

  const handleAddEnvironment = async (data: any) => {
    await createEnvironment(id!, data);
    await loadCustomer(id!);
  };

  const handleUpdateAccountTeam = async (data: any) => {
    try {
      await fetch(`http://localhost:3000/api/customers/${id}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      await loadCustomer(id!);
    } catch (error) {
      console.error('Failed to update account team', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}? This will move them to the Recycle Bin.`)) {
      try {
        await fetch(`http://localhost:3000/api/customers/${id}`, { method: 'DELETE' });
        navigate('/customers');
      } catch (error) {
        console.error('Failed to delete customer', error);
        alert('Failed to delete customer');
      }
    }
  };

  const handleUpdatePortals = async (data: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}/portals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) loadCustomer(id!);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddResource = async (data: any, file?: File) => {
    await createResource(id!, data, file);
    await loadCustomer(id!);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await deleteResource(resourceId);
      await loadCustomer(id!);
    }
  };

  if (loading) return <div>Loading customer profile...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="customer-profile-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <CustomerHeader customer={customer} onDelete={handleDeleteCustomer} />
      <CustomerKPIs customer={customer} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TasksSection tasks={customer.tasks} onAddTask={() => setShowTaskModal(true)} onUpdateTask={handleUpdateTask} />
          <SupportTicketsSection tickets={customer.customerTickets} />
          <MeetingsSection meetings={customer.meetings} onAddMeeting={() => setShowMeetingModal(true)} />
          <PortalsSection customer={customer} onEditPortals={() => setShowEditPortalsModal(true)} />
          <ResourcesSection resources={customer.resources} onAddResource={() => setShowResourceModal(true)} onDeleteResource={handleDeleteResource} />
          <SchoolsSection 
            schools={customer.schools} 
            onAddSchool={() => setShowSchoolModal(true)} 
            onEditSchool={(s) => { setSelectedSchoolForEdit(s); setShowEditSchoolModal(true); }}
            onAddContactToSchool={(schoolId) => { setSelectedSchoolIdForContact(schoolId); setShowContactModal(true); }}
            onEditContact={(c) => { setSelectedContactForEdit(c); setShowEditContactModal(true); }}
            onDeleteContact={handleDeleteContact}
          />
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <MainContactsSection 
            contacts={customer.contacts} 
            onAddContact={() => { setSelectedSchoolIdForContact(undefined); setShowContactModal(true); }}
            onEditContact={(c) => { setSelectedContactForEdit(c); setShowEditContactModal(true); }}
            onDeleteContact={handleDeleteContact}
          />
          <RenewalsSection renewals={customer.renewals} onAddRenewal={() => setShowRenewalModal(true)} />
          <EnvironmentsSection environments={customer.environments} onAddEnvironment={() => setShowEnvModal(true)} />
          <AccountTeamSection customer={customer} onEditAccountTeam={() => setShowAccountTeamModal(true)} />
        </div>
      </div>

      {/* Modals */}
      <AddContactModal isOpen={showContactModal} onClose={() => { setShowContactModal(false); setSelectedSchoolIdForContact(undefined); }} onSubmit={handleAddContact} schoolId={selectedSchoolIdForContact} />
      {showEditContactModal && selectedContactForEdit && (
        <EditContactModal isOpen={showEditContactModal} onClose={() => { setShowEditContactModal(false); setSelectedContactForEdit(null); }} onSubmit={handleUpdateContact} initialData={selectedContactForEdit} />
      )}
      <AddSchoolModal isOpen={showSchoolModal} onClose={() => setShowSchoolModal(false)} onSubmit={handleAddSchool} />
      {showEditSchoolModal && selectedSchoolForEdit && (
        <EditSchoolModal isOpen={showEditSchoolModal} onClose={() => { setShowEditSchoolModal(false); setSelectedSchoolForEdit(null); }} onSubmit={handleUpdateSchool} initialData={selectedSchoolForEdit} />
      )}
      {showEditPortalsModal && <EditPortalsModal isOpen={showEditPortalsModal} onClose={() => setShowEditPortalsModal(false)} onSubmit={handleUpdatePortals} initialData={customer} />}
      <AddResourceModal isOpen={showResourceModal} onClose={() => setShowResourceModal(false)} onSubmit={handleAddResource} />
      <AddTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} onSubmit={handleAddTask} />
      <AddMeetingModal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} onSubmit={handleAddMeeting} />
      <AddRenewalModal isOpen={showRenewalModal} onClose={() => setShowRenewalModal(false)} onSubmit={handleAddRenewal} />
      <AddEnvironmentModal isOpen={showEnvModal} onClose={() => setShowEnvModal(false)} onSubmit={handleAddEnvironment} customerId={id!} />
      <EditAccountTeamModal isOpen={showAccountTeamModal} onClose={() => setShowAccountTeamModal(false)} onSubmit={handleUpdateAccountTeam} initialData={customer} />

    </div>
  );
};
