import axios from 'axios';
import { API_KEY_STORAGE_KEY } from '../context/ApiKeyContext';
import { readStorage } from '../utils/storage';

export const client = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Attach the currently selected client key (kept in localStorage by ApiKeyProvider).
client.interceptors.request.use(config => {
  const apiKey = readStorage(API_KEY_STORAGE_KEY);
  if (apiKey) config.headers['x-api-key'] = apiKey;
  return config;
});

// Resolve to the backend's full { status, message, body? }; surface its message on errors.
client.interceptors.response.use(
  response => response.data,
  error => Promise.reject(new Error(error.response?.data?.message ?? error.message)),
);

export const get = (url, params) => client.get(url, { params });
export const post = (url, data) => client.post(url, data);
export const put = (url, data) => client.put(url, data);
export const patch = (url, data) => client.patch(url, data);
