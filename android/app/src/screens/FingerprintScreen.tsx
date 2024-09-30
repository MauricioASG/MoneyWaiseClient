import React, { useContext, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';

type FingerprintProps = {
  navigation: StackNavigationProp<RootStackParamList, 'FingerprintScreen'>;
  route: any;  // para recibir el email desde LoginScreen
};

function FingerprintScreen({ navigation, route }: FingerprintProps): React.JSX.Element {
  const { setUserId } = useContext(UserContext);



  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image
          source={require('../assets/MoneyWiseLogo2.jpg')}
          style={styles.image}
        />
        <Text style={styles.titleText}>Inicio con huella</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Correo electrónico"
          placeholderTextColor={'#aaa'}
        />
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonTextPrimary}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textInput: {
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#0073AB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '85%',
    margin: 10,
    fontSize: 16,
  },
  titleText: {
    color: '#333',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: -70,
  },
  image: {
    width: 200,
    height: 400,
    resizeMode: 'cover',
  },
  buttonPrimary: {
    backgroundColor: '#0073AB',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonTextSecondary: {
    color: '#0073AB',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FingerprintScreen;
