import React, { useEffect, useState } from "react";

const CurrentNumber = () => {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const readData = async () => {
      const url = "/api/grabhtml";
      const body = {
        url:
          "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html",
        regex: [
          "<p>Stand: (.*) \\(online aktualisiert.*",
          ".*Gesamt.*<\\/td>.*<strong>(.*)<\\/strong>.*<strong>(.*)<\\/strong>.*<strong>(.*)<\\/strong>.*<strong>(.*)<\\/strong>.*.*<strong>(.*)<\\/strong>.*<\\/tbody>",
        ],
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      setResult(result);
    };
    readData();
  }, []);

  if (result.length >= 6) {
    return (
      <div>
        <p>Date: {result[0]}</p>
        <p>All: {result[1]}</p>
        <p>Delta: {result[2]}</p>
      </div>
    );
  } else {
    return null;
  }
};

export default CurrentNumber;
