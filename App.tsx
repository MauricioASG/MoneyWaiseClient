/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/* eslint-disable prettier/prettier */
// import React, { Component, useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './android/app/src/screens/LoginScreen';
// import HomeScreen from './android/app/src/screens/Home';
// import MyComponent from './android/app/src/components/MyComponent';
// import Counter from './android/app/src/components/Contador';
// import Boton from './android/app/src/components/Boton';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './android/app/src/screens/LoginScreen';
// const Stack = createStackNavigator();


//Creamos pantalla secundaria
function DetailsScreen ({ navigation }){
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center '}}>
      <Text>Pantalla de detalles</Text>
      <Button title="Go to details again" onPress={()=> navigation.push('Details')}/>
      <Button title="Go to Home" onPress={()=> navigation.navigate('Home')}/>
      <Button title="Go back" onPress={()=> navigation.goBack()} />
    </View>
  );
}

//Creamos la pantalla HomeScreen que sera la principal
function HomeScreen( { navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center '}}>
      <Text>Pantalla Home</Text>
      <Button title="Go to Details" onPress={()=> navigation.navigate('Details')}/>
      <LoginScreen />
    </View>
  );
}

// function CounterButton({ title, onIncrement}) {
//   return <Button title={title} onPress={onIncrement} />
// }

const Stack = createNativeStackNavigator();

function App() {
  // const [count, setCount] = useState(0);
  // const handlePress1 = () =>{
  //   console.log('Boton 1 presionado');
  // };
  // const handlePress2 = () =>{
  //   console.log('Boton 2 presionado');
  // };
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Login">
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // <NavigationContainer>
      // {/* <View>
      //   <MyComponent title={'Presioname 1'} onPress={handlePress1} />
      //   <MyComponent title={'Presioname 2'} color="rgb(59, 108, 212)" onPress={handlePress2} />
      //   <Boton title='Hola' />
      //   <Text style={{ fontSize: 60 }}>Contador</Text>
      //   <Counter />
      //   <CounterButton
      //     title={`Click HERE to increment: ${count}`}
      //     onIncrement={() => setCount(count + 1)}
      //   />
      // </View> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen}  options={{title: 'Overview' }}/>
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
