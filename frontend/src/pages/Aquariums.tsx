import React, { useState, useEffect } from 'react';
import { getUser } from '../services/AuthServices';

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  // Check if the user is logged in by looking for user data in localStorage
  useEffect(() => {
    const storedUserName = getUser();
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div>
      {userName ? <h1>Hello, {userName}!</h1> : <h1>Welcome to the homepage!</h1>}
    </div>
  );
};

export default Aquariums;
