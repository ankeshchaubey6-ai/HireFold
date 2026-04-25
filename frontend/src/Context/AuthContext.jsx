import React, { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  googleLoginUser,
  getCurrentUser,
  logoutUser,
} from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const register = async (data) => {
    const res = await registerUser(data);

    if (res?.success && res.user) {
      setUser(res.user);
    }

    return res;
  };

  /* ================= LOGIN (REAL BACKEND - SETS COOKIE) ================= */
  const login = async (data) => {
    const res = await loginUser(data);

    if (res?.success && res.user) {
      setUser(res.user); // Cookie already set by backend
    }

    return res;
  };

  /* ================= GOOGLE LOGIN (REAL BACKEND) ================= */
  const loginWithGoogle = async (data) => {
    const res = await googleLoginUser(data);

    if (res?.success && res.user) {
      setUser(res.user);
    }

    return res;
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

