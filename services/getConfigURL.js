import { ParseToken } from "../lib/parsers/token-parser";
import { get } from "../lib/request";

export const getConfigURL = async (token) => {
    let headers = {};
    if (token) headers = { authorization: await ParseToken(token) };
    return get("/config", headers);
};