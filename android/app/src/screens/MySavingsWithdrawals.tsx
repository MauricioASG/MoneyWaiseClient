/* eslint-disable prettier/prettier */
// MySavingsWithdawals.tsx
import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Home: undefined;
  Savings: { amountAdded?: string, savingsGoal?: string, interval?: string };
  Schedule: undefined;
  Login: undefined;
  SavingsAdd: { savingsGoal: string, interval: string };
  MySavingsWithdawals: { savingsGoal: string, interval: string };
};

type MySavingsWithdawalsProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MySavingsWithdawals'>;
  route: RouteProp<RootStackParamList, 'MySavingsWithdawals'>;
};

const MySavingsWithdawals: React.FC<MySavingsWithdawalsProps> = ({ navigation, route }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const { savingsGoal, interval } = route.params;

  const handleButtonPress = () => {
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount))) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida');
      return;
    }

    navigation.navigate('Savings', { amountAdded: (-Number(withdrawalAmount)).toString(), savingsGoal, interval });
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
      <Text style={styles.heading2}>Meta financiera: {savingsGoal}</Text>
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
    width: '80%',
    marginBottom: 10,
  },
});

export default MySavingsWithdawals;
