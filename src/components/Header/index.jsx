import { useId } from 'react';
import { useApiKey } from '../../context/ApiKeyContext';
import { API_KEYS } from '../../utils/apiKeys';

const Header = () => {
  const { apiKey, setApiKey } = useApiKey();
  const selectId = useId();
  const hintId = useId();

  return (
    <header className="z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur lg:sticky lg:top-0">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start lg:px-6">
        <div className="hidden lg:block" aria-hidden="true" />

        <h1 className="text-center text-xl font-semibold tracking-tight text-slate-50 lg:leading-10">
          Task Engine
        </h1>

        <div className="flex min-w-0 flex-col items-center gap-1 lg:items-end">
          <div className="flex w-full min-w-0 items-center justify-center gap-2 lg:justify-end">
            <label htmlFor={selectId} className="shrink-0 text-sm font-medium text-slate-300">
              API key
            </label>
            <select
              id={selectId}
              value={apiKey}
              aria-describedby={hintId}
              onChange={event => setApiKey(event.target.value)}
              className="min-h-10 w-full min-w-0 max-w-[15rem] truncate rounded-md border border-slate-500 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {API_KEYS.map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <p
            id={hintId}
            className="text-center text-xs text-slate-400 lg:whitespace-nowrap lg:text-right"
          >
            Sent as <code className="font-mono">x-api-key</code> with task requests
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
