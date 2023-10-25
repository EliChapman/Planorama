import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('data'))); // Store user info

  const login = (userData) => {
    // Perform login logic, set the user, and store the authentication token
    setUser(userData);
    localStorage.setItem('data', JSON.stringify(userData))
  };

  const logout = () => {
    // Perform logout logic, clear the user, and remove the authentication token
    setUser(null);
    localStorage.removeItem('data')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}