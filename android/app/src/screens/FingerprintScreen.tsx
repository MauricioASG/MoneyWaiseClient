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
  const { email } = route.params;

  // Esta función solo se ejecutará cuando el usuario presione el botón "Usar Huella Digital"
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
        // Llama a la API de inicio de sesión con las credenciales recuperadas
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

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
      <Text style={styles.titleText}>Inicio con huella</Text>
        <Image
          source={require('../assets/MoneyWiseLogo2.jpg')}
          style={styles.image}
        />
        <Text style={styles.subtitleText}>Usuario: </Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleBiometricLogin}>
          <Text style={styles.buttonTextPrimary}>Escanear huella</Text>
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
    fontSize: 24,
    fontWeight: '700',
    marginTop: -40,
    marginBottom: 30,
  },
  buttonPrimary: {
    backgroundColor: '#0073AB',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 400,
    resizeMode: 'cover',
  },
});

export default FingerprintScreen;
