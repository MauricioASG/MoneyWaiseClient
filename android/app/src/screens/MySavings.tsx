/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
};

type MySavingsProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Savings'>;
  route: RouteProp<RootStackParamList, 'Savings'>;
};

const MySavings: React.FC<MySavingsProps> = ({ navigation }) => {
  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>¡Bienvenido MySavings!</Text>
      <Button
        title="Cerrar sesión"
        onPress={() => navigation.navigate('Login')}
      />
      <FooterMenu navigation={navigation} onButtonPress={handleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default MySavings;
