import { NowRequest, NowResponse } from "@vercel/node";

import { getFireStore } from "./utils";

const index = async (req: NowRequest, res: NowResponse) => {
  const dbName = process.env.DB_NAME;

  const db = getFireStore();
  const snapshot = await db.collection("users").get();

  const data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });

  res.json(data);
};

export default index;
