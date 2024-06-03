/* eslint-disable prettier/prettier */
// AllTransactionsScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AllTransactionsScreen = ({ route }) => {
  const { transactions } = route.params;

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
});

export default AllTransactionsScreen;
