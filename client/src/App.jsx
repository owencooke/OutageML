import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  // Example fetch to get the customer list from the server/db
  useEffect(() => {
    fetch('http://localhost:8000/customer/')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="text-3xl font-bold underline">
          Test fetch to django rest framework
        </div>
        {customers.map(({ pk, name, email, created }) => (
          <p key={pk}>
            Customer name: {name}, email: {email}, created at: {created}
          </p>
        ))}
        <p> {error} </p>
      </header>
    </div>
  );
}

export default App;
