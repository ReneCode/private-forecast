import React, { useEffect, useState } from "react";

type Props = {
  dateId: string;
};
const RankingLastWeek: React.FC<Props> = ({ dateId }) => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const loadRanking = async () => {
      const query = new URLSearchParams({ dateId: dateId, type: "week" });
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
      <h3>Top - Letze 7 Tage</h3>
      <div className="inset col3">
        {ranking.map((line: any, idx: number) => {
          return (
            <React.Fragment key={idx}>
              <div>{line.rank}</div>
              <div>{line.name}</div>
              <div></div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RankingLastWeek;