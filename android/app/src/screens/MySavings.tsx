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
  Savings: { amountAdded?: string, savingsGoal?: string, interval?: string, currentSavings?: string, selectedDate?: string };
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
  const [savingsGoal, setSavingsGoal] = useState('0');
  const [interval, setInterval] = useState('Mensual');
  const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate || new Date().toISOString().split('T')[0]);
  const [programmedSavings, setProgrammedSavings] = useState('0');
  const [currentSavings, setCurrentSavings] = useState('0');
  const [goalId, setGoalId] = useState<number | null>(null);
  const { setSelectedButton } = useButton();
  const isFocused = useIsFocused();

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Formato dd-mm-yyyy o dd/mm/yyyy
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [isFocused]);

  // Calcula los días restantes en función de la fecha límite
  const calculateDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(selectedDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(`Días restantes calculados: ${diffDays}`);
    return diffDays > 0 ? diffDays : 0;
  };

  // Calcula el porcentaje de avance del ahorro
  const calculateProgress = () => {
    const goal = parseFloat(savingsGoal) || 0;
    const current = parseFloat(currentSavings) || 0;
    return goal > 0 ? current / goal : 0;
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
      <Text style={styles.goalText}>- Meta de ahorro: ${savingsGoal}</Text>
      <Image source={require('../assets/MySavingsLogo.jpg')} style={styles.image} />

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={calculateProgress()} color="#80DA80" />
        <Text style={styles.text}>{(calculateProgress() * 100).toFixed(2)}% completado</Text>
      </View>
      {/* Contenedor para el texto de la pantalla */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>- Ahorro actual: ${currentSavings}</Text>
        <Text style={styles.text}>- Ahorro sugerido: ${programmedSavings}</Text>
        {/* Usa la función formatDate para formatear la fecha */}
        <Text style={styles.text}>- Fecha límite: {formatDate(selectedDate)}</Text>
        <Text style={styles.text}>- Días restantes: {calculateDaysRemaining()}</Text>
      </View>

      <CustomButton
        title="Ajustes"
        onPress={() => navigation.navigate('SavingsConf')}
        backgroundColor="#90CAF9"
        marginBottom={6}
        paddingHorizontal={85}
        paddingVertical={12}
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
        marginBottom={80}
        paddingHorizontal={85}
        paddingVertical={12}
        disabled={!savingsGoal || isNaN(Number(savingsGoal))}
      />
      {!isKeyboardVisible && <FooterMenu navigation={navigation} onButtonPress={handleButtonPress} />}
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
  textContainer: {
    alignSelf: 'stretch',
    marginLeft: 5,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: -50,
    color: 'black',
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    textAlign: 'left',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: -20,
    marginTop: -40,
  },
  progressBarContainer: {
    width: '80%',
    marginVertical: 25,
  },
});

export default SavingsScreen;
