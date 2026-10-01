import { createContext, useContext, useState } from "react";
import { clearSession, loadSession, saveSession } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession());

  const loginUser = (data) => {
    saveSession(data);
    setUser(data);
  };

  const logoutUser = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const homePathFor = (role) =>
  role === "STATUS_CHANGER" ? "/status-changer/dashboard" : "/applicant/dashboard";
