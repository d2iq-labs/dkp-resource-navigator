import { Deployment } from 'models/deployments';
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

const KubernetesPodView = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const getDeployments = () => {
    window.electron.ipcRenderer.requestDeployments();
  };

  useEffect(() => {
    const fetchDeployments = async () => {
      window.electron.ipcRenderer.receiveDeployments((data: Deployment[]) => {
        setDeployments(data ?? []);
      });
    };
    fetchDeployments();
  }, []);

  return (
    <div>
      <button type="button" onClick={getDeployments}>
        Get Deployments
      </button>
      {deployments.map((resource) => (
        <div key={resource.name}>{resource.name}</div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KubernetesPodView />} />
      </Routes>
    </Router>
  );
}
