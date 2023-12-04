export const ParseToken = (token) => {
  return decodeURIComponent(token).replace(/%20/g, " ");
};
