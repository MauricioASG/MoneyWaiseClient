/* eslint-disable prettier/prettier */
// LoginScreen.tsx
// LoginScreen.tsx
import React, { useState, useContext, useEffect } from 'react';
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
import * as Keychain from 'react-native-keychain';

type LogInProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function Login({ navigation }: LogInProps): React.JSX.Element {
  const { setUserId } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometryType, setBiometryType] = useState<string | null>(null);

  useEffect(() => {
    Keychain.getSupportedBiometryType().then(biometryType => {
      setBiometryType(biometryType);
    });
  }, []);

  const btnIngresaronPress = async () => {
    try {
      if (email && password) {
        const data = await login(email, password);
        setUserId(data.id);
        Alert.alert('Entraste', 'Iniciando sesión...');

        // Guardar credenciales en el llavero
        await Keychain.setGenericPassword(email, password, {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        });

        navigation.navigate('Home');
      } else {
        Alert.alert('Fallido', 'Datos incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'Autenticación requerida',
          subtitle: 'Iniciar sesión con biometría',
          description: 'Usa tu huella digital o Face ID para iniciar sesión',
          cancel: 'Cancelar',
        },
        authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
      });

      if (credentials) {
        const { username, password } = credentials;
        const data = await login(username, password);
        setUserId(data.id);
        Alert.alert('Autenticación exitosa', 'Bienvenido de nuevo');
        navigation.navigate('Home');
      } else {
        Alert.alert('No se encontraron credenciales', 'Por favor, inicia sesión primero con tu correo y contraseña');
      }
    } catch (error) {
      Alert.alert('Error', 'Autenticación fallida o cancelada');
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
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          secureTextEntry={true}
          placeholderTextColor={'#aaa'}
          onChangeText={p => setPassword(p)}
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
        {biometryType && (
          <TouchableOpacity style={styles.buttonBiometric} onPress={handleBiometricLogin}>
            <Text style={styles.buttonTextBiometric}>
              Iniciar con {biometryType === 'FaceID' ? 'Face ID' : 'Huella Digital'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#F5F5F5', // Fondo suave
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
    elevation: 5, // Sombra para efecto de profundidad
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
    marginTop: -70 , 
  },
  buttonBiometric: {
    color: '#333',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: -70 , 
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
    marginBottom: 80, 
  },
  buttonTextSecondary: {
    color: '#0073AB',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;
