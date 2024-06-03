/* eslint-disable prettier/prettier */
// TransactionsList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const TransactionsList = ({ transactions }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.tipo}: ${item.monto}</Text>
            <Text>{item.categoria}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  transactionItem: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default TransactionsList;
