/* eslint-disable prettier/prettier */
// GraphDetails.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getTransactionsByCategory, getTransactionsByDate } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const GraphDetails = ({ route }) => {
  const { categoria_id, label, month, year } = route.params;
  const { userId } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactionsByCategory(userId, categoria_id, year, month);
      setTransactions(data);
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
    }
  };

  const formatDate = (dateString) => {
    const datePart = dateString.split('T')[0]; // Obtiene 'YYYY-MM-DD'
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`; // Formato 'DD/MM/YYYY'
  };

  const handleTransactionPress = (transaction) => {
    Alert.alert(
      'Confirmación',
      '¿Deseas ver el gasto seleccionado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const datePart = transaction.fecha.split('T')[0]; // Obtener la fecha del gasto seleccionado
              const transactionsByDate = await getTransactionsByDate(userId, datePart);
              navigation.navigate('AllTransactions', { transactions: transactionsByDate });
            } catch (error) {
              console.error('Error al obtener transacciones por fecha:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de {label}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>Tipo: {item.tipo}</Text>
            <Text style={styles.transactionText}>Monto: ${item.monto}</Text>
            <Text style={styles.transactionText}>Fecha: {formatDate(item.fecha)}</Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleTransactionPress(item)}
            >
              <Text style={styles.viewButtonText}>Ver</Text>
            </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0056AD',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    position: 'relative',
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
  viewButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#2C5FC2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GraphDetails;
