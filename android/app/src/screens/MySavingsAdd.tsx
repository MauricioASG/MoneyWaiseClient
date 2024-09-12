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
  SavingsAdd: { savingsGoal: string, interval: string, currentSavings: string, goalId: number | null };
};

type SavingsAddProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SavingsAdd'>;
  route: RouteProp<RootStackParamList, 'SavingsAdd'>;
};

const SavingsAdd: React.FC<SavingsAddProps> = ({ navigation, route }) => {
  const [savings, setSavings] = useState('');
  const { savingsGoal, interval, currentSavings, goalId } = route.params; // Asegúrate de que goalId esté presente

  const handleButtonPress = async () => {
    if (!savings || isNaN(Number(savings))) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida');
      return;
    }

    // Actualizar el ahorro actual en la base de datos
    try {
      const newSavings = (parseFloat(currentSavings) + parseFloat(savings)).toString();
      await updateSavings(goalId, newSavings);  // Llamada a la API con goalId

      // Navegar de nuevo a la pantalla de Savings y pasar el nuevo ahorro
      navigation.navigate('Savings', { amountAdded: savings, savingsGoal, interval, currentSavings: newSavings });
    } catch (error) {
      console.error('Error al actualizar el ahorro actual:', error);
      Alert.alert('Error', 'No se pudo actualizar el ahorro');
    }
  };

  const handleSavingsChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setSavings(numericText);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} extraScrollHeight={100}>
      <Image source={require('../assets/MySavingsAddLogo.jpg')} style={styles.image} />
      <Text style={styles.heading2}>Cantidad a Ingresar</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Cantidad a ingresar"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={savings}
        onChangeText={handleSavingsChange}
      />
      <CustomButton
        title="Ingresar"
        onPress={handleButtonPress}
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

export default SavingsAdd;
