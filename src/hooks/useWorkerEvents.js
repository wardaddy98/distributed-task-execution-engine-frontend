import { useEffect, useRef } from 'react';

//in this hook, i subscribe to sse endpoint GET /task/events and calls onTask with each updated task.
export const useWorkerEvents = onCountUpdate => {
  // Keep the latest handler without reopening the connection on every render bu using useRef to persist current value on re-renders
  const onCountUpdateRef = useRef(onCountUpdate);
  onCountUpdateRef.current = onCountUpdate;

  useEffect(() => {
    const source = new EventSource(`${process.env.REACT_APP_API_URL}/worker/events`);
    source.addEventListener('worker', event => onCountUpdateRef.current(JSON.parse(event.data)));
    return () => source.close();
  }, []);
};
