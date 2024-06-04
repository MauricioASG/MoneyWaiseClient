/* eslint-disable prettier/prettier */
// AddTransactionScreen.tsx
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../contexts/UserContext';
import { createTransaction } from '../api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParamList'; // Asegúrate de importar RootStackParamList

type AddTransactionProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddTransaction'>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

const AddTransactionScreen: React.FC<AddTransactionProps> = ({ navigation, route }) => {
  const { userId } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Ingreso');
  const [category, setCategory] = useState('');

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || !category) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida y seleccione una categoría');
      return;
    }

    try {
      await createTransaction(userId, category, amount, type, route.params.selectedDate);
      route.params.refreshTransactions();
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
      <TextInput
        style={styles.input}
        placeholder="Descripción corta"
        value={category}
        onChangeText={setCategory}
      />
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
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
