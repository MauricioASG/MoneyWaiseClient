/* eslint-disable prettier/prettier */
// HomeScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import PieChart from 'react-native-pie-chart';
import { getTransactionsByMonth } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';

const HomeScreen: React.FC = ({ navigation }) => {
  const { setSelectedButton } = useButton();
  const { userId } = useContext(UserContext);
  const [chartData, setChartData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('center');

      const fetchData = async () => {
        try {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // Enero es 0, así que sumamos 1
          setCurrentMonth(month);
          setCurrentYear(year);
          console.log(`Obteniendo datos para el gráfico de ${month}-${year}`);
          
          const transactions = await getTransactionsByMonth(userId, year, month);
          console.log("Transacciones obtenidas:", transactions);

          if (transactions.length === 0) {
            console.log("No hay transacciones para este mes.");
            setChartData([]);
            return;
          }

          const categories = {};
          transactions.forEach((transaction) => {
            // Solo contabilizamos las categorías principales (1-12)
            if (transaction.categoria_id >= 1 && transaction.categoria_id <= 12) {
              if (!categories[transaction.categoria_id]) {
                categories[transaction.categoria_id] = 0;
              }
              categories[transaction.categoria_id] += parseFloat(transaction.monto);
            }
          });

          console.log("Datos de categorías procesados:", categories);

          const data = Object.keys(categories).map((categoria_id) => ({
            value: categories[categoria_id],
            color: getColorForCategory(categoria_id),
            label: getLabelForCategory(categoria_id),
          }));

          console.log("Datos para el gráfico:", data);
          setChartData(data);
        } catch (error) {
          console.error('Error al cargar los datos para el gráfico:', error);
        }
      };

      fetchData();
    }, [userId])
  );

  const getColorForCategory = (categoria_id) => {
    const colors = {
      1: '#c70039', // Vivienda
      2: '#008000', // Transporte
      3: '#808080', // Alimentación
      4: '#00CED4', // Salud
      5: '#FFD700', // Educación
      6: '#FF4500', // Entretenimiento
      7: '#FFA500', // Ropa y calzado
      8: '#9400D3', // Regalos
      9: '#FFD700', // Ahorro e inversión
      10: '#A52A2A', // Deudas
      11: '#696969', // Otros
      12: '#DAA520', // Mascotas
    };
    return colors[categoria_id] || '#000000';
  };

  const getLabelForCategory = (categoria_id) => {
    const labels = {
      1: 'Vivienda',
      2: 'Transporte',
      3: 'Alimentación',
      4: 'Salud',
      5: 'Educación',
      6: 'Entretenimiento',
      7: 'Ropa y calzado',
      8: 'Regalos',
      9: 'Ahorro e inversión',
      10: 'Deudas',
      11: 'Otros',
      12: 'Mascotas',
    };
    return labels[categoria_id] || 'Otro';
  };

  const calculatePercentages = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return chartData.map((item) => ({
      ...item,
      percentage: ((item.value / total) * 100).toFixed(2),
    }));
  };

  const dataWithPercentages = calculatePercentages();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Gráfica de gastos - {currentMonth}/{currentYear}
      </Text>
      {chartData.length > 0 ? (
        <PieChart
          widthAndHeight={200}
          series={chartData.map(item => item.value)}
          sliceColor={chartData.map(item => item.color)}
          doughnut={false}
          coverRadius={0.45}
          coverFill={'#FFF'}
        />
      ) : (
        <Text>No hay datos para este mes</Text>
      )}
      <View style={styles.legendContainer}>
        {dataWithPercentages.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}: {item.percentage}%</Text>
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
