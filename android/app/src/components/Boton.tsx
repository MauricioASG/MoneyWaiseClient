/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';


interface props{
  title: string
}

export default function Boton({title} :props) {
  return(
    <View style={styles.Boton}>
    <Button title={title} />
  </View>
  );
}

const styles = StyleSheet.create({
  Boton:{
    margin:20,
    padding: 5,
    backgroundColor: '#1ACDA5',
    borderRadius: 5,
  },
}
);
