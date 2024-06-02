/* eslint-disable prettier/prettier */
// LoginScreen.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
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

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    CreateAcount: undefined;
}

type LogInProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function Login({ navigation }: LogInProps): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const btnIngresaronPress = async () => {
        try {
            if (email && password) {
                const data = await login(email, password);
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
                    source={require('../assets/MoneyWiseLogo.jpg')}
                    style={styles.image}
                />
                <Text style={styles.Text}>Inicio de sesión</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Correo electrónico"
                    placeholderTextColor={'#000000'}
                    onChangeText={u => setEmail(u)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#000000'}
                    onChangeText={p => setPassword(p)}
                />
                <TouchableOpacity style={styles.button} onPress={btnIngresaronPress}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateAcount')}
                >
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        width: '70%',
        margin: 8,
    },
    Text: {
        color: 'black',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '500',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Login;
