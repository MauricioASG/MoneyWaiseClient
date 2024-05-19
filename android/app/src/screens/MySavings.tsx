/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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
  const handleButtonPress = (button: string) => {
    console.log(`${button} Pressed`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Savings Screen</Text>
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

export default SavingsScreen;
