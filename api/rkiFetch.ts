import fetch from "node-fetch";

export const rkiFetchDate = async () => {
  try {
    const url =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Recovered_BL/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=IdBundesland%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json.features[0].attributes.Datenstand;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const rkiGetNr = async (): Promise<number> => {
  try {
    const url =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=NeuerFall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlFall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      const val = json.features[0].attributes.value;
      return parseInt(val);
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const rkiGetDeath = async (): Promise<number> => {
  try {
    const url =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=NeuerTodesfall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      const val = json.features[0].attributes.value;
      return parseInt(val);
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
