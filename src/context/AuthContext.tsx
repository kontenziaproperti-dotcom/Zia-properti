import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  loginWithGoogle: () => Promise<void>;
  demoLogin: (role?: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  role: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  demoLogin: () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('zia_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          const designated = getDesignatedAdminInfo(user.uid, user.email);

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // If user is a designated administrator, ensure their active session has admin role
            if (designated && data.role !== 'super_admin' && data.role !== 'admin') {
              data.role = designated.role;
              await setDoc(userDocRef, { role: designated.role, updatedAt: new Date().toISOString() }, { merge: true });
            }
            setUserProfile(data);
            localStorage.setItem('zia_admin_session', JSON.stringify(data));
          } else {
            // New user registration / first login
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
            localStorage.setItem('zia_admin_session', JSON.stringify(defaultProfile));
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
          const designated = getDesignatedAdminInfo(user.uid, user.email);
          if (designated) {
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || designated.displayName,
              role: designated.role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setUserProfile(fallbackProfile);
            localStorage.setItem('zia_admin_session', JSON.stringify(fallbackProfile));
          } else {
            // Non-authorized user: do NOT grant super_admin
            setUserProfile(null);
            localStorage.removeItem('zia_admin_session');
          }
        }
      } else {
        // Not authenticated
        setUserProfile(null);
        localStorage.removeItem('zia_admin_session');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // Auto-create account ONLY if it is a designated administrator and user does not exist in Auth
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        const designated = getDesignatedAdminInfo(null, email);
        if (designated) {
          try {
            await createUserWithEmailAndPassword(auth, email, pass);
            return;
          } catch (createErr) {
            console.warn('Firebase createUser failed for designated admin:', createErr);
          }
        }
      }
      // Re-throw so authentication failure is properly displayed and unauthorized users are blocked
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const demoLogin = (role: UserRole = 'super_admin') => {
    const demoProfile: UserProfile = {
      uid: 'user-demo-admin',
      email: 'admin@ziaproperti.co.id',
      displayName: role === 'super_admin' ? 'Super Administrator' : 'Administrator CMS',
      role,
      phone: '+6289699703304',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUserProfile(demoProfile);
    localStorage.setItem('zia_admin_session', JSON.stringify(demoProfile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setUserProfile(null);
    localStorage.removeItem('zia_admin_session');
  };

  const isAuthorizedRole = !!userProfile && ['super_admin', 'admin', 'editor', 'sales', 'marketing'].includes(userProfile.role);
  const isDesignated = !!currentUser && !!getDesignatedAdminInfo(currentUser.uid, currentUser.email);
  const isAdmin = isAuthorizedRole || isDesignated;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        role: userProfile?.role || (isDesignated ? 'admin' : null),
        login,
        loginWithGoogle,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
