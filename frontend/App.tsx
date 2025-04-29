import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import GeoMapPage from './pages/GeoMapPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<GeoMapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;