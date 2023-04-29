import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test-page" element={<TestPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
