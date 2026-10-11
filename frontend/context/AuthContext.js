// frontend/context/AuthContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabase";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // New role state
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER ROLE
  // =====================================================

  // =====================================================
  // INITIAL SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;
    let roleRequestId = 0;

    const loadUserRole = async (authUser) => {
      const requestId = ++roleRequestId;

      if (!authUser) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);

      try {
        const userRole = await authService.getUserRole(authUser.id);

        if (mounted && requestId === roleRequestId) {
          setRole(userRole || "user");
          console.log("👤 User role:", userRole);
        }
      } catch (error) {
        console.error("❌ Error loading user role:", error);

        if (mounted && requestId === roleRequestId) {
          setRole(null);
        }
      } finally {
        if (mounted && requestId === roleRequestId) {
          setRoleLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        await loadUserRole(session?.user ?? null);
      } catch (error) {
        console.error(
          "❌ Auth initialization error:",
          error
        );

        if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
          setRoleLoading(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // ===================================================
    // LISTEN FOR AUTH CHANGES
    // ===================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const authUser = session.user;
          setRoleLoading(true);
          setTimeout(() => {
            if (mounted) {
              loadUserRole(authUser);
            }
          }, 0);
        } else {
          setRole(null);
          setRoleLoading(false);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // SIGN UP
  // =====================================================

  const signUp = async (
    email,
    password,
    userData
  ) => {
    const data = await authService.signUp(
      email,
      password,
      userData
    );

    return data;
  };

  // =====================================================
  // SIGN IN
  // =====================================================

  const signIn = async (
    email,
    password
  ) => {
    const data = await authService.signIn(
      email,
      password
    );

    /*
     * Auth state listener will normally update the
     * user/session/role automatically.
     */

    return data;
  };

  // =====================================================
  // SIGN OUT
  // =====================================================

  const signOut = async () => {
    await authService.signOut();

    setUser(null);
    setSession(null);
    setRole(null);
  };

  // =====================================================
  // REFRESH ROLE
  // =====================================================

  const refreshRole = async () => {
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setRole(null);
      return null;
    }

    const userRole = await authService.getUserRole(currentUser.id);

    const finalRole = userRole || "user";

    setRole(finalRole);

    console.log("🔐 Refreshed role:", finalRole);

    return finalRole;
  } catch (error) {
    console.error("❌ Error refreshing role:", error);

    setRole(null);
    throw error;
  }
};
  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,
    session,

    // New role information
    role,
    roleLoading,

    // Convenient admin check
    isAdmin: role === "admin",

    loading,

    signUp,
    signIn,
    signOut,

    refreshRole,

    getCurrentUser:
      authService.getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =======================================================
// USE AUTH
// =======================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};