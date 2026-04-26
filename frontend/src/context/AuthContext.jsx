import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

const SEED_USERS = [
  { id: 1, name: "Admin User",  email: "admin@blogera.com",   password: "admin123",   role: "admin"   },
  { id: 2, name: "Blog Writer", email: "blogger@blogera.com", password: "blogger123", role: "blogger" },
  { id: 3, name: "Reader User", email: "user@blogera.com",    password: "user123",    role: "user"    },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try { const s = localStorage.getItem("blogera-users"); return s ? JSON.parse(s) : SEED_USERS; }
    catch { return SEED_USERS; }
  });

  useEffect(() => {
    try { const s = localStorage.getItem("blogera-session"); if (s) setUser(JSON.parse(s)); }
    catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("blogera-users", JSON.stringify(users));
  }, [users]);

  const login = async (email, password, role) => {
    await new Promise(r => setTimeout(r, 600));
    const found = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password && u.role === role
    );
    if (!found) throw new Error("Invalid credentials or role.");
    const session = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(session);
    localStorage.setItem("blogera-session", JSON.stringify(session));
    return session;
  };

  const register = async (name, email, password, role) => {
    await new Promise(r => setTimeout(r, 600));
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Email already exists.");
    const newUser = { id: Date.now(), name, email, password, role };
    setUsers(prev => [...prev, newUser]);
    const session = { id: newUser.id, name, email, role };
    setUser(session);
    localStorage.setItem("blogera-session", JSON.stringify(session));
    return session;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blogera-session");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}