// Parses text that must be a JSON object (not an array, null, or a primitive).
// Blank text counts as an empty object.
export const parseJsonObject = text => {
  if (text.trim() === '') return { value: {} };

  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    return { error: `Invalid JSON: ${error.message}` };
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { error: 'Payload must be a JSON object, e.g. { "key": "value" }' };
  }
  return { value };
};
