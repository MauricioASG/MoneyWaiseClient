import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(false); // Estado para mostrar un indicador de carga
  const { savingsGoal, interval, currentSavings, goalId } = route.params;

  const MAX_SAVINGS = 1000000; // Límite de la cantidad permitida para el ahorro

  const handleButtonPress = async () => {
    if (!savings || isNaN(Number(savings)) || Number(savings) <= 0) {
      Alert.alert('Error', 'Por favor, ingrese una cantidad válida mayor a 0');
      return;
    }

    if (parseFloat(savings) > MAX_SAVINGS) {
      Alert.alert('Error', `La cantidad ingresada no puede exceder ${MAX_SAVINGS}`);
      return;
    }

    setLoading(true); // Iniciar el indicador de carga

    // Actualizar el ahorro actual en la base de datos
    try {
      const newSavings = (parseFloat(currentSavings) + parseFloat(savings)).toString();
      await updateSavings(goalId, newSavings);  // Llamada a la API con goalId

      setLoading(false); // Detener el indicador de carga

      // Navegar de nuevo a la pantalla de Savings y pasar el nuevo ahorro
      navigation.navigate('Savings', {
        amountAdded: savings,
        savingsGoal,
        interval,
        currentSavings: newSavings,
      });
    } catch (error) {
      setLoading(false); // Detener el indicador de carga
      console.error('Error al actualizar el ahorro actual:', error);
      Alert.alert('Error', 'No se pudo actualizar el ahorro');
    }
  };

  // Función para manejar el cambio de entrada
  const handleSavingsChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, ''); // Permitir solo números y puntos
    const parts = numericText.split('.');
    if (parts.length <= 2 && (parts[1]?.length || 0) <= 2) { // Limitar a dos decimales
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
      {loading ? (
        <ActivityIndicator size="large" color="#80DA80" />
      ) : (
        <CustomButton
          title="Ingresar"
          onPress={handleButtonPress}
          backgroundColor="#80DA80"
          marginBottom={200}
          paddingHorizontal={85}
          paddingVertical={16}
        />
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
