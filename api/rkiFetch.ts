import fetch from "node-fetch";

export const rkiFetchDate = async () => {
  try {
    //const url =
    //  "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Recovered_BL/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=IdBundesland%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true";
    const url =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_data_status_v/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json.features[0].attributes.Timestamp_txt;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const rkiGetNr = async (): Promise<number> => {
  try {
    const url =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=AdmUnitId asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      const val = json.features[0].attributes.AnzFallNeu;
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
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=AdmUnitId asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true";
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      const val = json.features[0].attributes.AnzTodesfallNeu;
      return parseInt(val);
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
