import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FooterMenu from '../components/FooterMenu';
import PieChart from 'react-native-pie-chart';
import { getTransactionsByMonth } from '../api';
import { UserContext } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useButton } from '../contexts/FooterMenuContext';

// Definir la constante de los meses
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

// Definir los años que se mostrarán en el picker
const years = [];
const currentYearValue = new Date().getFullYear();
for (let i = currentYearValue - 5; i <= currentYearValue + 5; i++) {
  years.push(i);
}

const HomeScreen: React.FC = ({ navigation }) => {
  const { setSelectedButton } = useButton();
  const { userId } = useContext(UserContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
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
    setLoading(true); // Mostrar indicador de carga
    try {
      console.log(`Obteniendo datos para el gráfico de ${month}-${year}`);

      const transactions = await getTransactionsByMonth(userId, year, month);
      console.log('Transacciones obtenidas:', transactions);

      if (transactions.length === 0) {
        console.log('No hay transacciones para este mes.');
        setChartData([]);
        setLoading(false); // Ocultar indicador de carga
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
        categoria_id: parseInt(categoria_id), // Aseguramos que sea un número
        value: categories[categoria_id],
        color: getColorForCategory(categoria_id),
        label: getLabelForCategory(categoria_id),
      }));

      console.log('Datos para el gráfico:', data);
      setChartData(data);
      setLoading(false); // Ocultar indicador de carga
    } catch (error) {
      console.error('Error al cargar los datos para el gráfico:', error);
      setLoading(false); // Ocultar indicador de carga en caso de error
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
      categoria_id: item.categoria_id, // Aseguramos que categoria_id esté incluido
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
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return monthNames[monthNumber - 1];
  };

  const handleLegendItemPress = (categoria_id, label) => {
    navigation.navigate('GraphDetails', {
      categoria_id,
      label,
      month: currentMonth,
      year: currentYear,
    });
  };

  // Navegar a la pantalla de configuración del usuario
  const navigateToUserSettings = () => {
    navigation.navigate('UserSettingsScreen');
  };

  return (
    <View style={styles.container}>
      {/* Imagen de configuración en la esquina superior derecha */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={navigateToUserSettings}
      >
        <Image
          source={require('../assets/UserSettingsLogo.jpg')}
          style={styles.settingsImage}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={openModal}>
        <Text style={styles.heading}>
          {getMonthName(currentMonth)} {currentYear}
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

      {loading ? (
        <ActivityIndicator size="large" color="#0073AB" />
      ) : chartData.length > 0 ? (
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
              <TouchableOpacity
                key={index}
                style={styles.legendItem}
                onPress={() => handleLegendItemPress(item.categoria_id, item.label)}
              >
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.label}: {item.percentage}% (${item.value.toFixed(2)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <Image source={require('../assets/NoDataYet.jpg')} style={styles.noDataImage} />
      )}
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
    backgroundColor: '#FFFFFF',
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10, // Posicionar en la esquina superior derecha
    zIndex: 1, // Asegura que esté por encima de otros componentes
  },
  settingsImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0056AD',
    textAlign: 'center',
  },
  noDataImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 100,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%', 
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
  legendScrollContainer: {
    maxHeight: 250,
    width: '100%',
    marginTop: 60,
    backgroundColor: '#F0F8FF', 
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
    fontSize: 16,
    color: '#000000',
  },
});
 
export default HomeScreen;
