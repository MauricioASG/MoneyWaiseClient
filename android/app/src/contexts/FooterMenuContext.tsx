// context/FooterMenuContext.tsx
/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ButtonContextType = {
  selectedButton: string;
  setSelectedButton: (button: string) => void;
};

const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

export const ButtonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedButton, setSelectedButton] = useState<string>('center'); // 'center' seleccionado por defecto

  return (
    <ButtonContext.Provider value={{ selectedButton, setSelectedButton }}>
      {children}
    </ButtonContext.Provider>
  );
};

export const useButton = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('useButton must be used within a ButtonProvider');
  }
  return context;
};
