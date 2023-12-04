import { MAP_KEY } from "../config";

export const getCityStateWithZipCode = async (zip) => {
  const api = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${MAP_KEY}`;

  const res = await fetch(api, {
    method: 'GET',
  });

  const data = await res.json();

  if (data?.results?.[0]?.address_components) {
    return data.results[0].address_components;
  }
  return;
}

export const getCityStateLatLongWithZipCode = async (zip) => {
  const api = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${MAP_KEY}`;

  const res = await fetch(api, {
    method: 'GET',
  });

  const data = await res.json();

  if (data?.results?.[0]?.address_components) {
    return data.results[0];
  }
  return;
}