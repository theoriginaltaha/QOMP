import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';
import { MainDashboard } from './modules/dashboard/components/MainDashboard';
import { CustomerList } from './modules/customers/components/CustomerList';
import { CustomerProfile } from './modules/customers/components/CustomerProfile';
import { SuccessDashboard } from './modules/customerSuccess/components/SuccessDashboard';
import { Environments } from './modules/environments/components/Environments';
import { EnvironmentDetails } from './modules/environments/components/EnvironmentDetails';
import { SettingsDashboard } from './modules/admin/components/SettingsDashboard';
import { RecycleBin } from './modules/admin/components/RecycleBin';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { Login } from './modules/auth/components/Login';
import { JiraDashboard } from './modules/tickets/components/JiraDashboard';
import { CustomerPortal } from './modules/tickets/components/CustomerPortal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/support-portal" element={<CustomerPortal />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<MainDashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerProfile />} />
            <Route path="success" element={<SuccessDashboard />} />
            <Route path="environments" element={<Environments />} />
            <Route path="environments/:id" element={<EnvironmentDetails />} />
            <Route path="jira" element={<JiraDashboard />} />
            <Route path="settings" element={<SettingsDashboard />} />
            <Route path="recycle-bin" element={<RecycleBin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
