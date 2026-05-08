import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { registerUnauthorizedHandler } from "../services/api";
import { authStorage } from "../utils/storage";
import { getApiErrorMessage } from "../utils/apiError";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authStorage.getUser());
  const [booting, setBooting] = useState(true);

  const clearSession = () => {
    authStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    registerUnauthorizedHandler((message) => {
      if (authStorage.getToken()) {
        clearSession();
        toast.error(message || "Your session expired. Please sign in again.");
      }
    });

    const boot = async () => {
      const token = authStorage.getToken();

      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        authStorage.setUser(data.user);
      } catch (error) {
        clearSession();
        toast.error(getApiErrorMessage(error, "Please sign in again."));
      } finally {
        setBooting(false);
      }
    };

    boot();
  }, []);

  const login = ({ token, user: nextUser }) => {
    authStorage.setToken(token);
    authStorage.setUser(nextUser);
    setUser(nextUser);
  };

  const logout = (message) => {
    clearSession();

    if (message) {
      toast.success(message);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading: booting,
      isAuthenticated: Boolean(user),
      login,
      logout,
      clearSession
    }),
    [booting, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
