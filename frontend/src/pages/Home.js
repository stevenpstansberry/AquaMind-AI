import { healthCheck } from "../services/APIServices";
import React, { useState, useEffect } from "react";

function Home() {
  const [healthState, setHealthState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthState = async () => {
      try {
        const response = await healthCheck();
        setHealthState(response);
      } catch (err) {
        console.error("Error fetching health status:", err);
        setError("Failed to fetch health status");
      }
    };

    fetchHealthState();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <p>
          Health Status:{" "}
          {healthState ? JSON.stringify(healthState) : "Loading..."}
        </p>
      )}
    </div>
  );
}

export default Home;
