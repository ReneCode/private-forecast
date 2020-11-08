import React, { useEffect, useState } from "react";
import { UserType } from "./utils";

type Props = {
  dateId: string;
  user: UserType;
};
const RankingLastWeek: React.FC<Props> = ({ user, dateId }) => {
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
          let className = line.id === user.id ? "selected" : "";

          return (
            <React.Fragment key={idx}>
              <div className={className}>{line.rank}</div>
              <div className={className}>{line.name}</div>
              <div className={className}></div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RankingLastWeek;
