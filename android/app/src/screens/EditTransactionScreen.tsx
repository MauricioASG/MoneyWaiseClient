/* eslint-disable prettier/prettier */
// EditTransactionScreen.tsx
// EditTransactionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { updateTransaction } from '../api';

// Asumiendo que los IDs de las categorías son números
const categories = [
  { label: 'Ingreso', value: 1 },
  { label: 'Gasto', value: 2 },
  { label: 'Prioritario', value: 3 },
  { label: 'Recreativo', value: 4 },
  { label: 'Hormiga', value: 5 },
  { label: 'Servicios', value: 6 },
];

const EditTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction } = route.params;

  const [amount, setAmount] = useState(transaction.monto.toString());
  const [type, setType] = useState(transaction.tipo);
  const [categoryId, setCategoryId] = useState(transaction.categoria_id);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || !categoryId) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida y seleccione una categoría');
      return;
    }

    try {
      const updatedTransaction = { ...transaction, monto: parseFloat(amount), tipo: type, categoria_id: categoryId };
      await updateTransaction(transaction.id, updatedTransaction);
      Alert.alert('Transacción actualizada', 'La transacción ha sido actualizada exitosamente.');
      navigation.navigate('AllTransactions', { updatedTransaction });
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la transacción.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Editar Transacción</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue) => setCategoryId(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={type}
        onChangeText={setType}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    color: 'black',
    borderBottomWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#2C5FC2',
    paddingVertical: 12,
    paddingHorizontal: 120,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EditTransactionScreen;

