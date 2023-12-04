import Route from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Image from "../../../components/image/image";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import useBookmark from "../../../hooks/useBookMark";
import * as config from "../../../lib/config";
import { findDayAgo } from "../../../lib/date-operation/date-operation";
import { authenticate, isOwnProfile } from '../../../lib/global/routeAuth'
import {
  close_dialog,
  close_drawer,
  close_progress,
  open_dialog,
  open_drawer,
  open_progress,
  startLoader,
  startPageLoader,
  stopLoader,
  stopPageLoader,
  Toast,
  updateModelCardPost,
} from "../../../lib/global/loader";
import { handleContextMenu, openCollectionDialog } from "../../../lib/helper";
import { getCookie, setCookie } from "../../../lib/session";
// import Video from "../image/video";
// import Image from "../image/image";
import { deletePost, postLikeDislike } from "../../../services/assets";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import CustomImageSlider from "../../../components/image-slider/ImageSlider";
import MenuModel from "../../../components/model/postMenu";
import TextPost from "../../../components/TextPost/textPost";
import Img from "../../../components/ui/Img/Img";
import { follow } from "../../../services/profile";
import { getComments, postComment } from "../../../services/comments";
import ShowMore from "../../../components/show-more-text/ShowMoreText";
import PageLoader from "../../../components/loader/page-loader";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CustomDataLoader from "../../../components/loader/custom-data-loading";
import { Avatar, Tooltip } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PROFILE_FOLLOWING } from "../../../redux/actions/auth";
import useProfileData from "../../../hooks/useProfileData";
import Icon from "../../../components/image/icon";
import { useTheme } from "react-jss";
import { isAgency } from "../../../lib/config/creds";
import { commentParser } from "../../../lib/helper/userRedirection";
import { scrollToView } from "../../../lib/global/scrollToView";

let theme = "light";

/**
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */

export default function DVExploreModelCard(props) {
  const theme = useTheme();
  const auth = getCookie("auth");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const [lang] = useLang();
  const [propsData, setPropsData] = useState(props);
  const [aspectWidth, setAspectWidth] = useState(null);
  const [isModelOpen, setModelOpen] = useState(false);
  const scrolledPositionRef = useRef(0);
  const moreOptionItems = [
    { label: "Report Post", value: 5 },
    // { label: "Download Post", value: 6 },
  ];
  const ownPostOptionItems = [
    { label: "Edit post", value: 3 },
    { label: "Delete post", value: 4 },
  ];
  const [mobileView] = isMobile();

  const dispatch = useDispatch();
  const [currProfile] = useProfileData();

  const { bookmark, setBookMark, removeBookmark, addBookMarkReq } = useBookmark(
    props.isBookmarked
  );

  const [parsedDescription, setParsedDescription] = useState("");

  //comment states
  const [skip, setSkip] = useState(0);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [commentLoader, setCommentLoader] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [pageChange, setPageChange] = useState(0);
  const commentBoxRef = useRef(null);

  useEffect(() => {
    setBookMark(props.isBookmarked);
  }, [props.isBookmarked]);

  useEffect(() => {
    setAspectWidth(window.innerWidth - 70);
    showMoreDescText(props.postDesc, true);
    startPageLoader();
    getAllComments();
    const commentNode =
      document.getElementById("comment_box") ||
      (commentBoxRef && commentBoxRef.current);
    commentNode.addEventListener("scroll", handleScroller);
    return () => {
      setComment("");
      setCommentList([]);
      setTotalComments(0);
      setCommentLoader(false);
      commentNode.removeEventListener("scroll", handleScroller);
    };
  }, [props.postId]);

  var handleScroller = async () => {
    const commentNode =
      document.getElementById("comment_box") ||
      (commentBoxRef && commentBoxRef.current);
    const isScrollTouchingBottom =
      commentNode.scrollHeight ==
      commentNode.scrollTop + commentNode.clientHeight;
    if (isScrollTouchingBottom) {
      setPageChange(Math.random());
    }
  };

  useEffect(() => {
    const commentNode =
      document.getElementById("comment_box") ||
      (commentBoxRef && commentBoxRef.current);
    const isScrollTouchingBottom =
      commentNode.scrollHeight ==
      commentNode.scrollTop + commentNode.clientHeight;
    if (isScrollTouchingBottom && commentList.length < totalComments) {
      startPageLoader();
      getAllComments(skip + 10);
    }
  }, [pageChange]);

  const getAllComments = (offset = 0) => {
    setSkip(offset);
    const list = {
      postId: props.postId,
      skip: offset,
    };
    getComments(list)
      .then((res) => {
        let response = res;
        if (response?.data?.data?.length) {
          if (offset == 0) {
            setCommentList(response.data.data);
          } else {
            setCommentList((prev) => {
              return [...prev, ...response.data.data];
            });
          }
          setTotalComments(response.data.totalCount);
        }
        setCommentLoader(false);
        stopPageLoader();

        updateModelCardPost(props.postId, {
          commentCount: response?.data?.totalCount
        });
      })
      .catch((err) => {
        console.error(err);
        // stopLoader()
        stopPageLoader();
        setCommentLoader(false);
      });
  };

  useEffect(() => {
    setPropsData(props);
  }, []);

  const showMoreDescText = (text, flag) => {
    const count = mobileView ? 100 : 200;
    if (!text || text.length <= count || !flag) {
      setParsedDescription(text);
    } else {
      let nText = [...text].splice(0, count - 10).join("");
      setParsedDescription(nText);
    }
  };

  //Function to Like/DisLike the post
  // Modified By Bhavleen on April 19th, 2021
  const handleLikeDislike = () => {
    setPropsData({
      ...propsData,
      isLiked: !propsData.isLiked,
      likeCount: propsData.isLiked
        ? propsData.likeCount - 1
        : propsData.likeCount + 1,
    });

    let payload = {
      userId: isAgency() ? selectedCreatorId : getCookie("uid"),
      assetid: props.postId,
      like: !propsData.isLiked,
    };

    postLikeDislike(payload)
      .then((res) => {
        let response = res;
        let propsIns = { ...propsData };
        if (response.status == 200) {
          propsIns.likeCount = propsData.isLiked
            ? propsData.likeCount - 1
            : propsData.likeCount + 1;
          propsIns.isLiked = !propsData.isLiked;
          setPropsData(propsIns);

          updateModelCardPost(propsIns.postId, {
            isLike: propsIns.isLiked,
            totalLike: propsIns.likeCount,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setPropsData({
          ...propsData,
          isLiked: false,
          likeCount: propsData.likeCount - 1,
        });
      });
  };

  const back = () => {
    close_drawer();
  };

  const handlePurchasePost = (data = {}) => {
    authenticate().then(() => {
      open_drawer(
        "buyPost",
        {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price,
          currency: (props.currency && props.currency.symbol) || "$",
          updatePostPurchase,
          postType: props.postType,
        },
        "bottom"
      );
    });
  };

  const TimeLinePost = (height) => {
    // if (props.postImage && props.postImage[0] && props.postImage[0].type == 2) {
    //   return (
    //     // <CloudinaryVideo
    //     // publicId={props.postImage[0].url}
    //     // thumbnail={props.postImage[0].thumbnail}
    //     // isVisible={propsData.isVisible || 0}
    //     // updatePostPurchase={updatePostPurchase}
    //     // onClick={() => {
    //     //   if (propsData.isVisible || props.postType == 3) {
    //     //     open_post_dialog({
    //     //       data: props.postImage,
    //     //       postType: props.postType,
    //     //       width: aspectWidth + 70,
    //     //     });
    //     //   }
    //     // }}
    //     // className={mobileView ? `postImg` : "dv__postImg"}
    //     // postId={props.postId}
    //     // postType={props.postType}
    //     // width={aspectWidth > 900 ? 900 : aspectWidth}
    //     // />
    //     <FeedVideoPlayer
    //       publicId={props.postImage[0].url}
    //       thumbnail={props.postImage[0].thumbnail}
    //       isVisible={props.isVisible || 0}
    //       updatePostPurchase={updatePostPurchase}
    //       className="dv__explorepostImg"
    //       tileLockIcon={props.isVisible == 1 ? true : false}
    //       postId={props.postId}
    //       postType={props.postType}
    //       price={props.price}
    //       currency={props.currency}
    //       setVideoAnalytics={props.setVideoAnalytics}
    //       width="auto"
    //       height={height}
    //       crop="fit"
    //       subscribedEvent={props.subscribedEvent}
    //       userId={props.userId}
    //       username={props?.username || props?.userName}
    //       isExplorePage={true}
    //     />
    //   );
    // } else 
    if (props.postImage && props.postImage[0] && props.postImage[0].type == 4) {
      return (
        <TextPost
          className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
          postType={props.postType}
          price={props.price}
          currency={props.currency}
          isVisible={props.isVisible}
          userId={props.userId}
          postId={props.postId}
          updateTipHandler={updateTipHandler}
          updatePostPurchase={updatePostPurchase}
          tileLockIcon={propsData.isVisible == 1 ? true : false}
          // handlePurchasePost={handlePurchasePost}
          subscribedEvent={props?.subscribedEvent}
          onClick={() => {
            // if (propsData.isVisible || props.postType == 3 || props.userId == userId) {
            // 	open_post_dialog({
            // 		data: props.postImage,
            // 		postType: props.postType,
            // 		width: aspectWidth + 70,
            // 	});
            // }
          }}
          width={aspectWidth > 900 ? 900 : aspectWidth}
          textPost={props.postImage}
          alt={props.fullName}
          username={props?.username || props?.userName}
          isExplorePage={true}
        />
      )
    } else {
      return (
        <CustomImageSlider
          aspectWidth={aspectWidth}
          post={props.post}
          className="dv__explorepostImg"
          postType={props.postType}
          price={props.price}
          currency={props.currency}
          tileLockIcon={props.isVisible == 1 ? true : false}
          isVisible={props.isVisible || 0}
          userId={props.userId}
          postId={props.postId}
          updatePostPurchase={updatePostPurchase}
          updateTipHandler={updateTipHandler}
          onClick={() => {
            if (props.postType == 3 || propsData.isVisible || props.userId == uid) {
              const post = props.post;
              const assets = [];
              if (post.previewData && post.previewData.length > 0) {
                const previewList = post.previewData.map((file, idx) => {
                  return ({
                    id: idx + 1,
                    seqId: idx + 1,
                    mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
                    mediaThumbnailUrl: file.thumbnail || file.url,
                    mediaUrl: file.url || file.thumbnail,
                    isPreview: true
                  })
                })
                assets = [...previewList]
              }

              const postImages = post.postData.map((file, idx) => {
                return ({
                  id: idx + post.previewData ? post.previewData.length : 1,
                  seqId: idx + post.previewData ? post.previewData.length : 1,
                  mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
                  mediaThumbnailUrl: file.thumbnail || file.url,
                  mediaUrl: file.url || file.thumbnail,
                })
              })

              assets = [...assets, ...postImages]

              open_drawer("openMediaCarousel", {
                assets: assets,
                selectedMediaIndex: 0,
                scrolledPositionRef: scrolledPositionRef,
              }, "right")
            }
            // if(!propsData.isVisible && props.postType == 1){
            //   authenticate().then(()=>{
            //     handlePurchasePost()
            //   })
            // }
          }}
          width="auto"
          height={height}
          crop="scale"
          imagesList={props.postImage.filter(f => f.seqId !== 0)}
          username={props?.username || props?.userName}
          isExplorePage={true}
          subscribedEvent={props?.subscribedEvent}
          style={{ objectFit: !mobileView ? "cover" : "" }}
        />
      );
    }
  };

  const getLatestComment = (data) => {
    let assetIns = { ...propsData };
    assetIns["latestComment"] = data.latestComment;
    assetIns["commentCount"] = data.commentCount || data.commentCount_x || data.commentCount_y;
    setPropsData(assetIns);
  };

  const handleCommentBox = (theme = "dark") => {
    mobileView
      ? open_drawer(
        "COMMENT",
        {
          drawerData: { postId: props.postId },
          back: () => back(),
          getLatestComment: (data) => getLatestComment(data),
          theme,
          totalLikes: propsData.likeCount,
          totalViews: propsData.viewCount,
          profileName: props.profileName,
          username: props.username || props.userName
        },
        "bottom"
      )
      : open_dialog("COMMENT", {
        drawerData: { postId: props.postId },
        back: () => back(),
        getLatestComment: (data) => getLatestComment(data),
        theme,
        totalLikes: propsData.likeCount,
        totalViews: propsData.viewCount,
        profileName: props.profileName,
        username: props.username || props.userName
      });
  };

  const menuHandler = (option, props) => {
    if (option && option.value == 4 && props && props.postId) {
      mobileView
        ? open_drawer(
          "DeletePost",
          {
            id: props.postId,
            postDelete: postDelete,
            back: () => close_drawer(),
          },
          "bottom"
        )
        : open_dialog("DeletePost", {
          id: props.postId,
          postDelete: postDelete,
          back: () => close_dialog(),
        });
    }
    if (option && option.value == 3 && props && props.postId) {
      open_drawer("EDIT_POST", {
        postId: props.postId,
        data: props
      }, 'bottom')
    }
    if (option && option.value == 5 && props && props.postId) {
      mobileView
        ? open_drawer(
          "REPORT_POST",
          {
            drawerData: {
              reportedId: props.postId,
              reportType: 1,
            },
            back: () => close_drawer(),
          },
          "bottom"
        )
        : open_dialog("REPORT_POST", {
          drawerData: {
            reportedId: props.postId,
            reportType: 1,
          },
          back: () => close_dialog(),
        });
    }
  };

  const postDelete = (id) => {
    const payload = {
      postIds: [id],
    };

    startLoader();
    deletePost(payload)
      .then((res) => {
        let response = res;
        if (response.status == 200) {
          props.deletePostEvent && props.deletePostEvent(id);
          stopLoader();
          Toast("Post deleted successfully!");
          return;
        }
      })
      .catch((err) => {
        stopLoader();
        Toast(
          err.response && err.response.data && err.response.data.message,
          "error"
        );
        return;
      });
  };

  const handleSharePost = () => {
    mobileView
      ? open_drawer(
        "SHARE_ITEMS",
        {
          postId: props.postId,
          shareType: "post",
          username: (props.username || props.userName),
          back: () => close_drawer(),
        },
        "bottom"
      )
      : open_dialog(
        "SHARE_ITEMS",
        {
          postId: props.postId,
          shareType: "post",
          username: (props.username || props.userName),
          back: () => close_dialog("SHARE_ITEMS"),
        },
        "bottom"
      );
  };

  const profileClickHandler = () => {
    open_progress();
    if (getCookie("uid") == props.userId) {
      props.setActiveState && props.setActiveState("profile");
      Route.push(`/profile`);
    } else {
      setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id}`)
      Route.push(`${props?.username || props?.userName}`);
    }
  };

  const updateTipHandler = (data) => {
    // console.log("updateTipHandler", data);
    let assetIns = { ...propsData };
    assetIns["totalTipReceived"] =
      (Number(propsData.totalTipReceived) || 0) + Number(data);
    setPropsData({ ...assetIns });

    updateModelCardPost(assetIns.postId, {
      totalTipReceived: assetIns.totalTipReceived,
    });
  };

  const updatePostPurchase = (postData) => {
    let assetIns = { ...propsData };
    assetIns["isVisible"] = 1;
    setPropsData(assetIns);
    if (postData) {
      updateModelCardPost(assetIns.postId, {
        isVisible: 1,
        postData,
      });
    } else {
      updateModelCardPost(assetIns.postId, {
        isVisible: 1,
      });
    }
  };

  const handleBookMark = () => {
    const requestPayload = {
      postId: props.postId,
      collectionId: props.collectionId,
    };
    if (isAgency()) {
      requestPayload["userId"] = selectedCreatorId;
    }
    addBookMarkReq({
      requestPayload: requestPayload,
      cb: () => {
        setBookMark(true);
      },
    });
  };

  const handleFollowUser = () => {
    open_progress();
    const payload = {
      followingId: propsData.userId,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    follow(payload)
      .then((res) => {
        Toast(res.data && res.data.message, "success");
        const cardDataInstance = { ...propsData };
        cardDataInstance.isFollowed = 1;
        setPropsData(cardDataInstance);
        close_progress();
        dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
        props.followUnfollowEvent(propsData.userId);
      })
      .catch((error) => {
        console.error(error);
        Toast(
          error && error.response && error.response.data
            ? error.response.data.message
            : "Failed to follow this creator",
          "warning"
        );
        close_progress();
      });
  };

  // Commented on 22nd March by Bhavleen
  // const handleSubmitComment = (e) => {
  //   if (e.key === "Enter") {
  //     commentSubmitHandler(e);
  //   }
  // };

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    if (!comment) return;

    setCommentLoader(true);
    scrollToView("comment_box");
    const payload = {
      comments: comment,
      assetId: props.postId,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    postComment(payload)
      .then(async (res) => {
        // console.log(res);
        setComment("");
        await getAllComments();
        setCommentLoader(false);
      })
      .catch((error) => {
        console.error(error);
        setComment("");
        setCommentLoader(false);
        Toast(
          error && error.response
            ? error.response.message
            : "Your are not allowed to comment this post!",
          "error"
        );
      });
  };

  const CommentCard = (data = {}) => {
    return (
      // <a key={data._id} className="nav-link" data-toggle="pill" href="#chat5">
      <div key={data._id} className="row align-items-end mx-0 mb-3">
        <div className={`col-12 ${mobileView ? "pr-1" : ""}`}>
          <div className="form-row align-items-start">
            <div className="col-auto callout-none" onContextMenu={handleContextMenu}>
              {data?.users?.profilePic ? (
                <FigureCloudinayImage
                  publicId={
                    data?.users?.profilePic
                      ? data?.users?.profilePic
                      : config.EMPTY_PROFILE
                  }
                  className="live"
                  errorImage={config.EMPTY_PROFILE}
                  style={
                    mobileView
                      ? { borderRadius: "50%" }
                      : {
                        maxWidth: "2.781vw",
                        maxHeight: "2.781vw",
                        borderRadius: "50%",
                      }
                  }
                  width={50}
                  height={50}
                />
              ) : (
                <Avatar className="mui-cust-avatar-dv"
                  style={{
                    maxWidth: "2.781vw",
                    maxHeight: "2.781vw",
                  }}>
                  {data?.users?.firstName[0]}
                </Avatar>
              )}
              {/* <span className="mv_online_true" /> */}
            </div>
            <div className="col">
              <div className="row justify-content-between">
                <div className="col-auto">
                  <div
                    className={
                      mobileView
                        ? "mv_comment_name dv_appTxtClr"
                        : "txt-roman dv__fnt12 dv__Grey_var_11"
                    }
                  >
                    {data.users
                      ? data.users.firstName + " " + data.users.lastName
                      : ""}
                  </div>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-auto">
                  <div
                    className={
                      mobileView
                        ? "mv_chat_pro_status muted"
                        : "txt-roman dv__lightGrey_color dv__fnt12"
                    }
                  >
                    {/* {data.comments} */}
                    <ShowMore text={data.comments} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto align-self-start pt-1">
              <div
                style={{
                  textDecoration: "none",
                  cursor: "context-menu",
                }}
                className={
                  mobileView
                    ? "mv_chat_pro_status"
                    : "dv__Grey_var_11 txt-roman dv__fnt12"
                }
              >
                {findDayAgo(data.creationTs * 1000)}
              </div>
            </div>
          </div>
        </div>
      </div>
      // </a>
    );
  };

  return (
    <React.Fragment>
      <div key={props.postId} className="col-12 card-post p-0">
        <div className="row m-0 align-items-center justify-content-center">
          <div className="col-6 p-0">
            <div
              className="row m-0"
              style={{
                minHeight: "160px",
                maxHeight: "36.603vw",
                overflow: "hidden",
              }}
            >
              <div className="col-12 pl-0">
                {/* <TimeLinePost /> */}
                {TimeLinePost(340)}
              </div>
            </div>
          </div>
          <div className="col-6 pl-0 pb-2">
            <div className="row m-0 align-items-center justify-content-between py-3">
              <div className="col-auto pl-0 profile-title">
                <div className="row align-items-end">
                  <div className="col-auto pr-0 position-relative callout-none" onContextMenu={handleContextMenu}>
                    <FigureCloudinayImage
                      publicId={props.profileLogo}
                      className="live cursorPtr"
                      onClick={profileClickHandler}
                      style={
                        mobileView
                          ? {
                            borderRadius: "50%",
                            maxWidth: "42px",
                            maxHeight: "42px",
                          }
                          : {
                            borderRadius: "50%",
                            maxWidth: "3.660vw",
                            maxHeight: "3.660vw",
                          }
                      }
                      width={42}
                      height={42}
                    />
                    {mobileView ? (
                      <Image
                        src={config.Creator_Icon}
                        className="postCreatorIcon"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center justify-content-between dv__post_pro_name">
                      <p
                        role="button"
                        className="m-0 pr-1 appTextColor"
                        onClick={profileClickHandler}
                      >
                        {props.profileName}
                      </p>
                      {!mobileView ? (
                        <Image
                          src={config.Creator_Icon}
                          width={20}
                          height={20}
                        />
                      ) : (
                        ""
                      )}

                      {propsData.isFollowed == 0 &&
                        (uid !== propsData.userId) && (
                          <>
                            {mobileView ? (
                              <span
                                style={{
                                  color: "lightgrey",
                                  marginLeft: "6px",
                                }}
                              >
                                &#8729;
                              </span>
                            ) : (
                              <span
                                style={{
                                  width: "0.293vw",
                                  height: "0.293vw",
                                  borderRadius: "50%",
                                  background: "#ffffff",
                                  marginLeft: "0.366vw",
                                }}
                              ></span>
                            )}
                            <p
                              className="dv__feed_follow_btn m-0 txt-heavy"
                              onClick={() => {
                                authenticate().then(() => {
                                  handleFollowUser();
                                });
                              }}
                            >
                              {lang.follow}
                            </p>
                          </>
                        )}
                    </div>
                    <div className="dv__lastSeenTime dv__lightGrey_color">
                      {findDayAgo(props.onlineStatus)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto row pl-0">
                <Tooltip title={lang.postInsight}>
                  <div>
                    {props.userId != uid ? (
                      ""
                    ) : (
                      <Img
                        onClick={() =>
                          authenticate().then(() => {
                            Route.push(
                              `/dashboard/${props.postId}?f=3&t=1&ct=5`
                            );
                          })
                        }
                        className="pointer ml-auto mx-2"
                        style={{
                          width: "20px",
                          height: "auto",
                        }}
                        src={config.INSIGHT}
                        width={14}
                      />
                    )}
                  </div>
                </Tooltip>

                <Tooltip title={lang.share}>
                  <div>
                    {!props.isSharedPost && (
                      <Icon
                        onClick={() =>
                          authenticate().then(() => {
                            handleSharePost();
                          })
                        }
                        icon={`${config.DV_Share_Icon_Black}#exploreShareIcon`}
                        color={theme?.text}
                        class="dv__pointer mx-2"
                        alt="share"
                        size={mobileView ? 23 : 1.730}
                        unit={mobileView ? "px" : "vw"}
                        viewBox="0 0 14.712 20.229"
                      />
                    )}
                  </div>
                </Tooltip>

                <MenuModel
                  items={
                    props.userId == uid ? ownPostOptionItems : moreOptionItems
                  }
                  isOwnProfile={isOwnProfile(props.userId)}
                  imageWidth={24}
                  handleChange={(e) => {
                    authenticate().then(() => {
                      menuHandler(e, props);
                    });
                  }}
                  iconColorWhite={theme.type === "light" ? false : true}
                  selected={{ label: "Revenue", value: 1 }}
                />
                {/* <img
            onClick={() =>
              authenticate().then(() => {
                handleClickMoreOptions();
              })
            }
            className={`pointer ml-2 ${!props.isSharedPost && 'rotate90'}`}
            src={config.MORE_ICON}
            width={16}
          /> */}
              </div>
            </div>
            <div style={{ height: "17.237vw" }}>
              <div
                id="comment_box"
                ref={commentBoxRef}
                className={`chat_cont comment_cont h-100 ${theme == "light" && "comment_section_wht"
                  } ${mobileView ? "" : "pt-0"}`}
              >
                <p className="text-center muted">
                  {commentLoader && (
                    <CustomDataLoader type="PulseLoader" size={10} />
                  )}
                </p>
                {!commentList.length && !commentLoader && (
                  <div style={{ backgroundImage: `url(${config.COMMENT_PLACEHOLDER_IMAGE})` }} className="text-muted comment_placeholder">
                    {lang.commentPlaceholder}
                  </div>
                )}
                {commentList.map((commentItem) => {
                  return CommentCard(commentItem);
                })}
                <div className="text-center">
                  <PageLoader />
                </div>
              </div>
            </div>
            <div className="row justify-content-between align-items-center mb-2">
              <div className="col-auto">
                <div className="row align-items-end">
                  <div className="col-auto">
                    <div
                      className="form-row align-items-end"
                      onClick={() => {
                        authenticate().then();
                      }}
                    >
                      <div
                        className="col-auto pl-1"
                        onClick={() => (auth ? handleLikeDislike() : "")}
                      >
                        <Icon
                          icon={`${config.LIKE_ICON}#like_icon`}
                          color={
                            propsData.isLiked
                              ? theme.palette.l_red
                              : theme.palette.white
                          }
                          size={17}
                          class="pointer"
                          style={
                            mobileView
                              ? { marginBottom: "3px" }
                              : { maxWidth: "1.434vw" }
                          }
                          viewBox="0 0 21.095 17.86"
                        />
                      </div>
                      <div className="col-auto pl-0 dv__post_desc appTextColor">
                        {propsData.likeCount || 0}
                      </div>
                    </div>
                  </div>

                  <div className="col-auto p-0">
                    <div
                      className="form-row align-items-end pointer"
                    // onClick={() =>
                    //   auth ? handleCommentBox() : authenticate().then()
                    // }
                    >
                      <div className="col-auto">
                        <Icon
                          icon={`${config.COMMENT_ICON_Dark}#comment`}
                          color={theme.text}
                          width={18}
                          viewBox="0 0 19.529 19.534"
                          class="pointer"
                          alt="comment_icon"
                        />
                      </div>
                      <div className="col-auto pl-0 dv__post_desc appTextColor">
                        {propsData.commentCount || 0}
                      </div>
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="form-row align-items-center">
                      <div className="col-auto dv__post_desc appTextColor">
                        ${propsData.totalTipReceived || "0.00"}{" "}
                        <span> tips</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="form-row align-items-center cursorPtr">
                  {props.postType != "1" && (
                    <div
                      className="col-auto pl-0 py-2 pr-3"
                      onClick={() => {
                        authenticate().then(() => {
                          bookmark
                            ? props.removeBookmark
                              ? props.removeBookmark({
                                postIds: [props.postId],
                                index: props.index,
                              })
                              : removeBookmark({
                                postIds: [props.postId],
                                userId: isAgency() ? selectedCreatorId : ""
                              })
                            : props.collectionId
                              ? handleBookMark()
                              : openCollectionDialog(
                                {
                                  postId: props.postId,
                                  postData: props.postImage,
                                  collectionId: props.collectionId,
                                  updateBookMark: () => setBookMark(true),
                                },
                                mobileView
                              );
                        });
                      }}
                    >
                      {/* <Img
                        src={
                          bookmark
                            ? config.BOOKMARKED
                            : config.BOOKMARK_ICON_Dark
                        }
                        width={12}
                        alt="bookmarked"
                        style={mobileView ? {} : { maxWidth: "0.956vw" }}
                      /> */}
                      {theme?.type == "light" ? <Icon
                        icon={`${config.BOOKMARK_ICON}#bookmark`}
                        color={bookmark ? theme.appColor : theme.palette.white}
                        size={16}
                        class="mx-2"
                        viewBox="0 0 16.56 21.638"
                      />
                        :
                        <Icon
                          icon={`${config.BOOKMARK_DARK_ICON}#bookmark_dark`}
                          color={bookmark ? theme.appColor : theme.palette.black}
                          size={16}
                          class="d-flex"
                          viewBox="0 0 16.56 21.638"
                        />
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className={mobileView ? "dv_post_desc" : "dv__post_desc"}>
                <strong
                  role="button bold"
                  onClick={() => authenticate().then()}
                >
                  {props.profileName}
                </strong>
                {"  "}
                <span style={{ color: theme?.text }} className="post_desc_text">
                  {props.postDesc && commentParser(parsedDescription, props?.taggedUsers)}
                  {props.postDesc &&
                    props.postDesc.length > (mobileView ? 100 : 200) &&
                    (parsedDescription.length > (mobileView ? 100 : 200) ? (
                      <a onClick={() => showMoreDescText(props.postDesc, true)}>{lang.showLess}</a>
                    ) : (
                      <a
                        onClick={() => showMoreDescText(props.postDesc, false)}
                        className="cursorPtr"
                      >{lang.showMore}</a>
                    ))}
                </span>
              </span>
            </div>
            {/* <a className="dv__lastSeenTime mb-1 d-block dv__lightGrey_color">
              {lang.viewAll} {propsData.commentCount || 0} {lang.comments}
            </a> */}
            <form
              className={`col-auto p-0 d-flex justify-content-center 
                ${!mobileView ? "dv__inp_chat_cont_light" : "inp_chat_cont_dark"
                }`}
            >
              <TextareaAutosize
                type="text"
                placeholder="Add comments"
                value={comment}
                rows={1}
                rowsMax={3}
                autoFocus
                className="form-control dv__form-control-textarea_exploreuser ml-0 my-2 mr-2"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              // onKeyDown={
              //   handleSubmitComment
              // }
              />
              <SendIcon
                className="send-icon cursorPtr"
                onClick={commentSubmitHandler}
              />
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(.MuiList-padding) {
          padding: 0 10px;
          margin-top: 5px;
        }
        :global(.MuiMenu-paper) {
          margin-top: 5px;
        }
        .post_desc_text a {
          text-decoration: none;
        }
      `}</style>
    </React.Fragment>
  );
}
