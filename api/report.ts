import { NowRequest, NowResponse } from "@vercel/node";
import { createRankingWeek } from "./utils";
import { getFireStore } from "./utils";

const report = async (req: NowRequest, res: NowResponse) => {
  try {
    switch (req.method) {
      case "POST":
        await postReport(req, res);
        break;
      default:
        res.send(404).send(null);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

const postReport = async (req: NowRequest, res: NowResponse) => {
  const db = getFireStore();
  const result = await createRankingWeek(db);

  res.json(result);
};

export default report;
