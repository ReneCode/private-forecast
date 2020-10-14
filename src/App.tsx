import React, { useEffect, useState } from "react";
import "./App.scss";
import CurrentNumber from "./CurrentNumber";
import Summarize from "./Summarize";
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
      {/* <h1>private forecast</h1> */}
      {/* <CurrentNumber /> */}
      <YourForecast user={user} saveUser={(user) => onSaveUser(user)} />
      <Summarize
        dateId={dateToDateId(getDate(-1))}
        title="Vortag"
        user={user}
      />
    </div>
  );
}

export default App;
