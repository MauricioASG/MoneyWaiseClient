/* eslint-disable prettier/prettier */
// CreateAccountScreen.tsx
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
import { register } from '../api';

type RootStackParamList = {
    Login: undefined;
};

type CreateAccountProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function CreateAccount({ navigation }: CreateAccountProps): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [salary, setSalary] = useState('');

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const btnCrearCuentaPress = async () => {
        if (!email || !nombre || !password || !confirmPassword || !salary) {
            Alert.alert('Fallido', 'Por favor, completa todos los campos.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        if (isNaN(Number(salary)) || Number(salary) <= 0) {
            Alert.alert('Error', 'Por favor, ingresa un salario válido.');
            return;
        }

        try {
            await register(nombre, email, password, parseFloat(salary));
            Alert.alert('Haz creado tu cuenta', 'Regresando a login...');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Ocurrió un error al crear la cuenta.');
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.titleText}>Crear una cuenta</Text>
                <Image
                    source={require('../assets/MoneyWiseLogo2.jpg')}
                    style={styles.image}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Correo electrónico"
                    placeholderTextColor={'#aaa'}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Nombre de usuario"
                    placeholderTextColor={'#aaa'}
                    onChangeText={setNombre}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#aaa'}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirmar contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#aaa'}
                    onChangeText={setConfirmPassword}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Ingreso mensual aproximado"
                    placeholderTextColor={'#aaa'}
                    keyboardType="decimal-pad"
                    onChangeText={setSalary}
                />
                <TouchableOpacity style={styles.buttonPrimary} onPress={btnCrearCuentaPress}>
                    <Text style={styles.buttonTextPrimary}>Crear cuenta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonTextSecondary}>Cancelar</Text>
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
        height: '95%',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // Sombra para profundidad
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
        marginTop: 40,
    },
    image: {
        width: 300,
        height: 220,
        resizeMode: 'cover',
        marginBottom: -50,
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
        marginBottom: 40,
    },
    buttonTextSecondary: {
        color: '#0073AB',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CreateAccount;
