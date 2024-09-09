/* eslint-disable prettier/prettier */
// MySavingsScreen.tsx
/* eslint-disable prettier/prettier */
// MySavingsScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, Keyboard, Platform, Alert, View } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { useButton } from '../contexts/FooterMenuContext';
import { getGoal, updateSavings } from '../api';
import { UserContext } from '../contexts/UserContext';

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
  const [savingsGoal, setSavingsGoal] = useState('');
  const [interval, setInterval] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [programmedSavings, setProgrammedSavings] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
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
        setTimePeriod(goal.timePeriod.toString());
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
    if (route.params?.timePeriod) {
      setTimePeriod(route.params.timePeriod);
    }
  }, [route.params?.amountAdded, route.params?.interval, route.params?.timePeriod]);

  useEffect(() => {
    if (route.params?.savingsGoal) {
      setSavingsGoal(route.params.savingsGoal);
    }
  }, [route.params?.savingsGoal]);

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
      <Image
        source={require('../assets/MySavingsLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.goalText}>Meta: ${savingsGoal}</Text>
      <Text style={styles.text}>Plan de Ahorro: {interval}</Text>
      <Text style={styles.text}>Ahorro Programado: ${programmedSavings}</Text>
      <Text style={styles.text}>Ahorro Actual: ${currentSavings}</Text>
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
});

export default SavingsScreen;
