import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login as loginStorage,
  logout as logoutStorage,
} from "../lib/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();

    setCurrentUser(savedUser);
    setAuthLoading(false);
  }, []);

  const login = ({ username, password }) => {
    const user = loginStorage({
      username,
      password,
    });

    setCurrentUser(user);

    return user;
  };

  const logout = () => {
    logoutStorage();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    authLoading,
    isLoggedIn: Boolean(currentUser),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
}
