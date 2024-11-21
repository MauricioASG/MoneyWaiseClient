// RemindersScreen.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

export default function RemindersScreen() {
  async function onDisplayNotification() {
    // Crear un canal de notificación
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
      visibility: AndroidVisibility.PUBLIC,
    });

    // Mostrar una notificación
    await notifee.displayNotification({
      title: 'Notificación de prueba',
      body: 'Esta es una notificación de prueba',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        vibrationPattern: [300, 500],
        visibility: AndroidVisibility.PUBLIC,
        // smallIcon: 'ic_launcher', // asegúrate de que este icono existe en tu proyecto
        pressAction: {
          id: 'default',
        },
      },
    });

    console.log('Notificación mostrada');
  }

  return (
    <View style={styles.container}>
      <Button 
        title="Mostrar Notificación de Prueba" 
        onPress={onDisplayNotification} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});