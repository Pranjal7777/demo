import React from 'react';
import MediaPlayer from '../MediaPlayer/MediaPlayer';

const Host = (props) => {

    const { localAudioTrack, localVideoTrack, isVideoTrackMuted } = props;

    return (
        <React.Fragment>

            <div className="local_vide_cont h-100">
                <MediaPlayer
                    audoTrack={localAudioTrack}
                    videoTrack={localVideoTrack}
                    isVideoTrackMuted={isVideoTrackMuted}
                    avatarSize="50px"
                ></MediaPlayer>
            </div>
            <style>{`
                .local_vide_cont{
                    background: black;
                    border-radius: 8px;
                }
            `}</style>
        </React.Fragment>
    )
}

export default Host
