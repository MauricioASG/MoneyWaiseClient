/* eslint-disable prettier/prettier */
// MySavingsAdd.tsx
import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, Image, TextInput, Keyboard, Platform } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import { useButton } from '../contexts/FooterMenuContext';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
  SavingsAdd: undefined;
};

type SavingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SavingsAdd'>;
  route: RouteProp<RootStackParamList, 'SavingsAdd'>;
};

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation }) => {
  const [savings, setSavings] = useState('');

  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  const handleSavingsChange = (text: string) => {
    // Permitir solo números y un punto decimal
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setSavings(numericText);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
    >
      <Text style={styles.heading}>Savings Add Screen</Text>
      <Image
        source={require('../assets/MySavingsAddLogo.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading2}>Meta financiera</Text>
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
        onPress={() => handleButtonPress('Ingresar')}
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
  },
});

export default SavingsScreen;
