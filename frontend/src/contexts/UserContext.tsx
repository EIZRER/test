import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import { IUser } from '../types/user';

interface UserContextType {
  user: IUser | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const clearUser = () => setUser(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error as Error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        setUser(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to get current user:', error);
        setUser(null);
        // Don't set error here - it's expected that users might not be logged in initially
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Debug
  useEffect(() => {
    console.log('UserContext state:', { user, loading, error });
  }, [user, loading, error]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, refresh, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 