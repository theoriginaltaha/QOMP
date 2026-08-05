import React, { createContext, useContext, useState, useEffect } from 'react';

interface Permission {
  moduleName: string;
  canRead: boolean;
  canWrite: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (moduleName: string, action?: 'read' | 'write') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('qomp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('qomp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qomp_user');
  };

  const hasPermission = (moduleName: string, action: 'read' | 'write' = 'read') => {
    if (!user) return false;
    if (user.role === 'Admin') return true; // Admin has all permissions
    
    const perm = user.permissions?.find(p => p.moduleName === moduleName);
    if (!perm) return false;
    
    return action === 'read' ? perm.canRead : perm.canWrite;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
