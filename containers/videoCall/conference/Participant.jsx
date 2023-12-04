import React from 'react';
import MediaPlayer from '../MediaPlayer/MediaPlayer';
import ParticipantMediaPlayer from '../MediaPlayer/ParticipantMediaPlayer';

const Participant = (props) => {
    const { videoTrack, audioTrack, isVideoTrackMuted } = props;
    return (
        <div className="border h-100 w-100">
            <ParticipantMediaPlayer
                videoTrack={videoTrack}
                isVideoTrackMuted={isVideoTrackMuted}
                audioTrack={audioTrack}
                avatarSize="100px"
            />
        </div>
    )
};

export default Participant;
