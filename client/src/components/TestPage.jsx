import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TestAPI = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  // Example fetch to get the customer list from the server/db
  useEffect(() => {
    fetch('http://localhost:8000/customer/')
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold underline">
        Test fetch to django rest framework
      </div>
      {customers.map(({ pk, name, email, created }) => (
        <p key={pk}>
          Customer name: {name}, email: {email}, created at: {created}
        </p>
      ))}
      <p> {error} </p>
      <Link to="/" className="text-blue-700 underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default TestAPI;
