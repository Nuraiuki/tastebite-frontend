import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const stored = JSON.parse(localStorage.getItem("users")) || [];
    const found = stored.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found); // содержит и name
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    }
    return false;
  };
  

  const register = (email, password, name) => {
    const stored = JSON.parse(localStorage.getItem("users")) || [];
    if (stored.find((u) => u.email === email)) return false;
    const newUser = { email, password, name };
    localStorage.setItem("users", JSON.stringify([...stored, newUser]));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
