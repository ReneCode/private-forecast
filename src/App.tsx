import React, { useEffect, useState } from "react";
import "./App.scss";
import Ranking from "./Ranking";
import RealData from "./RealData";
import {
  dateToDateId,
  getDate,
  loadUserFromLocalStorage,
  saveUserToLoacalStorage,
  UserType,
} from "./utils";
import YourForecast from "./YourForecast";
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
          Tippe die Gesamtzahl der Neuinfektionen für Deutschland. Daten von{" "}
          <a href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html">
            rki.de
          </a>
        </h3>
      </div>
      <YourForecast
        user={user}
        dateId={dateToDateId(getDate())}
        saveUser={(user) => onSaveUser(user)}
      />
      <RealData dateId={dateToDateId(getDate(-1))} title="Vortag" user={user} />
      <Ranking dateId={dateToDateId(getDate(-1))} />
    </div>
  );
}
export default App;
