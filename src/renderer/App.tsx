import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { DeploymentsView } from './components/DeploymentView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeploymentsView />} />
      </Routes>
    </Router>
  );
}
