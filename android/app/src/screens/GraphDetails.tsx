/* eslint-disable prettier/prettier */
// GraphDetails.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getTransactionsByCategory } from '../api'; // Necesitaremos crear esta función en nuestra API
import { UserContext } from '../contexts/UserContext';

const GraphDetails = ({ route, navigation }) => {
  const { categoria_id, label, month, year } = route.params;
  const { userId } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);

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

  // Nueva función formatDate
  const formatDate = (dateString) => {
    // Extraer solo la parte de la fecha
    const datePart = dateString.split('T')[0]; // Obtiene 'YYYY-MM-DD'
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`; // Formato 'DD/MM/YYYY'
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
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GraphDetails;
