/* eslint-disable prettier/prettier */
// MySavingsConf.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, TextInput, View, Alert, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import { getGoal, saveGoal } from '../api';
import { UserContext } from '../contexts/UserContext';

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
  const [timePeriod, setTimePeriod] = useState('');
  const [goalId, setGoalId] = useState<number | null>(null);

  useEffect(() => {
    calculateProgrammedSavings();
  }, [savingsGoal, interval, timePeriod]);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goalData = await getGoal(userId);
        if (goalData.length > 0) {
          const goal = goalData[0];
          setSavingsGoal(goal.monto.toString());
          setInterval(goal.periodo);
          setTimePeriod(goal.timePeriod.toString());
          setProgrammedSavings(goal.ahorro_programado.toString());
          setGoalId(goal.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGoal();
  }, [userId]);

  const handleSavingsGoalChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setSavingsGoal(numericText);
    }
  };

  const handleTimePeriodChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setTimePeriod(numericText);
  };

  // Se va amodificar esta parte
  const calculateProgrammedSavings = () => {
    const goal = parseFloat(savingsGoal);
    const period = parseInt(timePeriod, 10);
    if (!isNaN(goal) && !isNaN(period) && period > 0) {
      let savingsPerInterval = 0;
      if (interval === 'Diario') {
        savingsPerInterval = goal / period;
      } else if (interval === 'Semanal') {
        savingsPerInterval = goal/period;
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
            Keyboard.dismiss(); // Cierra el teclado
            navigation.goBack(); // Regresa a la pantalla anterior
          },
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const ahorro_programado = parseFloat(programmedSavings);

              await saveGoal(goalId, userId, parseFloat(savingsGoal), interval, ahorro_programado, parseInt(timePeriod, 10));
              
              navigation.navigate('Savings', { savingsGoal, interval, timePeriod });
            } catch (error) {
              Alert.alert('Error', 'Error al aplicar la meta financiera');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
    >
      <Image
        source={require('../assets/MySavingsConfLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading2}>Meta de Ahorro</Text>
      <TextInput
        style={styles.textInput}
        placeholder="cantidad $"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={savingsGoal}
        onChangeText={handleSavingsGoalChange}
      />

      <Text style={styles.heading2}>Intervalo de Ahorro</Text>
      <Picker
        selectedValue={interval}
        style={styles.picker}
        onValueChange={(itemValue) => setInterval(itemValue)}
      >
        <Picker.Item label="Diario" value="Diario" />
        <Picker.Item label="Semanal" value="Semanal" />
      </Picker>
      <Text style={styles.heading2}>Periodo de Tiempo</Text>
      <TextInput
        style={styles.textInput}
        placeholder={interval === 'Diario' ? 'Días' : 'Semanas'}
        placeholderTextColor={'black'}
        keyboardType="number-pad"
        value={timePeriod}
        onChangeText={handleTimePeriodChange}
      />
      <Text style={styles.heading2}>Ahorro Programado {interval === 'Diario' ? '(por día)' : '(por semana)'}</Text>
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
        marginBottom={200}
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
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
    alignSelf: 'flex-start',
  },
  image: {
    width: 200,
    height: 200,
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
    fontSize: 25,
  },
  picker: {
    height: 30,
    width: '70%',
    marginBottom: 15,
    fontSize: 25,
  },
});

export default SavingsConf;
