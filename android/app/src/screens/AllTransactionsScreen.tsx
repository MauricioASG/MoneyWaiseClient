/* eslint-disable prettier/prettier */
// AllTransactionsScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteTransaction } from '../api';

const AllTransactionsScreen = ({ route }) => {
  const { transactions } = route.params;
  const navigation = useNavigation();

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Transacción eliminada', 'La transacción ha sido eliminada exitosamente.');
      // Puedes agregar lógica adicional aquí para actualizar la lista de transacciones si es necesario
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al eliminar la transacción.');
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    navigation.navigate('EditTransaction', { transaction });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todos los movimientos</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.tipo}: ${item.monto}</Text>
            <Text>{item.categoria}</Text>
            <Text>{new Date(item.fecha).toLocaleDateString()}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  transactionItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AllTransactionsScreen;
