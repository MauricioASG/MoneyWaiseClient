/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Keyboard, Platform } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  // Estado para rastrear si el teclado está visible
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Listeners para detectar cuando el teclado se muestra u oculta
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true); // Actualiza el estado cuando el teclado se muestra
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false); // Actualiza el estado cuando el teclado se oculta
      }
    );

    // Limpiar los listeners cuando el componente se desmonta
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100} // Ajusta el scroll para evitar que el teclado cubra los campos de entrada
    >
      <Text style={styles.heading}>Savings Screen</Text>
      <Image
        source={require('../assets/MySavingsLogo.jpg')}
        style={styles.image}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Ahorro"
        secureTextEntry={true}
        placeholderTextColor={'#000000'}
      />
      {/* Muestra el FooterMenu solo si el teclado no está visible */}
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
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  textInput: {
    color: 'black',
    borderBottomWidth: 1,
    borderRadius: 8,
    backgroundColor: '#9BD3FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '80%',
    marginBottom: 400,
  },
});

export default SavingsScreen;
