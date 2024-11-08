/* eslint-disable prettier/prettier */
// AllTransactionsScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { deleteTransaction, getTransactionsByDate } from '../api';
import { UserContext } from '../contexts/UserContext';

const AllTransactionsScreen = ({ route }) => {
  const { transactions: initialTransactions, selectedDate } = route.params; // Asegúrate de que selectedDate esté aquí
  const [transactions, setTransactions] = useState(initialTransactions);
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactions = async () => {
        if (selectedDate) { // Verifica que selectedDate esté definido
          try {
            const fetchedTransactions = await getTransactionsByDate(userId, selectedDate);
            setTransactions(fetchedTransactions);
          } catch (error) {
            console.error('Error fetching transactions:', error);
          }
        } else {
          console.warn('selectedDate es undefined en AllTransactionsScreen');
        }
      };
      fetchTransactions();
    }, [selectedDate, userId])
  );

  useEffect(() => {
    console.log('selectedDate recibido en AllTransactionsScreen:', selectedDate); // Log para depuración
    setTransactions(initialTransactions);
  }, [initialTransactions, selectedDate]);
  

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

  // Confirmación de eliminación de la transacción
  const confirmDelete = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de que desea eliminar esta transacción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => handleDelete(id), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  // Función para eliminar la transacción
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Transacción eliminada', 'La transacción ha sido eliminada exitosamente.');
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(updatedTransactions);

      // Verificar si ya no hay transacciones y regresar a la pantalla anterior
      if (updatedTransactions.length === 0) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al eliminar la transacción.');
      console.error('Error deleting transaction:', error);
    }
  };

  // Función para editar la transacción
  const handleEdit = (transaction) => {
    navigation.navigate('EditTransaction', { transaction });
  };

  // Formatear la fecha para mostrarla en un formato más amigable
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  // Obtener la etiqueta de la categoría con base en el ID de categoría
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
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionText}>Categoría: {getCategoryLabel(item.categoria_id)}</Text>
              <Text style={styles.transactionText}>Subcategoría: {item.tipo}</Text>
              <Text style={styles.transactionText}>Monto: ${item.monto}</Text>
              <Text style={styles.transactionText}>Fecha: {formatDate(item.fecha)}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactionsText}>No hay transacciones disponibles.</Text>
      )}
      <TouchableOpacity
        style={styles.addTransactionButton}
        onPress={() => navigation.navigate('AddTransaction', { selectedDate })}
      >
        <Text style={styles.addTransactionButtonText}>Agregar Transacción</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d6e7fe',
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
    backgroundColor: '#089dda',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 45,
    paddingVertical: 15,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 1,
  },
  noTransactionsText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
  },
  addTransactionButton: {
    backgroundColor: '#089dda', // color atractivo para el botón de agregar transacción
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25, // bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // sombra en Android
    alignItems: 'center',
    marginTop: 20,
  },
  addTransactionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AllTransactionsScreen;
