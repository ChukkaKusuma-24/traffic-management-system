import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const CURRENT_USER_KEY = "user";
const AUTH_TOKEN_KEY = "auth_token";

function getStoredUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      setUser(storedUser);
    }

    authService
      .getMe()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async ({ name, email, password, role }) => {
    const data = await authService.signup({ name, email, password, role });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      const data = await authService.updateProfile(updates);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    },
    []
  );

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, updateProfile }),
    [user, loading, login, signup, logout, updateProfile]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

