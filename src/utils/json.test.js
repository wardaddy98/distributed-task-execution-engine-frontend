import { parseJsonObject } from './json';

test.each([
  ['', {}],
  ['   ', {}],
  ['{"a":1}', { a: 1 }],
  ['{"nested":{"b":[1]}}', { nested: { b: [1] } }],
])('parses %p as an object', (text, expected) => {
  expect(parseJsonObject(text)).toEqual({ value: expected });
});

test.each(['[]', 'null', '42', '"text"', 'true'])('rejects non-object JSON %p', text => {
  expect(parseJsonObject(text).error).toMatch(/must be a JSON object/);
});

test('reports a syntax error', () => {
  expect(parseJsonObject('{"a":').error).toMatch(/^Invalid JSON/);
});
