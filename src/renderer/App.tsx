import { useRef } from 'react';
import SVG from 'react-inlinesvg';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import systemIcons from '@d2iq/ui-kit/dist/packages/icons/dist/system-icons-sprite.svg';
import productIcons from '@d2iq/ui-kit/dist/packages/icons/dist/product-icons-sprite.svg';
import { Navigator } from './components/Navigator';

export default function App() {
  const systemIconRef = useRef<SVGElement>(null);
  const productIconRef = useRef<SVGElement>(null);
  return (
    <div>
      <div
        style={{
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          visibility: 'hidden',
          width: 0,
        }}
      >
        <SVG innerRef={systemIconRef} src={systemIcons} />
        <SVG innerRef={productIconRef} src={productIcons} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigator />} />
        </Routes>
      </Router>
    </div>
  );
}