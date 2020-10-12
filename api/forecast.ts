import { NowRequest, NowResponse } from "@vercel/node";
import {
  createUser,
  getDateNow,
  getFireStore,
  getUser,
  storeForecast,
} from "./utils";

const forecast = async (req: NowRequest, res: NowResponse) => {
  try {
    const { name, id, forecast } = req.body || {};

    if (!name) {
      res.status(400).send({ code: 5, msg: "name missing" });
      return;
    }

    let userId = "";
    const db = getFireStore();
    if (id) {
      const ok = await getUser(db, name, id);
      if (!ok) {
        res.status(400).json({ code: 4, msg: "name,id not found" });
        return;
      } else {
        userId = id;
      }
    } else {
      const newId = await createUser(db, name);
      if (!newId) {
        res.status(400).json({
          code: 3,
          msg: `can't create user ${name} - choose different name`,
        });
        return;
      } else {
        // new user created
        userId = newId;
      }
    }

    const forecastNr = parseInt(forecast);
    if (isNaN(forecastNr)) {
      res.status(400).json({ code: 2, msg: `bad forecast format` });
      return;
    }

    const docId = getDateNow();

    const ok = await storeForecast(db, docId, userId, forecastNr);
    if (!ok) {
      res.status(400).json({ code: 1, msg: `can't store forecast. try again` });
      return;
    }

    res.status(200).json({ code: 0, id: userId, msg: "ok" });
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

export default forecast;
