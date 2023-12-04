import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
/**
 * @description use thic component for Media playing
 * @author jagannath
 * @date 22/04/2021
 * @param videoTrack:any
 * @param audioTrack:any
 * @param avatarHeight: String
 * @param avatarWidth: String
 * @param avatarSize: String
 * @param avatarClass: ?String
 */
const MediaPlayer = (props) => {
    const { videoTrack = {}, audioTrack, isVideoTrackMuted } = props;

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
                        className={`video-renderer h-100 w-100 `}
                        ref={videoTrack}
                        muted={true}
                        playsInline
                    />
                ) :
                    ""
                }
            </div>
            <style>{`
                .video-renderer {
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
