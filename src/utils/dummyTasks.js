// TODO: remove once tasks are fetched from GET /task.
export const DUMMY_TASKS = [
  ['running', 62, 0],
  ['running', 18, 0],
  ['queued', 0, 0],
  ['queued', 0, 0],
  ['queued', 0, 0],
  ['failed', 40, 1],
  ['failed', 75, 2],
  ['dead', 80, 3],
  ['completed', 100, 0],
  ['completed', 100, 0],
].map(([status, progress, retries], index) => ({
  id: `${index}f3a9c2e-5b7d-4e1a-9c8b-2d6f0a1e3b4${index}`,
  type: index % 2 ? 'report_generation' : 'image_processing',
  priority: (index % 5) + 1,
  status,
  progress,
  retries,
  // Spread over several days so date filters have something to match.
  createdAt: new Date(Date.now() - index * 12 * 60 * 60 * 1000).toISOString(),
}));
