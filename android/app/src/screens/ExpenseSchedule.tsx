// ScheduleScreen.tsx
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
};

type ScheduleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Schedule'>;
  route: RouteProp<RootStackParamList, 'Schedule'>;
};

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { setSelectedButton } = useButton();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('right');
    }, [setSelectedButton])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Horario de Gastos</Text>
      <FooterMenu navigation={navigation} />
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

export default ScheduleScreen;
