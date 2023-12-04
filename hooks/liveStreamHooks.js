import { useSelector } from "react-redux";

export const getStreamsHook = (type = 'POPULAR_STREAMS') => {
    const data = useSelector((state) => state.liveStream[type]);
    return [data];
};

export const getCurrentStreamAnalyticsHook = () => {
    const data = useSelector((state) => state.liveStream.CURRENT_STREAM_DATA.streamAnalytics);
    return [data];
};

export const getCurrentStreamInfoHook = () => {
    const data = useSelector((state) => state.liveStream.CURRENT_STREAM_DATA.metaData);
    return [data];
};

export const getCurrentStreamUserInfoHook = (isHost = true) => {
    const data = useSelector((state) => state.liveStream.CURRENT_STREAM_DATA.streamUserInfo[isHost ? 'HOST' : 'viewers']);
    return [data];
};

export const getCurrentStreamMessagesHook = () => {
    const data = useSelector((state) =>  state.liveStream.CURRENT_STREAM_DATA.streamMessages);
    return [data];
}