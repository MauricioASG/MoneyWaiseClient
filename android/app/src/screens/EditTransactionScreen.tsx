/* eslint-disable prettier/prettier */
// EditTransactionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateTransaction } from '../api';

const EditTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction } = route.params;

  const [amount, setAmount] = useState(transaction.monto.toString());
  const [type, setType] = useState(transaction.tipo);
  const [category, setCategory] = useState(transaction.categoria_id.toString());

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || !category) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida y seleccione una categoría');
      return;
    }

    try {
      const updatedTransaction = { ...transaction, monto: parseFloat(amount), tipo: type, categoria: category };
      await updateTransaction(transaction.id, updatedTransaction);
      Alert.alert('Transacción actualizada', 'La transacción ha sido actualizada exitosamente.');
      navigation.navigate('AllTransactions', { updatedTransaction }); // Navega con el parámetro actualizado
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar la transacción.');
      console.error('Error updating transaction:', error);
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
      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={category}
        onChangeText={setCategory}
      />
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
