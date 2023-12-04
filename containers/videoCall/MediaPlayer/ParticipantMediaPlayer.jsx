import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

const MediaPlayer = (props) => {
    const { videoTrack = {}, audioTrack, isVideoTrackMuted = false } = props;
    return (
        <React.Fragment>
            <div className="video-player h-100 d-flex bg_light_grey">
                {isVideoTrackMuted ?
                    <Avatar className={`profile_avatar ${props.avatarClass}`}>
                        <PersonIcon
                            style={{
                                fontSize: props.avatarSize || '100px'
                            }}
                            className="avatar_icon"></PersonIcon>
                    </Avatar> : ""}
                {videoTrack ? (
                    <video
                        className={`video-renderer-participant h-100 w-100 `}
                        ref={videoTrack}
                        muted={true}
                        playsInline
                    />
                ) :
                    ""
                }
            </div>
            <style>{`
            
            .video-renderer-participant {
                display: ${isVideoTrackMuted ? "none" : "initial"}
            }
                .profile_avatar{
                    height: ${props.avatarHeight || '60%'};
                    width: ${props.avatarWidth || '60%'};
                    margin: auto;
                    max-width: 200px;
                    max-height: 200px;
                }
                .avatar_icon{
                    color: #fff;
                }
                .bg_light_grey{
                    background: #808080d9;
                    border: 1px solid white;
                }
            `}</style>
        </React.Fragment>
    )
}

export default MediaPlayer
