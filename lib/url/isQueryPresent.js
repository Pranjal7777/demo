export const isQueryPresentInURL = (path) => {
  // console.log("INDEX OF SEARCH --> ", path, path.toString().indexOf("?") > -1);
  return path.toString().indexOf("?") > -1;
};
