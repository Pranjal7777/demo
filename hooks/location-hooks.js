import React, { useContext, useEffect, useState } from "react";
import Language from "../context/language";
import { getLocationData } from "../lib/global";
const useLocation = () => {
  const [locationData, setLocationData] = useState({});
  useEffect(() => {
    getLocationData().then((data) => setLocationData(data));
  }, []); 
  return [locationData];
};
export default useLocation;
