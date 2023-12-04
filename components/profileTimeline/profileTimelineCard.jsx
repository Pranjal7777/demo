import dynamic from "next/dynamic";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"));
import parse from "html-react-parser";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
const DateRangeOutlinedIcon = dynamic(() => import('@material-ui/icons/DateRangeOutlined'));
import Image from "../../components/image/image";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useBookmark from "../../hooks/useBookMark";
import { findDayAgo } from "../../lib/date-operation/date-operation";
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
import { authenticate } from "../../lib/global/routeAuth";
import { linkify } from "../../lib/global/linkify";
import { openCollectionDialog } from "../../lib/helper";
import { getCookie, setCookie, setLocalStorage } from "../../lib/session";
import { deletePost, postLikeDislike } from "../../services/assets";
import CustomImageSlider from "../image-slider/ImageSlider";
import TextPost from "../TextPost/textPost";
import MenuModel from "../model/postMenu";
import Img from "../ui/Img/Img";
import Icon from "../image/icon";
import FeedVideoPlayer from "../videoplayer/feed-video-player";
import { getComments } from "../../services/comments";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import { createGroup, getGroupChat } from "../../services/chat";
import { chatList } from "../../lib/chat/chatModel";
import moment from "moment/moment";
import Button from "../../components/button/button";
import { getProfile, makeScheduledPostActive } from "../../services/profile";
import { downloadFile } from "../../lib/chat/downloadFile";
import { CHAT_PLAY, CROSS, REVIEW, share_icon_profile } from "../../lib/config/profile";
import { COMMENT_ICON, BOOKMARK_ICON, Creator_Icon, DOLLAR_ICON, INSIGHT, LIKE_ICON, NAV_CHAT_ICON, request_shotuout_post, UNLIKE_POST_ICON, LIKE_POST_ICON, FILL_BOOKMARK_ICON, SEND_POST_ICON } from "../../lib/config/homepage";
import { isAgency, defaultCurrency } from "../../lib/config/creds";
import { isShoutoutEnabled } from "../../services/shoutout";
import { CoinPrice } from "../ui/CoinPrice";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import { authenticateUserForPayment } from "../../lib/global";
import { useChatFunctions } from "../../hooks/useChatFunctions";
import { commentParser } from "../../lib/helper/userRedirection";

export default function ModelCard(props) {
  const { isLockedPost = false, coverImage } = props;
  const theme = useTheme();
  const [auth] = useState(getCookie("auth"));
  const userId = getCookie("uid");
  const userType = getCookie("userType");
  const [lang] = useLang();
  const [propsData, setPropsData] = useState(props);
  const [isModelOpen, setModelOpen] = useState(false);
  const [showDoubleClickHeart, setShowDoubleClickHeart] = useState(false);
  const scrolledPositionRef = useRef(0);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const userProfileActiveStarusCode = useSelector((state) => state?.profileData?.statusCode);
  const isUserProfileActive = userProfileActiveStarusCode == 5 || userProfileActiveStarusCode == 6 || userProfileActiveStarusCode == 7 ? false : true
  const { handleChat } = useChatFunctions()
  const [aspectWidth, setAspectWidth] = useState(window.innerWidth - 70);
  const moreOptionItems = [
    // { label: "Download Post", value: 6 },
    { label: "Report Post", value: 5 },
    { label: "Share Post", value: 7 },
  ];
  const textPostItem = [
    { label: "Report Post", value: 5 },
  ]
  const [ownPostOptionItems, setOwnPostOptionItems] = useState([
    { label: "Edit post", value: 3 },
    { label: "Delete post", value: 4 },
    // { label: "Download Post", value: 6 },
    { label: "Share Post", value: 7 },
  ]);
  const isScheduled = props.isScheduled;
  const items = [{ label: "Report Post", value: 5 },
  ];
  const [mobileView] = isMobile();
  const [parsedDescription, setParsedDescription] = useState("");
  const { bookmark, setBookMark, removeBookmark, addBookMarkReq } = useBookmark(
    props.isBookmarked
  );
  const router = useRouter();

  let pageSlug =
    router.asPath == "/profile" ||
    router.asPath == "/purchased-gallery" ||
    router.asPath == "/collections";

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const NON_TRANSMATION_URL = useSelector((state) => state?.appConfig?.nonTransformUrl);
  //Existing Chat list 
  const existingChatList = useSelector((state) => state.chat?.sale) || {};
  useEffect(() => {
    setPropsData(props);
    setParsedDescription(props.postDesc);
  }, [props]);
  useEffect(() => {
    showMoreDescText(props.postDesc, true);
    if (props.isFromCollection) {
      let removeDelEl = ownPostOptionItems.slice(1, 2);
      setOwnPostOptionItems(removeDelEl);
    }

    // if (isLockedPost) {
    //   let removeDelEl = ownPostOptionItems.filter((label) => label?.value != 3)
    //   setOwnPostOptionItems([...removeDelEl]);
    // }
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

  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  const handlePurchasePost = (data = {}) => {
    authenticate().then(() => {
      mobileView
        ? open_drawer("buyPost", {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price,
          currency: (props.currency && props.currency.symbol) || "$",
          updatePostPurchase,
          postType: props.postType,
        },
          "bottom"
        )
        : open_dialog("buyPost", {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price || 0,
          currency: (props.currency && props.currency.symbol) || "$",
          updatePostPurchase,
          postType: props.postType,
        });
    });
  };

  // Function to Like/DisLike the post

  let clicks = 0;
  let tapTimeout;
  const handleTouchEnd = () => {
    clicks++;
    if (clicks === 1) {
      clearTimeout(tapTimeout)
      tapTimeout = setTimeout(() => {
        if (
          propsData.isVisible ||
          props.postType == 3 ||
          props.userId == userId
        ) {
          const post = props.post
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
      userId: isAgency() ? selectedCreatorId : getCookie("uid"), assetid: props.postId,
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
        }

        // To update Unlike at profile page
        if (props.likedPost) {
          props.updateLikedPost();
        }

        updateModelCardPost(propsIns.postId, {
          isLike: propsIns.isLiked,
          likeCount: propsIns.likeCount,
        });
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
        console.error("ERROR IN getLatestComment >", err);
      });

    updateModelCardPost(assetIns.postId, {
      // commentCount: assetIns.commentCounts || assetIns.commentCount,
      commentCount: assetIns.commentCounts,
    });

    // setPropsData({ ...assetIns })
    setPropsData({
      ...propsData,
      commentCount: assetIns.commentCounts,
    });
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
    let assetIns = { ...propsData };
    assetIns["isVisible"] = 1;
    setPropsData({ ...assetIns });
    if (postData) {
      updateModelCardPost(assetIns.postId, {
        isVisible: 1,
        postData
      });
    } else {
      updateModelCardPost(assetIns.postId, {
        isVisible: 1
      });
    }
  };

  const back = () => {
    close_drawer();
  };

  const handleCommentBox = () => {
    mobileView
      ? open_drawer(
        "COMMENT",
        {
          drawerData: { postId: props.postId },
          back: () => back(),
          getLatestComment: (data) => getLatestComment(data),
          totalLikes: propsData.likeCount,
          totalViews: propsData.viewCount,
          profileName: props.profileName,
          userName: props.username || props?.userName,
          userId: propsData.userId
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
        userName: props.username || props?.userName,
        userId: propsData.userId
      });
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

  const makePostActive = async (e, { postId, userId }) => {
    try {
      startLoader()
      await makeScheduledPostActive({ postId, userId })
      props.handleDialog(false)
      // props?.setPage(1)
      Toast("Post Activated", "success");
      props.setActiveNavigationTab("grid_post")
      stopLoader()
    } catch (error) {
      stopLoader()
      Toast(error.message, "error");
      console.error(error.message)
    }
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

  const postDelete = (id) => {
    const payload = {
      postIds: [id],
    };
    startLoader();
    deletePost(payload)
      .then((res) => {
        let response = res;
        if (response.status == 200) {
          // props.reloadItems();
          props.deletePostEvent && props.deletePostEvent(id);
          stopLoader();
          Toast("Post deleted successfully!");
          // router.reload();
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

  const profileClickHandler = () => {
    if (userId == props.userId) {
      if (router.query.tab !== "profile") {
        props.setActiveState && props.setActiveState("profile");
        router.push(`/profile`);
      }
    } else {
      open_progress();
      setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id}`)
      router.push(`${props.username || props.userName}`);
    }
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

  const getOtherUserPost = () => {
    if (props.isVisible != 0) {
      return moreOptionItems;
    } else {
      let otherItem = moreOptionItems.splice(1, 3);
      return otherItem;
    }
  };

  const menuHandler = (option, props) => {
    if (auth && option && option.value == 4 && props && props.postId) {
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
    if (auth && option && option.value == 3 && props && props.postId) {
      props.viewPostPage ? close_dialog("paymentSuccess") : "";
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
    if (auth && option && option.value == 5 && props && props.postId) {
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
    if (auth && option && option.value == 6 && props && props.postId) {
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

  const handleShareItem = () => {
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
        back: () => close_dialog("SHARE_ITEMS"),
      });
  };

  const handleClickMoreOptions = () => {
    open_drawer("POST_OPTIONS", {
      drawerData: {
        reportedId: props.postId,
        reportType: 1,
      },
      back: () => close_drawer(),
    },
      "bottom"
    );
  };

  const postRejectedHandler = () => {
    drawerToast({
      title: lang.rejectionReason,
      desc: props.nsfwData.rejectionReason,
      isMobile: true,
      closeIconVisible: true,
      icon: true,
    })
  }

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

  return (
    <React.Fragment>
      <div
        id={props.postId}
        className={`col-12 ${mobileView
          ? "card-post rounded-0"
          : pageSlug
            ? "profile card-post-profile"
            : "card-post-profile"
          } pt-3 pb-3 ${mobileView ? 'mb-2' : 'my-3 borderStroke'}`}
      >
        {/* Post Header */}
        <div className="row align-items-center justify-content-between mb-3">
          <div className="col-auto profile-title">
            <div className="row align-items-center">
              <div className="col-auto pr-0">
                {props?.profileLogo ? (
                  <Image
                    src={s3ImageLinkGen(S3_IMG_LINK, props.profileLogo, mobileView ? 30 : 40, mobileView ? 42 : 50, mobileView ? 42 : 50)}
                    className="live cursorPtr"
                    crop="fill"
                    onClick={profileClickHandler}
                    style={
                      mobileView
                        ? { borderRadius: "50%" }
                        : {
                          borderRadius: "50%",
                          maxWidth: "3.660vw",
                          maxHeight: "3.660vw",
                          objectFit: "cover",
                          objectPosition: "top",
                        }
                    }
                    width={mobileView ? 42 : 50}
                    height={mobileView ? 42 : 50}
                  />
                ) : (
                  <Avatar className="feed_avatar uppercase solid_circle_border">
                    {props.firstName && (
                      <span className="feed_avatar_text">
                        {props?.firstName[0]}
                      </span>
                    )}
                  </Avatar>
                )}

                <Image
                  src={Creator_Icon}
                  width={mobileView ? 18 : 18}
                  height={mobileView ? 18 : 18}
                  style={
                    mobileView
                      ? {
                        position: "absolute",
                        top: "-4px",
                        right: "-9px",
                      }
                      : {
                        position: "absolute",
                        top: "-4px",
                        right: "-9px",
                      }
                  }
                />
              </div>
              <div className="col" style={mobileView ? { maxWidth: "39vw" } : {}}>
                <div
                  className={mobileView
                    ? "post_pro_name d-flex"
                    : `dv__post_pro_name ${theme.type == "light"
                      ? "dv__black_color" : "dv__white_color"
                    } `
                  }
                >
                  <strong
                    role="button"
                    // Code commented on 24th March by Bhavleen after Failed in Testing
                    // onClick={(e) => {
                    //   authenticate().then(() => {
                    //     props.userId !== userId &&
                    //       router.push(
                    //         `/otherProfile?userId=${props.userId}&status=1`
                    //       );
                    //   });
                    // }}
                    onClick={profileClickHandler}
                    className="pr-2 text-truncate"
                  >
                    {props.userName}
                  </strong>
                  {/* <Icon
                    icon={`${config.Creator_Icon}#creator_icon`}
                    color={theme.appColor}
                    size={20}
                    class="pointer"
                    viewBox="0 0 20 20"
                  /> */}
                </div>
                <div className="strong_app_text fntSz13">
                  {isScheduled ? "Created On" + " " + moment(props?.scheduledTimestamp).format("MMM DD YYYY") : findDayAgo(props.onlineStatus)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto row align-items-center m-0">

            {/* DashBoard code commented temporary */}
            {/* {!isLockedPost && !isScheduled &&
              <div className="cursorPtr">
                {props.userId != userId ? (
                  ""
                ) : (
                  <div
                    onClick={() =>
                      authenticate(router.asPath).then(() => {
                        mobileView
                          ? router.push(
                            `/dashboard/${props.postId}?f=1&t=1&ct=5`
                          )
                          : open_dialog("POST_INSIGHT", {
                            postId: props.postId,
                            f: 3,
                            t: 1,
                            ct: 5,
                          });
                      })
                    }
                  >
                    <Icon
                      icon={`${INSIGHT}#insight_icon`}
                      size={mobileView ? 30 : 2.6}
                      class="pointer mx-2"
                      unit={mobileView ? "px" : "vw"}
                      viewBox="0 0 19.803 21.729"
                      color={theme?.text}
                    />
                  </div>
                )}
              </div>
            } */}

            <div
            >
              {/* <div>
                {props.userId != userId ? (
                  <div
                    onClick={() => {
                      authenticate().then(() => {
                        handleChat({ userId: props?.userId, userName: props?.userName || props?.username });
                      });
                    }}
                    className="hover_bgClr mx-1"
                    style={{ borderRadius: '10px' }}
                  >
                    {

                      <Icon
                        icon={`${NAV_CHAT_ICON}#chat`}
                        size={30}
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
              </div> */}
            </div>
            {/* <div className="col-auto px-0">
              {((isAgency() ? selectedCreatorId : getCookie("uid")) !== props.userId && props.shoutoutPrice && props.isEnable) ?
                <div className="d-flex px-0 px-sm-0 hover_bgClr mx-0 ml-1"
                  style={{ borderRadius: "10px" }}>
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
                </div>
                : ""}
            </div> */}

            {!isLockedPost && <MenuModel
              items={props.userId == userId ? ownPostOptionItems : getOtherUserPost()}
              isOwnProfile={props.userId === userId}
              imageWidth={30}
              handleChange={(e) => menuHandler(e, props)}
              selected={{ label: "Revenue", value: 1 }}
              iconColorWhite={theme?.type == "light" ? false : true}
            />}
          </div>
        </div>

        {/* Post Content */}
        <div className="row mb-3 profile_post_cont">
          <div className="col-12 px-0 position-relative" style={props.postImage[0]?.type == 4 ? { minHeight: "250px" } : { minHeight: mobileView ? "32vw" : "23vw" }}>
            {(props.postImage && props.status == 0 && props.postImage[0].type == 2) &&
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
            }
            {showDoubleClickHeart && <div className="position-absolute doubleClickHeart d-flex justify-content-center align-items-center h-100 w-100">
              <Icon
                icon={LIKE_POST_ICON + "#like_posticon"}
                width={mobileView ? 52 : 88}
                height={mobileView ? 52 : 88}
                viewBox="0 0 88 88"
              />
            </div>}
            {((props.postImage && props.postImage[0] && props.postImage[0].type == 1) || props.postImage && props.postImage[0] && props.postImage[0].type == 2) ?
              <CustomImageSlider
                aspectWidth={aspectWidth}
                post={props.post}
                className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
                postType={props.postType}
                price={props.price}
                currency={props.currency}
                isVisible={propsData.isVisible || 0}
                userId={props.userId}
                postId={props.postId}
                currentTime={new Date().getTime()}
                makePostActive={makePostActive}
                isScheduled={isScheduled}
                userName={props.userName || props.username}
                updateTipHandler={updateTipHandler}
                updatePostPurchase={updatePostPurchase}
                // handlePurchasePost={handlePurchasePost}
                subscribedEvent={props.subscribedEvent}
                creationTs={props.scheduledTimestamp || props?.creationTs}
                onClick={handleTouchEnd}
                // width={aspectWidth > 900 ? 900 : aspectWidth}
                transformWidth={mobileView ? "90vw" : "50vw"} // Exact For Mob - 83vw and For DV - 44vw
                imagesList={props.postImage.filter(f => f.seqId !== 0)}
                alt={props.fullName}
                isProgressiveLoading={true}
              /> :
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
                alt={props.fullName}
              />
            }

            {props.status == 6
              ? <div className="bg-danger p-2 position-absolute d-flex justify-content-center align-items-center" style={{ bottom: 0, width: "91%" }} onClick={() => postRejectedHandler()}>
                <Icon
                  icon={`${CROSS}#cross`}
                  size={23}
                  class="mt-2"
                  unit={"px"}
                  color={theme.palette.l_red}
                />
                <span className="text-light">{lang.postRejected}</span>
              </div>
              : props.status == 5
                ? <div className="bg-primary p-2 text-light d-flex justify-content-center position-absolute" style={{ bottom: 0, width: "91%" }}>
                  <Icon
                    icon={`${REVIEW}#review`}
                    // size={mobileView ? 23 : 1.757}
                    class="mx-2"
                    // unit={mobileView ? "px" : "vw"}
                    viewBox="0 0 19.803 21.7290 0 15.872 15.708"
                    color={theme?.white}
                  />
                  {lang.inReview}
                </div>
                : <></>
            }
          </div>


        </div>
        {/* {isScheduled && <div className="position-absolute d-flex align-items-center justify-content-around text-white  ml-3 fntSz12 manageScheduleTimeProfileCard" style={!mobileView ? { opacity: "0.95", bottom: "6rem", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" } : { opacity: "0.95", bottom: "8.5rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <DateRangeOutlinedIcon style={{ width: "15px", height: "15px" }} />
          <p className="m-0 py-3">Scheduled for {moment(props?.creationTs).format("MMM DD ,h:mm a")} </p>
        </div>} */}

        {/* {isScheduled && <div className="position-absolute manageAtiveBtnProfileCard" style={!mobileView ? { bottom: "6rem", right: "-3rem", width: "11rem" } : { bottom: "6rem", right: "1.5rem" }}>
          <Button
            type="button"
            cssStyles={theme.blueButton}
            onClick={(e) => makePostActive({ postId: props?.postId, userId: props?.userId })}
            fclassname={`postBtn__btn p-2 ${!mobileView && "col-6"}`}
            btnSpanClass="fntSz12"
            isDisabled={new Date().getTime() < props?.creationTs}
          >
            {lang.makeActive}
          </Button>
        </div>} */}
        {/* Price Section Only For Locked Post */}
        {<div className="row px-2 justify-content-start">
          {isLockedPost
            ?
            <div className="dv__sendTip d-flex align-items-start px-2 py-1 ml-auto" style={mobileView ? { width: "17vw" } : { width: "5vw" }}>
              <CoinPrice price={props.price} size={14} iconSize={16} />
            </div>

            : ""}
        </div>}

        {/* Post Footer */}
        {!isScheduled && <div className="row mx-0 justify-content-between align-items-center mb-2">
          {!isLockedPost && <div className="col-auto px-0">
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

              {!(["4", "5", "6"].includes(props?.postType)) && <div
                className="d-flex align-items-end pointer"
                onClick={() =>
                {
                    handleShareItem();
                }
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
          </div>}

          <div className="col-auto px-0">
            <div className="d-flex flex-row align-items-center gap_8">
              {/* Send Tip Button */}
              {props.userId != userId && !isLockedPost && !(["4", "5", "6"].includes(props?.postType)) &&
                (mobileView
                  ?
                  <div
                    className="gradient_bg rounded-pill d-flex flex-row  w-500"
                    onClick={() => {
                      authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                        !isAgency() && authenticate(router.asPath).then(() => {
                          if (props.postType == 1 && !propsData.isVisible) {
                            open_drawer("buyPost", {
                              creatorId: props.userId,
                              postId: props.postId,
                              price: props.price,
                              currency:
                                props.currency && props.currency.symbol,
                              updatePostPurchase,
                              postType: props.postType,
                            },
                              "bottom"
                            );
                          } else if (
                            props.postType == 2 &&
                            !props.isVisible
                          ) {
                            open_drawer("CreatorPlanSubscription", {
                              back: () => close_drawer(),
                              creatorId: props.userId,
                              creatorName: props.profileName,
                            },
                              "bottom"
                            );
                          } else {
                            open_drawer("SentTip", {
                              creatorId: props.userId,
                              creatorName: props.userName,
                              postId: props.postId,
                              updateTip: (tipCount) =>
                                updateTipHandler &&
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
                      <div className="btn-subscribe py-1">
                        <span className="txt-heavy fntSz14">
                          {lang.subscribe}
                        </span>
                      </div>
                    ) : props.postType == 1 && !props.isVisible
                      ? <span className="btn-subscribe txt-heavy py-1 fntSz14">{lang.unlock}</span>
                      : <div className="d-flex flex-row py-1 px-2">
                        {/* <Icon
                          icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                          width={18}
                          height={18}
                          class='cursorPtr'
                          viewBox="0 0 20 20"
                        /> */}
                        <span className="txt-heavy fntSz14">
                          {lang.chatSendTip}
                        </span>
                      </div>
                    }
                  </div>
                  : <div
                    className="dv__sendTip d-flex align-items-center justify-content-center cursorPtr mx-2 py-1 px-2"
                    onClick={() => {
                      authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                        !isAgency() && authenticate(router.asPath).then(() => {
                          if (props.postType == 1 && !propsData.isVisible) {
                            open_dialog("buyPost", {
                              creatorId: props.userId,
                              postId: props.postId,
                              price: props.price || 0,
                              currency:
                                (props.currency && props.currency.symbol) ||
                                defaultCurrency,
                              updatePostPurchase,
                              postType: props.postType,
                            });
                          } else if (
                            props.postType == 2 &&
                            !props.isVisible
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
                              creatorName: props.userName,
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
                        <span className="txt-heavy dv__fnt14">
                          {lang.chatSendTip}
                        </span>
                      </>
                    }
                  </div>
                )
              }

              {/* Collection Action */}
              {/* {(props.postType != "1" || propsData.isVisible == 1) && ( */}
              {!isLockedPost && <div
                className="cursorPtr"
                onClick={() => {
                  authenticate(router.asPath).then(() => {
                    bookmark
                      ? mobileView
                        ? open_drawer(
                          "confirmDrawer",
                          {
                            title: lang.removeCollection,
                            subtitle: lang.removeSubTitleCollection,
                            yes: () => {
                              startLoader();
                              handleBookMarkRemove();
                              setTimeout(stopLoader, 1500);
                            },
                          },
                          "bottom"
                        )
                        : open_dialog("confirmDialog", {
                          title: lang.removeCollection,
                          subtitle: lang.removeSubTitleCollection,
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
                    style={{ width: mobileView ? '30px' : '2.5vw', height: mobileView ? '30px' : "2.5vw" }}
                  />}
              </div>}
              {/* )} */}
              {/* Collection Action End */}
            </div>
          </div>
        </div>}

        <div>
          <div
            className={
              mobileView
                ? "col-auto dv_post_desc px-0 pb-1"
                : "col-auto dv__fnt13 pl-0 pb-1"
            }
            style={{ color: 'var(--l_strong_app_text)' }}
          >
            {propsData.likeCount || 0} {propsData.likeCount > 1 ? 'likes' : 'like'}
          </div>
        </div>

        {/* Caption */}
        {props.postDesc && <div className="mb-2">
          <span className={mobileView ? "dv_post_desc" : "dv__post_desc"}>
            <strong role="button cursorPtr" onClick={() => authenticate().then()}>
              {props.username}
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
        {!isLockedPost && !isScheduled && <>
          {/* <a
            onClick={() => (auth ? handleCommentBox() : authenticate().then())}
            className={
              mobileView
                ? "lastSeenTime my-1 d-block pointer"
                : "dv__lastSeenTime my-1 dv__fnt13 d-block pointer"
            }
          >
            {lang.viewAll} {propsData.commentCount || 0} {lang.comments}
          </a> */}
          <div onClick={() => (auth ? handleCommentBox() : authenticate().then())} className="d-flex justify-content-between align-items-center cursorPtr" style={{ margin: '0px -14px', padding: '15px', paddingBottom: '0px', borderTop: '1px solid var(--l_border)' }}>
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
        </>}
      </div>

      <style jsx>{`
      
        :global(.rec.rec-item-wrapper) {
          min-height: ${mobileView ? "32vw" : "23vw"}
        }
        .post_desc_text a {
          text-decoration: none;
        }
        .profile_post_cont {
          min-height: 190px;
        }
        :global(.locked-post){
          width: 135%;
          min-height: 1.2em;
          word-break: break-word;
          display: block;
          max-height: 7em;
          overflow-y: auto;
          margin-top: 0.4rem;
        }
        :global(.dv__lastSeenTime){
          opacity:60% !important;
        }
        :global(.full_screen_dialog .MuiDialog-paperScrollPaper) {
          background-color: var(--l_app_bg3);
        }
      `}</style>
    </React.Fragment>
  );
}
