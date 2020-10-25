import React, { useEffect, useState } from "react";

import { UserType } from "./utils";

type Props = {
  title: string;
  dateId: string;
  user: UserType;
};
const Yesterday: React.FC<Props> = ({ title, dateId, user }) => {
  const [fact, setFact] = useState(0);
  const [forecast, setForecast] = useState(0);

  useEffect(() => {
    const loadFact = async () => {
      const query = new URLSearchParams({ dateId: dateId });
      const url = `/api/fact?${query}`;
      const response = await fetch(url);
      if (response.ok) {
        const doc = await response.json();
        if (doc && doc.nr) {
          setFact(doc.nr);
        }
      }
    };

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
    loadFact();
    loadForecast();
  }, [dateId, user]);

  return (
    <div className="form">
      <h3>{title}</h3>
      <div className="inset col2">
        <label htmlFor="fact">Realität:</label>
        <input id="fact" readOnly type="number" value={fact} />
        <label htmlFor="fact">Prognose:</label>
        <input id="fact" readOnly type="number" value={forecast} />
      </div>
    </div>
  );
};

export default Yesterday;
