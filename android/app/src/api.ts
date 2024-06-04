/* eslint-disable prettier/prettier */
//api.ts
import axios from 'axios';
import WebServiceParams from './WebServiceParams';

const API_URL = `http://${WebServiceParams.host}:${WebServiceParams.port}`;

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

export const createTransaction = async (usuario_id, categoria, monto, tipo, fecha) => {
  try {
    const response = await axios.post(`${API_URL}/transacciones`, {
      usuario_id,
      categoria,
      monto,
      tipo,
      fecha,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error creating transaction');
  }
};