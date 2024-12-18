/* eslint-disable prettier/prettier */
//api.ts
import axios from 'axios';
import WebServiceParams from './WebServiceParams';

//Back local
//const API_URL = `http://${WebServiceParams.host}:${WebServiceParams.port}`;

//Google GCP
const API_URL = WebServiceParams.BASE_URL;

export const login = async (email, passw) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, passw });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error en el inicio de sesión');
    } else {
      throw new Error('Error en el inicio de sesión');
    }
  }
};

export const register = async (nombre, email, passw, salario) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { nombre, email, passw, salario });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error en la creación de cuenta');
    } else {
      throw new Error('Error en la creación de cuenta');
    }
  }
};

export const createGoal = async (usuario_id, monto, periodo, ahorro_programado) => {
  try {
    const response = await axios.post(`${API_URL}/metaFinanciera`, { usuario_id, monto, periodo, ahorro_programado });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la meta financiera');
  }
};

export const getGoal = async (usuario_id) => {
  try {
    const response = await axios.get(`${API_URL}/metaFinanciera/${usuario_id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la meta financiera', error);
    throw error;
  }
};

export const saveGoal = async (id, usuario_id, monto, periodo, ahorro_programado, timePeriod) => {
  try {
    const response = await axios.post(`${API_URL}/metaFinanciera`, {
      id,
      usuario_id,
      monto,
      periodo,
      ahorro_programado,
      timePeriod,
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar la meta financiera', error);
    throw error;
  }
};

export const updateSavings = async (id, ahorro_actual) => {
  try {
    const response = await axios.post(`${API_URL}/metaFinanciera/updateSavings`, { id, ahorro_actual });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el ahorro actual', error);
    throw error;
  }
};

export const deleteGoal = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/metaFinanciera/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la meta financiera');
  }
};

export const getTransactionsByDate = async (usuario_id, date) => {
  if (!date) {
    throw new Error("La fecha es undefined o está vacía.");
  }
  try {
    const response = await axios.get(`${API_URL}/transacciones/${usuario_id}/fecha/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las transacciones por fecha:', error);
    throw error;
  }
};


export const addTransaction = async (usuario_id, fecha, monto, categoria, tipo) => {
  try {
    const response = await axios.post(`${API_URL}/transacciones`, {
      usuario_id,
      fecha,
      monto,
      categoria,
      tipo,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const createTransaction = async (userId, categoryId, amount, type, date) => {
  try {
    const response = await axios.post(`${API_URL}/transacciones`, {
      usuario_id: userId,
      categoria_id: categoryId,
      monto: amount,
      tipo: type,
      fecha: date,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (id, transaction) => {
  try {
    // Formateamos la fecha antes de enviar la solicitud
    const formattedDate = new Date(transaction.fecha).toISOString().slice(0, 19).replace('T', ' ');
    transaction.fecha = formattedDate;

    const response = await axios.put(`${API_URL}/transacciones/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/transacciones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// obtener transacciones por mes para la grafica
export const getTransactionsByMonth = async (usuario_id, year, month) => {
  try {
    console.log(`Solicitando transacciones del mes ${month}-${year} para el usuario ${usuario_id}`);
    const response = await axios.get(`${API_URL}/transacciones/${usuario_id}/mes/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las transacciones por mes:', error);
    throw error;
  }
};

// Agrega esta función
export const getTransactionsByCategory = async (usuario_id, categoria_id, year, month) => {
  try {
    const response = await axios.get(`${API_URL}/transacciones/${usuario_id}/categoria/${categoria_id}/mes/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las transacciones por categoría:', error);
    throw error;
  }
};

// Obtener los detalles del usuario
export const getUserDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles del usuario:', error);
    throw error;
  }
};

// Crear un nuevo recordatorio
export const addReminder = async (reminder: {
  usuario_id: string;
  title: string;
  description: string;
  date: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/reminders`, reminder);
    return response.data;
  } catch (error) {
    console.error('Error al crear el recordatorio:', error);
    throw error; // Throw the entire error object for more detailed logging
  }
};

// Obtener recordatorios por usuario
export const getReminders = async (usuario_id: string) => {
  try {
    const response = await axios.get(`${API_URL}/reminders/${usuario_id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los recordatorios:', error);
    throw new Error('No se pudieron obtener los recordatorios.');
  }
};

// Actualizar un recordatorio existente
export const updateReminder = async (id: string, data: {
  title: string;
  cost: string;
  date: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/reminders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el recordatorio:', error);
    throw new Error('No se pudo actualizar el recordatorio.');
  }
};

// Eliminar un recordatorio
export const deleteReminder = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/reminders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el recordatorio:', error);
    throw new Error('No se pudo eliminar el recordatorio.');
  }
};