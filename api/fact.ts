import { NowRequest, NowResponse } from "@vercel/node";
import { getFireStore, getHost, shiftDate, createFact } from "./utils";
import fetch from "node-fetch";

const fact = async (req: NowRequest, res: NowResponse) => {
  try {
    console.log(">>", req.method);
    if (req.method !== "POST") {
      res.status(404).send("");
      return;
    }

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

    // take date from website
    // "17.10.2020"
    // store as previous day => "2020-10-16"
    const rkiDate = result[0];
    const [_, day, month, year] = /(\d*)\.(\d*)\.(\d*)/.exec(rkiDate);
    const dateOfData = new Date(parseInt(year), parseInt(month), parseInt(day));
    const prevDate = shiftDate(dateOfData, -1);
    const docId = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

    // take nr from website
    const delta = result[2].replace("+", "").replace(".", "");
    const nr = parseInt(delta);

    const stage = process.env.STAGE;

    const db = getFireStore();
    const created = await createFact(db, docId, {
      nr,
      stage,
      rkiDate: rkiDate,
    });

    res.status(200).json({
      code: 0,
      stage,
      docId,
      nr,
      rkiDate,
      msg: "ok",
      created,
    });
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

export default fact;
