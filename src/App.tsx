import React, { useEffect, useState } from "react";
import "./App.scss";
import CurrentNumber from "./CurrentNumber";
import Summarize from "./Summarize";
import { dateToDateId, getDate } from "./utils";
import YourForecast from "./YourForecast";

function App() {
  const [user, setUser] = useState({ id: "", name: "" });

  useEffect(() => {});

  return (
    <div className="App">
      {/* <h1>private forecast</h1> */}
      {/* <CurrentNumber /> */}
      <YourForecast />
      <Summarize dateId={dateToDateId(getDate(-1))} title="Vortag" />
    </div>
  );
}

export default App;
