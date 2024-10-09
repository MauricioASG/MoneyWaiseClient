import React, { useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import * as Keychain from 'react-native-keychain';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { login } from '../api'; // Importa la función de login

type FingerprintProps = {
  navigation: StackNavigationProp<RootStackParamList, 'FingerprintScreen'>;
  route: any; // para recibir el email desde LoginScreen
};

function FingerprintScreen({ navigation, route }: FingerprintProps): React.JSX.Element {
  const { setUserId } = useContext(UserContext);
  const { email } = route.params; // Recibimos el email desde LoginScreen

  // Esta función se ejecuta cuando el usuario presiona el botón "Escanear Huella"
  const handleBiometricLogin = async () => {
    try {
      // Solicita la autenticación biométrica para obtener las credenciales
      const credentials = await Keychain.getInternetCredentials('moneywise', {
        authenticationPrompt: {
          title: 'Autenticación requerida',
          subtitle: 'Usa tu huella digital o Face ID para iniciar sesión',
          description: 'Verifica tu identidad para continuar',
          cancel: 'Cancelar',
        },
        authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS, // Solicitar autenticación biométrica
      });

      if (credentials) {
        const { username, password } = credentials;

        // Verificamos si el email recuperado coincide con el mostrado en la pantalla de login
        if (username !== email) {
          Alert.alert('Error', 'Las credenciales almacenadas no coinciden con el correo actual.');
          await Keychain.resetInternetCredentials('moneywise'); // Elimina las credenciales incorrectas
          return;
        }

        // Si las credenciales coinciden, llamamos a la API de inicio de sesión
        const data = await login(username, password);
        setUserId(data.id);
        Alert.alert('Autenticación exitosa', 'Bienvenido de nuevo');
        navigation.navigate('Home');
      } else {
        Alert.alert('No se encontraron credenciales', 'Por favor, inicia sesión primero con tu correo y contraseña.');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Autenticación fallida o cancelada');
      navigation.navigate('Login');
    }
  };

  // Botón para cancelar e ir de regreso a la pantalla anterior
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Inicio con huella</Text>
        <Image
          source={require('../assets/MoneyWiseLogo2.jpg')}
          style={styles.image}
        />
        <Text style={styles.subtitleText}>Usuario: {email}</Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleBiometricLogin}>
          <Text style={styles.buttonTextPrimary}>Escanear huella</Text>
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
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
  titleText: {
    color: '#333',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 35,
    marginBottom: -5,
  },
  subtitleText: {
    color: '#333',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 40,
  },
  buttonPrimary: {
    backgroundColor: '#0073AB',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonCancel: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonTextCancel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 40,
  },
  image: {
    width: 200,
    height: 400,
    resizeMode: 'cover',
  },
});

export default FingerprintScreen;
