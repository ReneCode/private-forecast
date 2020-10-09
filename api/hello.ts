import { NowRequest, NowResponse } from "@vercel/node";

const hello = async (req: NowRequest, res: NowResponse) => {
  res.send("hello");
};

export default hello;
