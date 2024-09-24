/* eslint-disable prettier/prettier */
// HomeScreen.tsx

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FooterMenu from '../components/FooterMenu';
import PieChart from 'react-native-pie-chart';
import { getTransactionsByMonth } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';

const months = [
  { label: 'Ene', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Abr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Ago', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dic', value: 12 },
];

const years = [];
const currentYearValue = new Date().getFullYear();
for (let i = currentYearValue - 5; i <= currentYearValue + 5; i++) {
  years.push(i);
}

const HomeScreen: React.FC = ({ navigation }) => {
  const { setSelectedButton } = useButton();
  const { userId } = useContext(UserContext);
  const [chartData, setChartData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Enero es 0
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useFocusEffect(
    useCallback(() => {
      setSelectedButton('center');
      fetchData(currentMonth, currentYear); // Actualizar los datos al enfocar la pantalla
    }, [setSelectedButton, currentMonth, currentYear])
  );

  const fetchData = async (month, year) => {
    try {
      console.log(`Obteniendo datos para el gráfico de ${month}-${year}`);

      const transactions = await getTransactionsByMonth(userId, year, month);
      console.log('Transacciones obtenidas:', transactions);

      if (transactions.length === 0) {
        console.log('No hay transacciones para este mes.');
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

      console.log('Datos de categorías procesados:', categories);

      const data = Object.keys(categories).map((categoria_id) => ({
        value: categories[categoria_id],
        color: getColorForCategory(categoria_id),
        label: getLabelForCategory(categoria_id),
      }));

      console.log('Datos para el gráfico:', data);
      setChartData(data);
    } catch (error) {
      console.error('Error al cargar los datos para el gráfico:', error);
    }
  };

  useEffect(() => {
    fetchData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

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

  const openModal = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setModalVisible(true);
  };

  const confirmSelection = () => {
    setCurrentMonth(selectedMonth);
    setCurrentYear(selectedYear);
    setModalVisible(false);
    fetchData(selectedMonth, selectedYear);
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];
    return monthNames[monthNumber - 1];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal}>
        <Text style={styles.heading}>
          Gastos {getMonthName(currentMonth)} {currentYear}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccione Mes y Año</Text>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerWrapperMonth}>
                <Text style={styles.pickerLabel}>Mes</Text>
                <View style={styles.pickerInner}>
                  <Picker
                    key={`picker-month-${selectedMonth}`}
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    dropdownIconColor="#2C5FC2"
                  >
                    {months.map((month) => (
                      <Picker.Item
                        key={`${month.value}-${month.label}`}
                        label={month.label}
                        value={month.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.pickerWrapperYear}>
                <Text style={styles.pickerLabel}>Año</Text>
                <View style={styles.pickerInner}>
                  <Picker
                    key={`picker-year-${selectedYear}`}
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                    dropdownIconColor="#2C5FC2"
                  >
                    {years.map((year) => (
                      <Picker.Item
                        key={`year-${year}`}
                        label={year.toString()}
                        value={year}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSelection}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {chartData.length > 0 ? (
        <>
          <PieChart
            widthAndHeight={200}
            series={chartData.map((item) => item.value)}
            sliceColor={chartData.map((item) => item.color)}
            doughnut={false}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
          <ScrollView
            style={styles.legendScrollContainer}
            contentContainerStyle={styles.legendContainer}
          >
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.label}: {item.percentage}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.noDataText}>No hay datos para este mes</Text>
      )}
      <FooterMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos de la pantalla principal
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0056AD',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  // Estilos del modal y pickers
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%', // Ajusta el ancho según tus necesidades
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0056AD',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapperMonth: {
    flex: 1,
    marginHorizontal: 10,
  },
  pickerWrapperYear: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5FC2',
    marginBottom: 5,
    textAlign: 'center',
  },
  pickerInner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C5FC2',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#2C5FC2',
    ...Platform.select({
      android: {
        backgroundColor: 'transparent',
      },
    }),
  },
  modalButtons: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2C5FC2',
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos de la leyenda y gráfica
  legendScrollContainer: {
    maxHeight: 250, // Puedes ajustar la altura según tus necesidades
    width: '100%',
    marginTop: 60,
    backgroundColor: '#F0F8FF', // Fondo para distinguir del fondo general
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2C5FC2',
  },
  legendContainer: {
    alignItems: 'flex-start',
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
