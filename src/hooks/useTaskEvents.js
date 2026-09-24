import { useEffect, useRef } from 'react';

//in this hook, i subscribe to sse endpoint GET /task/events and calls onTask with each updated task.
export const useTaskEvents = onTask => {
  // Keep the latest handler without reopening the connection on every render bu using useRef to persist current value on re-renders
  const onTaskRef = useRef(onTask);
  onTaskRef.current = onTask;

  useEffect(() => {
    const source = new EventSource(`${process.env.REACT_APP_API_URL}/task/events`);
    source.addEventListener('task', event => onTaskRef.current(JSON.parse(event.data)));
    return () => source.close();
  }, []);
};
