import { renderHook } from '@testing-library/react';
import { useTaskEvents } from './useTaskEvents';

const latestSource = () => EventSource.instances[EventSource.instances.length - 1];

test('opens the task events stream', () => {
  renderHook(() => useTaskEvents(() => {}));
  expect(EventSource.instances).toHaveLength(1);
  expect(latestSource().url).toBe(`${process.env.REACT_APP_API_URL}/task/events`);
});

test('calls the handler with each parsed task', () => {
  const onTask = jest.fn();
  renderHook(() => useTaskEvents(onTask));

  latestSource().emit('task', { id: '1', status: 'running' });
  expect(onTask).toHaveBeenCalledWith({ id: '1', status: 'running' });
});

test('keeps one connection across re-renders and uses the latest handler', () => {
  const first = jest.fn();
  const second = jest.fn();
  const { rerender } = renderHook(({ handler }) => useTaskEvents(handler), {
    initialProps: { handler: first },
  });

  rerender({ handler: second });
  latestSource().emit('task', { id: '1' });

  expect(EventSource.instances).toHaveLength(1);
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledWith({ id: '1' });
});

test('closes the connection on unmount', () => {
  const { unmount } = renderHook(() => useTaskEvents(() => {}));
  unmount();
  expect(latestSource().closed).toBe(true);
});
