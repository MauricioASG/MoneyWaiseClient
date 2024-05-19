//FooterMenu
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useButton } from '../contexts/FooterMenuContext'; // Asegúrate de ajustar la ruta según sea necesario

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
};

type FooterMenuProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings' | 'Home' | 'Schedule'>;
  onButtonPress?: (button: string) => void;
};

const FooterMenu: React.FC<FooterMenuProps> = ({ navigation, onButtonPress }) => {
  const { selectedButton, setSelectedButton } = useButton();

  const handlePress = (button: string) => {
    setSelectedButton(button);
    if (onButtonPress) {
      onButtonPress(button);
    }
    switch (button) {
      case 'left':
        navigation.navigate('Savings');
        break;
      case 'center':
        navigation.navigate('Home');
        break;
      case 'right':
        navigation.navigate('Schedule');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.footerBackground}>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'left' && styles.buttonSelected,
          ]}
          activeOpacity={0.7}
          onPress={() => handlePress('left')}
        >
          <Image
            source={require('../assets/MenuLogoLeft.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'center' && styles.buttonSelected,
          ]}
          activeOpacity={0.7}
          onPress={() => handlePress('center')}
        >
          <Image
            source={require('../assets/MenuLogoCenter.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'right' && styles.buttonSelected,
          ]}
          activeOpacity={0.7}
          onPress={() => handlePress('right')}
        >
          <Image
            source={require('../assets/MenuLogoRight.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#1671CF',
  },
  buttonSelected: {
    backgroundColor: '#FFFFFF', // Color más claro cuando está seleccionado
    borderWidth: 2,
    borderRadius: 20,
  },
  logo: {
    width: 80, // ajusta el tamaño según sea necesario
    height: 80, // ajusta el tamaño según sea necesario
    borderRadius: 10,
  },
  footerBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1671CF',
    height: 120, // ajusta el tamaño según sea necesario
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center', // Align buttons to center vertically
    width: '100%',
  },
});

export default FooterMenu;
