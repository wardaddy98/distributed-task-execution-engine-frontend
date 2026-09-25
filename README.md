Task Execution Engine - Frontend

A single page app created with Create React App, styled with Tailwind CSS, with its own reusable components (such as Button and Pagination). It follows a dark theme and works on mobile.


ApiKeyContext

A context that wraps the whole app. It stores the x-api-key that the user selects from the dropdown in the header. The backend has no user accounts; the api key is how it knows which client sent a request. The dropdown has 10 fixed keys, so you can act as different clients.

When a key is selected, it is also saved in local storage at the same time. This way the last used key is still selected after a page reload.


src/service/api.js

Exports get, post, put and patch functions built with axios. All requests go to the backend URL set in .env (REACT_APP_API_URL).

An axios interceptor runs before every request. If an x-api-key is saved in local storage, it adds it to the request headers. We read it from local storage instead of the context because this file is not a React component, so it can't use the context.

If a request fails, the error message sent by the backend is passed on, so it can be shown to the user.


Messages

Error and success messages are shown as pop-ups using react-toastify.


Hooks

useTaskEvents - creates a new EventSource and connects to the /task/events SSE endpoint to receive task updates. The connection stays open while the component is on the screen and is closed when it is removed.

useWorkerEvents - creates a new EventSource and connects to the /worker/events SSE endpoint to receive worker updates (total, idle and busy counts).

Both hooks keep a single connection open, even when the component re-renders.


Main components

Header - shows the app title and the api key dropdown.

TaskForm - lets the user choose a type and priority, enter a payload (JSON), and submit the task. Type and priority are required. The payload is optional and defaults to {}. The new task shows up on the board through the live updates, not from the submit response.

WorkersIndicator - shows the total, idle and busy workers. It uses the useWorkerEvents hook, so the numbers update live.

TasksSection - shows all tasks in separate columns by status: running, queued, failed, dead, completed and cancelled. When the page loads, it fetches all tasks once. After that, it uses the useTaskEvents hook: when a task update arrives, the task is replaced in the list (or added if it's new), so cards move between columns on their own. Each task is shown as a TaskCard.

TaskCard - shows a task's priority, short id, created time and type. Running tasks show a progress bar and a Cancel button. Queued tasks show a Cancel button. Failed tasks show which retry attempt they are on. Dead tasks show a Retry button.

FilterTasks - lets the user choose filters (status, type, priority, start date, end date) and get the matching tasks, one page at a time. Clicking Apply fetches page 1 with the chosen filters. Clicking Previous or Next changes the page and fetches that page. Results are shown with FilteredTaskItem cards and the Pagination component.


Running the project

Set the backend URL in .env: REACT_APP_API_URL=http://localhost:3001
npm install
npm start (runs on http://localhost:3000)
npm run build (creates a production build)

