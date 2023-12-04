import { SET_COMMON_UTILITY } from "./actionTypes"

export const commonUtility = (data) => {
    return {
        type: SET_COMMON_UTILITY,
        payload: data,
    };
};