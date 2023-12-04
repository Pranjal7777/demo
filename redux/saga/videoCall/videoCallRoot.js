import { takeEvery } from "redux-saga/effects";
import { GET_SCHEDULE_AVAILABILITY_ACTION, GET_SLOTS_ACTION, PATCH_DAILY_AVAILABILITY_ACTION, POST_DAILY_AVAILABILITY_ACTION, SAVE_SLOT_ACTION } from "../../actions/videoCall/videoCallActions";
import { getDailyAvailabilityScheduleSaga, getVideoCallSlotsSettingSaga, patchDailyAvailabiltySaga, postDailyAvailabilitySaga, postVideoCallSlotsSettingSaga } from "./videoCallSaga";
export default function videoCallSaga() {
    return [
        takeEvery(GET_SLOTS_ACTION, getVideoCallSlotsSettingSaga),
        takeEvery(SAVE_SLOT_ACTION, postVideoCallSlotsSettingSaga),
        takeEvery(GET_SCHEDULE_AVAILABILITY_ACTION, getDailyAvailabilityScheduleSaga),
        takeEvery(POST_DAILY_AVAILABILITY_ACTION, postDailyAvailabilitySaga),
        takeEvery(PATCH_DAILY_AVAILABILITY_ACTION, patchDailyAvailabiltySaga)
    ]
};