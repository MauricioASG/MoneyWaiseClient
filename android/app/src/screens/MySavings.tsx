/* eslint-disable prettier/prettier */
// SavingsScreen.tsx
// SavingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Keyboard, Platform } from 'react-native';
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
  SavingsConf: undefined;
};

type SavingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings'>;
  route: RouteProp<RootStackParamList, 'Savings'>;
};

const SavingsScreen: React.FC<SavingsScreenProps> = ({ navigation, route }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [savings, setSavings] = useState('');
  const { setSelectedButton } = useButton();
  const programmedSavings = route.params?.programmedSavings;

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

  useEffect(() => {
    if (programmedSavings) {
      setSavings(programmedSavings);
    }
  }, [programmedSavings]);

  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  const handleSavingsChange = (text: string) => {
    if (!programmedSavings) {
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
        value={savings}
        onChangeText={handleSavingsChange}
        editable={!programmedSavings}
      />
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
        onPress={() => navigation.navigate('SavingsAdd')}
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
