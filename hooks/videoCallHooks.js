import { useSelector } from "react-redux";

export const getVideoSlotDataHook = () => {
    const data = useSelector((state) => state?.videoCallSetting?.slotData);
    return [data];
};

export const getVideoCallWeeklyScheduleHook = () => {
    const data = useSelector((state) => state.videoCallSetting.weeklySchedule);
    return [data];
};