import React, { useEffect, useState } from "react";
import "./App.scss";
import Yesterday from "./Yesterday";
import {
  dateToDateId,
  getDate,
  loadUserFromLocalStorage,
  saveUserToLoacalStorage,
  UserType,
} from "./utils";
import Today from "./Today";
import RankingYesterday from "./RankingYesterday";
import RankingLastWeek from "./RankingLastWeek";
function App() {
  const [user, setUser] = useState<UserType>((null as unknown) as UserType);
  useEffect(() => {
    const storedUser = loadUserFromLocalStorage();
    setUser(storedUser);
  }, []);
  const onSaveUser = (user: UserType) => {
    saveUserToLoacalStorage(user);
    setUser(user);
  };
  if (!user) {
    return <div>Loading ...</div>;
  }
  return (
    <div className="App">
      <div className="center">
        <h1>COVID-19 Private Prognose</h1>
        <h3>
          Tippe die Gesamtzahl der Neuinfektionen für Deutschland. Daten vom{" "}
          <a href="https://corona.rki.de">rki.de</a>
        </h3>
      </div>
      <Today
        user={user}
        title="Heute"
        dateId={dateToDateId(getDate())}
        saveUser={(user) => onSaveUser(user)}
      />
      <Yesterday
        dateId={dateToDateId(getDate(-1))}
        title="Gestern"
        user={user}
      />
      <RankingYesterday user={user} dateId={dateToDateId(getDate(-1))} />
      <RankingLastWeek user={user} dateId={dateToDateId(getDate(-1))} />
    </div>
  );
}
export default App;
