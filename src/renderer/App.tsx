import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ResourcesView } from './components/ResourcesView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResourcesView />} />
      </Routes>
    </Router>
  );
}
