/* eslint-disable prettier/prettier */
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Import the Picker
import { createTransaction } from '../api';
import { UserContext } from '../contexts/UserContext';

const AddTransactionScreen = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const { userId } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Ingreso'); // or 'Gasto'

  const handleAddTransaction = async () => {
    try {
      await createTransaction(userId, category, parseFloat(amount), type, selectedDate);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Agregar Transacción</Text>
      <Text>Fecha: {selectedDate}</Text>
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
      <Picker
        selectedValue={type}
        style={styles.input}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Ingreso" value="Ingreso" />
        <Picker.Item label="Gasto" value="Gasto" />
      </Picker>
      <Button title="Agregar" onPress={handleAddTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default AddTransactionScreen;
