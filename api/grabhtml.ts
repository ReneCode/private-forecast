import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

// doc
// https://vercel.com/docs/runtimes#advanced-usage/advanced-node-js-usage

const home = async (req: NowRequest, res: NowResponse) => {
  try {
    if (!req.body) {
      return res.status(404).send(`body missing`);
    }
    const { url, regex }: { url: string; regex: string[] } = req.body;
    if (!url || !regex) {
      return res.status(404).send(`url,regex missing`);
    }
    const response = await fetch(url);
    const data = await response.text();

    const result = [];
    for (let r of regex) {
      const re = new RegExp(r);
      const d = re.exec(data);
      for (let i = 1; i < d.length; i++) {
        result.push(d[i]);
      }
    }

    return res.json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export default home;
