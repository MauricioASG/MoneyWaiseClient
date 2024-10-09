import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { login } from '../api';
import { UserContext } from '../contexts/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain'; // IMPORTACIÓN DE KEYCHAIN
import { useFocusEffect } from '@react-navigation/native'; // IMPORTAR useFocusEffect

type LogInProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function Login({ navigation }: LogInProps): React.JSX.Element {
  const { setUserId } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastLoggedEmail, setLastLoggedEmail] = useState(''); // Guardamos el último email usado

  useEffect(() => {
    const initialize = async () => {
      const savedEmail = await AsyncStorage.getItem('lastUserEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setLastLoggedEmail(savedEmail); // Almacenar el último correo utilizado
      }
      setPassword(''); // Limpiamos el campo de contraseña inicialmente.
    };

    initialize();
  }, []);

  // Limpiar el campo de contraseña cada vez que la pantalla Login esté en foco
  useFocusEffect(
    useCallback(() => {
      setPassword(''); // Limpiamos el campo de contraseña cuando la pantalla está en foco
    }, [])
  );

  const btnIngresaronPress = async () => {
    try {
      if (email && password) {
        const data = await login(email, password);
        setUserId(data.id);
        Alert.alert('Entraste', 'Iniciando sesión...');
  
        // Almacenar el último email en AsyncStorage
        await AsyncStorage.setItem('lastUserEmail', email);
  
        // Almacenar las credenciales en Keychain para biometría usando InternetCredentials
        await Keychain.setInternetCredentials(
          'moneywise',  // Identificador para las credenciales (puede ser un dominio o nombre de la app)
          email,
          password,
          {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // Forzar autenticación biométrica
            authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
          }
        );

        // Actualizamos el último email utilizado después de un inicio de sesión exitoso
        setLastLoggedEmail(email);
  
        navigation.navigate('Home');
      } else {
        Alert.alert('Fallido', 'Por favor ingresa tu correo y contraseña');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al iniciar sesión');
    }
  };

  // Función que redirige a la pantalla de huella si hay credenciales disponibles
  const handleBiometricRedirect = () => {
    if (email !== lastLoggedEmail) {
      // Si el correo en el campo es diferente al último correo con el que se inició sesión
      Alert.alert(
        'Debes iniciar sesión con contraseña',
        'Parece que cambiaste el correo. Por favor, inicia sesión con tu contraseña al menos una vez.'
      );
    } else {
      // Si los correos coinciden, permitir acceso a la huella
      navigation.navigate('FingerprintScreen', { email });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image
          source={require('../assets/MoneyWiseLogo2.jpg')}
          style={styles.image}
        />
        <Text style={styles.titleText}>Inicio de sesión</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Correo electrónico"
          placeholderTextColor={'#aaa'}
          onChangeText={u => setEmail(u)}
          value={email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          secureTextEntry={true}
          placeholderTextColor={'#aaa'}
          onChangeText={p => setPassword(p)}
          value={password}
        />
        <TouchableOpacity style={styles.buttonPrimary} onPress={btnIngresaronPress}>
          <Text style={styles.buttonTextPrimary}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.buttonTextSecondary}>Crear cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBiometric}
          onPress={handleBiometricRedirect} // Solo navega a FingerprintScreen si no cambió el correo
        >
          <Text style={styles.buttonTextBiometric}>Inicio con huella</Text>
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
    backgroundColor: '#0d8a94',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonTextSecondary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonBiometric: {
    backgroundColor: '#39628f',
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonTextBiometric: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;
