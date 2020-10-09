import * as admin from "firebase-admin";
import { nanoid } from "nanoid";

let fireStoreDatabase = null;

export const getDateNow = () => {
  const dt = new Date(Date.now());
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth()}-${dt.getUTCDay()}`;
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

const getFireStoreCollection = (db: FirebaseFirestore.Firestore) => {
  return db.collection(process.env.STAGE);
};

const collection = (db: FirebaseFirestore.Firestore, name: string) => {
  return db.collection(`${process.env.STAGE}/d/${name}`);
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

const createForecast = async (
  db: FirebaseFirestore.Firestore,
  docId: string,
  userId: string,
  forecast: number
) => {
  try {
    const forecastRef = collection(db, "forecast").doc(docId);
    const setData = {};
    setData[userId] = forecast;
    await forecastRef.set(setData);
    return true;
  } catch (err) {
    return false;
  }
};

export const storeForecast = async (
  db: FirebaseFirestore.Firestore,
  docId: string,
  userId: string,
  forecast: number
) => {
  try {
    const forecastRef = collection(db, "forecast").doc(docId);
    const updateData = {};
    updateData[userId] = forecast;
    await forecastRef.update(updateData);
    return true;
  } catch (err) {
    if (err.code == 5) {
      // document not found
      return await createForecast(db, docId, userId, forecast);
    }
    return `${JSON.stringify(err)}`;
  }
};
