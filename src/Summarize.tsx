import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  dateId: string;
};
const Summarize: React.FC<Props> = ({ title, dateId }) => {
  const [fact, setFact] = useState(0);
  useEffect(() => {
    const loadFact = async () => {
      const query = new URLSearchParams({ dateId: dateId });
      const url = `/api/fact?${query}`;
      const response = await fetch(url);
      const doc = await response.json();
      if (doc && doc.nr) {
        setFact(doc.nr);
      }
    };

    const loadForecast = async () => {};
    loadFact();
    loadForecast();
  });

  return (
    <div className="form">
      <h2>{title}</h2>
      <div className="inset">
        <p>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" value={dateId} />
        </p>
        <p>
          <label htmlFor="fact">Realität:</label>
          <input id="fact" type="number" value={fact} />
        </p>
      </div>
    </div>
  );
};

export default Summarize;
