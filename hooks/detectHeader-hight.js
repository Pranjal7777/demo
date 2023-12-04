import React, { useEffect } from "react";

const useDetectHeaderHight = (headerId, divHeight) => {
  useEffect(() => {
    headerId = document.getElementById(headerId);
    // console.log("asdasdasd", headerId);
    divHeight = document.getElementById(divHeight);
    const heigth = headerId && headerId.offsetHeight;
    if (divHeight) {
      divHeight.style.paddingTop = heigth + "px";
    }
  }, []);
  return [];
};

export default useDetectHeaderHight;
