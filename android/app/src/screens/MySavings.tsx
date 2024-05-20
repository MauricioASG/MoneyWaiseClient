// SavingsScreen.tsx
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Keyboard, Platform } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
};

type SavingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings'>;
  route: RouteProp<RootStackParamList, 'Savings'>;
};

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [savings, setSavings] = useState('');

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

  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  const handleSavingsChange = (text: string) => {
    // Remover cualquier caracter que no sea número
    const numericText = text.replace(/[^0-9]/g, '');
    setSavings(numericText);
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
        keyboardType="numeric"
        value={savings}
        onChangeText={handleSavingsChange}
      />
      <CustomButton
        title="Ajustes" 
        onPress={() => handleButtonPress('Ajustes')} 
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
      />
      <CustomButton 
        title="Retirar" 
        onPress={() => handleButtonPress('Retirar')} 
        backgroundColor="#FF5564"
        marginBottom={200}
        paddingHorizontal={85}
        paddingVertical={16}
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
