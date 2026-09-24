import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_API_KEY, isKnownApiKey } from '../utils/apiKeys';
import { readStorage, writeStorage } from '../utils/storage';

export const API_KEY_STORAGE_KEY = 'x-api-key';

const ApiKeyContext = createContext(null);

const getInitialApiKey = () => {
  const stored = readStorage(API_KEY_STORAGE_KEY);
  return isKnownApiKey(stored) ? stored : DEFAULT_API_KEY;
};

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(getInitialApiKey);

  useEffect(() => {
    writeStorage(API_KEY_STORAGE_KEY, apiKey);
  }, [apiKey]);

  return <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>{children}</ApiKeyContext.Provider>;
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
