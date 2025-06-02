import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;
  checkAdminStatus: () => boolean;
  clearAdminStatus: () => void;
  verifyAdminWithServer: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Verify admin status with server on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyAdminWithServer();
    }
  }, []);

  // Verify admin status with the server
  const verifyAdminWithServer = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        clearAdminStatus();
        return false;
      }

      const response = await fetch('http://localhost:3000/api/orders/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.isAdmin) {
          // If we can access admin endpoint and server confirms admin status
          setAdminStatus(true);
          return true;
        }
      }
      
      // If verification fails, clear admin status
      clearAdminStatus();
      return false;
    } catch (error) {
      console.error('Error verifying admin status:', error);
      clearAdminStatus();
      return false;
    }
  };

  // Save admin status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
  };

  const checkAdminStatus = (): boolean => {
    return isAdmin;
  };

  const clearAdminStatus = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setAdminStatus,
        checkAdminStatus,
        clearAdminStatus,
        verifyAdminWithServer,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 