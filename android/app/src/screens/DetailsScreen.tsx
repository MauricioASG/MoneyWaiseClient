/* eslint-disable prettier/prettier */
import React from 'react';
import {Button, Text, View} from 'react-native';



//Creamos pantalla secundaria
export function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center ' }}>
      <Text>Pantalla de detalles</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
