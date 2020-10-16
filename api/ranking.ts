import { NowRequest, NowResponse } from "@vercel/node";
import {
  getFireStore,
  getHost,
  shiftDate,
  createReport,
  saveData,
  FACT_ID,
  loadData,
  RANKING_ID,
} from "./utils";

const fact = async (req: NowRequest, res: NowResponse) => {
  try {
    switch (req.method) {
      case "GET":
        await getRanking(req, res);
        break;
      default:
        res.send(404).send(null);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

const getRanking = async (req: NowRequest, res: NowResponse) => {
  const dateId = req.query.dateId as string;
  if (dateId) {
    const db = getFireStore();
    const doc = await loadData(db, dateId, RANKING_ID);
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } else {
    res.status(400).json(null);
  }
};

export default fact;
