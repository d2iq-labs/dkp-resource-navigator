import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navigator } from './components/Navigator';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigator />} />
      </Routes>
    </Router>
  );
}
