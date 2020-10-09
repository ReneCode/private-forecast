import { NowRequest, NowResponse } from "@vercel/node";
import {
  createUser,
  getDateNow,
  getFireStore,
  getUser,
  storeForecast,
} from "./utils";
const firebase = require("firebase");

const sendforecast = async (req: NowRequest, res: NowResponse) => {
  try {
    const { name, id, forecast } = req.body || {};

    if (!name || !forecast) {
      res.status(404).send("name, forecast missing");
      return;
    }

    let userId = "";
    const db = getFireStore();
    if (id) {
      const ok = await getUser(db, name, id);
      if (!ok) {
        res.status(404).send("name,id not found");
        return;
      } else {
        userId = id;
      }
    } else {
      const newId = await createUser(db, name);
      if (!newId) {
        res.send(`can't create user ${name} - choose different name`);
        return;
      } else {
        userId = newId;
      }
    }

    const forecastNr = parseInt(forecast);
    if (isNaN(forecastNr)) {
      res.send(`bad forecast format ${forecast}`);
      return;
    }

    const docId = getDateNow();

    const ok = await storeForecast(db, docId, userId, forecastNr);
    if (!ok) {
      res.send(`can't store forecast. try again: ${ok}`);
      return;
    }

    // const stage = process.env.STAGE;

    // const docRef = db.collection(stage).doc("RENE");
    // await docRef.set({
    //   name: "rene",
    //   age: "55+",
    //   gender: "male",
    // });

    res.send(`ok, well done. userId ${userId}`);
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

export default sendforecast;
