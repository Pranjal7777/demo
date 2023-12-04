import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Route, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useBookmark from "../../hooks/useBookMark";
import { isAgency, defaultCurrency } from "../../lib/config/creds";
import { findDayAgo } from "../../lib/date-operation/date-operation";
import { openCollectionDialog } from "../../lib/helper";
import { getCookie, setCookie } from "../../lib/session";
import { getComments } from "../../services/comments";
import { follow } from "../../services/profile";
import { deletePost, postLikeDislike } from "../../services/assets";
import { UPDATE_PROFILE_FOLLOWING } from "../../redux/actions/auth";
import useProfileData from "../../hooks/useProfileData";
import { downloadFile } from "../../lib/helper/downloadFile";
import {
  close_dialog,
  close_drawer,
  close_progress,
  drawerToast,
  open_dialog,
  open_drawer,
  open_progress,
  startLoader,
  stopLoader,
  Toast,
  updateModelCardPost,
} from "../../lib/global/loader";
import { authenticate, isOwnProfile, sendMail } from "../../lib/global/routeAuth";
import { getProfile } from "../../services/auth";
import { useTheme } from "react-jss";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import isTablet from "../../hooks/isTablet";

const Image = dynamic(() => import("../../components/image/image"), {
  ssr: false,
});
import CustomImageSlider from "../image-slider/ImageSlider"
import MenuModel from "../model/postMenu"
import TextPost from "../TextPost/textPost"

import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip"
import { BOOKMARK_ICON, COMMENT_ICON, Creator_Icon, hashtag_icon, INSIGHT, LIKE_POST_ICON, NAV_CHAT_ICON, request_shotuout_post, SEND_POST_ICON, UNLIKE_POST_ICON, FILL_BOOKMARK_ICON } from "../../lib/config/homepage";
import { isShoutoutEnabled } from "../../services/shoutout";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import { CoinPrice } from "../ui/CoinPrice";
import { authenticateUserForPayment } from "../../lib/global";
import { useChatFunctions } from "../../hooks/useChatFunctions";
import { commentParser } from "../../lib/helper/userRedirection";
const Icon = dynamic(() => import("../image/icon"), { ssr: false });

/**
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */
export default function ModelCard(props) {
  const theme = useTheme();
  const auth = getCookie("auth");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const [userWalletBalance] = useUserWalletBalance()
  const [lang] = useLang();
  const [propsData, setPropsData] = useState(props);
  const [aspectWidth, setAspectWidth] = useState(null)
  const [showDoubleClickHeart, setShowDoubleClickHeart] = useState(false);
  const router = useRouter();
  const { handleChat } = useChatFunctions()
  const userType = getCookie("userType");
  const scrolledPositionRef = useRef(0);
  const moreOptionItems = [
    // { label: "Download Post", value: 6 },
    { label: "Report Post", value: 5 },
    { label: "Share Post", value: 7 },
  ];
  const textPostItem = [
    { label: "Report Post", value: 5 },
  ]
  const ownPostOptionItems = [
    { label: "Edit Post", value: 3 },
    { label: "Delete Post", value: 4 },
    // { label: "Download Post", value: 6 },
    { label: "Share Post", value: 7 },
  ];
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const existingChatList = useSelector((state) => state.chat?.sale) || {};

  const dispatch = useDispatch();
  const [currProfile] = useProfileData();

  const { bookmark, setBookMark, removeBookmark, addBookMarkReq } = useBookmark(props.isBookmarked);

  const [parsedDescription, setParsedDescription] = useState("");
  const userProfileActiveStarusCode = useSelector((state) => state?.profileData?.statusCode);
  const isUserProfileActive = userProfileActiveStarusCode == 5 || userProfileActiveStarusCode == 6 || userProfileActiveStarusCode == 7 ? false : true
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const NON_TRANSMATION_URL = useSelector((state) => state?.appConfig?.nonTransformUrl);
  const VIDEO_LINK = useSelector((state) => state?.cloudinaryCreds?.VIDEO_LINK);

  useEffect(() => {
    setBookMark(props.isBookmarked);
  }, [props.isBookmarked]);

  useEffect(() => {
    if (props.commnntId) {
      handleCommentBox();
    }
  }, [props.commnntId])

  useEffect(() => {
    setAspectWidth(window.innerWidth - 70);
    showMoreDescText(props.postDesc, true);
  }, [props]);

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
      mobileView ? open_drawer("Shoutout", {
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

  let clicks = 0;
  let tapTimeout;
  const handleTouchEnd = () => {
    clicks++;
    if (clicks === 1) {
      clearTimeout(tapTimeout)
      tapTimeout = setTimeout(() => {
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
        };
        clicks = 0;
      }, 400)
    } else {
      tapTimeout && clearTimeout(tapTimeout);
      setShowDoubleClickHeart(true);
      setTimeout(() => {
        setShowDoubleClickHeart(false);
      }, 1000)
      if (!propsData.isLiked) {
        handleLikeDislike()
      }
      clicks = 0;
    }
  };

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

  function handleCommentBox() {
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
      : open_dialog("HomepageCommentBox", {
        drawerData: { postId: props.postId },
        back: () => back(),
        getLatestComment: (data) => getLatestComment(data),
        totalLikes: propsData.likeCount,
        totalViews: propsData.viewCount,
        profileName: props.profileName,
        username: props.username || props.userName,
        assetOwnerId: "",
        data: "",
        profileLogo: propsData.profileLogo,
        isFollowed: propsData.isFollowed,
        userId: propsData.userId,
        onlineStatus: propsData.onlineStatus,
        setPropsData: setPropsData,
        propsData: propsData,
        setProfileTimelineData: setProfileTimelineData,
        setHomePageData: props.setHomePageData,
        homepageData: props.homepageData,
        taggedUser: props.taggedUsers
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
          data: props
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
          let img = NON_TRANSMATION_URL + "/" + pic?.url;

          downloadCloudanaryImg(img);
        } else {
          let extension = pic.type !== 1 ? "mp4" : "png";
          downloadFile(pic.url.replace("m3u8", "mp4"), extension);
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

  const handleSharePost = () => {
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
      });
  };

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
        setCookie("otherProfile", `${props.username.trim() || props.userName.trim()}$$${props.userId || props.userid || props._id}`)
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
    props?.isHashTag && props?.subscribedEvent()
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
  const setProfileTimelineData = (data) => {
    setPropsData(data)
  }
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
    } else {
      let otherItem = moreOptionItems.splice(1, 3);
      return otherItem;
    }
  };

  const handleShoutoutRequest = (creatorId) => {
    isShoutoutEnabled(creatorId).then((res) => {
      getUserDataShoutout(creatorId)
    }).catch((error) => {
      if (error.response.status == "408") {
        return drawerToast({
          closing_time: 70000,
          // title: lang.shoutoutPlaceholder,
          desc: error.response.data.message,
          closeIconVisible: true,
          isPromo: true,
          button: {
            text: lang.contactUs,
            onClick: () => {
              sendMail();
            },
          },
          titleClass: "max-full",
          autoClose: true,
          isMobile: mobileView ? true : false,
        });
      }
    })
  }

  const handlePurchaseSuccess = () => {
    mobileView ? close_drawer() : close_dialog()
    mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
  }


  return (
    <React.Fragment>
      <div index={props.currentIndex} className={`card-post ${mobileView ? 'mb-2 rounded-0' : 'mb-3'}  text-app`} style={{ border: mobileView ? '0px' : theme?.type === "light" ? "1px solid var(--l_border)" : "1px solid transparent" }}>
        {/* Post Header */}
        <div className="py-3 px-3 d-flex m-0 align-items-center justify-content-between flex-nowrap">
          <div className={`col-auto pl-0 ${mobileView ? "profile-title" : ""}`}>
            <div className="row align-items-center position-relative">
              <div className="col-auto pr-0 pl-3 position-relative cursorPtr" onClick={profileClickHandler}>
                {props.profileLogo && !props.isHashtagPost ? (
                  <Image
                    src={s3ImageLinkGen(S3_IMG_LINK, props.profileLogo, 100, 200, 200)}
                    className="live cursorPtr"
                    style={mobileView
                      ? {
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }
                      : {
                        borderRadius: "50%",
                        maxWidth: "5vw",
                        maxHeight: "5vw",
                      }
                    }
                    width={70}
                    height={70}
                  />
                ) : (
                  props.isHashtagPost
                    ? <Avatar className="hashtags">#</Avatar>
                    : <Avatar className="feed_avatar text-uppercase solid_circle_border">
                      {props.profileLogoText && (
                        <span className="feed_avatar_text text-uppercase">
                          {props.profileLogoText}
                        </span>
                      )}
                    </Avatar>
                )}
              </div>
              <div className="col m-auto profile_name pr-0" style={{ maxWidth: mobileView ? "47vw" : "" }}>
                <div
                  className={mobileView
                    ? "d-flex align-items-center justify-content-between post_pro_name"
                    : "d-flex align-items-center dv__post_pro_name"
                  }
                >
                  <h3
                    role="button"
                    className={`${mobileView ? "m-0 fntSz16 text-truncate" : "m-0 dv__fnt16"} text_underline_hover`}
                    onClick={profileClickHandler}
                  >
                    {props.isHashtagPost ? props.hashtagName : props.username}
                  </h3>
                  {!mobileView ? (
                    <div className="dv__postCreatorIcon">
                      <Image
                        src={props.isHashtagPost
                          ? hashtag_icon
                          : Creator_Icon
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                  ) : (
                    <div className="postCreatorIcon">
                      <Image
                        src={props.isHashtagPost
                          ? hashtag_icon
                          : Creator_Icon
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                  )}
                  {propsData.isFollowed == 0 &&
                    (uid !== propsData.userId) && (
                      <>
                        <span
                          className="gradient_bg rounded-pill mx-2"
                          style={{
                            width: "4px",
                            height: "4px",
                          }}
                        ></span>
                        <div
                          className="gradient_text cursorPtr w-500 fntSz13"
                          onClick={() => {
                            authenticate().then(() => {
                              handleFollowUser();
                            });
                          }}
                        >
                          {lang.follow}
                        </div>
                      </>
                    )}
                </div>
                <div
                  className={mobileView ? "lastSeenTime" : "dv__lastSeenTime fntWeight300 "}
                >
                  {findDayAgo(props.onlineStatus)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto px-0">
            <div className={`row no-gutters ${tabletView ? 'align-items-center' : 'align-items-center'}`}>
              {/* <div className="col-auto">
                <Tooltip title={lang.chat}>
                  <div>
                    {props.userId != uid ? (
                      <div
                        onClick={() => {
                          authenticate().then(() => {
                            console.log(props)
                            handleChat({ userId: props?.userId, userName: props?.userName || props?.username });
                          });
                        }}
                        className="hover_bgClr mx-1"
                        style={{ borderRadius: '10px' }}
                      >
                        {
                          tabletView ?
                            <Icon
                              icon={`${NAV_CHAT_ICON}#chat`}
                              size={2.6}
                              class="pointer"
                              unit={"vw"}
                              hoverColor='var(--l_base)'
                              viewBox="0 0 52 52"
                            />
                            :
                            <Icon
                              icon={`${NAV_CHAT_ICON}#chat`}
                              size={mobileView ? 30 : 2.6}
                              class="pointer"
                              hoverColor='var(--l_base)'
                              unit={mobileView ? "px" : "vw"}
                              viewBox="0 0 52 52"
                            />
                        }
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Tooltip>
              </div> */}

              {/* DashBoard code commented temporary */}
              {/* <div className="col-auto">
                <Tooltip title={lang.postInsight}>
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
                        className="hover_bgClr mx-1"
                        style={{ borderRadius: "10px" }}
                      >
                        <Icon
                          icon={`${INSIGHT}#insight_icon`}
                          size={mobileView ? 30 : 2.6}
                          class="pointer"
                          hoverColor='var(--l_base)'
                          unit={mobileView ? "px" : "vw"}
                          viewBox="0 0 52 52"
                        />
                      </div>
                    )}
                  </div>
                </Tooltip>
              </div> */}
              {/* <div className="col-auto">
                {((isAgency() ? selectedCreatorId : getCookie("uid")) !== props.userId && props.shoutoutPrice && props.isEnable) ?
                  <Tooltip title={lang.createShoutout}>
                    <div className="d-flex px-0 px-sm-0 hover_bgClr mx-1"
                      style={{ borderRadius: "10px" }}>
                      {
                        tabletView ?
                          <Icon
                            icon={`${request_shotuout_post}#Group_55861`}
                            size={27}
                            class="d-flex align-items-center cursorPtr"
                            viewBox="0 0 52 52"
                            hoverColor='var(--l_base)'
                            width={2.6}
                            height={2.6}
                            unit={"vw"}
                            onClick={() =>
                              !isAgency() && authenticate().then(() => {
                                handleShoutoutRequest(props.userId)
                              })
                            }
                          />
                          :
                          <Icon
                            icon={`${request_shotuout_post}#Group_55861`}
                            size={25}
                            class="d-flex align-items-center cursorPtr"
                            viewBox="0 0 52 52"
                            hoverColor='var(--l_base)'
                            width={mobileView ? 30 : 2.6}
                            height={mobileView ? 30 : 2.6}
                            unit={mobileView ? "px" : "vw"}
                            onClick={() =>
                              authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                                !isAgency() && authenticate().then(() => {
                                  handleShoutoutRequest(props.userId)
                                })
                              })
                            }
                          />
                      }
                    </div>
                  </Tooltip> : ""}
              </div> */}
              <div className="col-auto">
                <MenuModel
                  items={
                    props.userId == uid ? getOwnUserPost() : getOtherUserPost()
                  }
                  // items={props.userId == uid ? ownPostOptionItems : moreOptionItems}
                  isOwnProfile={isOwnProfile(props.userId)}
                  iconColorWhite={theme.type === "light" ? false : true}
                  imageWidth={30}
                  handleChange={(e) => {
                    authenticate().then(() => {
                      menuHandler(e, props);
                    });
                  }}
                  selected={{ label: "Revenue", value: 1 }}
                />
              </div>
            </div>

            {/* <Tooltip title={lang.share}>
              <div>
                {!props.isSharedPost && (
                  <div
                    onClick={() =>
                      authenticate().then(() => {
                        handleSharePost();
                      })
                    }
                  >
                    <Icon
                      icon={`${SHARE_ICON}#share_icon`}
                      size={mobileView ? 23 : 1.757}
                      class="pointer"
                      unit={mobileView ? "px" : "vw"}
                      viewBox="0 0 25.111 24.229"
                    />
                  </div>
                )}
              </div>
            </Tooltip> */}


          </div>
          {/* <img
            onClick={() =>
              authenticate().then(() => {
                handleClickMoreOptions();
              })
            }
            className={`pointer ml-2 ${!props.isSharedPost && 'rotate90'}`}
            src={MORE_ICON}
            width={16}
          /> */}
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <div className="p-0 cursorPtr position-relative" style={props.postImage?.[0].type == 4 ? { minHeight: "250px" } : { minHeight: mobileView ? "32vw" : "23vw" }}>
            {showDoubleClickHeart && <div className="position-absolute doubleClickHeart d-flex justify-content-center align-items-center h-100 w-100">
              <Icon
                icon={LIKE_POST_ICON + "#like_posticon"}
                width={mobileView ? 52 : 88}
                height={mobileView ? 52 : 88}
                viewBox="0 0 88 88"
              />
            </div>}
            {((props.postImage && props.postImage[0] && props.postImage[0].type == 1) || (props.postImage && props.postImage[0] && props.postImage[0].type == 2)) ?
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
                onClick={handleTouchEnd}
                // width={aspectWidth > 900 ? 900 : aspectWidth}
                transformWidth={mobileView ? "90vw" : "50vw"} // Exact For Mob - 83vw and For DV - 44vw
                imagesList={props.postImage.filter(f => f.seqId !== 0)}
                subscribedEvent={props.subscribedEvent}
                alt={props.alt}
                username={props.username}
                isProgressiveLoading={true}
                visibleByDefault={props?.visibleByDefault}
              />
              :
              <TextPost
                className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
                postType={props.postType}
                price={props.price}
                currency={props.currency}
                isVisible={propsData.isVisible || 0}
                userId={props.userId}
                postId={props.postId}
                updateTipHandler={updateTipHandler}
                updatePostPurchase={updatePostPurchase}
                // handlePurchasePost={handlePurchasePost}
                subscribedEvent={props.subscribedEvent}
                // onClick={() => {
                // 	if (propsData.isVisible || props.postType == 3 || props.userId == userId) {
                // 		open_post_dialog({
                // 			data: props.postImage,
                // 			postType: props.postType,
                // 			width: aspectWidth + 70,
                // 		});
                // 	}
                // }}
                width={aspectWidth > 900 ? 900 : aspectWidth}
                textPost={props.postImage}
                username={props.username}
                alt={props.fullName}
              />}
          </div>
        </div>

        {/* Post Footer */}
        <div className="row mx-0 justify-content-between  align-items-center px-3 mb-2">
          <div className="col-auto px-0">
            <div className="d-flex flex-row align-items-center justify-content-start gap_10">
              {/* Like Action	 */}
              <div
                className="d-flex align-items-end"
                onClick={() => {
                  authenticate().then();
                }}
              >
                <div
                  className={!mobileView ? "hover_bgClr" : ""}
                  style={{ borderRadius: "10px", marginLeft: mobileView ? "-5px" : "" }}
                  onClick={() => (auth ? handleLikeDislike() : "")}
                >
                  <Icon
                    icon={`${propsData.isLiked ? LIKE_POST_ICON + "#like_posticon" : UNLIKE_POST_ICON + "#like_posticon"}`}
                    width={mobileView ? 32 : 2.5}
                    height={mobileView ? 32 : 2.5}
                    unit={mobileView ? "px" : "vw"}
                    color={theme?.type === "light" ? "#D33AFF" : ""}
                    hoverColor='var(--l_base)'
                    className='cursorPtr'
                    viewBox="0 0 52 52"
                  />
                </div>
              </div>

              {/* Comment Action */}
              <div
                className="d-flex align-items-end pointer"
                onClick={() =>
                  auth ? handleCommentBox() : authenticate().then()
                }
              >
                <div className={!mobileView ? "hover_bgClr" : ""}
                  style={{ borderRadius: "10px" }}>
                  <Icon
                    icon={`${COMMENT_ICON}#comment_icon`}
                    width={mobileView ? 30 : 2.5}
                    height={mobileView ? 30 : 2.5}
                    unit={mobileView ? "px" : "vw"}
                    class="pointer"
                    color={theme?.type === "light" ? "#D33AFF" : ""}
                    hoverColor='var(--l_base)'
                    viewBox="0 0 52 52"
                  />
                </div>
              </div>

              {/* Comment Action */}
              {!(["4", "5", "6"].includes(props?.postType)) && <div
                className="d-flex align-items-end pointer"
                onClick={() =>
                  authenticate().then(() => {
                    handleSharePost();
                  })
                }
              >
                <div className={!mobileView ? "hover_bgClr" : ""}
                  style={{ borderRadius: "10px" }}>
                  <Icon
                    icon={`${SEND_POST_ICON}#share_post`}
                    width={mobileView ? 32 : 2.5}
                    height={mobileView ? 32 : 2.5}
                    unit={mobileView ? "px" : "vw"}
                    class="pointer"
                    color={theme?.type === "light" ? "#D33AFF" : ""}
                    hoverColor='var(--l_base)'
                    viewBox="0 0 52 52"
                  />
                </div>
              </div>}

              {/* Total Tip Received */}
              {/* <div className="d-flex align-items-center px-1 pt-1 receivedTips">
                <div>
                  {propsData?.totalTipReceived > 0 && <CoinPrice price={propsData?.totalTipReceived || "0"} size="16" suffixText={lang.tip} showCoinText={false} iconSize={15} />}
                </div>
              </div> */}
            </div>
          </div>

          <div className={`col-auto px-0`}>
            <div className={"form-row align-items-center m-0"}>
              {/* Send Tip Button */}
              {props.userId != currProfile._id && !(["4", "5", "6"].includes(props?.postType)) &&
                (mobileView ? (
                  <div
                    className="col-auto"
                    onClick={() => {
                      authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                        !isAgency() && authenticate().then(() => {
                          if (props.postType == 1 && !props.isVisible) {
                            (userWalletBalance < props.price) ?
                              open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") :
                              open_drawer("buyPost", {
                                creatorId: props.userId,
                                postId: props.postId,
                                price: props.price || 0,
                                currency:
                                  (props.currency && props.currency.symbol) ||
                                  defaultCurrency,
                                updatePostPurchase,
                                postType: props.postType,
                                purchaseUsingCoins: true,
                                title: lang.purchasePost,
                                description: lang.unlockPost,
                                button: lang.purchasePost
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
                      ? <span className="btn-subscribe txt-heavy fntSz14">{lang.unlock}</span>
                      : <div className="btn-subscribe d-flex flex-row px-2">
                        {/* <Icon
                          icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                          width={18}
                          height={18}
                          class='cursorPtr'
                          viewBox="0 0 20 20"
                        /> */}
                        <span className="txt-heavy ml-1 fntSz14">
                          {lang.chatSendTip}
                        </span>
                      </div>
                    }
                  </div>
                ) : (
                  <div
                    className="dv__sendTip d-flex align-items-center justify-content-center cursorPtr mx-3 py-1"
                    style={{ padding: '6.5px 13px' }}
                    onClick={() => {
                      authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then((res) => {
                        !isAgency() && authenticate().then(() => {
                          if (props.postType == 1 && !props.isVisible) {
                            (userWalletBalance < props.price) ?
                              open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) :
                              open_dialog("buyPost", {
                                creatorId: props.userId,
                                postId: props.postId,
                                price: props.price || 0,
                                currency:
                                  (props.currency && props.currency.symbol) ||
                                  defaultCurrency,
                                updatePostPurchase,
                                postType: props.postType,
                                purchaseUsingCoins: true,
                                title: lang.purchasePost,
                                description: lang.unlockPost,
                                button: lang.purchasePost
                              }
                              );
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
                      <span className="txt-heavy dv__fnt14 py-1">
                        {lang.subscribe}
                      </span>
                    ) : props.postType == 1 && !props.isVisible
                      ? <span className="txt-heavy dv__fnt14 py-1">{lang.unlock}</span>
                      : <div className="d-flex flex-row align-items-center">
                        <span className="txt-heavy fntSz14 py-1">
                          {lang.chatSendTip}
                        </span>
                      </div>
                    }
                  </div>
                ))}

              {/* Collection Action */}
              {/* {(props.postType != "1" || propsData.isVisible == 1) && ( */}
              <div
                className="hover_bgClr"
                style={{ borderRadius: "10px" }}
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
                            userId: isAgency() ? selectedCreatorId : propsData.userId,
                          },
                          mobileView
                        );
                  });
                }}
              >
                {!bookmark ? <Icon
                  icon={`${BOOKMARK_ICON}#bookmark`}
                  color={theme?.type === "light" ? "#D33AFF" : ""}
                  hoverColor='var(--l_base)'
                  width={mobileView ? 27 : 2.5}
                  height={mobileView ? 27 : 2.5}
                  unit={mobileView ? "px" : "vw"}
                  class="d-flex"
                  viewBox="0 0 52 52"
                />
                  : <Image
                    src={FILL_BOOKMARK_ICON}
                    style={{ width: mobileView ? '27px' : '2.5vw', height: mobileView ? '27px' : "2.5vw" }}
                  />}
              </div>
              {/* )} */}
              {/* Collection Action End */}
            </div>
          </div>
        </div>

        <div className="px-3">
          <div
            className={
              mobileView
                ? "col-auto dv_post_desc px-0 pb-1"
                : "col-auto dv__fnt13 px-0 pb-1"
            }
            style={{ color: 'var(--l_strong_app_text)' }}
          >
            {propsData.likeCount || 0} {propsData.likeCount > 1 ? 'likes' : 'like'}
          </div>
        </div>

        {/* Caption */}
        {props.postDesc && <div className="mb-2 px-3">
          <span className={mobileView ? "dv_post_desc" : "dv__post_desc"}>
            <strong role="button cursorPtr" onClick={() => authenticate().then()}>
              {props.isHashtagPost ? props.hashtagName : props.username}
            </strong>
            {"  "}
            <span className="post_desc_text fntSz14">
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
        </div>}

        {/* Comment Actions */}
        {/* <a
          onClick={() => (auth ? handleCommentBox() : authenticate().then())}
          className={
            mobileView
              ? "lastSeenTime my-1 d-block pointer px-3"
              : "dv__lastSeenTime my-1 dv__fnt13 d-block pointer px-3"
          }
        >
          {lang.viewAll} {propsData.commentCount || 0} {lang.comments}
        </a> */}
        <div onClick={() => (auth ? handleCommentBox() : authenticate().then())} className="d-flex justify-content-between py-3 px-3 align-items-center cursorPtr" style={{ paddingBottom: '0px', borderTop: '1px solid var(--l_border)' }}>
          <div className="d-flex flex-row align-items-center">
            {/* <div className="imogi-block mr-2">
              <Img
                className="cursorPtr"
                src={IMOGI}
              ></Img>
            </div> */}
            <div
              className={
                mobileView
                  ? "lastSeenTime mt-1 d-block pointer"
                  : "dv__lastSeenTime mt-1 d-block pointer"
              }
              style={{ opacity: "0.3" }}
            >
              {lang.addComment}...
            </div>
          </div>
          <div className="mr-2 gradient_text bold">
            Post
          </div>
        </div>
      </div>

      <style jsx>{`
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
        .feed_avatar {
          width: 42px;
          height: 42px;
        }
        .feed_avatar_text {
          font-size: 16px;
          color: var(--l_base);
        }
        .lastSeenLocation{
          max-width: calc(100vw - 17.6rem);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .dv__lastSeenLocation{
          max-width: calc(100vw - 65rem);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        :global(.receivedTips .bombCoin){
          margin-left:0.25rem !important;
        }
        :global(.card-post .rec.rec-slider), 
        :global(.card-post .rec.rec-swipable), 
        :global(.card-post .rec.rec-carousel-item), 
        :global(.card-post .imgSliderSquare) {
          width: 100% !important;
        }
      `}</style>
    </React.Fragment>
  );
}
