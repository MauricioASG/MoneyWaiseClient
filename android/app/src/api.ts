/* eslint-disable prettier/prettier */
import axios from 'axios';
import WebServiceParams from './WebServiceParams';

const API_URL = `http://${WebServiceParams.host}:${WebServiceParams.port}`;

export const login = async (email: string, passw: string) => {
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

export const register = async (nombre: string, email: string, passw: string, salario: number) => {
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

export const createGoal = async (usuario_id: number, monto: number, periodo: string, ahorro_programado: number) => {
  try {
    const response = await axios.post(`${API_URL}/metaFinanciera`, { usuario_id, monto, periodo, ahorro_programado });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la meta financiera');
  }
};

export const getGoal = async (usuario_id: number) => {
  try {
    const response = await axios.get(`${API_URL}/metaFinanciera/${usuario_id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la meta financiera', error);
    throw error;
  }
};

export const saveGoal = async (usuario_id: number, monto: number, periodo: string, ahorro_programado: number) => {
  try {
    const response = await axios.post(`${API_URL}/metaFinanciera`, {
      usuario_id,
      monto,
      periodo,
      ahorro_programado
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar la meta financiera', error);
    throw error;
  }
};

export const updateGoal = async (id: number, monto: number, periodo: string, ahorro_programado: number) => {
  try {
    const response = await axios.put(`${API_URL}/metaFinanciera`, { id, monto, periodo, ahorro_programado });
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar la meta financiera');
  }
};

export const deleteGoal = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/metaFinanciera/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la meta financiera');
  }
};
