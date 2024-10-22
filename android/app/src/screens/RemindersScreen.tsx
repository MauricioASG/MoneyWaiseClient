// RemindersScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const RemindersScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Gestión de Recordatorios</Text>
      <Button title="Agregar Recordatorio" onPress={() => { /* Navegar o agregar lógica */ }} />
      {/* Aquí se mostrarán los recordatorios existentes */}
    </View>
  );
};

export default RemindersScreen;
