/* eslint-disable prettier/prettier */
// App.tsx
/* eslint-disable prettier/prettier */
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './android/app/src/screens/Home';
import SavingsScreen from './android/app/src/screens/MySavings';
import ScheduleScreen from './android/app/src/screens/ExpenseSchedule';
import { ButtonProvider } from './android/app/src/contexts/FooterMenuContext';
import LoginScreen from './android/app/src/screens/LoginScreen';
import SavingsAdd from './android/app/src/screens/MySavingsAdd';
import SavingsConf from './android/app/src/screens/MySavingsConf';
import MySavingsWithdrawals from './android/app/src/screens/MySavingsWithdrawals';
import CreateAccountScreen from './android/app/src/screens/CreateAccount';
import AddTransactionScreen from './android/app/src/screens/AddTransactionScreen';
import AllTransactionsScreen from './android/app/src/screens/AllTransactionsScreen';
import EditTransactionScreen from './android/app/src/screens/EditTransactionScreen';
import GraphDetails from './android/app/src/screens/GraphDetails'; // Importa la nueva pantalla
import { UserProvider } from './android/app/src/contexts/UserContext';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <ButtonProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gráfica de gastos' }} />
            <Stack.Screen name="Savings" component={SavingsScreen} options={{ title: 'Mis Ahorros' }} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Registro de Gastos' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Inicio de Sesión' }} />
            <Stack.Screen name="SavingsAdd" component={SavingsAdd} options={{ title: 'Agregar Ahorro' }} />
            <Stack.Screen name="SavingsConf" component={SavingsConf} options={{ title: 'Retirar Ahorro' }} />
            <Stack.Screen name="MySavingsWithdrawals" component={MySavingsWithdrawals} options={{ title: 'Configuración de Ahorro' }} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ title: 'Crear Nueva Cuenta' }} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Registrar Nuevo Gasto' }} />
            <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} options={{ title: 'Registro de Gastos' }} />
            <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: 'Actualizar Detalles' }} />
            <Stack.Screen
              name="GraphDetails"
              component={GraphDetails}
              options={{ title: 'Detalles de gastos' }}
            />
          </Stack.Navigator>
        </ButtonProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
