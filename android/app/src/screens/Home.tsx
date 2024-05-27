/* eslint-disable prettier/prettier */
// Home.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';
import PieChart from 'react-native-pie-chart';

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Schedule: undefined;
  Login: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { setSelectedButton } = useButton();

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('center');
    }, [setSelectedButton])
  );

  const data = [
    { value: 45, color: '#c70039', label: 'Prioritarios o fijos' },
    { value: 25, color: '#008000', label: 'Hormiga' },
    { value: 15, color: '#808080', label: 'Otros' },
    { value: 15, color: '#00CED4', label: 'Ahorro' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gráfica de gastos</Text>
      <PieChart
        widthAndHeight={200}
        series={data.map(item => item.value)}
        sliceColor={data.map(item => item.color)}
        doughnut={false}
        coverRadius={0.45}
        coverFill={'#FFF'}
      />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
      <FooterMenu navigation={navigation} />
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
  legendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
});

export default HomeScreen;
