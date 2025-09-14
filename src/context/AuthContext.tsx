import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (stateId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updatePassword: (userId: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (stateId: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('state_id', stateId)
        .eq('password', password)
        .single();

      if (error || !data) {
        return false;
      }

      const user: User = {
        id: data.id,
        name: data.name,
        stateId: data.state_id,
        password: data.password,
        type: data.type,
        role: data.role,
        firstLogin: data.first_login
      };

      setUser(user);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const updatePassword = async (userId: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          password: newPassword,
          first_login: false
        })
        .eq('id', userId);

      if (error) throw error;

      if (user && user.id === userId) {
        setUser({
          ...user,
          password: newPassword,
          firstLogin: false
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin,
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};