/* eslint-disable prettier/prettier */
// src/contexts/UserContext.js
// UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Suponiendo que obtienes el userId después de iniciar sesión
  useEffect(() => {
    // Simula obtener el userId del almacenamiento seguro o del servidor
    const fetchUserId = async () => {
      const id = await getUserIdFromStorage(); // Reemplaza esto con la lógica adecuada
      setUserId(id);
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Simula una función para obtener el userId del almacenamiento seguro
const getUserIdFromStorage = async () => {
  // Lógica para obtener el userId
  return 1; // Devuelve el userId
};

