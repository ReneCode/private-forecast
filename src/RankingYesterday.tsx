import React, { useEffect, useState } from "react";
import { UserType } from "./utils";

type Props = {
  dateId: string;
  user: UserType;
};
const RankingYesterday: React.FC<Props> = ({ user, dateId }) => {
  const [ranking, setRanking] = useState({
    nr: [],
    death: [],
  });

  useEffect(() => {
    const loadRanking = async (dataProp: "nr" | "death") => {
      const query = new URLSearchParams({ dateId: dateId, dataProp: dataProp });
      const url = `/api/ranking?${query}`;
      const response = await fetch(url);
      if (response.ok) {
        const doc = await response.json();
        if (doc && doc.ranking) {
          setRanking((state) => {
            switch (dataProp) {
              case "nr":
                return { ...state, nr: doc.ranking };
              case "death":
                return { ...state, death: doc.ranking };
            }
          });
        }
      }
    };

    loadRanking("nr");
    loadRanking("death");
  }, [dateId]);

  if (ranking.nr.length === 0) {
    return null;
  }

  return (
    <div className="form">
      <h3>Top - Gestern</h3>
      <div className="inset grid-ranking">
        <div>Infektionen</div>
        <div></div>
        <div></div>
        <div>Todesfälle</div>
        <div></div>

        {ranking.nr.map((line: any, idx: number) => {
          const nrRank =
            ranking.nr.length > 0
              ? ranking.nr[idx]
              : { name: "", nr: "", id: "" };
          const deathRank =
            ranking.death.length > 0
              ? ranking.death[idx]
              : { name: "", death: "", id: "" };
          let nrClassName = nrRank.id === user.id ? "selected" : "";
          let deathClassName = deathRank.id === user.id ? "selected" : "";
          return (
            <React.Fragment key={idx}>
              {/* <div className={className}>{n.rank}</div> */}
              <div className={nrClassName}>{nrRank.name}</div>
              <div className={`${nrClassName} right`}>{nrRank.nr}</div>
              <div></div>
              <div className={deathClassName}>{deathRank.name}</div>
              <div className={`${deathClassName} right`}>{deathRank.death}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RankingYesterday;
