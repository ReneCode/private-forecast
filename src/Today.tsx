import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { UserType } from "./utils";

import "./Today.scss";

type Props = {
  user: UserType;
  dateId: string;
  title: string;
  saveUser: (user: UserType) => void;
};
const YourForecast: React.FC<Props> = ({ user, dateId, title, saveUser }) => {
  const [name, setName] = useState("");
  const [forecast, setForecast] = useState(0);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

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

  const handleSend = async () => {
    if (!name) {
      return;
    }

    try {
      setSending(true);
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
      } else {
        switch (result.code) {
          case 3:
            setError("Name bereits verwendet - bitte anderen Namen wählen");
            // set Focus to name
            break;
          case 4:
            setError("Name nicht gefunden - bitte anderen Namen wählen");
            break;
          default:
            setError(`>> ${result.code} ${result.msg}`);
            break;
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setSending(false);
    }
  };

  let sendClass = "";
  if (sending) {
    sendClass = "disable";
  }
  let readonly = "";
  if (user.id) {
    readonly = "readonly";
  }

  return (
    <div className="form">
      <h3>{title}</h3>
      <div className="inset col2">
        {error && <div className="error">{error}</div>}
        <label htmlFor="name">Name:</label>
        <input
          readOnly={!!user.id}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="forecast">Prognose:</label>
        <input
          id="forecast"
          type="number"
          value={forecast}
          onChange={(e) => setForecast(parseInt(e.target.value))}
        />
      </div>

      <div className="action">
        <button className={sendClass} onClick={handleSend}>
          {sending && <Loading />}
          Senden
        </button>
      </div>
    </div>
  );
};

export default YourForecast;
