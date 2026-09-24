# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React frontend (Create React App, React 19, plain JavaScript) for the distributed task execution engine whose backend lives in the sibling directory `../distributed-task-execution-engine-backend` (Express 5 + Sequelize/MySQL, see its own `CLAUDE.md`). Built so far: the `Header` (title plus API-key selector) and `ApiKeyContext`; the rest of the layout below is still to do. Planned features:

- Form to submit new tasks with type, priority, and payload
- Cancel queued or running tasks
- Retry dead-lettered tasks
- Filter and search across all tasks

Backend is not 100% complete yet. First we will target to get a basic frontend setup up working before fixing the finer details of the backend

This will be a Single Page Application. Where we will have a header. In which we will have a Api-Key selector on the right far end.

This project will follow a dark design pattern.

The main component will have a container inside which there will be a task submit form and on the right side adjacent to it a Idle and running workers indicator.

Below the main component, there will be separate columns for Running, Queued, Failed, Dead, Completed Tasks

Running and Queued tasks will have Cancel Option.
Running Tasks will have a progress bar
Dead tasks will have a retry option
Failed tasks will display tasks that have been failed, but backend will automatically retry the failed tasks for maximum of 3 times before moving them to the dead queue. Need to figure out a way to alert user on the frontend that the failed task has been retired.

At the bottom, there will be a section where user can query tasks based on filters - status, type, startDate, endData, priority, type. This will display a horizontal list of tasks with a pagination component at the bottom.

Any ambiguity should be cleared before moving to write the actual code

## Commands

- `npm start` — dev server on http://localhost:3000 (the backend runs on port 3001 by default, so both can run together)
- `npm run build` — production build into `build/`
- `npm test` — Jest via react-scripts in interactive watch mode
- `npx react-scripts test --watchAll=false` — run the suite once (non-interactive)
- `npx react-scripts test --watchAll=false src/App.test.js` — run a single test file (append `-t "<name>"` to filter by test name)

Linting is ESLint's `react-app` config, built into react-scripts; warnings surface in the `npm start`/`npm run build` output — there is no separate lint script. Tests use React Testing Library, with `@testing-library/jest-dom` matchers loaded in `src/setupTests.js`.

## Frontend conventions

- Styling is Tailwind CSS v3 (CRA 5 picks up `tailwind.config.js` natively; v4 would need a PostCSS override CRA doesn't allow). The dark theme base lives in `src/index.css`. CRA only detects the Tailwind config when the dev server starts, so restart `npm start` if styles are missing.
- Don't use screen-reader-only markup: no `aria-*` attributes, explicit ARIA `role`s, or `sr-only` text. Plain semantic HTML (`<label htmlFor>`, `<button>`, headings, `<nav>`, lists) is fine. Tests query by visible text, labels, headings and native roles.
- Components live in `src/components/<Name>/index.jsx` with tests in `<Name>.test.js`; reusable helpers go in `src/utils/`.
- HTTP calls go through `src/services/api.js` (`get`, `post`, `put`, `patch` on an axios instance with `baseURL` from `REACT_APP_API_URL`). Each call resolves to the unwrapped `body` and rejects with `ApiError` (`message` from the backend, `status` undefined when the server is unreachable). Pass the key per call: `post('/task', data, { apiKey })`.
- The selected API key lives in `ApiKeyContext` (`src/context/ApiKeyContext.jsx`, `useApiKey()`), is chosen from the fixed list in `src/utils/apiKeys.js`, and is persisted to localStorage. Capture the key when a request is sent rather than reading it again when the response arrives (`POST /task` can stay open for a long time).

## Backend API contract

Base URL is the backend root (no `/api` prefix); CORS is open (`origin: '*'`). Every response is shaped `{ status, message, body? }` — unwrap `body` for data, and show `message` on errors (errors use the same shape with a non-2xx status).

- `POST /task` — body `{ type, priority, payload }`. Requires an `x-api-key` header, which is how the backend identifies the client (there are no user accounts). `type` is one of `image_processing` | `report_generation` (the enum in the backend's `src/database/models/task.model.js` is the source of truth); `priority` is an integer 1–5 (5 highest); `payload` is an arbitrary JSON object. Rate limited per API key (10/min by default → 429), and a fairness check can also return 429 if the client has too many high-priority tasks queued. **The request is held open until the task finishes executing** (the backend awaits the worker), so the UI should not block on it or assume a quick response.
- `GET /task` — query params `status`, `type`, `priority`, `startDate`, `endDate`, `page`, `limit` (default 10), all optional exact-match filters except the date range on `createdAt`. Returns `{ data: Task[], pagination: { totalCount, totalPages, currentPage } }`, ordered newest first. There is no free-text search param yet.
- `PATCH /task/cancel/:taskId` — requires `x-api-key`.

Task fields: `id` (UUID), `apiKey`, `type`, `priority`, `payload`, `status` (`queued` | `running` | `completed` | `cancelled` | `failed` | `dead`), `progress` (0–100), `retries`, `createdAt`, `updatedAt`. `dead` is the dead-letter state.

Not yet implemented on the backend: a retry endpoint for dead-lettered tasks, text search, and the planned SSE endpoint for live status/progress updates. Building those UI features will require backend changes in the sibling repo.

## Review

After creating or changing components, run the `ui-ux-reviewer` subagent (`.claude/agents/ui-ux-reviewer.md`). It reviews design, usability, accessibility, and backend-API compatibility, and reports findings without editing code.




## Vision for this project

Form to submit new tasks with type, priority, and payload
Cancel queued or running tasks
Retry dead-lettered tasks
Filter and search across all tasks
Submit a task with: type (string), priority (1–5, where 5 is highest), and payload (arbitrary JSON)
Cancel a running or queued task
Query tasks with filtering by status, priority, date range, and type — with pagination
SSE endpoint for real-time task status updates -clients subscribe and receive live updates as tasks
progress

