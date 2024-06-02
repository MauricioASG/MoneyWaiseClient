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
