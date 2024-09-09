/* eslint-disable prettier/prettier */
// AllTransactionsScreen.tsx
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { deleteTransaction } from '../api';
import { UserContext } from '../contexts/UserContext';

const AllTransactionsScreen = ({ route }) => {
  const { transactions: initialTransactions } = route.params;
  const [transactions, setTransactions] = useState(initialTransactions);
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.updatedTransaction) {
        const updatedTransaction = route.params.updatedTransaction;
        const updatedTransactions = transactions.map(transaction =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        );
        setTransactions(updatedTransactions);
        navigation.setParams({ updatedTransaction: null });
      }
    }, [route.params?.updatedTransaction])
  );

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Transacción eliminada', 'La transacción ha sido eliminada exitosamente.');
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(updatedTransactions);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al eliminar la transacción.');
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    // Navegar a la pantalla de edición, pasando la transacción completa
    navigation.navigate('EditTransaction', { transaction });
  };

  const getCategoryLabel = (categoria_id) => {
    const categories = {
      1: 'Vivienda',
      2: 'Transporte',
      3: 'Alimentación',
      4: 'Salud',
      5: 'Educación',
      6: 'Entretenimiento',
      7: 'Ropa y calzado',
      8: 'Regalos',
      9: 'Ahorro e inversión',
      10: 'Deudas',
      11: 'Otros',
      12: 'Mascotas',
    };
    return categories[categoria_id] || 'Otro';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todos los movimientos</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>Categoría: {getCategoryLabel(item.categoria_id)}</Text>
            <Text style={styles.transactionText}>Subcategoría: {item.tipo}</Text>
            <Text style={styles.transactionText}>Monto: ${item.monto}</Text>
            <Text style={styles.transactionText}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
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
    backgroundColor: '#B2DFDF',
  },
  transactionItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 55,
    paddingVertical: 15,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 55,
    paddingVertical: 15,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#121313',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  transactionText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 1,
  },
});

export default AllTransactionsScreen;
