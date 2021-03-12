import { NowRequest, NowResponse } from "@vercel/node";
import {
  createUser,
  getDateNow,
  getFireStore,
  getUser,
  loadData,
  saveData,
} from "./utils";

const forecast = async (req: NowRequest, res: NowResponse) => {
  try {
    switch (req.method) {
      case "POST":
        await postForecast(req, res);
        break;
      case "GET":
        await getForecast(req, res);
        break;
      default:
        res.send(404).send(null);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
};

const postForecast = async (req: NowRequest, res: NowResponse) => {
  const { name, id, forecast, death } = req.body || {};

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
  const deathNr = parseInt(death);
  if (isNaN(forecastNr) || isNaN(deathNr)) {
    res.status(400).json({ code: 2, msg: `bad forecast or death format` });
    return;
  }

  const dateId = getDateNow();

  // const ok = await storeForecast(db, docId, userId, forecastNr);
  const result = await saveData(db, dateId, userId, {
    name: name,
    nr: forecastNr,
    death: deathNr,
  });

  if (!result) {
    res.status(400).json({ code: 1, msg: `can't store forecast. try again` });
    return;
  }

  res.status(200).json({ code: 0, id: userId, msg: "ok" });
};

const getForecast = async (req: NowRequest, res: NowResponse) => {
  const dateId = req.query.dateId as string;
  const userId = req.query.userId as string;

  if (dateId && userId) {
    const db = getFireStore();
    const doc = await loadData(db, dateId, userId);
    if (doc) {
      res.json({ nr: doc.nr, death: doc.death });
    } else {
      res.json(null);
    }
  } else {
    res.status(400).json(null);
  }
};

export default forecast;
