import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, Keyboard, Platform, Alert, View } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { useButton } from '../contexts/FooterMenuContext';
import { getGoal, updateSavings } from '../api';
import { UserContext } from '../contexts/UserContext';
import { ProgressBar } from 'react-native-paper';




type RootStackParamList = {
  Home: undefined;
  Savings: { amountAdded?: string, savingsGoal?: string, interval?: string, currentSavings?: string };
  Schedule: undefined;
  Login: undefined;
  SavingsAdd: { savingsGoal: string, interval: string, currentSavings: string };
  SavingsConf: undefined;
  MySavingsWithdrawals: undefined;
};

type SavingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings'>;
  route: RouteProp<RootStackParamList, 'Savings'>;
};

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation, route }) => {
  const { userId } = useContext(UserContext);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState('0'); // Inicializa en '0'
  const [interval, setInterval] = useState('Mensual'); // Ejemplo de valor por defecto
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto
  const [programmedSavings, setProgrammedSavings] = useState('0'); // Inicializa en '0'
  const [currentSavings, setCurrentSavings] = useState('0'); // Inicializa en '0'  
  const [goalId, setGoalId] = useState<number | null>(null);
  const { setSelectedButton } = useButton();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('left');
      fetchGoal();
    }, [setSelectedButton])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchGoal = async () => {
    try {
      const goalData = await getGoal(userId);
      if (goalData.length > 0) {
        const goal = goalData[0];
        setSavingsGoal(goal.monto.toString());
        setInterval(goal.periodo);
        setSelectedDate(goal.fecha_limite);
        setProgrammedSavings(goal.ahorro_programado.toString());
        setCurrentSavings(goal.ahorro_actual.toString());
        setGoalId(goal.id);
      } 
      else {
      // Inicializa con valores por defecto
      setSavingsGoal('0');
      setCurrentSavings('0');
      setInterval('Mensual');
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.amountAdded && !isNaN(Number(route.params.amountAdded))) {
      const newCurrentSavings = parseFloat(currentSavings) + parseFloat(route.params.amountAdded);
      setCurrentSavings(newCurrentSavings.toString());
      if (goalId !== null) {
        updateSavings(goalId, newCurrentSavings)
          .then(() => {
            console.log('Ahorro actualizado correctamente');
          })
          .catch((error) => {
            console.error('Error al actualizar el ahorro actual:', error);
          });
      }
    }
    if (route.params?.interval) {
      setInterval(route.params.interval);
    }
    if (route.params?.selectedDate) {
      setSelectedDate(route.params.selectedDate);
    }
  }, [route.params?.amountAdded, route.params?.interval, route.params?.selectedDate]);

  useEffect(() => {
    if (route.params?.savingsGoal) {
      setSavingsGoal(route.params.savingsGoal);
    }
  }, [route.params?.savingsGoal]);

  // Calcula los días restantes en función de la fecha límite
  const calculateDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(selectedDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calcula el porcentaje de avance del ahorro
  const calculateProgress = () => {
    const goal = parseFloat(savingsGoal) || 0; // Asegurarse de que no sea NaN
    const current = parseFloat(currentSavings) || 0;
    return goal > 0 ? (current / goal) : 0;
  };


  const handleButtonPress = (button: string) => {
    if (!savingsGoal || isNaN(Number(savingsGoal))) {
      Alert.alert('Error', 'Primero necesitas configurar una meta financiera de ahorro');
    } else {
      if (button === 'Ingresar') {
        navigation.navigate('SavingsAdd', { savingsGoal, interval, currentSavings });
      }
      if (button === 'Retirar') {
        navigation.navigate('MySavingsWithdrawals', { savingsGoal, interval, currentSavings });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/MySavingsLogo.jpg')} style={styles.image} />
      <Text style={styles.goalText}>Meta: ${savingsGoal}</Text>
      <Text style={styles.text}>Plan de Ahorro: {interval}</Text>
      <Text style={styles.text}>Ahorro Programado: ${programmedSavings}</Text>
      <Text style={styles.text}>Ahorro Actual: ${currentSavings}</Text>
      <Text style={styles.text}>Fecha Límite: {selectedDate}</Text>
      <Text style={styles.text}>Días Restantes: {calculateDaysRemaining()}</Text>

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <ProgressBar
          progress={calculateProgress()} // Usar el progreso calculado
          color="#80DA80"
        />
        <Text style={styles.text}>{(calculateProgress() * 100).toFixed(2)}% completado</Text>
      </View>



      <CustomButton
        title="Ajustes"
        onPress={() => navigation.navigate('SavingsConf')}
        backgroundColor="#90CAF9"
        marginBottom={6}
        paddingHorizontal={85}
        paddingVertical={14}
      />
      <CustomButton
        title="Ingresar"
        onPress={() => handleButtonPress('Ingresar')}
        backgroundColor="#80DA80"
        marginBottom={6}
        paddingHorizontal={85}
        paddingVertical={14}
        disabled={!savingsGoal || isNaN(Number(savingsGoal))}
      />
      <CustomButton
        title="Retirar"
        onPress={() => handleButtonPress('Retirar')}
        backgroundColor="#FF5564"
        marginBottom={120}
        paddingHorizontal={85}
        paddingVertical={14}
        disabled={!savingsGoal || isNaN(Number(savingsGoal))}
      />
      {!isKeyboardVisible && (
        <FooterMenu navigation={navigation} onButtonPress={handleButtonPress} />
      )}
    </View>
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
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 2,
    marginRight: 135,
    color: 'black',
  },
  goalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 5,
    marginTop: -50,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: 'black',
  },
  progressBarContainer: {
    width: '80%',
    marginVertical: 10,
  },
});

export default SavingsScreen;
