/* eslint-disable prettier/prettier */
// LoginScreen.tsx
import React, { useState, useContext } from 'react';
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

type LogInProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function Login({ navigation }: LogInProps): React.JSX.Element {
  const { setUserId } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const btnIngresaronPress = async () => {
    try {
      if (email && password) {
        const data = await login(email, password);
        setUserId(data.id);
        Alert.alert('Entraste', 'Iniciando sesión...');
        navigation.navigate('Home');
      } else {
        Alert.alert('Fallido', 'Datos incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
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
        <Text style={styles.subTitleText}>Inicia sesión para continuar</Text>
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
    marginTop: -110 , 
  },
  subTitleText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 400,
    resizeMode: 'cover',
  },
  buttonPrimary: {
    backgroundColor: '#0073AB',
    paddingVertical: 12,
    paddingHorizontal: 60,
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
  },
  buttonTextSecondary: {
    color: '#0073AB',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;
