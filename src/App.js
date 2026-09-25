import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import FilterTasks from './components/FilterTasks';
import TaskForm from './components/TaskForm';
import TasksSection from './components/TasksSection';
import WorkersIndicator from './components/WorkersIndicator';
import { ApiKeyProvider } from './context/ApiKeyContext';

function App() {
  return (
    <ApiKeyProvider>
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-3">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)] lg:items-start">
          <TaskForm />
          <WorkersIndicator/>
        </div>
        <TasksSection />
        <FilterTasks />
      </main>
      <ToastContainer position="top-right" theme="dark" />
    </ApiKeyProvider>
  );
}

export default App;
