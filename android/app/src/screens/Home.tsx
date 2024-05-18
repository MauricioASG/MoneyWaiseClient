/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>¡Bienvenido a la aplicación!</Text>
      <Button
        title="Cerrar sesión"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Ir a Test"
        onPress={() => navigation.navigate('Test')}
      />
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => { console.log('Logo Left Pressed') }}
        >
          <Image
            source={require('../assets/MenuLogoLeft.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => { console.log('Logo Center Pressed') }}
        >
          <Image
            source={require('../assets/MenuLogoCenter.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => { console.log('Logo Right Pressed') }}
        >
          <Image
            source={require('../assets/MenuLogoRight.jpg')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#1671CF',
  },
  logo: {
    width: 85, // ajusta el tamaño según sea necesario
    height: 85, // ajusta el tamaño según sea necesario
  },
  footerContainer: {
    position: 'absolute',
    bottom: 5,
    left: -42,
    right: -40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default HomeScreen;
