import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from 'react-jss';
import isMobile from '../../../hooks/isMobile';
import AvatarImage from '../../../components/image/AvatarImage';
import { GO_LIVE_SCREEN, CLOSE_ICON_WHITE } from '../../../lib/config';
import { CLOSE_ICON_BLACK } from '../../../lib/config';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/uploadAWS';
import { getCurrentStreamUserInfoHook } from '../../../hooks/liveStreamHooks';
import { getCurrentStreamUserInfo } from '../../../redux/actions/liveStream/liveStream';

const userInfoDrawer = (props) => {
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [currentStreamHostInfo] = getCurrentStreamUserInfoHook(true);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [mobileView] = isMobile();
  const { userInfo, isFollowed, handleFollowClicked, onClose, handleReport, streamId } = props;
  const [followed, setFollowed] = React.useState(isFollowed);

  const handleFollow = () => {
    handleFollowClicked?.(followed);
    setFollowed(prev => !prev);
  };

  React.useEffect(() => {
    dispatch(getCurrentStreamUserInfo(streamId, null));
  }, []);

  return (
    <>
      <div className="position-relative user_info__backdrop">
        {!mobileView && <img
          src={theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_ICON_WHITE}
          width="15"
          height="15"
          alt="Close Icon"
          className="streamEnded_close cursor-pointer"
          onClick={onClose}
        />}
        <span className="report_option txt-heavy cursor-pointer" onClick={handleReport}>
          Report
        </span>
        {
          userInfo?.userProfileImageUrl ? (
            <img
              src={s3ImageLinkGen(S3_IMG_LINK, userInfo?.userProfileImageUrl, null, mobileView ? 116 : 86, mobileView ? 116 : 86)}
              className="profilePic_Img_userInfo d-inline-block"
              alt="Host Profile"
            />
          ) : (
            <AvatarImage isCustom={true} className="profilePic_Img_userInfo" userName={userInfo?.userName} />
          )
        }
        {/* <div className={`user_info__name txt-heavy fntSz20 text-center mt-2 ${mobileView ? 'pt-3' : 'pt-2'}`}>
      {userInfo?.userName}
    </div> */}
        <div className="user_info__username txt-medium text-center mt-3 ">
          @{userInfo?.userIdentifier}
          {/* ● {userInfo?.age}, {userInfo?.gender} */}
        </div>

        <div className="user_info_analytics txt-medium d-flex align-items-center justify-content-center mt-3 text-app">
          <img src={GO_LIVE_SCREEN.dollarStreamIco} className="mr-2" width={18} height={18} /> $ {currentStreamHostInfo?.coinsCount}
          {/* <img src={GO_LIVE_SCREEN.streamUserIco} className="ml-3 mr-2" width={16} /> {currentStreamHostInfo?.followerCount} */}
        </div>


        <div className="mt-4 mb-1 text-center">
          <button
            className={`profileFollow_btn w-100 unfollowed_style`}
            onClick={handleFollow}
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>

      </div>
      <style jsx="true">
        {`
      .user_info__backdrop {
        // backdrop-filter: blur(5px) brightness(25%);
        // border-radius: 12px 12px 0 0;
        padding: 20px;
      }

      .span_tag{
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: yellow;
      }

      .profileFollow_btn {
        background: var(--l_base);
        color: #fff;
        border: none;
        font-size: 14px;
        font-weight: 600;
        padding: 0.7rem 5rem;
        border-radius: 30px;
      }

      :global(.profilePic_Img_userInfo) {
        border: 1px solid white;
        width: ${mobileView ? 116 : 86}px;
        height: ${mobileView ? 116 : 86}px;
        border-radius: 50%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        border: 3px solid var(--l_base);
      }
      :global(.USER_INFO_POPUP .MuiDialog-paper) {
        min-width: 300px !important;
      }

      :global(.MuiDialogContent-root) {
        overflow: visible !important;
      }

      .followed_style {
        background: #fff;
        color: var(--l_base);
        border: 2px solid var(--l_base);
      }

      :global(.MuiDrawer-paper) {
        // background-color: transparent !important;
        overflow: visible !important;
      }
      :global(.drawerBgColor) {
        // background-color: transparent !important;
      }
      
      .streamEnded_close {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .report_option, .user_info__username{
        color: #8C959D;
        font-size: 14px;
      }
      .user_info_analytics {
        color: #151515;
        font-size: 14px;
      }
      `}
      </style>
    </>
  )
}

export default userInfoDrawer;
