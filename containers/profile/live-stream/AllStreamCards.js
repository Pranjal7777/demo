import React from 'react'
import isMobile from '../../../hooks/isMobile'
import { getCookie } from '../../../lib/session';
import LiveStreamCards from '../../live-stream-tabs/live-stream-cards';
import { GO_LIVE_SCREEN } from '../../../lib/config';
import { handleContextMenu } from '../../../redux/actions/chat/helper';
import { isOwnProfile } from '../../../lib/global/routeAuth';
import WarnStateNotConnected from '../../live-stream-tabs/live-video-screen/warnStateNotConnected';
import { useState } from 'react';

const AllStreamCards = (props) => {
    const { streamDetailsArr, handleRemoveThisStream, handleUnlockThisStream, userId, currentTime, activeStreamTab } = props;
    const [mobileView] = isMobile();
    const selfUserId = getCookie('uid');
    const OtherProfileUser = isOwnProfile(userId);
    const [warnStateIssue, setWarnStateIssue] = useState(false);
    const [callStreamFunction, setCallStreamFunction] = useState(false)

    return (
        <div className="row mx-0 px-2 px-md-0">
            {streamDetailsArr.length ? (
                streamDetailsArr.map((stream) => (
                    <div className="p-1" style={{ width: mobileView ? "50%" : !OtherProfileUser ? "25%" : "20%" }} key={stream.eventId}>
                        {(activeStreamTab === "allStream" ? stream?.isRecorded : activeStreamTab === "recordedStreams") ?
                            <LiveStreamCards
                                isRecorded
                                isSelf={selfUserId === userId}
                                handleRemoveThisStream={handleRemoveThisStream}
                                isProfile
                                mobileView={mobileView}
                                streamData={stream}
                                setWarnStateIssue={setWarnStateIssue}
                                callStreamFunction={callStreamFunction}
                            />
                            :
                            <LiveStreamCards
                                handleUnlockThisStream={handleUnlockThisStream}
                                handleRemoveThisStream={handleRemoveThisStream}
                                isSelf={selfUserId === userId}
                                currentTimeStamp={currentTime}
                                isProfile
                                mobileView={mobileView}
                                streamData={stream}
                                setWarnStateIssue={setWarnStateIssue}
                                callStreamFunction={callStreamFunction}
                            />}
                    </div>
                ))
            ) : (
                <>
                    <div
                        className="w-100 mt-4 d-flex align-items-center justify-content-center flex-column"
                    >
                        <img
                            src={GO_LIVE_SCREEN.NoStreamPlaceholder}
                            alt="No Streams Available"
                            className="callout-none"
                            onContextMenu={handleContextMenu}
                        />
                        <span className="pt-3 txt-heavy fntSz22">
                            No Streams Available
                        </span>
                    </div>
                </>)}
            {warnStateIssue && <WarnStateNotConnected handleNo={() => {
                setCallStreamFunction(false)
                setWarnStateIssue(false)
            }} handleYes={() => {
                setCallStreamFunction(true)
            }} />}
        </div>
    )
}

export default AllStreamCards