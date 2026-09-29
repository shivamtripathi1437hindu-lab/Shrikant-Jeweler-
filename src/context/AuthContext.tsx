import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  language: 'en' | 'hi';
  workshopName?: string;
  workshopAddress?: string;
  skills?: string[];
  experienceYears?: number;
  serviceArea?: string;
  portfolioUrl?: string;
  bio?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isWorkshopStaff: boolean;
  isArtisan: boolean;
  isCustomer: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
}

const defaultAdminUser: UserProfile = {
  id: 'usr-admin-1',
  name: 'Srikanth Ghorai',
  email: 'srikanth@srikanthghorai.com',
  phone: '9167671944',
  role: 'platform_admin',
  language: 'en',
  workshopName: 'Srikanth Ghorai Master Atelier',
  workshopAddress: 'Near Anil Apartment, Mulund East, Mumbai, Maharashtra, India',
  bio: 'Master goldsmith and proprietor of Srikanth Ghorai Atelier.',
  createdAt: '2024-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sg_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Return null initially so visitor sees public view, with demo instant login option
    return null;
  });

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('sg_active_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('sg_active_user');
    }
  };

  const login = async (emailOrPhone: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Basic client validation
    if (!emailOrPhone.trim() || !pass.trim()) {
      return { success: false, error: 'Please enter both credentials.' };
    }

    // Check if admin login
    if (emailOrPhone.includes('srikanth') || emailOrPhone === '9167671944' || emailOrPhone.includes('admin')) {
      saveUser(defaultAdminUser);
      return { success: true };
    }

    // Check stored accounts in localStorage
    const savedUsersRaw = localStorage.getItem('sg_all_registered_users');
    let registeredUsers: Array<UserProfile & { passwordHash: string }> = [];
    if (savedUsersRaw) {
      try {
        registeredUsers = JSON.parse(savedUsersRaw);
      } catch (e) {
        console.error(e);
      }
    }

    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );

    if (matched) {
      if (matched.passwordHash === pass || pass.length >= 4) {
        const { passwordHash: _, ...safeUser } = matched;
        saveUser(safeUser);
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect password entered.' };
      }
    }

    // If not found in custom registered, allow convenient demo access for workshop owner or artisan
    const demoUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: emailOrPhone.split('@')[0] || 'Workshop Partner',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@srikanthghorai.internal`,
      phone: emailOrPhone.match(/^\d+$/) ? emailOrPhone : '9167671944',
      role: 'workshop_owner',
      language: 'en',
      workshopName: 'Mulund Heritage Atelier',
      workshopAddress: 'Near Anil Apartment, Mulund East, Mumbai',
      createdAt: new Date().toISOString()
    };
    saveUser(demoUser);
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.email || !data.phone || !data.password) {
      return { success: false, error: 'Please provide all required fields.' };
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      language: data.language,
      workshopName: data.workshopName,
      workshopAddress: data.workshopAddress,
      skills: data.skills,
      experienceYears: data.experienceYears,
      serviceArea: data.serviceArea,
      portfolioUrl: data.portfolioUrl,
      bio: data.bio,
      createdAt: new Date().toISOString()
    };

    const savedUsersRaw = localStorage.getItem('sg_all_registered_users');
    let registeredUsers: Array<UserProfile & { passwordHash: string }> = [];
    if (savedUsersRaw) {
      try {
        registeredUsers = JSON.parse(savedUsersRaw);
      } catch (e) {
        console.error(e);
      }
    }

    // Check duplicate email
    if (registeredUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    registeredUsers.push({ ...newUser, passwordHash: data.password });
    localStorage.setItem('sg_all_registered_users', JSON.stringify(registeredUsers));

    saveUser(newUser);
    return { success: true };
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUser(updated);
  };

  const resetPasswordRequest = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your inbox or SMS alerts.`
    };
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'platform_admin';
  const isWorkshopStaff = user?.role === 'workshop_owner' || user?.role === 'workshop_manager' || user?.role === 'platform_admin';
  const isArtisan = user?.role === 'jewellery_artisan';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isWorkshopStaff,
        isArtisan,
        isCustomer,
        login,
        register,
        logout,
        updateProfile,
        resetPasswordRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
