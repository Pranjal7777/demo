export const queryRemoval = (name) => {
  //   console.log(
  //     "NAME SLICER --> ",
  //     name
  //       .toString()
  //       .substr(0, name.indexOf("?") >= 0 ? name.indexOf("?") : name.length)
  //   );
  return name.toString().substr(0, name.indexOf("?"));
  // return name
};
