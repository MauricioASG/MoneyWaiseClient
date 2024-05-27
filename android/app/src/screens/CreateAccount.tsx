/* eslint-disable prettier/prettier */
// CreateAccountScreen.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
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

type RootStackParamList = {
    Login: undefined;
};

type CreateAccountProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

function CreateAccount({ navigation }: CreateAccountProps): React.JSX.Element {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [mail, setMail] = React.useState('');
    const [salary, setSalary] = React.useState('');

    const btnCreaarCuentaPress = function () {
        if (user && password && mail && salary) {
            Alert.alert('Haz creado tu cuenta', 'Regresando a login...');
            navigation.navigate('Login');
            return;
        }
        Alert.alert('Fallido', 'Datos incompletos');
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/MoneyWiseLogo.jpg')}
                    style={styles.image}
                />
                <Text style={styles.Text}>Creación de usuario</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Correo electrónico"
                    placeholderTextColor={'#000000'}
                    onChangeText={u => setMail(u)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Nombre de usuario"
                    placeholderTextColor={'#000000'}
                    onChangeText={u => setUser(u)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#000000'}
                    onChangeText={p => setPassword(p)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirmar contraseña"
                    secureTextEntry={true}
                    placeholderTextColor={'#000000'}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Ingreso mensual aproximado"
                    placeholderTextColor={'#000000'}
                    onChangeText={p => setSalary(p)}
                />
                <TouchableOpacity style={styles.button} onPress={btnCreaarCuentaPress}>
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancelar</Text>
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

export default CreateAccount;
