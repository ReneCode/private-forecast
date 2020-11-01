import * as admin from "firebase-admin";
import { nanoid } from "nanoid";

export const FACT_ID = "FACT";
export const RANKING_ID = "RANKING";
export const RANKING_WEEK_ID = "RANKING_WEEK";

let fireStoreDatabase: FirebaseFirestore.Firestore = null;

const collection = (db: FirebaseFirestore.Firestore, name: string) => {
  return db.collection(`${process.env.STAGE}/d/${name}`);
};

export const getDateNow = (dayDelta: number = 0) => {
  const dt = new Date(Date.now() + 24 * 60 * 60 * 1000 * dayDelta);
  // month is 0-based, 0=januar
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()}`;
};

export const shiftDate = (dt: Date, dayDelta: number) => {
  return new Date(dt.getTime() + dayDelta * 24 * 60 * 60 * 1000);
};

export const getFireStore = () => {
  if (fireStoreDatabase) {
    return fireStoreDatabase;
  }

  const serviceAccount = {
    type: "service_account",
    project_id: "private-forecast",
    private_key_id: process.env.DB_PRIVATE_KEY_ID,
    private_key: process.env.DB_PRIVATE_KEY,
    client_email:
      "firebase-adminsdk-qpjvz@private-forecast.iam.gserviceaccount.com",
    client_id: "113263646886207911275",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qpjvz%40private-forecast.iam.gserviceaccount.com",
  } as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://private-forecast.firebaseio.com",
  });

  const db = admin.firestore();
  fireStoreDatabase = db;
  return db;
};

export const getUser = async (
  db: FirebaseFirestore.Firestore,
  name: string,
  id: string
) => {
  const userRef = collection(db, "users");
  const query = userRef.where("name", "==", name).where("id", "==", id);
  const snapshot = await query.get();

  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data();
};

export const createUser = async (
  db: FirebaseFirestore.Firestore,
  name: string
) => {
  try {
    const userRef = collection(db, "users").doc(name);
    const id = nanoid();
    const res = await userRef.create({
      id: id,
      name: name,
    });
    if (!res) {
      return "";
    }
    return id;
  } catch (err) {
    console.log(err);
    return "";
  }
};

const createData = async (
  db: FirebaseFirestore.Firestore,
  dateId: string,
  docId: string,
  data: object
) => {
  try {
    const timestamp = new Date(Date.now());
    const dataRef = collection(db, dateId).doc(docId);
    await dataRef.create({ ts: timestamp, ...data });
    return true;
  } catch (err) {
    return null;
  }
};

export const saveData = async (
  db: FirebaseFirestore.Firestore,
  dateId: string,
  docId: string,
  data: object
) => {
  try {
    const timestamp = new Date(Date.now());
    const dataRef = collection(db, dateId).doc(docId);
    await dataRef.update({ ts: timestamp, ...data });
    return { created: false };
  } catch (err) {
    if (err.code === 5) {
      // document not found
      const ok = await createData(db, dateId, docId, data);
      if (ok) {
        return { created: true };
      }
    }
    return null;
  }
};

export const loadData = async (
  db: FirebaseFirestore.Firestore,
  dateId: string,
  docId: string
) => {
  try {
    const dataRef = collection(db, dateId).doc(docId);
    const doc = await dataRef.get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  } catch (err) {
    console.log(`loadData: ${err}`);
    return null;
  }
};

export const getHost = () => {
  switch (process.env.STAGE) {
    case "DEV":
      return "http://localhost:3000";
    case "PREVIEW":
      return "https://private-forecast.relang.vercel.app";
    case "PROD":
      return "https://private-forecast.vercel.app";
  }
};

const loadAllData = async (db: FirebaseFirestore.Firestore, dateId: string) => {
  let factNr = undefined;
  const docRef = collection(db, dateId);
  const snapshot = await docRef.get();
  const allData: {
    nr: number;
    name: string;
    id: string;
    delta: number;
    absDelta: number;
    rank: number;
  }[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    switch (doc.id) {
      case FACT_ID:
        factNr = data.nr;
        break;
      case RANKING_ID:
      case RANKING_WEEK_ID:
        break;
      default:
        allData.push({
          nr: data.nr,
          name: data.name,
          id: doc.id,
          delta: 0,
          absDelta: 0,
          rank: 0,
        });
    }
  });

  return { factNr, allData };
};

export const createRankingWeek = async (db: FirebaseFirestore.Firestore) => {
  const all: Map<
    string,
    {
      name: string;
      id: string;
      sumAbsDelta: number;
      count: number;
    }
  > = new Map();

  const cntDays = 7;
  for (let i = 1; i <= cntDays; i++) {
    const dateId = getDateNow(-1 * i);
    const { factNr, allData } = await loadAllData(db, dateId);
    for (let data of allData) {
      const userId = data.id;
      const absDelta = Math.abs((factNr ? factNr : 0) - data.nr);
      if (!all.has(userId)) {
        all.set(userId, {
          id: userId,
          name: data.name,
          sumAbsDelta: absDelta,
          count: 1,
        });
      } else {
        const d = all.get(userId);
        d.count += 1;
        d.sumAbsDelta += absDelta;
      }
    }
  }

  // calc mean of absDelta
  const ranking: { name: string; sortAbsDelta: number; rank: number }[] = [];
  all.forEach((value) => {
    const count = value.count;
    // TODO ??  may be +1 because that the penaltyFactor will be working even in the delte is 0
    // const meanAbsDelta = (value.sumAbsDelta + 1) / count;
    const meanAbsDelta = value.sumAbsDelta / count;
    // 0 missing-tip => * 1
    // 1 missing-tip => * 2
    // 2 missing-tip => * 3
    const penaltyFactor = cntDays - count + 1;
    ranking.push({
      name: value.name,
      sortAbsDelta: meanAbsDelta * penaltyFactor,
      rank: 0,
    });
  });

  ranking.sort((a, b) => {
    if (a.sortAbsDelta !== b.sortAbsDelta) {
      return a.sortAbsDelta - b.sortAbsDelta;
    } else {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    }
  });

  if (ranking.length > 0) {
    let rank = 1;
    let lastSortAbsDelta = ranking[0].sortAbsDelta;
    for (let tip of ranking) {
      if (lastSortAbsDelta !== tip.sortAbsDelta) {
        lastSortAbsDelta = tip.sortAbsDelta;
        rank++;
      }
      tip.rank = rank;
    }
  }

  const dateId = getDateNow(-1);

  const result = { ranking: ranking, dateId: dateId };

  const rankingRef = collection(db, dateId).doc(RANKING_WEEK_ID);
  await rankingRef.set(result);

  return result;
};

export const createRanking = async (
  db: FirebaseFirestore.Firestore,
  dateId: string
) => {
  const { factNr, allData } = await loadAllData(db, dateId);

  if (allData.length === 0 || factNr === undefined || isNaN(factNr)) {
    return false;
  }

  for (let data of allData) {
    data.absDelta = Math.abs(factNr - data.nr);
    data.delta = factNr - data.nr;
  }

  allData.sort((a, b) => {
    if (a.absDelta !== b.absDelta) {
      return a.absDelta - b.absDelta;
    } else {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    }
  });

  let rank = 1;
  let lastAbsDelta = allData[0].absDelta;
  for (let data of allData) {
    if (lastAbsDelta !== data.absDelta) {
      lastAbsDelta = data.absDelta;
      rank++;
    }
    data.rank = rank;

    const dataRef = collection(db, dateId).doc(data.id);
    await dataRef.update({ rank: rank });
  }

  const ranking = allData.map((data) => {
    return {
      rank: data.rank,
      name: data.name,
      nr: data.nr,
    };
  });

  const result = { fact: factNr, ranking: ranking, dateId: dateId };

  const rankingRef = collection(db, dateId).doc(RANKING_ID);
  await rankingRef.set(result);

  return result;
};

export function getRankingId(type: string | string[]) {
  let id: string = "";
  switch (type) {
    case "week":
      id = RANKING_WEEK_ID;
      break;
    default:
      id = RANKING_ID;
      break;
  }
  return id;
}
