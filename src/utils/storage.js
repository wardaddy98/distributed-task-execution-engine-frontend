export const readStorage = (key, fallback = null) => {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
};
