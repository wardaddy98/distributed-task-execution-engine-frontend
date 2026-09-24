import { AxiosError } from 'axios';
import { API_KEY_STORAGE_KEY } from '../context/ApiKeyContext';
import { client, get, patch, post, put } from './api';

let lastRequest;

// Stub the network: record the request and reply with the given status and data.
const respondWith = (status, data) => {
  client.defaults.adapter = async config => {
    lastRequest = config;
    const response = { data, status, statusText: '', headers: {}, config };
    if (status >= 400) {
      throw new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, null, response);
    }
    return response;
  };
};

beforeEach(() => {
  window.localStorage.clear();
  lastRequest = undefined;
  respondWith(200, { status: 200, message: 'ok', body: { id: 1 } });
});

test('sends x-api-key from localStorage when set', async () => {
  window.localStorage.setItem(API_KEY_STORAGE_KEY, 'tek_123');
  await get('/task');
  expect(lastRequest.headers['x-api-key']).toBe('tek_123');
});

test('omits x-api-key when none is stored', async () => {
  await get('/task');
  expect(lastRequest.headers['x-api-key']).toBeUndefined();
});

test('get sends query params', async () => {
  await get('/task', { status: 'queued', page: 2 });
  expect(lastRequest.method).toBe('get');
  expect(lastRequest.url).toBe('/task');
  expect(lastRequest.params).toEqual({ status: 'queued', page: 2 });
});

test.each([
  ['post', post],
  ['put', put],
  ['patch', patch],
])('%s sends the body with the right method', async (method, request) => {
  await request('/task', { type: 'image_processing' });
  expect(lastRequest.method).toBe(method);
  expect(JSON.parse(lastRequest.data)).toEqual({ type: 'image_processing' });
});

test('resolves to the full backend response, without unwrapping body', async () => {
  await expect(get('/task')).resolves.toEqual({ status: 200, message: 'ok', body: { id: 1 } });
});

test('rejects with the backend message on an error response', async () => {
  respondWith(429, { status: 429, message: 'Too many requests' });
  await expect(post('/task', {})).rejects.toThrow('Too many requests');
});
