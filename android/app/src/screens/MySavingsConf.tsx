import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, TextInput, View, Alert, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import { getGoal, saveGoal } from '../api';
import { UserContext } from '../contexts/UserContext';
import { Calendar } from 'react-native-calendars';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
  SavingsAdd: undefined;
  SavingsConf: undefined;
};

type SavingsConfProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SavingsConf'>;
  route: RouteProp<RootStackParamList, 'SavingsConf'>;
};

const SavingsConf: React.FC<SavingsConfProps> = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [programmedSavings, setProgrammedSavings] = useState('');
  const [interval, setInterval] = useState('Diario');
  const [selectedDate, setSelectedDate] = useState('');
  const [goalId, setGoalId] = useState<number | null>(null);

  useEffect(() => {
    calculateProgrammedSavings();
  }, [savingsGoal, interval, selectedDate]);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goalData = await getGoal(userId);
        if (goalData.length > 0) {
          const goal = goalData[0];
          console.log('Meta financiera cargada:', goal);

          setSavingsGoal(goal.monto.toString());
          setInterval(goal.periodo);
          setProgrammedSavings(goal.ahorro_programado.toString());
          setGoalId(goal.id);
          setSelectedDate(goal.fecha_limite);
        }
      } catch (error) {
        console.error('Error al cargar la meta financiera:', error);
      }
    };

    fetchGoal();
  }, [userId]);

  const handleSavingsGoalChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    setSavingsGoal(numericText);
    console.log('Nueva meta de ahorro ingresada:', numericText);
  };

  // Calcular el ahorro programado en función de la fecha seleccionada y el objetivo
  const calculateProgrammedSavings = () => {
    const goal = parseFloat(savingsGoal);
    const today = new Date();
    const endDate = new Date(selectedDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!isNaN(goal) && diffDays > 0) {
      let savingsPerInterval = 0;
      if (interval === 'Diario') {
        savingsPerInterval = goal / diffDays;
      } else if (interval === 'Semanal') {
        const diffWeeks = Math.ceil(diffDays / 7);
        savingsPerInterval = goal / diffWeeks;
      }
      setProgrammedSavings(savingsPerInterval.toFixed(2));
    } else {
      setProgrammedSavings('');
    }
  };

  const handleApply = async () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de querer aplicar los cambios?',
      [
        {
          text: 'No',
          onPress: () => {
            Keyboard.dismiss();
            navigation.goBack();
          },
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const ahorro_programado = parseFloat(programmedSavings);
              const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // Asegúrate del formato YYYY-MM-DD
  
              console.log('Fecha límite seleccionada (formato YYYY-MM-DD):', formattedDate);
              console.log('Meta financiera guardada:', { savingsGoal, interval, ahorro_programado, fecha_limite: formattedDate });
  
              await saveGoal(goalId, userId, parseFloat(savingsGoal), interval, ahorro_programado, formattedDate);
  
              console.log('Meta financiera actualizada correctamente');
              navigation.navigate('Savings', { savingsGoal, interval, selectedDate: formattedDate });
            } catch (error) {
              console.error('Error al aplicar la meta financiera:', error);
              Alert.alert('Error', 'Error al aplicar la meta financiera');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} extraScrollHeight={100}>
      <Image source={require('../assets/MySavingsConfLogo.jpg')} style={styles.image} />
      <Text style={styles.heading1}>Meta de Ahorro</Text>
      <TextInput
        style={styles.textInput}
        placeholder="cantidad $"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={savingsGoal}
        onChangeText={handleSavingsGoalChange}
      />
      <Text style={styles.heading2}>Selecciona la fecha límite</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, marked: true } }}
      />
      <Text style={styles.heading2}>Ahorro sugerido {interval === 'Diario' ? '(por día)' : '(por semana)'}</Text>
      <TextInput
        style={styles.textInput}
        placeholder="cantidad $"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={programmedSavings}
        editable={false}
      />
      <CustomButton
        title="Aplicar"
        onPress={handleApply}
        backgroundColor="#80DA80"
        marginBottom={40} //Esta propiedad altera es espacio que hay en separación de pantalla abajo y boton
        paddingHorizontal={85}
        paddingVertical={16}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
    heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#0056AD',
    textAlign: 'center',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
    color: '#0056AD',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  textInput: {
    color: 'black',
    borderBottomWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '80%',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SavingsConf;
