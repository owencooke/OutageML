import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TestAPI = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  // Example fetch to get the customer list from the server/db
  useEffect(() => {
    fetch('http://localhost:8000/transformer/')
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
        console.log(customers);
      })
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold underline">
        Test fetch to django rest framework
      </div>
      {customers.map((transformer, i) => (
        <p key={i}>{transformer.coordinates}</p>
      ))}
      <p> {error} </p>
      <Link to="/" className="text-blue-700 underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default TestAPI;
