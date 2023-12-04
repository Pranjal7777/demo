export const GET_SLOTS_ACTION = "GET_SLOTS_ACTION";
export const SAVE_SLOT_ACTION = "SAVE_SLOT_ACTION";
export const GET_SCHEDULE_AVAILABILITY_ACTION = "GET_SCHEDULE_AVAILABILITY_ACTION";
export const POST_DAILY_AVAILABILITY_ACTION = "POST_DAILY_AVAILABILITY_ACTION";
export const PATCH_DAILY_AVAILABILITY_ACTION = "PATCH_DAILY_AVAILABILITY_ACTION";

export const getSlotsAction = ({ isAPI, dataToSave, callBackFn, userId, failCallBack }) => ({
    type: GET_SLOTS_ACTION,
    isAPI,
    dataToSave,
    callBackFn,
    userId,
    failCallBack
});

export const saveSlotsActions = ({ slotConfig, callBackFn, userId }) => ({
    type: SAVE_SLOT_ACTION,
    slotConfig,
    callBackFn,
    userId
});

export const getScheduleAvailabilityAction = ({ isAPI, callBackFn, dataToSave, dayOfTheWeek, userId }) => ({
    type: GET_SCHEDULE_AVAILABILITY_ACTION,
    isAPI,
    callBackFn,
    dataToSave,
    dayOfTheWeek,
    userId
});

export const postDailyAvailabilitAction = ({ dayOfTheWeek, startTime, endTime, callBackSuccess, callBackError, userId }) => ({
    type: POST_DAILY_AVAILABILITY_ACTION,
    dayOfTheWeek,
    startTime,
    endTime,
    callBackSuccess,
    callBackError,
    userId
});

export const patchDailyAvailabiltyAction = ({ payloadToSet, callBackSuccess, callBackError }) => ({
    type: PATCH_DAILY_AVAILABILITY_ACTION,
    payloadToSet,
    callBackSuccess,
    callBackError
});