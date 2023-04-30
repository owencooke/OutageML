import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="w-screen h-screen no-scrollbar">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test-page" element={<TestPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
