/* eslint-disable prettier/prettier */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from './android/app/src/screens/TestScreen';
import Login from './android/app/src/screens/LoginScreen';
import HomeScreen from './android/app/src/screens/Home';
import MySavings from './android/app/src/screens/MySavings';
import ExpenseSchedule from './android/app/src/screens/ExpenseSchedule';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={ExpenseSchedule} options={{ headerShown: false }}/>
        <Stack.Screen name="Savings" component={MySavings} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
