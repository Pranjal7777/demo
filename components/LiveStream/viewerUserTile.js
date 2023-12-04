import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GO_LIVE_SCREEN } from "../../lib/config";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { FollowUserAction, UnfollowUserAction } from "../../redux/actions/liveStream/liveStream";
import AvatarImage from "../image/AvatarImage";

const viewerUserTile = (props) => {
  const { viewer, isSelf = false, streamId } = props;
  const dispatch = useDispatch();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [followed, setFollowed] = React.useState(Boolean(viewer.isFollow));

  const handleFollowClicked = () => {
    if (followed) dispatch(UnfollowUserAction(viewer.userId, () => setFollowed(false)));
    else dispatch(FollowUserAction(streamId, viewer.viewerId, () => setFollowed(true)));
  };

  return (
    <>
      <div
        className="stream_viewerTile d-flex align-items-center py-3 px-3"
      >
        {
          viewer.viewerProfilePic ? <img
            src={s3ImageLinkGen(S3_IMG_LINK, viewer.viewerProfilePic, null, 50, 50)}
            className="viewer_profPic rounded-circle border-white"
            alt="viewer"
          /> : <AvatarImage className="viewer_profPic rounded-circle" userName={viewer.viewerName} />
        }
        <div className="ml-3">
          {isSelf
            ? <div className="viewer_username text-app">You</div>
            : <div className="viewer_username text-app">@{viewer.viewerIdentifier}</div>
          }
          <div className="viewer_coinSent d-flex align-items-center text-app">
            <img
              className="mr-1"
              src={GO_LIVE_SCREEN.dollarCoin}
              width={16}
              height={16}
            />
            {viewer.coinsSent}
          </div>
        </div>
        {!isSelf && viewer.userType !== "USER" && <button
          className={`viewer_followBtn cursor-pointer ml-auto fntSz15 bg-white ${followed ? 'following_style' : 'follow_style'}`}
          onClick={handleFollowClicked}
        >
          {followed ? "Following" : "Follow"}
        </button>}
      </div>
      <style>
        {`
          
          .viewer_profPic {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
          .border-white {
            border: 1px solid #ffffff;
          }
          .viewer_followBtn {
            border: 1px solid var(--l_base);
            // color: var(--l_base);
            border-radius: 30px;
            padding: 0 22px;
            height: 32px;
            min-width: 111.28px;
          }
          .following_style {
            background: var(--l_base) !important;
            color: #fff !important;
          }
          .stream_viewerTile {
            border-bottom: 1px solid #80808063;
          }
          .follow_style{
            color: var(--l_base) !important
          }
          `}
      </style>
    </>
  );
};

export default viewerUserTile;
