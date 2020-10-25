import React, { useEffect, useState } from "react";

type Props = {
  dateId: string;
};
const Ranking: React.FC<Props> = ({ dateId }) => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const loadRanking = async () => {
      const query = new URLSearchParams({ dateId: dateId });
      const url = `/api/ranking?${query}`;
      const response = await fetch(url);
      if (response.ok) {
        const doc = await response.json();
        if (doc && doc.ranking) {
          setRanking(doc.ranking);
        }
      }
    };

    loadRanking();
  }, [dateId]);

  if (ranking.length === 0) {
    return null;
  }

  return (
    <div className="form">
      <h3>Top 100</h3>
      <div className="inset col3">
        {ranking.map((line: any, idx: number) => {
          return (
            <React.Fragment key={idx}>
              <div>{line.rank}</div>
              <div>{line.name}</div>
              <div className="right">{line.nr}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
