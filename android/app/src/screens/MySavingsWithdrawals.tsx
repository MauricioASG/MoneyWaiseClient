import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import { updateSavings } from '../api';  // Importa la función de la API

type RootStackParamList = {
  Home: undefined;
  Savings: { amountAdded?: string, savingsGoal?: string, interval?: string, currentSavings?: string };
  Schedule: undefined;
  Login: undefined;
  MySavingsWithdrawals: { savingsGoal: string, interval: string, currentSavings: string, goalId: number | null };
};

type MySavingsWithdrawalsProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MySavingsWithdrawals'>;
  route: RouteProp<RootStackParamList, 'MySavingsWithdrawals'>;
};

const MySavingsWithdrawals: React.FC<MySavingsWithdrawalsProps> = ({ navigation, route }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const { savingsGoal, interval, currentSavings, goalId } = route.params;  // Asegúrate de que goalId esté presente

  const handleButtonPress = async () => {
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount))) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida');
      return;
    }

    // Actualizar el ahorro actual en la base de datos
    try {
      const newSavings = (parseFloat(currentSavings) - parseFloat(withdrawalAmount)).toString();
      await updateSavings(goalId, newSavings);  // Llamada a la API con goalId

      navigation.navigate('Savings', { amountAdded: (-Number(withdrawalAmount)).toString(), savingsGoal, interval, currentSavings: newSavings });
    } catch (error) {
      console.error('Error al actualizar el ahorro actual:', error);
      Alert.alert('Error', 'No se pudo actualizar el ahorro');
    }
  };

  const handleSavingsChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setWithdrawalAmount(numericText);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
    >
      <Text style={styles.heading}>Retirar Ahorros</Text>
      <Image
        source={require('../assets/MySavingsWithdrawalsLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading2}>Cantidad a Retirar</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Cantidad a retirar"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={withdrawalAmount}
        onChangeText={handleSavingsChange}
      />
      <CustomButton
        title="Retirar"
        onPress={handleButtonPress}
        backgroundColor="#FF5564"
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
  },
});

export default MySavingsWithdrawals;
