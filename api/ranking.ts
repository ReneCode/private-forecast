import { NowRequest, NowResponse } from "@vercel/node";
import { getFireStore, getRankingId, loadData } from "./utils";

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
  const type = req.query.type;
  if (dateId) {
    const db = getFireStore();
    let id: string = getRankingId(type);
    const doc = await loadData(db, dateId, id);
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
