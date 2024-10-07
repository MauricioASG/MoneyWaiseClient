import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const UserSettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Lógica para cerrar sesión
    Alert.alert('Cerrar sesión', 'Has cerrado sesión con éxito.');
    navigation.navigate('Login'); // Redirigir a la pantalla de inicio de sesión
  };

  const handleProfileUpdate = () => {
    // Lógica para actualizar el perfil
    Alert.alert('Actualizar perfil', 'Funcionalidad de actualización de perfil.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Imagen del perfil del usuario */}
        <Image
          source={require('../assets/UserSettingsLogo.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.title}>Configuraciones de Usuario</Text>

        {/* Botón para actualizar el perfil */}
        <TouchableOpacity style={styles.button} onPress={handleProfileUpdate}>
          <Text style={styles.buttonText}>Actualizar Perfil</Text>
        </TouchableOpacity>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0073AB',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
  },
});

export default UserSettingsScreen;
