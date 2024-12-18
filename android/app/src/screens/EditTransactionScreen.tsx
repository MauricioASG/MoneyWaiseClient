/* eslint-disable prettier/prettier */
// EditTransactionScreen.tsx
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { updateTransaction } from '../api';

const EditTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction } = route.params;

  // Estado inicial basado en la transacción
  const [amount, setAmount] = useState(transaction.monto.toString());
  const [categoryId, setCategoryId] = useState(transaction.categoria_id?.toString() || '0');
  const [type, setType] = useState(transaction.tipo);

  // Guardamos los valores originales para comparar si hubo cambios
  const originalAmount = transaction.monto.toString();
  const originalCategoryId = transaction.categoria_id?.toString();
  const originalType = transaction.tipo;

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
    ]
  };

  // Sincronizar los valores iniciales
  useEffect(() => {
    if (categoryTypes[categoryId]) {
      const subcategories = categoryTypes[categoryId];
      const hasValidType = subcategories.some(subcategory => subcategory.value === type);
      
      if (!hasValidType) {
        setType(subcategories[0]?.value || 'Selecciona un tipo de gasto');
      }
    }
  }, [categoryId]);

  // Confirmar guardar la transacción editada si hubo cambios
  const confirmSave = () => {
    if (
      amount === originalAmount &&
      categoryId === originalCategoryId &&
      type === originalType
    ) {
      // Si no hubo cambios, mostrar la alerta y regresar a la pantalla anterior
      Alert.alert('Sin cambios', 'No se han realizado cambios en la transacción.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      // Si hubo cambios, mostrar la alerta de confirmación
      Alert.alert(
        'Confirmar guardado',
        '¿Está seguro de que desea guardar esta transacción?',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Guardado cancelado'),
            style: 'cancel',
          },
          {
            text: 'Guardar',
            onPress: handleSave,
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Guardar la transacción actualizada
  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || categoryId === '0' || type === 'Selecciona un tipo de gasto') {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida, seleccione una categoría y un tipo de transacción');
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

  // Controlador de cambio de categoría
  const handleCategoryChange = (itemValue) => {
    setCategoryId(itemValue);
    setType(categoryTypes[itemValue]?.[0]?.value || 'Selecciona un tipo de gasto');
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
        onValueChange={handleCategoryChange}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona categoría" value="0" />
        {Object.keys(categoryTypes).map((key) => (
          <Picker.Item key={key} label={getCategoryLabel(key)} value={key} />
        ))}
      </Picker>

      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
        enabled={categoryId !== '0'}
      >
        {categoryTypes[categoryId]?.length ? (
          categoryTypes[categoryId].map((typeItem) => (
            <Picker.Item key={typeItem.value} label={typeItem.label} value={typeItem.value} />
          ))
        ) : (
          <Picker.Item label="No hay subcategorías disponibles" value="Selecciona un tipo de gasto" />
        )}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={confirmSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const getCategoryLabel = (categoria_id) => {
  const categories = {
    '1': 'Vivienda',
    '2': 'Transporte',
    '3': 'Alimentación',
    '4': 'Salud',
    '5': 'Educación',
    '6': 'Entretenimiento',
    '7': 'Ropa y calzado',
    '8': 'Regalos',
    '9': 'Ahorro e inversión',
    '10': 'Deudas',
    '11': 'Otros',
    '12': 'Mascotas',
  };
  return categories[categoria_id] || 'Otro';
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
