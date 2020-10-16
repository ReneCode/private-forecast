import React, { useEffect, useState } from "react";

import { UserType } from "./utils";

type Props = {
  title: string;
  dateId: string;
  user: UserType;
};
const RealData: React.FC<Props> = ({ title, dateId, user }) => {
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
      <h2>{title}</h2>
      <div className="inset">
        <p>
          <label htmlFor="fact">Realität:</label>
          <input id="fact" readOnly type="number" value={fact} />
        </p>
        <p>
          <label htmlFor="fact">Meine Prognose:</label>
          <input id="fact" readOnly type="number" value={forecast} />
        </p>
      </div>
    </div>
  );
};

export default RealData;
