import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const DESIGNATED_ADMINISTRATORS: Record<string, { role: UserRole; displayName: string }> = {
  // Primary Administrator by UID
  'str6aMtNRzVF3ttdQtG0Z7pVUTX2': {
    role: 'super_admin',
    displayName: 'Administrator ZIA Properti'
  },
  // Secondary Administrator / Content by UID
  'jI2BH93v4JPWPZ6ULONFA9LaDdz1': {
    role: 'admin',
    displayName: 'Tim Konten ZIA Properti'
  },
  // By Registered Email
  'ziaproperti@corporate.co.id': {
    role: 'super_admin',
    displayName: 'Administrator ZIA Properti'
  },
  'konten.ziaproperti@gmail.com': {
    role: 'admin',
    displayName: 'Tim Konten ZIA Properti'
  },
  'garenkdeathcore@gmail.com': {
    role: 'super_admin',
    displayName: 'Super Administrator'
  },
  'admin@ziaproperti.co.id': {
    role: 'super_admin',
    displayName: 'Super Administrator'
  }
};

export const getDesignatedAdminInfo = (uid?: string | null, email?: string | null) => {
  if (uid && DESIGNATED_ADMINISTRATORS[uid]) {
    return DESIGNATED_ADMINISTRATORS[uid];
  }
  if (email && DESIGNATED_ADMINISTRATORS[email.toLowerCase()]) {
    return DESIGNATED_ADMINISTRATORS[email.toLowerCase()];
  }
  return null;
};

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  role: UserRole | null;
  login: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  role: null,
  login: async () => {},
  resetPassword: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Admin privileges must be reconstructed from a live Firebase Auth session.
  // A browser-only cached profile is never an authentication source.
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      setUserProfile(null);

      try {
        if (!user) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('zia_admin_session');
          }
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        const designated = getDesignatedAdminInfo(user.uid, user.email);

        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          if (designated && !['super_admin', 'admin'].includes(data.role)) {
            data.role = designated.role;
            await setDoc(userDocRef, {
              role: designated.role,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          setUserProfile(data);
        } else {
          const assignedRole: UserRole = designated ? designated.role : 'sales';
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || designated?.displayName || user.email?.split('@')[0] || 'Pengguna CMS',
            role: assignedRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(userDocRef, defaultProfile);
          setUserProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Gagal memuat profil administrator dari Firebase:', error);
        const designated = getDesignatedAdminInfo(user.uid, user.email);
        if (designated) {
          // A designated account may enter the CMS only while Firebase Auth
          // confirms the actual user. Firestore writes still require valid rules.
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || designated.displayName,
            role: designated.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          setUserProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !pass) {
      throw new Error('Email dan kata sandi wajib diisi.');
    }

    // Never create a privileged account from the login form. Account creation,
    // role assignment and password recovery are managed through Firebase.
    await signInWithEmailAndPassword(auth, normalizedEmail, pass);
  };

  const resetPassword = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Masukkan alamat email terlebih dahulu.');
    }

    await sendPasswordResetEmail(auth, normalizedEmail);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setUserProfile(null);
    if (typeof window !== 'undefined') localStorage.removeItem('zia_admin_session');
  };

  const isAuthorizedRole = !!currentUser && !!userProfile && ['super_admin', 'admin', 'editor', 'sales', 'marketing'].includes(userProfile.role);
  const designatedInfo = currentUser ? getDesignatedAdminInfo(currentUser.uid, currentUser.email) : null;
  const isAdmin = !!currentUser && (isAuthorizedRole || !!designatedInfo);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        role: userProfile?.role || designatedInfo?.role || null,
        login,
        resetPassword,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
