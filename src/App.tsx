import React from "react";
import "./App.css";
import CurrentNumber from "./CurrentNumber";
import Summarize from "./Summarize";
import { getDate } from "./utils";
import YourForecast from "./YourForecast";

function App() {
  const currentDate = getDate();

  return (
    <div className="App">
      {/* <h1>private forecast</h1> */}
      {/* <CurrentNumber /> */}
      <Summarize />
      <YourForecast />
    </div>
  );
}

export default App;
