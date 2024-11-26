/* eslint-disable prettier/prettier */
// ScheduleScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { UserContext } from '../contexts/UserContext';
import { getTransactionsByMonth } from '../api';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
  AllTransactions: { transactions: any[], selectedDate: string };
  Reminders: undefined;
};

type ScheduleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Schedule'>;
  route: RouteProp<RootStackParamList, 'Schedule'>;
};

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { userId } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState('');
  const [transactionsByDate, setTransactionsByDate] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useFocusEffect(
    React.useCallback(() => {
      fetchMonthlyTransactions();
    }, [currentMonth, currentYear])
  );

  const fetchMonthlyTransactions = async () => {
    try {
      const data = await getTransactionsByMonth(userId, currentYear, currentMonth);
      const groupedTransactions = {};
      data.forEach((transaction) => {
        const date = transaction.fecha.split('T')[0];
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
    Object.keys(transactionsByDate).forEach((date) => {
      newMarkedDates[date] = { marked: true, dotColor: 'red' };
    });
    if (selectedDate) {
      newMarkedDates[selectedDate] = {
        ...(newMarkedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#00adf5',
      };
    }
    setMarkedDates(newMarkedDates);
  }, [transactionsByDate, selectedDate]);

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
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('AllTransactions', { transactions: transactionsByDate[selectedDate] || [], selectedDate })}
          >
            <Text style={styles.viewAllText}>Ver todos los movimientos</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.ReminderButton}
          onPress={() => navigation.navigate('Reminders', { userId })}
        >
          <Text style={styles.ReminderButtonText}>Gestionar Recordatorios</Text>
        </TouchableOpacity>
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
  calendarContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: -10,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 10,
  },
  viewAllButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#ee4520',
    marginTop: 50,
    fontWeight: 'bold',
    fontSize: 16,
  },
  ReminderButton: {
    backgroundColor: '#00adf5', // color atractivo para el fondo
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // sombra en Android
    marginTop: 30,
  },
  ReminderButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ScheduleScreen;
