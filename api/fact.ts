import { NowRequest, NowResponse } from "@vercel/node";
import { rkiFetchDate, rkiGetDeath, rkiGetNr } from "./rkiFetch";
import {
  getFireStore,
  shiftDate,
  createRanking,
  saveData,
  FACT_ID,
  loadData,
  createRankingWeek,
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
  // let sNr = req.query.sNr as string;

  const rkiDate = await rkiFetchDate();

  const nr = await rkiGetNr();
  const death = await rkiGetDeath();

  if (!rkiDate) {
    res.status(400).send({ rkiDate });
    return;
  }

  const [_, day, month, year] = /(\d*)\.(\d*)\.(\d*)/.exec(rkiDate);
  // month is 0-based, 0=januar
  const dateOfData = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );
  const prevDate = shiftDate(dateOfData, -1);
  // month is 0-based, 0=januar
  const dateId = `${prevDate.getFullYear()}-${
    prevDate.getMonth() + 1
  }-${prevDate.getDate()}`;

  const stage = process.env.STAGE;

  const db = getFireStore();
  const { created } = await saveData(db, dateId, FACT_ID, {
    nr,
    death,
    stage,
    rkiDate,
  });

  if (created) {
    await createRanking(db, dateId, "nr");
    await createRanking(db, dateId, "death");
    // await createRankingWeek(db);
  }

  res.status(200).json({
    code: 0,
    stage,
    docId: dateId,
    nr,
    death,
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
      res.json({ nr: doc.nr, death: doc.death });
    } else {
      res.status(404).send(null);
    }
  } else {
    res.status(400).send(null);
  }
};

export default fact;
