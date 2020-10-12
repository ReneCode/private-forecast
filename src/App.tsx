import React from "react";
import "./App.css";
import CurrentNumber from "./CurrentNumber";
import YourForecast from "./YourForecast";

function App() {
  return (
    <div className="App">
      <h1>private forecast</h1>
      {/* <CurrentNumber /> */}
      <YourForecast />
    </div>
  );
}

export default App;
