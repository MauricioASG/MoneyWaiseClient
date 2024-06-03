/* eslint-disable prettier/prettier */
// AddTransactionScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { addTransaction } from '../api';

const AddTransactionScreen = ({ route, navigation }) => {
  const { userId } = useContext(UserContext);
  const { selectedDate } = route.params;
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Gasto');

  const handleAddTransaction = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Por favor, ingrese todos los campos');
      return;
    }

    try {
      await addTransaction(userId, selectedDate, amount, category, type);
      Alert.alert('Éxito', 'Transacción agregada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Hubo un problema al agregar la transacción');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Agregar Transacción</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (Ingreso/Gasto)"
        value={type}
        onChangeText={setType}
      />
      <Button title="Agregar" onPress={handleAddTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default AddTransactionScreen;
