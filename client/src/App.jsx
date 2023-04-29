import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test-page" element={<TestPage />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
