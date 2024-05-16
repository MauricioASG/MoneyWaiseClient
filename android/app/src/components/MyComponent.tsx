/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, View } from 'react-native';

interface props {
  title: string
  color: string
  onPress: () => void;
}

export default function MyComponent({title, color = '#1ACDA5', onPress}:props) {
  return (
    <View>
      <Button title={title} color={color} onPress={onPress}/>
    </View>

  );
}

