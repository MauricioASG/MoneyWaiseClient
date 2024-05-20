// Home.tsx
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { setSelectedButton } = useButton();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('center');
    }, [setSelectedButton])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>¡Bienvenido a la aplicación!</Text>
      <Button
        title="Cerrar sesión"
        onPress={() => navigation.navigate('Login')}
      />
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

export default HomeScreen;
