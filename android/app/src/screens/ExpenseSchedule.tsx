/* eslint-disable prettier/prettier */
// ExpenseSchedule.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';
import { Calendar } from 'react-native-calendars';
import { UserContext } from '../contexts/UserContext';
import { getTransactionsByMonth } from '../api';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
  AddTransaction: { selectedDate: string };
  AllTransactions: { transactions: any[] };
};

type ScheduleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Schedule'>;
  route: RouteProp<RootStackParamList, 'Schedule'>;
};

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { setSelectedButton } = useButton();
  const { userId } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Los meses en JS van de 0 a 11
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [transactionsByDate, setTransactionsByDate] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('right');
      fetchMonthlyTransactions();
    }, [setSelectedButton, currentMonth, currentYear])
  );

  const fetchMonthlyTransactions = async () => {
    try {
      const data = await getTransactionsByMonth(userId, currentYear, currentMonth);
      const groupedTransactions = {};

      data.forEach((transaction) => {
        const date = transaction.fecha.split('T')[0]; // Obtener solo la parte de la fecha
        if (!groupedTransactions[date]) {
          groupedTransactions[date] = [];
        }
        groupedTransactions[date].push(transaction);
      });

      setTransactionsByDate(groupedTransactions);
    } catch (error) {
      console.error('Error fetching monthly transactions:', error);
    }
  };

  useEffect(() => {
    const newMarkedDates = {};

    // Marcar fechas con transacciones
    Object.keys(transactionsByDate).forEach((date) => {
      newMarkedDates[date] = { marked: true, dotColor: 'red' };
    });

    // Marcar la fecha seleccionada
    if (selectedDate) {
      newMarkedDates[selectedDate] = {
        ...(newMarkedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#00adf5',
      };
    }

    setMarkedDates(newMarkedDates);
  }, [transactionsByDate, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const transactionsForDate = transactionsByDate[selectedDate] || [];
      setTransactions(transactionsForDate);
    } else {
      setTransactions([]);
    }
  }, [selectedDate, transactionsByDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const onMonthChange = (month) => {
    setCurrentMonth(month.month);
    setCurrentYear(month.year);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            markedDates={markedDates}
            monthFormat={'yyyy MM'}
            hideExtraDays={true}
            showWeekNumbers={true}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: 'orange',
              monthTextColor: 'blue',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            style={styles.calendar}
          />
        </View>
        {selectedDate ? (
          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionsHeading}>Gastos del {selectedDate}</Text>
            {transactions.slice(0, 2).map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <Text>{transaction.tipo}: ${transaction.monto}</Text>
                <Text>{transaction.categoria}</Text>
              </View>
            ))}
            {transactions.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('AllTransactions', { transactions })}
              >
                <Text style={styles.viewAllText}>Ver todos los movimientos</Text>
              </TouchableOpacity>
            )}
            <Button
              title="Agregar Transacción"
              onPress={() => navigation.navigate('AddTransaction', { selectedDate })}
            />
          </View>
        ) : (
          <Text style={styles.noDateSelected}>Seleccione una fecha para ver las transacciones</Text>
        )}
        <FooterMenu navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  calendarContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    padding: 10,
    marginVertical: -10,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 10,
  },
  transactionsContainer: {
    width: '90%',
    marginTop: 20,
  },
  transactionsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#A7F7DA',
    padding: 2,
    borderRadius: 5,
    marginBottom: 2,
  },
  viewAllButton: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#00adf5',
    fontWeight: 'bold',
  },
  noDateSelected: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default ScheduleScreen;
