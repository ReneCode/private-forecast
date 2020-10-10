import { NowRequest, NowResponse } from "@vercel/node";
import { getDateNow, getFireStore, getHost, storeFact } from "./utils";
import fetch from "node-fetch";

const updateFact = async (req: NowRequest, res: NowResponse) => {
  try {
    const apiUrl = getHost();
    const url = `${apiUrl}/api/grabhtml`;
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
    // take date
    const docId = getDateNow(-1);

    const date = result[0];
    const [_, day, month, year] = /(\d*)\.(\d*)\.(\d*)/.exec(date);
    const updateDate = `${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`;
    // take delta
    const delta = result[2].replace("+", "").replace(".", "");
    const nr = parseInt(delta);

    const db = getFireStore();
    await storeFact(db, docId, { nr, updateDate });

    res.status(200).json({ code: 0, docId, nr, msg: "ok" });
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

export default updateFact;
