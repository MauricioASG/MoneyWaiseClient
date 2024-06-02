/* eslint-disable prettier/prettier */
// MySavings.tsx
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, TextInput, Keyboard, Platform, Alert } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import { useButton } from '../contexts/FooterMenuContext';
import { getGoal, updateGoal } from '../api';

type RootStackParamList = {
  Home: undefined;
  Savings: { amountAdded?: string, savingsGoal?: string, interval?: string, timePeriod?: string };
  Schedule: undefined;
  Login: undefined;
  SavingsAdd: { savingsGoal: string, interval: string };
  SavingsConf: undefined;
  MySavingsWithdawals: undefined;
};

type SavingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings'>;
  route: RouteProp<RootStackParamList, 'Savings'>;
};

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation, route }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(''); 
  const [savings, setSavings] = useState(''); 
  const [interval, setInterval] = useState(''); 
  const [timePeriod, setTimePeriod] = useState('');
  const [goalId, setGoalId] = useState<number | null>(null);
  const { setSelectedButton } = useButton();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('left');
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
      const usuarioId = 1; // Reemplaza con el ID del usuario actual
      const goalData = await getGoal(usuarioId);
      if (goalData.length > 0) {
        const goal = goalData[0];
        setSavingsGoal(goal.monto.toString());
        setInterval(goal.periodo);
        setTimePeriod(goal.timePeriod.toString());
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
      const newSavingsGoal = parseFloat(savingsGoal) - parseFloat(route.params.amountAdded);
      setSavingsGoal(newSavingsGoal.toString());
      if (goalId !== null) {
        updateGoal(goalId, newSavingsGoal, interval, newSavingsGoal / 30); // Ahorro programado de ejemplo
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
        navigation.navigate('SavingsAdd', { savingsGoal, interval });
      }
      if (button === 'Retirar') {
        navigation.navigate('MySavingsWithdawals', { savingsGoal, interval });
      }
    }
  };

  const handleSavingsChange = (text: string) => {
    if (!savingsGoal) {
      const numericText = text.replace(/[^0-9.]/g, '');
      const parts = numericText.split('.');
      if (parts.length <= 2) {
        setSavings(numericText);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
    >
      <Text style={styles.heading}>Savings Screen</Text>
      <Image
        source={require('../assets/MySavingsLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading2}>Meta financiera</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Ahorro"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={savingsGoal}
        onChangeText={handleSavingsChange}
        editable={!savingsGoal} // Solo editable si no hay valor programado
      />
      <Text style={styles.text}>Plan de Ahorro: {interval}</Text>
      <Text style={styles.text}>Periodo de Ahorro: {timePeriod}</Text>
      <CustomButton
        title="Ajustes"
        onPress={() => navigation.navigate('SavingsConf')}
        backgroundColor="#90CAF9"
        marginBottom={10}
        paddingHorizontal={85}
        paddingVertical={16}
      />
      <CustomButton
        title="Ingresar"
        onPress={() => handleButtonPress('Ingresar')}
        backgroundColor="#80DA80"
        marginBottom={10}
        paddingHorizontal={85}
        paddingVertical={16}
        disabled={!savingsGoal || isNaN(Number(savingsGoal))}
      />
      <CustomButton
        title="Retirar"
        onPress={() => handleButtonPress('Retirar')}
        backgroundColor="#FF5564"
        marginBottom={140}
        paddingHorizontal={85}
        paddingVertical={16}
        disabled={!savingsGoal || isNaN(Number(savingsGoal))}
      />
      {!isKeyboardVisible && (
        <FooterMenu navigation={navigation} onButtonPress={handleButtonPress} />
      )}
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
    marginBottom: 5,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 135,
    color: 'black',
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
    width: '65%',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 25,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 100,
    color: 'black',
  },
});

export default SavingsScreen;

