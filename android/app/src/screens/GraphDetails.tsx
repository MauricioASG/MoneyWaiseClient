import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image, ActivityIndicator, Button } from 'react-native';
import { getTransactionsByCategory, getTransactionsByDate } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const GraphDetails = ({ route }) => {
  const { categoria_id, label, month, year } = route.params;
  const { userId } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Estado para gestionar los errores
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [categoria_id, month, year])
  );

  const fetchTransactions = async () => {
    setLoading(true);
    setError(false); // Reiniciar estado de error
    try {
      const data = await getTransactionsByCategory(userId, categoria_id, year, month);
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
      setError(true); // Establecer el error
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleTransactionPress = (transaction) => {
    Alert.alert(
      'Confirmación',
      '¿Deseas ver el gasto seleccionado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const datePart = transaction.fecha.split('T')[0]; // Extrae la fecha en formato "YYYY-MM-DD"
              if (datePart) {
                const transactionsByDate = await getTransactionsByDate(userId, datePart);
                navigation.navigate('AllTransactions', {
                  transactions: transactionsByDate,
                  selectedDate: datePart, // Asegúrate de pasar datePart como selectedDate
                });
              } else {
                console.warn('datePart es undefined');
              }
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0056AD" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error al cargar las transacciones. Intenta de nuevo.</Text>
            <Button title="Reintentar" onPress={fetchTransactions} />
          </View>
        ) : transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionText}>Tipo: {item.tipo}</Text>
                <Text style={styles.transactionText}>Monto: ${parseFloat(item.monto).toFixed(2)}</Text>
                <Text style={styles.transactionText}>Fecha: {formatDate(item.fecha)}</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleTransactionPress(item)}
                >
                  <Text style={styles.viewButtonText}>Ver</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Image
              source={require('../assets/NoDataYet.jpg')}
              style={styles.noDataImage}
            />
            <Text style={styles.noDataText}>No se encontraron transacciones para esta categoría.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0056AD',
    marginVertical: 20,
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
  listContent: {
    paddingBottom: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noDataImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default GraphDetails;
