import { createContext, useContext, useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  firebaseUser: any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { user: firebaseUser, logout: firebaseLogout } = useFirebaseAuth();

  useEffect(() => {
    // Check for Firebase authentication or stored admin authentication
    const savedAuth = localStorage.getItem('admin-auth');
    if (savedAuth === 'true' || firebaseUser) {
      setIsAdminAuthenticated(true);
    }
  }, [firebaseUser]);

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin-auth');
    if (firebaseUser) {
      firebaseLogout();
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAdminAuthenticated: isAdminAuthenticated || !!firebaseUser, 
      login, 
      logout,
      firebaseUser 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}