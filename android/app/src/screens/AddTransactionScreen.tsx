/* eslint-disable prettier/prettier */
// AddTransactionScreen.tsx
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../contexts/UserContext';
import { createTransaction } from '../api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList';

type AddTransactionProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddTransaction'>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

const AddTransactionScreen: React.FC<AddTransactionProps> = ({ navigation, route }) => {
  const { userId } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');  // No se asigna ningún valor por defecto
  const [categoryId, setCategoryId] = useState(''); // Usamos el ID de categoría

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || !categoryId || !type) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida, seleccione una categoría y un tipo de transacción');
      return;
    }

    try {
      await createTransaction(userId, categoryId, amount, type, route.params.selectedDate);
      const parentState = navigation.getParent()?.getState();
      const refreshTransactions = parentState?.routes.find(route => route.name === 'Schedule')?.params?.refreshTransactions;
      if (refreshTransactions) {
        refreshTransactions();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Error', 'Hubo un problema al crear la transacción');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Agregar Transacción</Text>
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
        <Picker.Item label="Selecciona categoría" value="" />
        <Picker.Item label="Comida" value="1" />
        <Picker.Item label="Transporte" value="3" />
        <Picker.Item label="Entretenimiento" value="4" />
        {/* Agrega más categorías según corresponda */}
      </Picker>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona tipo" value="" />
        <Picker.Item label="Ingreso" value="Ingreso" />
        <Picker.Item label="Gasto" value="Gasto" />
        <Picker.Item label="Prioritario" value="Prioritario" />
        <Picker.Item label="Recreativo" value="Recreativo" />
        <Picker.Item label="Hormiga" value="Hormiga" />
        <Picker.Item label="Servicios" value="Servicios" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </SafeAreaView>
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

export default AddTransactionScreen;
