import {
    postWithToken,
  } from "../lib/request";
  
  
  // report problem
  export const reportProblem = async (list = {}) => {
    return postWithToken("/reportProblem", list);
  };