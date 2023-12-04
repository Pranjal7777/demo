import { isQueryPresentInURL } from "./isQueryPresent";

export const removeQueryString = (path) => {
    let queryIndex = path.toString().indexOf("?");
    return isQueryPresentInURL(path) ? path.toString().slice(0, queryIndex) : path;
}