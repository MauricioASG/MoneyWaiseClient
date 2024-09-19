/* eslint-disable prettier/prettier */
// HomeScreen.tsx
/* eslint-disable prettier/prettier */
// HomeScreen.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FooterMenu from '../components/FooterMenu';
import PieChart from 'react-native-pie-chart';
import { getTransactionsByMonth } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';
import MonthPicker from 'react-native-month-year-picker';

const HomeScreen: React.FC = ({ navigation }) => {
  const { setSelectedButton } = useButton();
  const { userId } = useContext(UserContext);
  const [chartData, setChartData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Enero es 0
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedButton('center');
    }, [setSelectedButton])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Obteniendo datos para el gráfico de ${currentMonth}-${currentYear}`);
        
        const transactions = await getTransactionsByMonth(userId, currentYear, currentMonth);
        console.log("Transacciones obtenidas:", transactions);

        if (transactions.length === 0) {
          console.log("No hay transacciones para este mes.");
          setChartData([]);
          return;
        }

        const categories = {};
        transactions.forEach((transaction) => {
          if (!categories[transaction.categoria_id]) {
            categories[transaction.categoria_id] = 0;
          }
          categories[transaction.categoria_id] += parseFloat(transaction.monto);
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
  }, [userId, currentMonth, currentYear]);

  const getColorForCategory = (categoria_id) => {
    const colors = {
      1: '#c70039',
      2: '#008000',
      3: '#808080',
      4: '#00CED4',
      5: '#FFD700',
      6: '#FF4500',
      7: '#800080',
      8: '#FFA500',
      9: '#0000FF',
      10: '#A52A2A',
      11: '#708090',
      12: '#D2691E',
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

  const showPicker = () => {
    setShowMonthPicker(true);
  };

  const onValueChange = (event, newDate) => {
    setShowMonthPicker(false);
    if (newDate) {
      const selectedDate = newDate;
      setCurrentMonth(selectedDate.getMonth() + 1); // Enero es 0
      setCurrentYear(selectedDate.getFullYear());
    }
  };

  // Función para obtener el nombre del mes
  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return months[monthNumber - 1];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPicker}>
        <Text style={styles.heading}>
          Gráfica de gastos {getMonthName(currentMonth)} {currentYear}
        </Text>
      </TouchableOpacity>
      {showMonthPicker && (
        <MonthPicker
          onChange={onValueChange}
          value={new Date(currentYear, currentMonth - 1)}
          minimumDate={new Date(2000, 0)}
          maximumDate={new Date(2100, 11)}
          locale="es"
          cancelButton="Cancelar"
          okButton="Aceptar"
        />
      )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
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
    fontSize: 18,
    color: '#000000',
  },
});

export default HomeScreen;

