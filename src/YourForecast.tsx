import React, { useEffect, useState } from "react";

import "./YourForecast.scss";

const LOCAL_STORAGE_KEY_NAME = "private-forecast-name";
const LOCAL_STORAGE_KEY_ID = "private-forecast-id";

const YourForecast = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [forecast, setForecast] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const name = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
    if (name) {
      setName(name);
    }
    const id = localStorage.getItem(LOCAL_STORAGE_KEY_ID);
    if (id && id !== "undefined") {
      setUserId(id);
    }
  }, []);

  const handleClick = async () => {
    if (!name) {
      return;
    }

    try {
      const url = "/api/forecast";
      const body = {
        id: userId,
        name: name,
        forecast: forecast,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.ok) {
        setError("");
        if (!userId) {
          localStorage.setItem(LOCAL_STORAGE_KEY_NAME, name);
          localStorage.setItem(LOCAL_STORAGE_KEY_ID, result.id);
          setUserId(result.id);
        }
      } else if (result.code === 3) {
        setError(result.msg);
        // set Focus to name
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError(err);

      console.log(">>", err);
      console.error(err);
    }
  };

  return (
    <div className="form">
      <h2>Meine Prognose</h2>
      <div className="inset">
        {error && <div>{error}</div>}
        <p>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="forecast">Neuinfektionen zum Vortag:</label>
          <input
            id="forecast"
            type="number"
            value={forecast}
            onChange={(e) => setForecast(parseInt(e.target.value))}
          />
        </p>
      </div>

      <div className="action">
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

export default YourForecast;
