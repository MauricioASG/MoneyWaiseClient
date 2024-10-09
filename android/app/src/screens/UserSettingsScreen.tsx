import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { getUserDetails, updateUserDetails } from '../api'; // Asegúrate de tener estas funciones en tu api.ts

const UserSettingsScreen = ({ navigation }) => {
  const { userId } = useContext(UserContext); // Obtener el id del usuario desde el contexto
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    salario: '',
  });

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserDetails(userId); // Llamada a la API para obtener los detalles del usuario
        setUserData(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los detalles del usuario.');
      }
    };
    loadUserData();
  }, [userId]);

  // Manejar la actualización de los datos del usuario
  const handleSaveChanges = async () => {
    try {
      await updateUserDetails(userId, userData); // Llamada a la API para guardar los cambios
      Alert.alert('Éxito', 'Los cambios han sido guardados.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Imagen del perfil del usuario */}
        <Image
          source={require('../assets/UserSettingsLogo.jpg')}
          style={styles.profileImage}
        />

        <Text style={styles.title}>Configuraciones de Usuario</Text>

        {/* Campo editable para el nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={userData.nombre}
          onChangeText={(value) => handleInputChange('nombre', value)}
        />

        {/* Campo editable para el correo */}
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
        />

        {/* Campo editable para el salario */}
        <Text style={styles.label}>Salario</Text>
        <TextInput
          style={styles.input}
          value={userData.salario.toString()}
          onChangeText={(value) => handleInputChange('salario', value)}
          keyboardType="numeric"
        />

        {/* Botón para guardar cambios */}
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => {
            Alert.alert('Cerrar sesión', 'Has cerrado sesión con éxito.');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#0073AB',
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
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
    marginTop: 30,
  },
});

export default UserSettingsScreen;
