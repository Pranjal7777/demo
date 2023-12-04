import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Route from "next/router";
import { Skeleton } from "@material-ui/lab";
import { Avatar } from "@material-ui/core";

import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import CustomImageSlider from "../../image-slider/ImageSlider";
import TextPost from "../../TextPost/textPost";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";;
import Header from "../../header/header";
import { close_dialog, open_progress, Toast } from "../../../lib/global";
import { getPostsDetails } from "../../../services/bulkMessage";
import { getCookie, setCookie } from "../../../lib/session";
import { commentParser } from "../../../lib/helper/userRedirection";

const BulkMsgViewer = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const uid = getCookie("uid");
  const { parsedMedia, message } = props;
  const [parsedDescription, setParsedDescription] = useState("");

  // Redux State
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  // Local State
  const [postData, setPostData] = useState();

  useEffect(() => {
    getPostsDetailsAPI(props.parsedMedia.postId);
  }, []);

  const getPostsDetailsAPI = async (postId) => {
    try {
      const res = await getPostsDetails(postId);
      setPostData(res.data.data);

    } catch (err) {
      console.error("ERROR IN getPostsDetailsAPI", err);
      Toast(err?.response?.data?.message || lang.somethingWrong)
    }
  }

  const profileClickHandler = () => {
    if (props.isHashtagPost) {
      let hashtagName = props.hashtagName;
      let hashtag = hashtagName.replace("#", "");

      mobileView
        ? open_drawer("HashtagFollow", {
          hashtag: hashtagName,
          S3_IMG_LINK,
        }, "right")
        : Route.push(`/explore/${hashtag}`);

    } else {
      open_progress();
      if (uid == postData.userId) {
        postData.setActiveState && postData.setActiveState("profile");
        Route.push("/profile");
      } else {
        setCookie("otherProfile", `${postData.username || postData.userName}$$${postData.userId || postData.userid || postData._id}`)
        Route.push(`${postData.username || postData.userName}`);
      }
    }

    close_dialog();
  };
  const TimeLinePost = () => {
    // if (postData.postData[0].type === 2) {
    //   return (
    //     <FeedVideoPlayer
    //       publicId={postData.postData[0].url}
    //       thumbnail={postData.postData[0].thumbnail}
    //       isVisible={postData.isVisible || 0}
    //       // updatePostPurchase={updatePostPurchase}
    //       // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__postImg"}
    //       postId={postData.postId}
    //       postType={postData.postType}
    //       price={postData.price || 0}
    //       userId={postData.userId}
    //       currency={postData.currency.symbol || "$"}
    //       height={"450px"}
    //       width={"450px"}
    //       // setVideoAnalytics={postData.setVideoAnalytics}
    //       // width={aspectWidth > 900 ? 900 : aspectWidth}
    //       // subscribedEvent={props.subscribedEvent}
    //       alt={"Video Bulk Post"}
    //       isGridView={false}
    //       HideUnlockAndDollar={true}
    //       showIconsOnTop={true}

    //     // latestPage={props.latestPage}
    //     />
    //   );
    // } else 
    if (postData.postData[0].type === 1 || postData.postData[0].type === 2) {
      return (
        <CustomImageSlider
          // aspectWidth={aspectWidth}
          post={postData}
          coverImage={postData.previewData ? postData.previewData[0]?.url : undefined }
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__postImg"}
          postType={postData.postType}
          price={postData.price || 0}
          currency={postData.currency.symbol || "$"}
          isVisible={postData.isVisible || 0}
          userId={postData.userId}
          postId={postData.postId}
          height={"450px"}
          width={"100%"}
          // updateTipHandler={updateTipHandler}
          // updatePostPurchase={updatePostPurchase}
          // onClick={() => {
          //   if (props.postType == 3 || propsData.isVisible || props.userId == uid) {
          //     open_post_dialog({
          //       data: props.postImage,
          //       postType: props.postType,
          //       width: aspectWidth + 70,
          //     });
          //   }
          // }}
          // width={aspectWidth > 900 ? 900 : aspectWidth}
          imagesList={postData.postData.filter(f => f.seqId!==0)}
          // subscribedEvent={props.subscribedEvent}
          alt={"Image Bulk Post Viewer"}
          isGridView={false}
          HideUnlockAndDollar={true}
          showIconsOnTop={true}
        />
      )
    }
    else {
      return (
        <TextPost
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__profilepostImg"}
          postType={postData.postType}
          price={postData.price || 0}
          currency={postData.currency.symbol || "$"}
          isVisible={postData.isVisible || 0}
          userId={postData.userId}
          postId={postData.postId}
          // updateTipHandler={updateTipHandler}
          // updatePostPurchase={updatePostPurchase}
          // handlePurchasePost={handlePurchasePost}
          // subscribedEvent={props.subscribedEvent}
          // onClick={() => {
          // 	if (propsData.isVisible || props.postType == 3 || props.userId == userId) {
          // 		open_post_dialog({
          // 			data: props.postImage,
          // 			postType: props.postType,
          // 			width: aspectWidth + 70,
          // 		});
          // 	}
          // }}
          // width={aspectWidth > 900 ? 900 : aspectWidth}
          height={"450px"}
          width={"450px"}
          textPost={postData.postData}
          alt={"Text Bulk Post"}
          isGridView={false}
          HideUnlockAndDollar={true}
          showIconsOnTop={true}
        />
      );
    }
  };

  const showMoreDescText = (text, flag) => {
    const count = mobileView ? 100 : 200;
    if (!text || text.length <= count || !flag) {
      setParsedDescription(text);
    } else {
      let nText = [...text].splice(0, count - 10).join("");
      setParsedDescription(nText);
    }
  };

  const postViews = () => {
    return (
      <div className="container">
        {postData
          ? <div className="col-12 card-post py-3" style={{ width: "450px" }}>
            {/* Post Header */}
            <div className="row m-0 align-items-center mb-1 cursorPtr d-flex justify-content-between"
              onClick={profileClickHandler}>

              <div className="d-flex align-items-center">
                <Avatar src={s3ImageLinkGen(S3_IMG_LINK, postData.profilePic, 30, 42, 42)} alt={postData.username}
                  className="mr-2 text-uppercase" />
                <p className={mobileView ? "m-0 fntSz17" : "m-0 fntSz15 fntWeight600"}>
                  {postData.username}
                </p>
              </div>

            </div>

            {/* Post Content */}
            <div className="row mb-3 mx-0">
              <div className="col-12">{TimeLinePost()}</div>
            </div>

            {/* Caption */}
            {postData.postData[0].type !== 4 ? <div className="mb-2" style={{ height: "4rem", overflowY: "auto", wordBreak: "break-word" }}>
              <span className={mobileView ? "dv_post_desc" : "dv__post_desc"}>
                <strong role="cursorPtr bold" onClick={profileClickHandler}>
                  {postData.username}
                </strong>
                <span style={{ color: theme.text }} className="ml-2 post_desc_text">
                  {postData.description}
                  {/* {postData &&
                    postData.description && commentParser(parsedDescription, props?.taggedUsers)
                  } */}
                  {/* {postData && postData.description &&
                    postData.description.length > (mobileView ? 100 : 200) &&
                    (parsedDescription.length > (mobileView ? 100 : 200) ? (
                      <a
                        onClick={() => showMoreDescText(postData.description, true)}
                        className="cursorPtr"
                      >
                        {lang.showLess}
                      </a>
                    ) : (
                      <a
                        onClick={() => showMoreDescText(postData.description, false)}
                        className="cursorPtr"
                      >
                        {lang.showMore}
                      </a>
                    ))} */}
                </span>
              </span>
            </div> : ""}
            {/* ... */}
          </div>
          : <Skeleton
            variant="rect"
            width="500px"
            height="500px"
          />
        }
        <style jsx>{`
        .dv__btn_price_tag{
          position:inherit !important;
        }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {mobileView
        ? <div className="btmModal text-app bg-dark-custom">
          <div>
            <Header
              id="bulkMsgHeader"
              back={props.onClose}
              closeTrigger={props.onCloseDrawer}
              title={parsedMedia.postType === "LOCKED_POST" ? lang.uploadLockedPost : lang.bulkMsg}
            />
            <div className="pb-4" style={{ marginTop: "70px" }}>
              {postViews()}
            </div>
          </div>
          <style>{`
          .global-nav-header {
            box-shadow:none;
          }
          `}</style>
        </div>
        : <div className="pt-3 px-5">
          <div className="text-center">
            <h5 className="txt-black dv__fnt30">{parsedMedia.postType === "LOCKED_POST" ? lang.uploadLockedPost : lang.bulkMsg}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>

          {postViews()}

        </div>
      }

    </>
  );
};

export default BulkMsgViewer;
