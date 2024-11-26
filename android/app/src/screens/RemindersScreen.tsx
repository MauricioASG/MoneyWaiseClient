import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import notifee, { TriggerType, TimestampTrigger, AndroidImportance } from '@notifee/react-native';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { getReminders, addReminder, deleteReminder } from '../api';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function RemindersScreen() {
  const route = useRoute();
  const userId = route.params?.userId;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date()); // Estado para la hora actual

  // Actualizar la hora actual cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadReminders();
      } else {
        Alert.alert('Error', 'Usuario no identificado. Por favor, inicia sesión nuevamente.');
      }
    }, [userId])
  );

  const loadReminders = async () => {
    try {
      const remindersFromAPI = await getReminders(userId);
      setReminders(remindersFromAPI);
    } catch (error) {
      console.error('Error al cargar los recordatorios:', error);
      Alert.alert('Error', 'No se pudieron cargar los recordatorios.');
    }
  };

  const handleAddReminder = async () => {
    try {
      if (!title.trim() || !cost.trim()) {
        Alert.alert('Error', 'Por favor, ingrese un título y un costo para el recordatorio.');
        return;
      }

      const now = new Date(); // Hora actual
      if (selectedDate < now) {
        Alert.alert('Error', 'No puedes programar un recordatorio en una fecha u hora pasada.');
        return;
      }

      // Convertir fecha seleccionada a UTC antes de enviarla al backend
      const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      const formattedDate = utcDate.toISOString().slice(0, 19).replace('T', ' ');

      const newReminder = {
        usuario_id: userId.toString(),
        title: title.trim(),
        description: cost.trim(),
        date: formattedDate,
      };

      const savedReminder = await addReminder(newReminder);

      if (!savedReminder || !savedReminder.id) {
        throw new Error('La respuesta del servidor no incluye un ID válido');
      }

      const updatedReminders = [...reminders, { ...newReminder, id: savedReminder.id }];
      setReminders(updatedReminders);

      await scheduleNotification({ ...newReminder, id: savedReminder.id });
      setModalVisible(false);
      resetForm();
      Alert.alert('Éxito', 'Recordatorio creado correctamente');
    } catch (error) {
      console.error('Error detallado al crear el recordatorio:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo crear el recordatorio. Por favor, intente de nuevo.');
    }
  };

  const scheduleNotification = async (reminder: Reminder) => {
    try {
      const triggerDate = new Date(reminder.date);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      };

      // Formatear la fecha en formato legible para la notificación
      const formattedDate = triggerDate.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      await notifee.createChannel({
        id: 'reminders',
        name: 'Recordatorios',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createTriggerNotification(
        {
          id: `reminder-${reminder.id}`,
          title: `Recordatorio pago de ${reminder.title}`, // Título personalizado
          body: `${formattedDate}      $${parseFloat(reminder.description).toFixed(2)}`, // Formato de fecha y costo
          android: {
            channelId: 'reminders',
            importance: AndroidImportance.HIGH,
          },
        },
        trigger
      );

      console.log('Notificación programada para:', triggerDate);
    } catch (error) {
      console.error('Error al programar la notificación:', error);
      Alert.alert('Error', 'No se pudo programar la notificación.');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      await notifee.cancelNotification(`reminder-${id}`);
      console.log('Recordatorio eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el recordatorio:', error);
      Alert.alert('Error', 'No se pudo eliminar el recordatorio.');
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de que desea eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => handleDeleteReminder(id), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setTitle('');
    setCost('');
  };

  const formatDate = (dateString: string) => {
    const localDate = new Date(dateString);
    return localDate.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      {reminders.length > 0 ? (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Título: {item.title}</Text>
              <Text style={styles.reminderText}>Costo: ${item.description}</Text>
              <Text style={styles.reminderText}>Fecha: {formatDate(item.date)}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noRemindersText}>No hay recordatorios disponibles.</Text>
      )}
      <TouchableOpacity
        style={styles.addReminderButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addReminderButtonText}>Agregar Recordatorio</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <ScrollView contentContainerStyle={styles.modalView}>
            <Text style={styles.modalText}>Agregar Nuevo Recordatorio</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#666" // Cambiar el color del texto del placeholder
              textAlign='center'
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Costo"
              placeholderTextColor="#666" // Cambiar el color del texto del placeholder
              textAlign='center'
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
            />
            <Calendar
              onDayPress={(day) => {
                const newDate = new Date(selectedDate);
                newDate.setFullYear(day.year, day.month - 1, day.day);
                setSelectedDate(newDate);
              }}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#00adf5' },
              }}
            />
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setIsTimePickerOpen(true)}
            >
              <Text style={styles.timePickerButtonText}>
                Seleccionar Hora: {selectedDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={isTimePickerOpen}
              date={selectedDate}
              mode="time"
              onConfirm={(date) => {
                setIsTimePickerOpen(false);
                setSelectedDate(date); // Actualiza el estado con la nueva hora seleccionada
              }}
              onCancel={() => {
                setIsTimePickerOpen(false);
              }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddReminder}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#d6e7fe', },
  reminderItem: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, marginBottom: 25 },
  deleteButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  reminderText: { fontSize: 18, color: '#333', marginBottom: 5 },
  noRemindersText: { fontSize: 20, textAlign: 'center', marginTop: 50 },
  addReminderButton: { backgroundColor: '#089dda', padding: 15, borderRadius: 25, alignItems: 'center' },
  addReminderButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
    borderRadius: 5,
    color: 'black',
    textAlign: 'center',
  },
  timePickerButton: {
    backgroundColor: '#089dda',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  timePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RemindersScreen;