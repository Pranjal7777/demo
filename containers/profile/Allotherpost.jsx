import dynamic from "next/dynamic";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
const DateRangeOutlinedIcon = dynamic(() => import('@material-ui/icons/DateRangeOutlined'));
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import {
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global/loader";
import { getCookie } from "../../lib/session";
import TextPost from "../../components/TextPost/textPost";
import Img from "../../components/ui/Img/Img";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import Button from "../../components/button/button";
import { makeScheduledPostActive } from "../../services/profile";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { CHAT_PLAY, playIcon } from "../../lib/config/profile";
import dayjs from "dayjs";
import { useEffect } from "react";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";

export default function Allotherpost(props) {
  const { isLockedPost = false, isOtherProfile, isMoreMenu, isAllPosts, coverImage } = props;
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const userId = isAgency() ? selectedCreatorId : getCookie("uid");
  const [propsData, setPropsData] = useState(props);
  
  useEffect(() => {
    setPropsData(props)
  }, [props])

  const [aspectWidth, setAspectWidth] = useState(window.innerWidth - 70);
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [lang] = useLang();
  const [currentTime, setCurrentTime] = useState(dayjs().valueOf());
  const isScheduled = props.isScheduled;

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs().valueOf());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const hashtagPostClick = (id, index) => {
    open_dialog("PostSlider", {
      profileLogo: props.profilePic,
      price: props.price,
      currency: props.currency || {},
      postImage: props.postImage,
      postType: props.postType,
      isBookmarked: props.isBookmarked,
      profileName: props.firstName,
      onlineStatus: props.scheduledTimestamp || props.creationTs,
      likeCount: props.totalLike,
      commentCount: props.commentCount || props.commentCount_x || props.commentCount_y,
      postDesc: props.description,
      postId: id,
      userId: props.userId,
      isLiked: props.isLiked,
      username: props.username || props.userName,
      totalTipReceived: props.totalTipReceived, // not available
      // followUnfollowEvent:props.followUnfollowEvent,
      isVisible: props.isLockedPost ? 1 : props.isVisible || 0,
      taggedUsers: props.taggedUsers,
      isFollow: props.isFollowed || 0,
      postToShow: props.useIndexFromProps ? props.postToShow : index,
      isOtherProfile: props.isOtherProfile,
      setPage: props.setPage,
      page: props.page,
      //  rediredcted: postId?.length ? true:false, 
      setNeedApiCall: props.setNeedApiCall,
      getPersonalAssets: props.getPersonalAssets,
      adjustWidth: true,
      otherPostSlider: props.otherPostSlider,
      allData: props.allPost,
      setProfile: props.setProfile,
      profile: props.profile,
      setAsseets: props.setAsseets,
      userType: props.userType,
      isLockedPost: props.isLockedPost,
      size: 80,
      updateLikedPost: props.updateLikedPost,
      FavPage: props.FavPage,
      dialogClick: props.handleClose,
      collectionPage: props.collectionPage,
      getPosts: props.getPosts,
      isScheduled: props.isScheduled,
      scheduledTimestamp: props.scheduledTimestamp,
      purchasedPostPage: props.purchasedPostPage,
      setActiveNavigationTab: props.setActiveNavigationTab,
      deletePostEvent: props.deletePostEvent
    })

  }

  const makePostActive = async (e, { postId, userId }) => {
    e.stopPropagation()
    try {
      startLoader()
      await makeScheduledPostActive({ postId, userId })
      props?.setPage(1)
      props.setActiveNavigationTab("grid_post")
      Toast("Post Activated", "success");
      stopLoader()
    } catch (error) {
      stopLoader()
      Toast(error.message, "error");
      console.error(error.message)
    }
  }

  const TimeLinePost = () => {
    // this is the condition for the video only while video posting is in pending state
    if (props.postImage && props.status == 0 && props.postImage[0].type == 2) {
      return (
        <div className="pending_video_thumb">
          <Img
            src={s3ImageLinkGen(S3_IMG_LINK, props.postImage[0].thumbnail, null, aspectWidth > 900 ? 900 : aspectWidth)}
            width="100%"
            height="auto"
            className="image_thumb"
            alt="This post will be live after we complete our backend optimiZations"
          />
          <div className="image_thumb_overlay">
            <Img src={CHAT_PLAY} className="play_btn" alt="video play button" />
            <div className="image_thumb_msg">
              <p className="pending_msg">"This post will be live after we complete our backend optimiZations"</p>
            </div>
          </div>
        </div>
      )
    }
    if (props?.postImage[0]?.type !== 4) {
      return (
        <>
          <div className={` ${isScheduled && "position-relative h-100"} h-100 callout-none`} onContextMenu={handleContextMenu}>
            {props.isAddBoxShadow ? <div className="adjustBoxShadow h-100 w-100 pointer"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(30, 30, 30, 0), rgba(0, 0, 0, 1)), url('${s3ImageLinkGen(S3_IMG_LINK, `${props?.postImage[0]?.type === 1 ? propsData?.postImage[0]?.url : propsData?.postImage[0]?.thumbnail}`, null, mobileView ? null : '16vw', mobileView ? 230 : 307)}')`,
              }}
            ></div> :
              <FigureCloudinayImage
                className='hastag__img cursorPtr w-100 object-fit-cover callout-none'
                isVisible={propsData.isVisible || 0}
                isProgressiveLoading={true}
                userId={props.userId}
                uid={userId}
                userName={props?.userName}
                postId={props.postId}
                publicId={`${coverImage ? coverImage : props?.postImage[0]?.type === 1 ? propsData?.postImage[0]?.url : propsData?.postImage[0]?.thumbnail}`}
                isPreview={!!coverImage}
                alt={props.fullName}
                width={500}
                ratio={1}
                isOtherProfile={isOtherProfile}
                size={props.size}
                postType={props.postType}
                price={props.price}
                showLock={props.showLock}
                adjustUnlockSubscribetext={true}
                showPriceOnGrid={props.showPriceOnGrid}
              />}

            {props?.postImage[0]?.type === 2 && props.isVisible ? <Img
              src={playIcon}
              className="videoIconCenterCss pointer"
              height="50px"
            /> : ""}

            {isScheduled && currentTime > props?.creationTs && <div className="position-absolute  " style={!mobileView ? { bottom: "1rem", left: '50%', transform: 'translate(-50%, 0px)', width: "7rem" } : { bottom: "6rem", right: "1.5rem" }}>
              <Button
                type="button"
                cssStyles={theme.blueButton}
                onClick={(e) => makePostActive(e, { postId: props?.postId, userId: props?.userId })}
                fclassname={`postBtn__btn p-2 ${!mobileView && ""} disableBtn`}
                btnSpanClass="fntSz12"
                isDisabled={currentTime > props?.creationTs ? false : true}
              >
                {lang.makeActive}
              </Button>
            </div>}
            {(props.FavPage || props.collectionPage || props.purchasedPostPage) && <div className="position-absolute font-weight-500 radius_12 text-white" style={!mobileView ? { bottom: "0rem", left: "4px", width: "calc(100% - 8px)", padding: "30px 8px 8px", background: "linear-gradient(rgba(0, 0, 0, 0) -2.27%, rgba(0, 0, 0, 0.8) 100.01%)" } : { bottom: "6rem", right: "1.5rem" }}>
              @{props?.userName}
            </div>}
            {
              isScheduled && <div className="position-absolute d-flex align-items-center text-white fntSz11" style={!mobileView ? { opacity: "0.95", top: "0rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", gap: "7px" } : { opacity: "0.95", bottom: "8.5rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <DateRangeOutlinedIcon style={{ width: "15px", height: "15px" }} />
                <p className="m-0 py-3 w-500">{!mobileView && "Scheduled for"} {dayjs(props?.creationTs).format("MMM DD, h:mm a")} </p>
              </div>
            }
          </div>
        </>
      );
    } else {
      return (
        <div className={`${isScheduled && "position-relative h-100"} h-100`}>
          <TextPost
            className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
            postType={props.postType}
            price={props.price}
            currency={props.currency}
            isVisible={propsData.isVisible || 0}
            userId={props.userId}
            postId={props.postId}
            subscribedEvent={props.subscribedEvent}
            width={aspectWidth > 900 ? 900 : aspectWidth}
            textPost={props.postImage}
            alt={props.fullName}
            isOtherProfile={isOtherProfile}
            isGridView={true}
            size={50}
            adjustUnlockSubscribetext={true}
            showPriceOnGrid={props.showPriceOnGrid}
          />
          {isScheduled && <div className="position-absolute " style={!mobileView ? { bottom: "1rem", left: '50%', transform: 'translate(-50%, 0px)', width: "7rem" } : { bottom: "6rem", right: "1.5rem" }}>
            <Button
              type="button"
              cssStyles={theme.blueButton}
              onClick={(e) => makePostActive(e, { postId: props?.postId, userId: props?.userId })}
              fclassname={`postBtn__btn p-2 ${!mobileView && ""} disableBtn`}
              btnSpanClass="fntSz12"
              isDisabled={currentTime > props?.creationTs ? false : true}
            >
              {lang.makeActive}
            </Button>
          </div>}
          {
            isScheduled && <div className="position-absolute d-flex align-items-center text-white fntSz11" style={!mobileView ? { opacity: "0.95", top: "0rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", gap: "7px" } : { opacity: "0.95", bottom: "8.5rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <DateRangeOutlinedIcon style={{ width: "15px", height: "15px" }} />
              <p className="m-0 py-3 w-500">{dayjs(props?.creationTs).format("MMM DD ,h:mm a")} </p>
            </div>
          }
        </div>
      );
    }
  };

  return (
    <>
      <div className={`${isOtherProfile ? "col-3" : isMoreMenu ? "col-4" : "col-2"} px-0 d-flex adjustRadiusForBlur adjustAspectRatio overflowX-hidden`} onClick={() => hashtagPostClick(props.postId, props.currentIndex)} style={{ width: "16vw", minHeight: "23vh", padding: "3px 0px" }} >
        <div className="col-12 adjustLockPostText unsetHeight" style={props.postImage[0]?.type == 4 ? { maxHeight: "23vw", padding: "0 4px" } : { minHeight: mobileView ? "32vw" : "28vh", maxHeight: mobileView ? "32vw" : "28vh", maxWidth: "23vw", padding: "0px 4px" }}>
          {TimeLinePost()}
        </div>
      </div>

      <style jsx>{`
      
        :global(.rec.rec-item-wrapper) {
          height:${mobileView ? "32vw" : isOtherProfile && !mobileView ? "100%" : "100%"} ;
        }
        :global(.hastag__img){
          max-height:28vh !important;
          border-radius: 12px !important;
        }
        .post_desc_text a {
          text-decoration: none;
        }
        .profile_post_cont {
          min-height: 190px;
        }
        :global(.dv__profilepostImg){
          object-fit:${isOtherProfile && !mobileView && "cover"}
        }
        :global(.text-post-container){
          border-radius:${isOtherProfile && !mobileView && "5px !important"}
        }
        .adjustLockPostText{
          margin:1px !important
        }
        :global(.adjustRadiusForBlur>div>div){
          border-radius:4px !important;
         }

        :global(.schedulePost){
          position: absolute;
          bottom: 10px;
          border: none;
          padding: 5px 20px;
          border-radius: 32px;
          left: 50%;
          transform: translate(-50%, -0%);
          width: 127px;
          padding-bottom: 6px;
          color:white;
          font-weight:400;
          font-size:12px;
        }
        :global(.notActivePost){
          background:transparent;
          border: 2px solid#fff;
          font-weight: 500;
        }
        :global(.activePost){
          background:var(--l_base);
          border:none;
        }
        :global(.disableBtn:disabled){
          background:transparent;
          border:2px solid white;
          padding:10px 15px !important;
          font-weight:500;
          border-radius: 30px;
          // opacity:50%;
        }
        :global(.disableBtn){
          background:var(--l_base);
          padding:11px 15px !important;
          font-weight:500 !important;
          border-radius: 30px !important;
        }
        :global(.adjustBoxShadow){
          background-position: center;
          border-radius: 4px;
        }
        
      `}</style>
    </>
  );
}
