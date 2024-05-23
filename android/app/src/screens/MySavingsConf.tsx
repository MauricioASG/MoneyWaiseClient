/* eslint-disable prettier/prettier */
// MYSavingsConf.tsx
import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';

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
  const [savings, setSavings] = useState('');
  const [interval, setInterval] = useState('daily'); // Nuevo estado para el intervalo

  const handleSavingsChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setSavings(numericText);
    }
  };

  const handleApply = () => {
    navigation.navigate('Savings', { programmedSavings: savings });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
    >
      <Text style={styles.heading}>Savings Configuration</Text>
      <Image
        source={require('../assets/MySavingsConfLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading2}>Meta Deseable</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Cantidad a ingresar"
        placeholderTextColor={'black'}
        keyboardType="decimal-pad"
        value={savings}
        onChangeText={handleSavingsChange}
      />
      <Text style={styles.heading2}>Intervalo de Ahorro</Text>
      <Picker
        selectedValue={interval}
        style={styles.picker}
        onValueChange={(itemValue) => setInterval(itemValue)}
      >
        <Picker.Item label="Diario" value="daily" />
        <Picker.Item label="Semanal" value="weekly" />
      </Picker>
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
    textAlign: 'center',
    fontSize: 25,
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 20,
  },
});

export default SavingsConf;
