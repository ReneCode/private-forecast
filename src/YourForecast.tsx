import React, { useEffect, useState } from "react";
import { UserType } from "./utils";

import "./YourForecast.scss";

type Props = {
  user: UserType;
  dateId: string;
  saveUser: (user: UserType) => void;
};
const YourForecast: React.FC<Props> = ({ user, dateId, saveUser }) => {
  const [name, setName] = useState("");
  const [forecast, setForecast] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (dateId && user.id) {
      const loadForecast = async () => {
        const query = new URLSearchParams({ dateId: dateId, userId: user.id });
        const url = `/api/forecast?${query}`;
        const response = await fetch(url);
        if (response.ok) {
          const doc = await response.json();
          if (doc && doc.nr) {
            setForecast(doc.nr);
          }
        }
      };
      loadForecast();
    }
  }, [dateId, user]);

  useEffect(() => {
    setName(user.name);
  }, [user]);

  const handleClick = async () => {
    if (!name) {
      return;
    }

    try {
      const url = "/api/forecast";
      const body = {
        id: user.id,
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
        if (!user.id) {
          saveUser({ id: result.id, name: name });
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
