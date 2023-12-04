import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Route, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useBookmark from "../../hooks/useBookMark";
import * as config from "../../lib/config";
import { findDayAgo } from "../../lib/date-operation/date-operation";
import { openCollectionDialog } from "../../lib/helper";
import { getCookie, setCookie } from "../../lib/session";
import { getComments, postComment } from "../../services/comments";
import { follow } from "../../services/profile";
import { deletePost, postLikeDislike } from "../../services/assets";
import { UPDATE_PROFILE_FOLLOWING } from "../../redux/actions/auth";
import useProfileData from "../../hooks/useProfileData";
import { authenticate, isOwnProfile } from '../../lib/global/routeAuth';
import {
  close_dialog,
  close_drawer,
  close_progress,
  open_dialog,
  open_drawer,
  open_progress,
  startLoader,
  stopLoader,
  Toast,
  updateModelCardPost,
} from "../../lib/global/loader";

const Image = dynamic(() => import("../../components/image/image"), {
  ssr: false,
});
const CustomImageSlider = dynamic(() => import("../../components/image-slider/ImageSlider"), {
  ssr: false,
});
const MenuModel = dynamic(() => import("../../components/model/postMenu"), { ssr: false });

const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), {
  ssr: false,
});
import { getProfile } from "../../services/auth";
import { useTheme } from "react-jss";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import CommentTile from "../../components/commentTile/CommentTile"
import { isAgency } from "../../lib/config/creds";
import { authenticateUserForPayment, scrollToView } from "../../lib/global";
import { useChatFunctions } from "../../hooks/useChatFunctions";
const SendIcon = dynamic(() => import("@material-ui/icons/Send"), { ssr: false });
const Icon = dynamic(() => import("../../components/image/icon"), { ssr: false });
const TextareaAutosize = dynamic(() => import("@material-ui/core/TextareaAutosize"), { ssr: false });


/**
 * Updated By @author Pranjal K
 * @date 15/Sept/2022
 */
export default function HashTagPopup(props) {
  const theme = useTheme();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const auth = getCookie("auth");
  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const [lang] = useLang();
  const [propsData, setPropsData] = useState(props);
  const [aspectWidth, setAspectWidth] = useState(null);
  const [comment, setComment] = useState([])
  const loading = React.useRef(false);
  const [pageChange, setPageChange] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [skip, setSkip] = useState(0);
  const [commentLoader, setCommentLoader] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const { handleChat } = useChatFunctions()


  const router = useRouter();
  const moreOptionItems = [

    // { label: "Download Post", value: 6 },
    { label: "Report Post", value: 5 },
    { label: "Share post", value: 7 },

  ];
  const textPostItem = [
    { label: "Report Post", value: 5 },
  ]
  const ownPostOptionItems = [
    { label: "Edit post", value: 3 },
    { label: "Delete post", value: 4 },
    // { label: "Download Post", value: 6 },
    { label: "Share post", value: 7 },
  ];
  const [mobileView] = isMobile();
  const existingChatList = useSelector((state) => state.chat?.sale) || {};

  const dispatch = useDispatch();
  const [currProfile] = useProfileData();

  const { bookmark, setBookMark, removeBookmark, addBookMarkReq } = useBookmark(props.isBookmarked);

  const [parsedDescription, setParsedDescription] = useState("");
  const userProfileActiveStarusCode = useSelector((state) => state?.profileData?.statusCode);
  const isUserProfileActive = userProfileActiveStarusCode == 5 || userProfileActiveStarusCode == 6 || userProfileActiveStarusCode == 7 ? false : true
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const scrolledPositionRef = useRef(0);
  //   const hashTagLists = useSelector((state) => state?.viewedHashtagPost?.hashtagList);

  //   console.log(hashTagLists,"MAINHERE")



  useEffect(() => {
    setBookMark(props.isBookmarked);
  }, [props.isBookmarked]);

  useEffect(() => {
    setAspectWidth(window.innerWidth - 70);
    showMoreDescText(props.postDesc, true);
  }, []);

  useEffect(() => {
    setPropsData(props);
  }, [props]);

  const showMoreDescText = (text, flag) => {
    const count = mobileView ? 100 : 200;
    if (!text || text.length <= count || !flag) {
      setParsedDescription(text);
    } else {
      let nText = [...text].splice(0, count - 10).join("");
      setParsedDescription(nText);
    }
  };

  const getUserDataShoutout = async (uId) => {
    if (!isUserProfileActive) {
      Toast("You can not create shoutout as your profile is inactive", "info");
      return;
    }
    try {
      mobileView ? startLoader() : open_progress();
      const response = await getProfile(uId, getCookie("token"), getCookie('selectedCreatorId'));
      const userProfileData = response?.data?.data;
      if (!userProfileData.shoutoutPrice) {
        Toast("You can not create shoutout with this creator", "info");
        mobileView ? stopLoader() : close_progress();
        return;
      }
      mobileView ? open_drawer(
        "Shoutout",
        {
          handleCloseDrawer: () => router.push("/"),
          profile: userProfileData,
        },
        "right"
      ) : open_dialog("open_desktop_shoutout", {
        otherprofile: userProfileData,
      })
    } catch (e) {
      mobileView ? stopLoader() : close_progress();
    }
  }

  // Function to Like/DisLike the post
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

  const getLatestComment = async (data) => {
    let assetIns = { ...propsData };

    const payload = {
      postId: propsData.postId,
    };

    await getComments(payload)
      .then((res) => {
        assetIns["latestComments"] = res && res.data && res.data.data;
        assetIns["commentCounts"] = res && res.data && res.data.totalCount;
      })
      .catch((err) => {
        console.error(err);
      });

    updateModelCardPost(assetIns.postId, {
      commentCount: assetIns.commentCounts || assetIns.commentCount,
    });
  };

  const handleCommentBox = () => {
    mobileView
      ? open_drawer("COMMENT", {
        drawerData: { postId: props.postId },
        back: () => back(),
        getLatestComment: (data) => getLatestComment(data),
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
        totalLikes: propsData.likeCount,
        totalViews: propsData.viewCount,
        profileName: props.profileName,
        username: props.username || props.userName
      });
  };

  const menuHandler = (option, props) => {
    if (option && option.value == 4 && props && props.postId) {
      mobileView
        ? open_drawer("DeletePost", {
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
      mobileView
        ? open_drawer("EDIT_POST", {
          postId: props.postId,
          data: props
        }, 'bottom')
        : open_dialog("POST_EDIT_DIALOG", {
          postId: props.postId,
          data: props,
        });
    }
    if (option && option.value == 5 && props && props.postId) {
      mobileView
        ? open_drawer("REPORT_POST", {
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
    if (option?.value == 6 && props && props.postId) {
      props?.postImage.map((pic, index) => {
        if (pic.type === 1) {
          let img = s3ImageLinkGen(S3_IMG_LINK, pic?.url);

          downloadCloudanaryImg(img);
        } else {
          // let video = cloudanaryVideoUrl({
          //   publicId: pic?.url,
          //   VIDEO_LINK,
          // });
          // downloadCloudanaryVideo(video);
        }
      });
    }
    if (option && option.value == 7 && props && props.postId) {
      mobileView
        ? open_drawer("SHARE_ITEMS", {
          postId: props.postId,
          shareType: "post",
          username: (props.username || props.userName),
          back: () => close_drawer(),
        },
          "bottom"
        )
        : open_dialog("SHARE_ITEMS", {
          postId: props.postId,
          shareType: "post",
          username: (props.username || props.userName),
          theme: theme,
          back: () => close_dialog("SHARE_ITEMS"),
        })
    };
  };

  const downloadCloudanaryImg = async (img) => {
    mobileView ? startLoader() : open_progress();
    try {
      const image = await fetch(img);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      let link = document.createElement("a");
      link.href = imageURL;
      link.setAttribute("download", "image.png"); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toast("Images downloaded successfully!");
      mobileView ? stopLoader() : close_progress();
    } catch (e) {
      Toast("Could not download images... Something went wrong", "error");
      mobileView ? stopLoader() : close_progress();
    }
  };

  const downloadCloudanaryVideo = async (video) => {
    mobileView ? startLoader() : open_progress();

    try {
      const vid = await fetch(video);
      const videoBlog = await vid.blob();
      const videoURL = URL.createObjectURL(videoBlog);

      let link = document.createElement("a");
      link.href = videoURL;
      link.setAttribute("download", "video.mp4"); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toast("Video downloaded successfully!");
      mobileView ? stopLoader() : close_progress();
    } catch (e) {
      Toast("Could not download video... Something went wrong", "error");
      mobileView ? stopLoader() : close_progress();
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

  // const handleSharePost = () => {
  //   mobileView
  //     ? open_drawer("SHARE_ITEMS", {
  //       postId: props.postId,
  //       shareType: "post",
  //       username: props.profileName,
  //       back: () => close_drawer(),
  //     },
  //       "bottom"
  //     )
  //     : open_dialog("SHARE_ITEMS", {
  //       postId: props.postId,
  //       shareType: "post",
  //       username: props.profileName,
  //       theme: theme,
  //       back: () => close_dialog("SHARE_ITEMS"),
  //     });
  // };

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
      if (uid == props.userId) {
        props.setActiveState && props.setActiveState("profile");
        Route.push("/profile");
      } else {
        setCookie("otherProfile", `${props.username || props.userName}$$${props.userId || props.userid || props._id}`)
        Route.push(`${props.username || props.userName}`);
      }
    }
  };

  const updateTipHandler = (data) => {
    let assetIns = { ...propsData };
    assetIns["totalTipReceived"] =
      (Number(propsData.totalTipReceived) || 0) + Number(data);
    setPropsData({ ...assetIns });
    updateModelCardPost(assetIns.postId, {
      totalTipReceived: assetIns.totalTipReceived,
    });
  };

  const updatePostPurchase = (postData) => {
    // console.log(postData, 'is the data here');
    // let assetIns = { ...propsData };
    // assetIns["isVisible"] = 1;
    // setPropsData(assetIns);
    if (postData) {
      updateModelCardPost(props.postId, {
        isVisible: 1,
        postData
      });
    } else {
      updateModelCardPost(props.postId, {
        isVisible: 1
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

  const handleBookMarkRemove = () => {
    if (props.removeBookmark) {
      props.removeBookmark({
        postIds: [props.postId],
        index: props.index,
      });
    } else {
      removeBookmark({
        postIds: [props.postId],
        userId: isAgency() ? selectedCreatorId : ""
      });
    }
    close_dialog("confirmDialog");
    close_drawer("confirmDrawer");
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
        props.followUnfollowEvent(propsData.userId);
        close_progress();
        dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
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

  const getOwnUserPost = () => {
    if (props.postType == 1 || props.postType == 2) {
      return ownPostOptionItems;
    } else {
      // let ownItem = ownPostOptionItems.splice(ownPostOptionItems.length - 1, 1);
      return ownPostOptionItems;
    }
  };

  const getOtherUserPost = () => {
    if (props.isVisible != 0) {
      return moreOptionItems;
    } else if (props.postImage && props.postImage[0] && props.postImage[0].type == 4) {
      return textPostItem
    } else {
      let otherItem = moreOptionItems.splice(1, 3);
      return otherItem;
    }
  };


  const [img, setImg] = useState(s3ImageLinkGen(S3_IMG_LINK, props.postImage[0].url))
  console.log(props.comments, "MAINPROPS")



  var handleScroller = async () => {
    console.log("scrollFired")
    const commentNode = document.querySelector(".mappedComments");
    const isScrollTouchingBottom = commentNode?.scrollHeight <= commentNode?.scrollTop + commentNode?.clientHeight + 1;

    if (isScrollTouchingBottom && !loading.current) {
      loading.current = true;
      setPageChange(Math.random());
    }
  };


  useEffect(() => {
    getAllComments()
    const commentNode = document.querySelector(".mappedComments");
    commentNode?.addEventListener("scroll", handleScroller);
    return () => {
      commentNode?.removeEventListener("scroll", handleScroller);
    }
  }, [])


  useEffect(() => {
    const commentNode = document.querySelector(".mappedComments");
    const isScrollTouchingBottom = commentNode?.scrollHeight <=
      commentNode?.scrollTop + commentNode?.clientHeight + 1;

    if (isScrollTouchingBottom && comment.length < totalComments) {
      //   startPageLoader();
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
        if (res && res.data && res.data.data && res.data.data.length) {
          if (offset == 0) {
            setComment(res.data.data);
          } else {
            setComment((prev) => {
              return [...prev, ...res.data.data];
            });
          }
          setTotalComments(res.data.totalCount);
        }
        setCommentLoader(false);
        // stopPageLoader();
        loading.current = false;
      })
      .catch((err) => {
        console.error("ERROR IN getAllComments", err);
        loading.current = false;
        // stopPageLoader();
        setCommentLoader(false);
      });
  };

  console.log(comment, 'commentCheck')

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    startLoader();
    if (!inputComment) return;

    setCommentLoader(true);
    scrollToView("mComments");
    const payload = {
      comments: inputComment,
      assetId: props.postId,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    postComment(payload)
      .then(async (res) => {
        // console.log(res);
        setInputComment("");
        await getAllComments();
        setCommentLoader(false);
        stopLoader();
      })
      .catch((error) => {
        console.error(error);
        setComment("");
        setCommentLoader(false);
        Toast(
          error && error.response
            ? error.response.message
            : lang.commentNotAllowed,
          "error"
        );
        stopLoader();
      });
  };

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    commentSubmitHandler(e)
  }


  return (
    <React.Fragment>
      <div className="parent">
        <div className="ImageDiv">
          {/* <img className="modelImg" src={img && img} /> */}
          <CustomImageSlider
            aspectWidth={aspectWidth}
            post={props.post}
            className={mobileView ? `postImg` : "dv__postImg"}
            postType={props.postType}
            price={props.price}
            currency={props.currency}
            isVisible={props.isVisible || 0}
            userId={props.userId}
            postId={props.postId}
            updateTipHandler={updateTipHandler}
            updatePostPurchase={updatePostPurchase}
            onClick={() => {
              if (props.postType == 3 || propsData.isVisible || props.userId == uid) {
                open_drawer("postCarousel", {
                  post: props.post,
                  data: props.postImage,
                  postType: props.postType,
                  width: aspectWidth + 70,
                },
                  "bottom"
                );
              }
            }}
            // width={aspectWidth > 900 ? 900 : aspectWidth}
            transformWidth={mobileView ? "90vw" : "50vw"} // Exact For Mob - 83vw and For DV - 44vw
            imagesList={props.postImage.filter(f => f.seqId !== 0)}
            subscribedEvent={props.subscribedEvent}
            alt={props.alt}
            username={props.username}
            isProgressiveLoading={true}
          />


        </div>
        <div className="col-12 card-post py-3 h-100 ">
          {/* Post Header */}
          <div className="row m-0 align-items-center justify-content-between mb-3">
            <div className="col-auto pl-0 profile-title">
              <div className="row align-items-end position-relative">
                <div className="col-auto pr-0 position-relative cursorPtr" onClick={profileClickHandler}>
                  {props.profileLogo && (
                    <Image
                      src={s3ImageLinkGen(S3_IMG_LINK, props.profileLogo, 30, 42, 42)}
                      className="live cursorPtr"
                      style={mobileView
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
                  )
                    // : (
                    //   props.isHashtagPost
                    //     ? <Avatar className="hashtags">#</Avatar>
                    // : <Avatar className="feed_avatar text-uppercase solid_circle_border">
                    //   {props.profileLogoText && (
                    //     <span className="feed_avatar_text text-uppercase">
                    //       {props.profileLogoText}
                    //     </span>
                    //   )}
                    // </Avatar>
                    // )
                  }
                </div>
                <div className="col m-auto" style={{ maxWidth: mobileView ? "47vw" : "" }}>
                  <div
                    className={mobileView
                      ? "d-flex align-items-center justify-content-between post_pro_name"
                      : "d-flex align-items-center justify-content-between dv__post_pro_name"
                    }
                  >
                    <h3
                      role="button"
                      className={mobileView ? "m-0 fntSz17 text-truncate" : "m-0 dv__fnt17"}
                      onClick={profileClickHandler}
                    >
                      {props.isHashtagPost ? props.hashtagName : props.username}
                    </h3>
                    {!mobileView ? (
                      <div className="dv__postCreatorIcon">
                        <Image
                          src={props.isHashtagPost
                            ? config.hashtag_icon
                            : config.Creator_Icon
                          }
                          width={20}
                          height={20}
                        />
                      </div>
                    ) : (
                      <div className="postCreatorIcon">
                        <Image
                          src={props.isHashtagPost
                            ? config.hashtag_icon
                            : config.Creator_Icon
                          }
                          width={20}
                          height={20}
                        />
                      </div>
                    )}
                    {propsData.isFollowed == 0 &&
                      (uid !== propsData.userId) && (
                        <>
                          {mobileView ? (
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: theme.text,
                                margin: "0 6px",
                              }}
                            ></span>
                          ) : (
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: theme.text,
                                margin: "0 0.666vw",
                              }}
                            ></span>
                          )}
                          <p
                            className={
                              mobileView
                                ? "feed_follow_btn m-0"
                                : "dv__feed_follow_btn m-0 bold"
                            }
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
                  <div
                    className={mobileView ? "lastSeenTime" : "dv__lastSeenTime"}
                  >
                    {findDayAgo(props.onlineStatus)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto px-0 pr-2 row">
              {/* <Tooltip title={lang.chat}>
                <div>
                  {props.userId != uid ? (
                    <div
                      onClick={() => {
                        authenticate().then(() => {
                          handleChat({ userId: props?.userId, userName: props?.userName || props?.username });
                        });
                      }}
                    >
                      <Icon
                        icon={`${config.NAV_CHAT_ICON}#chat`}
                        size={mobileView ? 23 : 1.757}
                        class="pointer mx-2"
                        unit={mobileView ? "px" : "vw"}
                        viewBox="0 0 25 25.794"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Tooltip> */}

              {/* DashBoard code commented temporary */}
              {/* <Tooltip title={lang.postInsight}>
                <div>
                  {props.userId != uid ? (
                    ""
                  ) : (
                    <div
                      onClick={() =>
                        authenticate().then(() => {
                          mobileView
                            ? Route.push(
                              `/dashboard/${props.postId}?f=3&t=1&ct=5`
                            )
                            : open_dialog("POST_INSIGHT", {
                              postId: props.postId,
                              f: 3,
                              t: 1,
                              ct: 5,
                              theme: theme,
                            });
                        })
                      }
                    >
                      <Icon
                        icon={`${config.INSIGHT}#insight_icon`}
                        size={mobileView ? 23 : 1.757}
                        class="pointer mx-2"
                        unit={mobileView ? "px" : "vw"}
                        viewBox="0 0 19.803 21.729"
                      />
                    </div>
                  )}
                </div>
              </Tooltip> */}

              {/* {(getCookie("uid") !== props.userId && props.shoutoutPrice) && <Tooltip title={lang.createShoutout}><div className="d-flex px-0 px-sm-0">
                <Icon
                  icon={`${config.request_shotuout_post}#Group_55861`}
                  size={25}
                  class="d-flex align-items-center cursorPtr mx-2"
                  viewBox="0 0 20 20"
                  width={mobileView ? 22 : 1.7}
                  height={mobileView ? 22 : 1.7}
                  unit={mobileView ? "px" : "vw"}
                  onClick={() =>
                    authenticate().then(() => {
                      getUserDataShoutout(props.userId)
                    })
                  }
                />
              </div></Tooltip>} */}

              <MenuModel
                items={
                  props.userId == uid ? getOwnUserPost() : getOtherUserPost()
                }
                // items={props.userId == uid ? ownPostOptionItems : moreOptionItems}
                isOwnProfile={isOwnProfile(props.userId)}
                iconColorWhite={theme.type === "light" ? false : true}
                imageWidth={24}
                handleChange={(e) => {
                  authenticate().then(() => {
                    menuHandler(e, props);
                  });
                }}
                selected={{ label: "Revenue", value: 1 }}
              />
            </div>

          </div>

          <div className="mappedComments" id="mComments">

            {comment && comment.map((elem) => {
              console.log(elem, "*****CHECK")
              return <CommentTile data={elem} mobileView={mobileView} img={s3ImageLinkGen(S3_IMG_LINK, elem.users.profilePic, 30, 42, 42)} dayAgo={findDayAgo(elem.timeStamp, "comment")} />
            })}

            {/* mappedCommentsEnd */}

          </div>

          <div className="footerSection">

            {/* Post Footer */}
            <div className="row justify-content-between align-items-center mb-2">
              <div className="col-auto pl-1 pr-0">
                <div className="row align-items-end">
                  {/* Like Action	 */}
                  <div className="col-auto">
                    <div
                      className="form-row d-flex align-items-end"
                      onClick={() => {
                        authenticate().then();
                      }}
                    >
                      <div
                        className="col-auto pl-3"
                        onClick={() => (auth ? handleLikeDislike() : "")}
                      >
                        <Icon
                          icon={`${config.LIKE_ICON}#like_icon`}
                          color={
                            propsData.isLiked
                              ? theme.palette.l_red
                              : theme.palette.white
                          }
                          size={mobileView ? 17 : 17}
                          class="pointer"
                          style={
                            mobileView
                              ? { display: "flex" }
                              : { maxWidth: "1.434vw", display: "flex" }
                          }
                          viewBox="0 0 21.095 17.86"
                        />
                      </div>
                      <div
                        className={
                          mobileView
                            ? "col-auto dv_post_desc pl-0"
                            : "col-auto dv__post_desc pl-0"
                        }
                      >
                        {propsData.likeCount || 0}
                      </div>
                    </div>
                  </div>

                  {/* Comment Action */}
                  <div className="col-auto p-0">
                    <div
                      className="form-row align-items-end pointer"
                      onClick={() =>
                        auth ? handleCommentBox() : authenticate().then()
                      }
                    >
                      <div className="col-auto">
                        <Icon
                          icon={`${config.COMMENT_ICON}#comment_icon`}
                          size={mobileView ? 17 : 15}
                          class="pointer"
                          style={
                            mobileView
                              ? { display: "flex" }
                              : { maxWidth: "1.434vw", display: "flex" }
                          }
                          viewBox="0 0 19.32 19.3"
                        />
                      </div>
                      <div
                        className={
                          mobileView
                            ? "col-auto dv_post_desc pl-0"
                            : "col-auto dv__post_desc pl-0"
                        }
                      >
                        {propsData.commentCount || 0}
                      </div>
                    </div>
                  </div>

                  {/* Total Tip Received */}
                  <div className="col-auto">
                    <div className="form-row align-items-center">
                      <div
                        className={
                          mobileView
                            ? "col-auto dv_post_desc"
                            : "col-auto dv__post_desc"
                        }
                      >
                        {/* {props.currency.symbol}{propsData.totalTipReceived || "0.00"}  */}
                        <span> tips</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`col-auto ${mobileView && "pl-0"}`}>
                <div
                  className={
                    mobileView
                      ? "form-row align-items-end"
                      : "form-row align-items-center"
                  }
                >
                  {/* Send Tip Button */}
                  {props.userId != uid &&
                    (mobileView ? (
                      <div
                        className="col-auto"
                        onClick={() => {
                          authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                            !isAgency() && authenticate().then(() => {
                              if (props.postType == 1 && !props.isVisible) {
                                open_drawer("buyPost", {
                                  creatorId: props.userId,
                                  postId: props.postId,
                                  price: props.price || 0,
                                  currency:
                                    (props.currency && props.currency.symbol) ||
                                    config.defaultCurrency,
                                  updatePostPurchase,
                                  postType: props.postType,
                                },
                                  "bottom"
                                );
                              } else if (
                                props.postType == 2 && !props.isVisible
                              ) {
                                open_drawer("CreatorPlanSubscription", {
                                  back: () => close_drawer(),
                                  creatorId: props.userId,
                                  creatorName: props.profileName,
                                  subscribedEvent: props.subscribedEvent,
                                },
                                  "bottom"
                                );
                              } else {
                                open_drawer("SentTip", {
                                  creatorId: props.userId,
                                  creatorName: props.profileName,
                                  postId: props.postId,
                                  updateTip: (tipCount) =>
                                    updateTipHandler(tipCount),
                                },
                                  "bottom"
                                );
                              }
                            });
                          })
                        }}
                      >
                        {props.postType == 2 && !props.isVisible ? (
                          <div className="btn-subscribe">
                            <span className="txt-heavy fntSz14">
                              {lang.subscribe}
                            </span>
                          </div>
                        ) : props.postType == 1 && !props.isVisible
                          ? <span className="btn-subscribe txt-heavy fntSz14">{lang.unlockPost}</span>
                          : <div className="btn-subscribe">
                            <Icon
                              icon={`${config.DOLLAR_ICON}#Dollar_tip`}
                              color={theme.palette.white}
                              size={24}
                              class="d-flex align-items-center"
                              viewBox="0 0 24 24"
                            />
                            <span className="txt-heavy ml-2 fntSz14">
                              {lang.sendTip}
                            </span>
                          </div>
                        }
                      </div>
                    ) : (
                      <div
                        className="dv__sendTip d-flex align-items-center justify-content-center cursorPtr mx-3 py-1 px-2"
                        onClick={() => {
                          authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                            !isAgency() && authenticate().then(() => {
                              if (props.postType == 1 && !props.isVisible) {
                                open_dialog("buyPost", {
                                  creatorId: props.userId,
                                  postId: props.postId,
                                  price: props.price || 0,
                                  currency:
                                    (props.currency && props.currency.symbol) ||
                                    config.defaultCurrency,
                                  updatePostPurchase,
                                  postType: props.postType,
                                });
                              } else if (
                                props.postType == 2 && !props.isVisible
                              ) {
                                open_dialog("CreatorPlanSubscription", {
                                  back: () => close_dialog(),
                                  creatorId: props.userId,
                                  creatorName: props.profileName,
                                  subscribedEvent: props.subscribedEvent,
                                });
                              } else {
                                open_dialog("sendTip", {
                                  creatorId: props.userId,
                                  creatorName: props.profileName,
                                  postId: props.postId,
                                  updateTip: (tipCount) =>
                                    updateTipHandler && updateTipHandler(tipCount),
                                });
                              }
                            });
                          })
                        }}
                      >
                        {props.postType == 2 && !props.isVisible ? (
                          <span className="txt-heavy dv__fnt14">
                            {lang.subscribe}
                          </span>
                        ) : props.postType == 1 && !props.isVisible
                          ? <span className="txt-heavy dv__fnt14">{lang.unlockPost}</span>
                          : <>
                            <Icon
                              icon={`${config.DOLLAR_ICON}#Dollar_tip`}
                              color={theme.palette.white}
                              size={24}
                              class="d-flex align-items-center"
                              viewBox="0 0 24 24"
                            />
                            <span className="txt-heavy ml-2 dv__fnt14">
                              {lang.sendTip}
                            </span>
                          </>
                        }
                      </div>
                    ))}

                  {/* Collection Action */}
                  {/* {(props.postType != "1" || propsData.isVisible == 1) && ( */}
                  <div
                    className="col-auto cursorPtr mx-2"
                    onClick={() => {
                      authenticate().then(() => {
                        bookmark
                          ? mobileView
                            ? open_drawer("confirmDrawer", {
                              title: "Remove From Collection",
                              subtitle: "Are you sure, you want to remove this from your collection ?",
                              yes: () => {
                                startLoader();
                                handleBookMarkRemove();
                                setTimeout(stopLoader, 1500);
                              },
                            },
                              "bottom"
                            )
                            : open_dialog("confirmDialog", {
                              title: "Remove From Collection",
                              subtitle: "Are you sure, you want to remove this from your collection ?",
                              yes: () => {
                                startLoader();
                                handleBookMarkRemove();
                                setTimeout(stopLoader, 1500);
                              },
                            })
                          : props.collectionId
                            ? handleBookMark()
                            : openCollectionDialog(
                              {
                                postId: props.postId,
                                postData: props.postImage,
                                collectionId: props.collectionId,
                                updateBookMark: () => setBookMark(true),
                                isVisible: propsData.isVisible,
                                postType: props.postType,
                                userId: isAgency() ? selectedCreatorId : propsData.userId
                              },
                              mobileView
                            );
                      });
                    }}
                  >
                    <Icon
                      icon={`${config.BOOKMARK_ICON}#bookmark`}
                      color={bookmark ? theme.appColor : theme.palette.white}
                      // size={18}
                      width={18}
                      height={25}
                      class="d-flex"
                      viewBox="0 0 16.56 21.638"
                    />
                  </div>
                  {/* )} */}
                  {/* Collection Action End */}
                </div>
              </div>
            </div>

            {/* Caption */}
            {/* <div className="mb-2">
          <span className={mobileView ? "dv_post_desc" : "dv__post_desc"}>
            <strong role="button cursorPtr bold" onClick={() => authenticate().then()}>
              {props.isHashtagPost ? props.hashtagName : props.username}
            </strong>
            {"  "}
            <span style={{ color: theme.text }} className="post_desc_text">
              {props.postDesc && commentParser(parsedDescription, props?.taggedUsers)}
              {props.postDesc &&
                props.postDesc.length > (mobileView ? 100 : 200) &&
                (parsedDescription.length > (mobileView ? 100 : 200) ? (
                  <a
                    onClick={() => showMoreDescText(props.postDesc, true)}
                    className="cursorPtr"
                  >
                    {lang.showLess}
                  </a>
                ) : (
                  <a
                    onClick={() => showMoreDescText(props.postDesc, false)}
                    className="cursorPtr"
                  >
                    {lang.showMore}
                  </a>
                ))}
            </span>
          </span>
        </div> */}

            {/* Comment Actions */}

            <form
              onSubmit={commentSubmitHandler}
              className={`col-auto p-0 d-flex justify-content-center card_bg fntClrTheme
                ${theme == "light"
                  ? "inp_chat_cont_light"
                  : !mobileView
                    ? "dv__inp_chat_cont_light"
                    : "inp_chat_cont_dark"
                }`}
              style={
                mobileView
                  ? {
                    position: "fixed",
                    width: "100%",
                    bottom: 0,
                    zIndex: 2,
                  }
                  : {}
              }
            >
              <TextareaAutosize
                type="text"
                placeholder={lang.addComment}
                value={inputComment}
                rows={1}
                rowsMax={3}
                autoFocus
                onKeyPress={handleEnterPress}
                className={
                  mobileView
                    ? "form-control form-control-textarea m-2 comment_input"
                    : "form-control dv__form-control-textarea m-2"
                }
                onChange={(e) => {
                  setInputComment(e.target.value);
                }}
              />
              <SendIcon
                className="send-icon cursorPtr"
                onClick={commentSubmitHandler}
              />
            </form>
            {/* <a
          onClick={() => (auth ? handleCommentBox() : authenticate().then())}
          className={
            mobileView
              ? "lastSeenTime mb-1 d-block pointer"
              : "dv__lastSeenTime mb-1 d-block pointer"
          }
        >
          {lang.viewAll} {propsData.commentCount || 0} {lang.comments}
        </a>
        <a
          onClick={() => (auth ? handleCommentBox() : authenticate().then())}
          className={
            mobileView
              ? "dv_post_desc dv_appTxtClr d-block pointer app-link"
              : "dv__post_desc dv_appTxtClr d-block pointer app-link"
          }
        >
          {lang.addComment}
        </a> */}


          </div>

        </div>
      </div>
      <style jsx>{`
  

      :global(.MuiDialogContent-root){
        overflow: visible;
        transform:translate(-7%);
      }
      .mappedComments{
        max-height: calc(100% - 47px - 60px - 30px);
        min-height: calc(100% - 47px - 60px - 30px);
        overflow-y: scroll;
      }
      .card-post{
        flex-basis: 50%;
        border-radius:0px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        
      }
      .parent{
        display: flex;
        flex-wrap: nowrap;
        height: 80vh;
        width: 61vw;
        gap:1px
      }
      .modelImg{
        max-height: 100%;
        max-width: 100%;
      }
      .ImageDiv{
        display: flex;
        flex-basis: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position:relative;
        height: 100%;
      }
      :global(.ImageDiv .rec-carousel-wrapper), :global(.ImageDiv .rec-carousel), :global(.ImageDiv .rec-slider-container), :global(.ImageDiv .rec-slider) {
        height: 100% !important;
      }
      :global(.rec-item-wrapper") {
        aspect-ratio: 1/1;
        width: 100% !important;
      }
        :global(.MuiList-padding) {
          padding: 0 10px;
          margin-top: 0px;
        }
        :global(.MuiMenu-paper) {
          margin-top: 5px;
        }
        :global(.rec.rec-item-wrapper) {
          min-height: ${mobileView ? "32vw" : "23vw"}
        }
        .post_desc_text a {
          text-decoration: none;
        }
        :global(.MuiAvatar-colorDefault, .feed_avatar) {
          background-color: ${theme.palette.l_base};
        }
        .dv__feed_follow_btn {
         color: ${theme.type === "dark" ? theme.palette.white : theme.palette.l_base} !important;
        }
        .app-link{
          color: ${theme.type === "dark" ? theme.palette.white : theme.palette.l_base} !important;
        }
        .feed_avatar {
          width: 42px;
          height: 42px;
        }
        .feed_avatar_text {
          font-size: 16px;
          color: ${config.PRIMARY};
        }
        .footerSection{
          position: absolute;
          bottom: 5px;
          width:90%;
          
        }
      `}</style>
    </React.Fragment>

  );
}
