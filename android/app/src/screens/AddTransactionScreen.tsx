import React, { useState, useContext, useEffect } from 'react';
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
  const [categoryId, setCategoryId] = useState('0'); // Default to auxiliary category
  const [type, setType] = useState('Selecciona un tipo de gasto'); // Default to auxiliary type

  // Mapa de tipos de subcategorías por categoría
  const categoryTypes = {
    '1': [
      { label: 'Alquiler/Hipoteca', value: 'Vivienda_Alquiler/Hipoteca' },
      { label: 'Servicios básicos', value: 'Vivienda_Servicios básicos' },
      { label: 'Mantenimiento', value: 'Vivienda_Mantenimiento' },
      { label: 'Impuestos inmobiliarios', value: 'Vivienda_Impuestos inmobiliarios' },
      { label: 'Seguros de hogar', value: 'Vivienda_Seguros de hogar' },
    ],
    '2': [
      { label: 'Combustible', value: 'Transporte_Combustible' },
      { label: 'Transporte público', value: 'Transporte_Transporte público' },
      { label: 'Mantenimiento del vehículo', value: 'Transporte_Mantenimiento del vehículo' },
      { label: 'Peajes', value: 'Transporte_Peajes' },
      { label: 'Estacionamiento', value: 'Transporte_Estacionamiento' },
      { label: 'Seguro del vehículo', value: 'Transporte_Seguro del vehículo' },
    ],
    '3': [
      { label: 'Supermercado', value: 'Alimentación_Supermercado' },
      { label: 'Restaurantes', value: 'Alimentación_Restaurantes' },
      { label: 'Comida rápida', value: 'Alimentación_Comida rápida' },
      { label: 'Bebidas', value: 'Alimentación_Bebidas' },
      { label: 'Snacks', value: 'Alimentación_Snacks' },
    ],
    '4': [
      { label: 'Consultas médicas', value: 'Salud_Consultas médicas' },
      { label: 'Medicamentos', value: 'Salud_Medicamentos' },
      { label: 'Seguro médico', value: 'Salud_Seguro médico' },
      { label: 'Gimnasio', value: 'Salud_Gimnasio' },
      { label: 'Productos de belleza', value: 'Salud_Productos de belleza' },
      { label: 'Cuidado personal', value: 'Salud_Cuidado personal' },
    ],
    '5': [
      { label: 'Colegiaturas', value: 'Educación_Colegiaturas' },
      { label: 'Libros y materiales', value: 'Educación_Libros y materiales' },
      { label: 'Cursos y talleres', value: 'Educación_Cursos y talleres' },
      { label: 'Material escolar', value: 'Educación_Material escolar' },
      { label: 'Actividades extracurriculares', value: 'Educación_Actividades extracurriculares' },
    ],
    '6': [
      { label: 'Cine', value: 'Entretenimiento_Cine' },
      { label: 'Teatro', value: 'Entretenimiento_Teatro' },
      { label: 'Conciertos', value: 'Entretenimiento_Conciertos' },
      { label: 'Viajes', value: 'Entretenimiento_Viajes' },
      { label: 'Suscripciones', value: 'Entretenimiento_Suscripciones' },
      { label: 'Hobbies', value: 'Entretenimiento_Hobbies' },
    ],
    '7': [
      { label: 'Vestimenta', value: 'Ropa y calzado_Vestimenta' },
      { label: 'Calzado', value: 'Ropa y calzado_Calzado' },
      { label: 'Accesorios', value: 'Ropa y calzado_Accesorios' },
    ],
    '8': [
      { label: 'Cumpleaños', value: 'Regalos_Cumpleaños' },
      { label: 'Navidad', value: 'Regalos_Navidad' },
      { label: 'Otras ocasiones', value: 'Regalos_Otras ocasiones' },
    ],
    '9': [
      { label: 'Ahorro a corto plazo', value: 'Ahorro e inversión_Ahorro a corto plazo' },
      { label: 'Ahorro a largo plazo', value: 'Ahorro e inversión_Ahorro a largo plazo' },
      { label: 'Inversiones', value: 'Ahorro e inversión_Inversiones' },
    ],
    '10': [
      { label: 'Tarjeta de crédito', value: 'Deudas_Tarjeta de crédito' },
      { label: 'Préstamos personales', value: 'Deudas_Préstamos personales' },
      { label: 'Otros préstamos', value: 'Deudas_Otros préstamos' },
    ],
    '11': [
      { label: 'Imprevistos', value: 'Otros_Imprevistos' },
      { label: 'Donaciones', value: 'Otros_Donaciones' },
      { label: 'Impuestos (otros que no sean inmobiliarios)', value: 'Otros_Impuestos (otros que no sean inmobiliarios)' },
    ],
    '12': [
      { label: 'Alimento', value: 'Mascotas_Alimento' },
      { label: 'Veterinaria', value: 'Mascotas_Veterinaria' },
      { label: 'Productos de higiene', value: 'Mascotas_Productos de higiene' },
      { label: 'Accesorios', value: 'Mascotas_Accesorios' },
      { label: 'Adiestramiento', value: 'Mascotas_Adiestramiento' },
    ],
    '0': [
      { label: 'Selecciona un tipo de gasto', value: 'Selecciona un tipo de gasto' },
    ],
  };

  useEffect(() => {
    // Actualizar el tipo cuando se cambia la categoría
    if (categoryId !== '0') {
      setType(categoryTypes[categoryId][0].value);
    }
  }, [categoryId]);

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || categoryId === '0' || type === 'Selecciona un tipo de gasto') {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida, seleccione una categoría y un tipo de transacción');
      return;
    }

    Alert.alert(
      'Confirmación',
      `¿Estás seguro de agregar esta transacción por $${amount}?`,
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await createTransaction(userId, categoryId, amount, type, route.params.selectedDate); // Usar la fecha seleccionada
              const parentState = navigation.getParent()?.getState();
              const refreshTransactions = parentState?.routes.find(route => route.name === 'Schedule')?.params?.refreshTransactions;
              if (refreshTransactions) {
                refreshTransactions();
              }
              navigation.goBack();
            } catch (error) {
              console.error('Error creando la transacción:', error);
              Alert.alert('Error', 'Hubo un problema al crear la transacción');
            }
          },
        },
      ],
      { cancelable: false }
    );
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
        onValueChange={(itemValue) => {
          setCategoryId(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona categoría" value="0" />
        <Picker.Item label="Vivienda" value="1" />
        <Picker.Item label="Transporte" value="2" />
        <Picker.Item label="Alimentación" value="3" />
        <Picker.Item label="Salud" value="4" />
        <Picker.Item label="Educación" value="5" />
        <Picker.Item label="Entretenimiento" value="6" />
        <Picker.Item label="Ropa y calzado" value="7" />
        <Picker.Item label="Regalos" value="8" />
        <Picker.Item label="Ahorro e inversión" value="9" />
        <Picker.Item label="Deudas" value="10" />
        <Picker.Item label="Otros" value="11" />
        <Picker.Item label="Mascotas" value="12" />
      </Picker>

      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
        enabled={categoryId !== '0'} // Disable if no valid category is selected
      >
        {categoryTypes[categoryId]?.map((typeItem) => (
          <Picker.Item key={typeItem.value} label={typeItem.label} value={typeItem.value} />
        ))}
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
