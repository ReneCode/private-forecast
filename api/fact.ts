import { NowRequest, NowResponse } from "@vercel/node";
import { rkiFetchDate, rkiGetNeuerFall } from "./rkiFetch";
import {
  getFireStore,
  shiftDate,
  createReport,
  saveData,
  FACT_ID,
  loadData,
} from "./utils";

const fact = async (req: NowRequest, res: NowResponse) => {
  try {
    switch (req.method) {
      case "POST":
        await postFact(req, res);
        break;
      case "GET":
        await getFact(req, res);
        break;
      default:
        res.send(404).send(null);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

const postFact = async (req: NowRequest, res: NowResponse) => {
  /*  
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
  const dateId = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

  // take nr from website
  const delta = result[2].replace("+", "").replace(".", "");
  const nr = parseInt(delta);
*/

  // let { rkiDate, sNr } = req.body;

  const rkiDate = await rkiFetchDate();
  const sNr = await rkiGetNeuerFall();

  if (!rkiDate || !sNr) {
    res.status(400).send({ rkiDate, sNr });
    return;
  }

  const [_, day, month, year] = /(\d*)\.(\d*)\.(\d*)/.exec(rkiDate);
  const dateOfData = new Date(parseInt(year), parseInt(month), parseInt(day));
  const prevDate = shiftDate(dateOfData, -1);
  const dateId = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

  const nr = parseInt(sNr);

  const stage = process.env.STAGE;

  const db = getFireStore();
  const { created } = await saveData(db, dateId, FACT_ID, {
    nr,
    stage,
    rkiDate,
  });

  if (created) {
    await createReport(db, dateId, nr);
  }

  res.status(200).json({
    code: 0,
    stage,
    docId: dateId,
    nr,
    rkiDate,
    msg: "ok",
    created,
  });
};

const getFact = async (req: NowRequest, res: NowResponse) => {
  const dateId = req.query.dateId as string;
  if (dateId) {
    const db = getFireStore();
    const doc = await loadData(db, dateId, FACT_ID);
    if (doc) {
      res.json({ nr: doc.nr });
    } else {
      res.status(404).send(null);
    }
  } else {
    res.status(400).send(null);
  }
};

export default fact;
