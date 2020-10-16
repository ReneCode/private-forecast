import { NowRequest, NowResponse } from "@vercel/node";
import { createReport } from "./utils";
import { getFireStore } from "./utils";

const report = async (req: NowRequest, res: NowResponse) => {
  const dateId = req.query.dateId as string;

  const nr = parseInt(req.query.nr as string);
  const db = getFireStore();

  const result = await createReport(db, dateId, nr);
  res.json(result);
};
export default report;
