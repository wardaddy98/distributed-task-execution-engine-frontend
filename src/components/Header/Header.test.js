import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '.';
import { API_KEY_STORAGE_KEY, ApiKeyProvider, useApiKey } from '../../context/ApiKeyContext';
import { API_KEYS, DEFAULT_API_KEY } from '../../utils/apiKeys';

const CurrentKey = () => <output data-testid="current-key">{useApiKey().apiKey}</output>;

const renderHeader = () =>
  render(
    <ApiKeyProvider>
      <Header />
      <CurrentKey />
    </ApiKeyProvider>,
  );

const getKeySelect = () => screen.getByRole('combobox', { name: 'API key' });

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the Task Engine heading inside a banner', () => {
  renderHeader();
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Task Engine' })).toBeInTheDocument();
});

test('offers the 10 predefined API keys, defaulting to the first', () => {
  renderHeader();
  expect(screen.getAllByRole('option')).toHaveLength(10);
  expect(getKeySelect()).toHaveValue(DEFAULT_API_KEY);
});

test('describes how the selected key is used', () => {
  renderHeader();
  expect(getKeySelect()).toHaveAccessibleDescription(
    'Sent as x-api-key with task requests',
  );
});

test('selecting a key updates the shared context and persists it', () => {
  renderHeader();
  userEvent.selectOptions(getKeySelect(), API_KEYS[3]);

  expect(screen.getByTestId('current-key')).toHaveTextContent(API_KEYS[3]);
  expect(window.localStorage.getItem(API_KEY_STORAGE_KEY)).toBe(API_KEYS[3]);
});

test('restores a previously selected key from storage', () => {
  window.localStorage.setItem(API_KEY_STORAGE_KEY, API_KEYS[5]);
  renderHeader();
  expect(getKeySelect()).toHaveValue(API_KEYS[5]);
});

test('ignores an unknown stored key and falls back to the default', () => {
  window.localStorage.setItem(API_KEY_STORAGE_KEY, 'not-a-real-key');
  renderHeader();
  expect(getKeySelect()).toHaveValue(DEFAULT_API_KEY);
});

test('labels each option with the full API key', () => {
  renderHeader();
  API_KEYS.forEach(key => {
    expect(screen.getByRole('option', { name: key })).toHaveValue(key);
  });
});
