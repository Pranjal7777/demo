import { put } from "redux-saga/effects";
import { getAvailabilityWeekAPI, getVideoCallSettingsAPI, patchAvailabilityWeekAPI, patchVideoCallSettingsAPI, postAvailabilityWeekAPI } from "../../../services/videoCall";
import { getScheduleAvailabilityAction, getSlotsAction } from "../../actions/videoCall/videoCallActions";
import { startLoader, stopLoader } from "../../../lib/global/loader";
import { isAgency } from "../../../lib/config/creds";

export function* getVideoCallSlotsSettingSaga({ isAPI, callBackFn, userId, failCallBack }) {
    console.log(failCallBack, "dijaijsdjiji")
    if (!isAPI) return;
    let payload = {
    }
    if (userId) {
        payload["userId"] = userId;
    }
    try {
        const response = yield getVideoCallSettingsAPI(payload);
        if (response.status == 200) {
            const dataToSave = response.data.data;
            yield put(getSlotsAction({ isAPI: false, dataToSave }));
            callBackFn?.(dataToSave);
          }
    } catch (err) {
        console.error(err);
        failCallBack?.(err)
        yield put(getSlotsAction({ isAPI: false, dataToSave: null }));
        callBackFn?.(null);
    } finally {
    };
};

export function* postVideoCallSlotsSettingSaga({ slotConfig, callBackFn }) {
    try {
        const response = yield patchVideoCallSettingsAPI(slotConfig);
        yield put(getSlotsAction({ isAPI: false, dataToSave: slotConfig }));
    } catch (err) {
        console.error(err);
    } finally {
        callBackFn?.();
    }
};

export function* getDailyAvailabilityScheduleSaga({ isAPI, callBackFn, dayOfTheWeek, userId }) {
    if (!isAPI) return;
    try {
        const response = yield getAvailabilityWeekAPI(dayOfTheWeek, userId);
        if (response.status === 200) {
            yield put(getScheduleAvailabilityAction({ isAPI: false, dataToSave: response.data.data, userId: isAgency() ? userId : "" }));
            callBackFn?.(response.data.data);
        }
    } catch (err) {
        console.error(err);
        callBackFn?.();
    }
};

export function* postDailyAvailabilitySaga({ dayOfTheWeek, startTime, endTime, callBackSuccess, callBackError, userId }) {
    try {
        const payload = {
            dayOfTheWeek,
            startTime,
            endTime
        };
        if (userId) {
            payload["creatorId"] = userId;
        }
        const response = yield postAvailabilityWeekAPI(payload);
        if (response.status === 200) {
            callBackSuccess?.();
            startLoader();
            yield put(getScheduleAvailabilityAction({ isAPI: true, callBackFn: stopLoader, userId: isAgency() ? userId : "" }));
        }
    } catch (err) {
        console.error(err);
        callBackError?.(err);
    }
};

export function* patchDailyAvailabiltySaga({ payloadToSet, callBackSuccess, callBackError }) {
    try {
        const response = yield patchAvailabilityWeekAPI(payloadToSet);
        if (response.status === 200) {
            callBackSuccess?.();
            startLoader();
            yield put(getScheduleAvailabilityAction({ isAPI: true, callBackFn: stopLoader, userId: payloadToSet.creatorId }));
        }
    } catch (err) {
        console.error(err);
        callBackError?.(err);
    }
};
