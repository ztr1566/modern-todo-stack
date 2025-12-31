import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Today from './views/Today';
import Upcoming from './views/Upcoming';
import Projects from './views/Projects';

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/today" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;
