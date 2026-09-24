// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom has no EventSource. This fake records instances so tests can push server events.
class FakeEventSource {
  static instances = [];

  constructor(url) {
    this.url = url;
    this.listeners = {};
    this.closed = false;
    FakeEventSource.instances.push(this);
  }

  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }

  close() {
    this.closed = true;
  }

  emit(type, data) {
    (this.listeners[type] || []).forEach(listener => listener({ data: JSON.stringify(data) }));
  }
}

global.EventSource = FakeEventSource;

beforeEach(() => {
  FakeEventSource.instances = [];
});
