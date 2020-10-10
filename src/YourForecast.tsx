import React, { useEffect, useState } from "react";

import "./YourForecast.css";

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
    if (id && id != "undefined") {
      setUserId(id);
    }
  }, []);

  const handleClick = async () => {
    if (!name) {
      return;
    }

    try {
      const url = "/api/sendforecast";
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
      console.log(">>", result);
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, name);
      localStorage.setItem(LOCAL_STORAGE_KEY_ID, result.id);
      setUserId(result.id);
    } catch (err) {
      // setError(err.msg);
      console.error(err);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <div className="input">
        <h2>Your forcast</h2>

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input">
        <label htmlFor="forecast">Forecast:</label>
        <input
          id="forecast"
          type="number"
          value={forecast}
          onChange={(e) => setForecast(parseInt(e.target.value))}
        />
      </div>

      <button onClick={handleClick}>Send</button>
    </div>
  );
};

export default YourForecast;