// //LoginScreen.tsx
/* eslint-disable prettier/prettier */
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    SafeAreaView,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Image,
} from 'react-native';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
}

type LogInProps = {
    navigation: StackNavigationProp <RootStackParamList, 'Home'>;
};

function Login({navigation}: LogInProps): React.JSX.Element {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');

    const btnIngresaronPress = function () {
        if (user && password) {
            Alert.alert('Entraste', 'Iniciando sesión...');
            navigation.navigate('Home');
            return
        }
        Alert.alert('Fallido', 'Datos incorrectos');
    };
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
              <Image
              source={require('../assets/MoneyWiseLogo.jpg')}
              style={styles.image}
              />
                <Text style={styles.Text}>Inicio de sesion</Text>
                <TextInput style={styles.textInput}
                    placeholder="Usuario"
                    placeholderTextColor={'#000000'}
                    onChangeText={u => setUser(u)}
                />
                <TextInput style={styles.textInput}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#000000'}
                    onChangeText={p => setPassword(p)}
                />
                <Button title="Ingresar" onPress={btnIngresaronPress} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  screen: {
      height: '100%',
      backgroundColor: '#0073AB',
      justifyContent: 'center',
      alignItems: 'center',
  },
  container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#64B5F6',
      width: '100%',
      padding: 16,
  },
  textInput: {
      color: 'black',
      borderBottomWidth: 1,
      borderRadius: 8,
      backgroundColor: 'white',
      paddingVertical: 8,
      paddingHorizontal: 12,
      width: '80%',
      margin: 8,
  },
  Text: {
   color: 'black',
   fontSize: 20,
   marginBottom:10,
   fontWeight: '500',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default Login;

