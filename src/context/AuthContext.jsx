import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
          localStorage.removeItem("access_token");
        }
      } catch (err) {
        console.error("Auth fetch error:", err);
        setUser(null);
        localStorage.removeItem("access_token");
      }
    };

    fetchUser();
  }, []);

  // login funksiyası
  const login = (token, userData) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
  };

  // logout funksiyası
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
