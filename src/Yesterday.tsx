import React, { useEffect, useState } from "react";

import { UserType } from "./utils";

type ForecastType = {
  nr: number;
  death: number;
};

type Props = {
  title: string;
  dateId: string;
  user: UserType;
};
const Yesterday: React.FC<Props> = ({ title, dateId, user }) => {
  const [fact, setFact] = useState<ForecastType>({ death: 0, nr: 0 });
  const [forecast, setForecast] = useState<ForecastType>({ death: 0, nr: 0 });

  useEffect(() => {
    const loadFact = async () => {
      const query = new URLSearchParams({ dateId: dateId });
      const url = `/api/fact?${query}`;
      const response = await fetch(url);
      if (response.ok) {
        const doc: ForecastType = await response.json();
        console.log(">> fact", doc);
        if (doc) {
          setFact({ nr: doc?.nr, death: doc?.death });
        }
      }
    };

    const loadForecast = async () => {
      const query = new URLSearchParams({ dateId: dateId, userId: user.id });
      const url = `/api/forecast?${query}`;
      const response = await fetch(url);
      if (response.ok) {
        const doc: ForecastType = await response.json();
        console.log(">> forecast", doc);
        if (doc) {
          setForecast({ nr: doc.nr, death: doc?.death });
        }
      }
    };
    loadFact();
    loadForecast();
  }, [dateId, user]);

  return (
    <div className="form">
      <h3>{title}</h3>
      <div className="inset gridfr3">
        {/* <label></label>
        <div>Realität</div>
        <div>Prognose</div>
        <div>Infektionen:</div>
        <input readOnly type="number" value={fact.nr} />
        <input readOnly type="number" value={forecast.nr} />
        <div>Todesfälle:</div>
        <input readOnly type="number" value={fact.death} />
        <input readOnly type="number" value={forecast.death} /> */}

        <div></div>
        <div>Infektionen</div>
        <div>Todesfälle</div>
        <div>Realität:</div>
        <input readOnly type="number" value={fact.nr} />
        <input readOnly type="number" value={fact.death} />
        <div>Prognose:</div>
        <input readOnly type="number" value={forecast.nr} />
        <input readOnly type="number" value={forecast.death} />
      </div>
    </div>
  );
};

export default Yesterday;
