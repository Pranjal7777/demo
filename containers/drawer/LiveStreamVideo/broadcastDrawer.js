import React from 'react';
import BroadcastPage from '../../live-stream-tabs/broadcastForm/brodcastPage';

const broadcastDrawer = (props) => {
    const { onClose, streamData } = props;
    return (
        <>
        <BroadcastPage isScheduleStream={true} onClose={onClose} scheduleStreamData={streamData} />
        </>
    )
}

export default broadcastDrawer;
