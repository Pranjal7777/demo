import React from "react";
import { useSelector } from "react-redux";
import isMobile from "../../../hooks/isMobile";
import * as config from "../../../lib/config";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";

const streamEndedOverlay = ({ hostData, isFollowed, handleStopppedStreamClose, handleFollowClicked, endTitle = "" }) => {
  const [mobileView] = isMobile();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  return (
    <>
      <div className="streamEndedHost_Overlay">
        <div className="streamEndedBox_Outlayer text-center p-3">
          <img
            src={config.CLOSE_WHITE}
            width="20"
            height="20"
            alt="Close Icon"
            className="streamEnded_close cursor-pointer"
            onClick={handleStopppedStreamClose}
          />
          <span className="txt-heavy text-white fntSz25 mt-1 d-inline-block">
            {endTitle || (hostData?.userIdentifier ? "Live Stream Ended" : "No Stream Found")}
          </span>
          <div className="profileInfo_box mt-5 d-flex flex-column align-items-center">
            <img
              src={
                hostData?.userProfileImageUrl
                  ? s3ImageLinkGen(S3_IMG_LINK, hostData?.userProfileImageUrl)
                  : config.ProfilePlaceholder
              }
              className="profilePic_Img d-inline-block"
              alt="Host Profile"
            />
            {/* <span className="pt-3 text-white txt-heavy fntSz22">
              {hostData?.userName}
            </span> */}
            {hostData?.userIdentifier && (
              <span className="mt-3 text-white fntSz20 txt-book">
                @{hostData?.userIdentifier}
              </span>
            )}
          </div>
          {hostData?.userIdentifier && (
            <button
              className={`profileFollow_btn mt-3 mb-1 unfollowed_style}`}
              onClick={() => handleFollowClicked(!!isFollowed)}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
      <style jsx="true">
        {`
          .streamEndedHost_Overlay {
            position: absolute;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            background-color: ${mobileView ? '#0000004f' : '#0000005f'};
            z-index: 1;
          }
          .streamEndedBox_Outlayer {
            width: ${mobileView ? '75%' : '33vw'};
            // height: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid white;
            border-radius: 30px;
            background-color: #000000d4;
          }
          .profilePic_Img {
            border: 1px solid white;
            width: 50%;
            aspect-ratio: 1;
            border-radius: 50%;
            object-fit: cover;
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
          .streamEnded_close {
            position: absolute;
            right: -26px;
            top: 10px;
          }
          .unfollowed_style {
            background: inherit;
            border: 2px solid #fff;
          }
        `}
      </style>
    </>
  );
};

export default streamEndedOverlay;
