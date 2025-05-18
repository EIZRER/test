import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import { IUser } from '../types/user';

interface UserContextType {
  user: IUser | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    refresh: fetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 