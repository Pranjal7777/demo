import React, { useCallback, useEffect, useState } from "react"
import Route, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useBookmark from "../../hooks/useBookMark";
import { findDayAgo } from "../../lib/date-operation/date-operation";
import { openCollectionDialog } from "../../lib/helper";
import { getCookie, setCookie } from "../../lib/session";
import { editComment, getComments, postComment } from "../../services/comments";
import { makeScheduledPostActive } from "../../services/profile";
import { creatorSearch, deletePost, postImpressionApi, postLikeDislike } from "../../services/assets";
import { updateHashtag } from "../../redux/actions/auth";
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
import { authenticate, isOwnProfile } from "../../lib/global/routeAuth";
import { scrollToView } from "../../lib/global/scrollToView";
import Image from "../image/image";
import CustomImageSlider from "../image-slider/ImageSlider";
import MenuModel from "../model/postMenu";
import TextPost from "../TextPost/textPost";
import Tooltip from "@material-ui/core/Tooltip";
import { getProfile } from "../../services/auth";
import { useTheme } from "react-jss";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import CommentTile from "../commentTile/CommentTile"
import { Avatar } from "@material-ui/core";
import { sendPurchasedExclusiveDataToRedux, updateBookmarkPostslider, updateOtherProfileData, updatePurchasedPost } from "../../redux/actions/otherProfileData";
import { updateCommentCount } from "../../redux/actions/comment";
import moment from "moment";
import { CROSS, CROSS_ICON_POSTSLIDER, NEXT_ARROW_POSTSLIDER, PREV_ARROW_POSTSLIDER } from "../../lib/config/profile";
import { BOOKMARK_ICON, COMMENT_ICON, Creator_Icon, FILL_BOOKMARK_ICON, hashtag_icon, INSIGHT, LIKE_POST_ICON, NAV_CHAT_ICON, request_shotuout_post, SEND_POST_ICON, UNLIKE_POST_ICON } from "../../lib/config/homepage";
import { COMMENT_PLACEHOLDER_IMAGE } from "../../lib/config/placeholder";
import { isAgency, defaultCurrency } from "../../lib/config/creds";
import SendIcon from "@material-ui/icons/Send"
import Icon from "../image/icon";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { useRef } from "react";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import Button from "../button/button";
import dayjs from "dayjs";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { CoinPrice } from "../ui/CoinPrice";
import { calenderIcon } from "../../lib/config";
import { authenticateUserForPayment } from "../../lib/global";
import { useChatFunctions } from "../../hooks/useChatFunctions";
import { commentParser } from "../../lib/helper/userRedirection";


/**
 * @description Post slider
 * @author Pranjal k
 * @date 2022-10-11
 *
 */

const PostSlider = (props) => {
  const {
    imagesList,
    transitionMs,
    isVisible,
    enableAutoPlay,
    transformWidth = null,
    width,
    isProgressiveLoading = false,
    isOtherProfile,
    otherPostSlider,
    ...others
  } = props;
  const theme = useTheme();
  const [userWalletBalance] = useUserWalletBalance()
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
  const [inputComment, setInputComment] = useState("");
  const [currentSlide, setCurrentSlide] = useState(props.postToShow)
  const [isDislikePost, setDislikePost] = useState(false)
  const [currentTime, setCurrentTime] = React.useState(moment().unix() * 1000);
  const [isEditComment, setEditComment] = useState(false)
  const [editPostId, setEditPostId] = useState("")
  const [selectedTags, setSelectedTags] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isUserTagged, setIsUserTagged] = useState(0);
  const [showDoubleClickHeart, setShowDoubleClickHeart] = useState(false);
  const oldCursorPos = useRef(0);
  const currentTagWord = useRef("");
  const enableLikeButton = React.useRef(true)
  const [chatLockPurchasedPost, setChatLockPurchasedPost] = useState(false)
  const scrolledPositionRef = useRef(0);
  const { handleChat } = useChatFunctions()
  const postImpressionRef = useRef()

  const router = useRouter();
  const moreOptionItems = [
    { label: "Report Post", value: 5 },
    { label: "Share Post", value: 7 },

  ];
  const ownPostOptionItems = [
    { label: "Edit Post", value: 3 },
    { label: "Delete Post", value: 4 },
    // { label: "Download Post", value: 6 },
    { label: "Share Post", value: 7 },
  ];
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const { bookmark, setBookMark, removeBookmark, addBookMarkReq } = useBookmark(props.isBookmarked);

  const [parsedDescription, setParsedDescription] = useState("");
  const userProfileActiveStarusCode = useSelector((state) => state?.profileData?.statusCode);
  const isUserProfileActive = userProfileActiveStarusCode == 5 || userProfileActiveStarusCode == 6 || userProfileActiveStarusCode == 7 ? false : true
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const ALL_DATA = useSelector((state) => state.allData);
  // otherPostSlider => means using data for slider from redux
  const [sliderData, setSliderData] = useState(otherPostSlider ? ALL_DATA : props.allData);
  const [SliderOptimizedData, setSliderOptimizedData] = useState([sliderData[props.postToShow]])

  useEffect(() => {
    setBookMark(props.isBookmarked);
  }, [props.isBookmarked]);

  useEffect(() => {
    if (otherPostSlider) {
      const updatedData = [...sliderData];
      updatedData[currentSlide] = ALL_DATA[currentSlide]
      setSliderData(updatedData)
      setSliderOptimizedData([ALL_DATA[currentSlide]])
    }
  }, [ALL_DATA])

  useEffect(() => {
    setSliderOptimizedData([sliderData[currentSlide]])
  }, [currentSlide])

  useEffect(() => {
    if (auth) {
    if(postImpressionRef?.current) {
      clearTimeout(postImpressionRef?.current)
      postImpressionRef.current=null;
    }
    postImpressionRef.current = setTimeout(() => {
      // record postImpressions
      console.log("sssssssssssssssssssssss", sliderData[currentSlide], isOtherProfile)
      if (isOtherProfile && sliderData?.[currentSlide]?.isVisible && getCookie("auth")) {
        let mediaType = 1;
        const currPost = sliderData[currentSlide]
        if (currPost && currPost.previewData && currPost.previewData?.length > 0) {
          mediaType = currPost.previewData[0]?.type || 1;
        } else if (currPost && currPost.postData && currPost.postData?.length > 0) {
          mediaType = currPost.postData[0]?.type || 1;
        }
        const impressionPayload = {
          postId: currPost?.postId,
          startTime: Date.now(),
          watchedDuration: 0,
          postType: currPost?.postType || 3,
          viewerId: uid,
          mediaType: mediaType,
        }
        postImpressionApi({ posts: [impressionPayload] })
      }
    }, 2000)

    return () => {
      if (postImpressionRef.current) {
        clearTimeout(postImpressionRef)
      }
    }
    }
  }, [currentSlide])

  useEffect(() => {
    setChatLockPurchasedPost(+sliderData[currentSlide].postType === 4 && props.purchasedPostPage)
  }, [currentSlide])
  useEffect(() => {
    setAspectWidth(window.innerWidth - 70);
    showMoreDescText(sliderData[currentSlide]?.description, true);

  }, []);
  useEffect(() => {
    showMoreDescText(sliderData[currentSlide]?.description, true);
  }, [sliderData[currentSlide].description])
  useEffect(() => {
    setPropsData(props);
  }, [props]);

  useEffect(() => {
    if (currentSlide === sliderData?.length - 1 && otherPostSlider) {
      props.setPage((prev) => prev === 0 ? prev + 2 : prev + 1)
    }
  }, [currentSlide])

  const showMoreDescText = (text, flag) => {
    const count = mobileView ? 100 : 150;
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

  let clicks = 0;
  let tapTimeout;
  const handleTouchEnd = (post) => {
    clicks++;
    if (clicks === 1) {
      clearTimeout(tapTimeout)
      tapTimeout = setTimeout(() => {
        if (
          post.isVisible ||
          post.postType == 3 ||
          post.userId == userId
        ) {

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
        handleLikeDislike(post)
      }
      clicks = 0;
    }
  };

  // Modified By Bhavleen on April 19th, 2021
  const handleLikeDislike = (post) => {
    if (!enableLikeButton.current) return
    enableLikeButton.current = false

    setPropsData({
      ...propsData,
      isLiked: !propsData.isLiked,
      likeCount: propsData.isLiked
        ? propsData.likeCount - 1
        : propsData.likeCount + 1,
    });

    let payload = {
      userId: isAgency() ? selectedCreatorId : getCookie("uid"),
      assetid: post.postId,
      like: !post.isLike,
    };
    postLikeDislike(payload)
      .then((res) => {
        let response = res;
        let propsIns = { ...propsData };
        if (response.status == 200) {
          dispatch(updateOtherProfileData({ postId: post.postId, isLike: !post.isLike }));
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
        setDislikePost(!isDislikePost)
        enableLikeButton.current = true
      })

      .catch((err) => {
        console.error(err);
        setPropsData({
          ...propsData,
          isLiked: false,
          likeCount: propsData.likeCount - 1,
        });
        enableLikeButton.current = true
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


  const back = () => {
    close_drawer();
  };


  const getLatestComment = async (data) => {
    let assetIns = { ...sliderData[currentSlide] };

    const payload = {
      postId: assetIns.postId,
    };


    await getComments(payload)
      .then((res) => {
        assetIns["latestComments"] = res && res.data && res.data.data;
        assetIns["commentCount"] = res && res.data && res.data.totalCount;
      })
      .catch((err) => {
        console.error(err);
      });
    dispatch(updateCommentCount({ commentCount: assetIns.commentCount, postId: assetIns.postId }))
    // updateModelCardPost(assetIns.postId, {
    //   commentCount: assetIns.commentCounts || assetIns.commentCount,
    // });
  };


  const menuHandler = (option, props) => {
    if (auth && option && option.value == 4 && props && props.postId) {
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
    if (auth && option && option.value == 3 && props && props.postId) {
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
    if (auth && option?.value == 6 && props && props.postId) {
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
          username: (props.profileName || props.username || props.userName),
          back: () => close_drawer(),
        },
          "bottom"
        )
        : open_dialog("SHARE_ITEMS", {
          postId: props.postId,
          shareType: "post",
          username: (props.profileName || props.username || props.userName),
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

  const profileClickHandler = () => {
    if (props.isHashtagPost) {
      if (uid == props.userId) {
        props.setActiveState && props.setActiveState("profile");
        Route.push("/profile");
        close_dialog("PostSlider")
      } else {
        Route.push(`/${props.username || props.userName}`);
        close_dialog("PostSlider")
      }

    } else {
      open_progress();
      if (uid == props.userId) {
        props.setActiveState && props.setActiveState("profile");
        Route.push("/profile");
        close_dialog("PostSlider")
      } else {
        setCookie("otherProfile", `${props.username || props.userName}$$${props.userId || props.userid || props._id}`)
        Route.push(`${props.username || props.userName}`);
        close_dialog("PostSlider")
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

  const handleUpdateHashTag = (follow = null) => {
    const payload = {
      postId: props.postId,
    }
    follow !== null ? payload.isFollow = follow : payload.isVisible = 1
    dispatch(updateHashtag(payload))
  }

  const updatePostPurchase = (postData) => {
    dispatch(sendPurchasedExclusiveDataToRedux({ assetIndex: currentSlide, data: postData }))
    handleUpdateHashTag()
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
    dispatch(updatePurchasedPost({ postId: props.postId, isVisible: 1 }))
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
    if (props.collectionPage) {
      props.getPosts()
    }
    close_dialog("confirmDialog");
    close_drawer("confirmDrawer");
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
      let otherItem = moreOptionItems.slice(1, 3);
      return otherItem;
    }
  };


  var handleScroller = async () => {
    const commentNode = document.querySelector(".mappedComments");
    const isScrollTouchingBottom = commentNode?.scrollHeight <= commentNode?.scrollTop + commentNode?.clientHeight + 1;

    if (isScrollTouchingBottom && !loading.current) {
      loading.current = true;
      setPageChange(Math.random());
    }
  };


  useEffect(() => {
    // getAllComments()
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

    if (isScrollTouchingBottom && comment?.length < totalComments) {
      //   startPageLoader();
      getAllComments(skip + 10);
    }
  }, [pageChange]);


  const getAllComments = (offset = 0, index) => {
    setSkip(offset);
    const list = {
      postId: index,
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
        // stopPageLoader();
        loading.current = false;
      })
      .catch((err) => {
        console.error("ERROR IN getAllComments", err);
        loading.current = false;
        // stopPageLoader();
      });
  };


  const commentSubmitHandler = (e) => {
    e.preventDefault();
    authenticate(router.asPath).then(() => {
    startLoader();
    if (!inputComment) return;
    let taggedUserIds = [];
    // Removed Tagged Users if Content is NSFW

    Object.keys(selectedTags).map((item) => {
      if (inputComment.includes("@" + item)) {
        return taggedUserIds.push(selectedTags[item].userId);
      }
    });
    scrollToView("mComments");
    setIsUserTagged(0)
    if (isEditComment) {
      const payload = {
        comments: inputComment,
        commentId: [editPostId],
        taggedUserIds: taggedUserIds,
      };
      editComment(payload)
        .then(async (res) => {
          setInputComment("");
          await getAllComments(0, sliderData[currentSlide].postId);
          await getLatestComment()
          Toast(res.data.message)
          stopLoader();
        })
        .catch((error) => {
          console.error(error);
          setComment("");
          Toast(
            error && error.response
              ? error.response.message
              : lang.commentNotAllowed,
            "error"
          );
          stopLoader();
        });
      setEditComment(false)
      setEditPostId("")
      return
    }
    const payload = {
      comments: inputComment,
      assetId: sliderData[currentSlide].postId,
      taggedUserIds: taggedUserIds,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    postComment(payload)
      .then(async (res) => {
        setInputComment("");
        await getAllComments(0, sliderData[currentSlide].postId);
        await getLatestComment()
        stopLoader();
      })
      .catch((error) => {
        console.error(error);
        setComment("");
        Toast(
          error && error.response
            ? error.response.message
            : lang.commentNotAllowed,
          "error"
        );
        stopLoader();
      });
    })
  };

  const handleRemoveEdit = () => {
    setEditComment(false);
    setEditPostId("");
    setInputComment("");
  }
  const handleDeletedComments = (id) => {
    setComment((prev) => {
      let updatedList = prev.filter((post) => post._id !== id)
      return updatedList
    })
  }
  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    commentSubmitHandler(e)
  }
  const handlePaymentThroughWallet = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath).then(() => {
        if (mobileView) {
          open_drawer("buyPost", {
            creatorId: props.userId,
            postId: props.postId,
            price: props.price,
            currency: (props.currency && props.currency.symbol) || "$",
            updatePostPurchase,
            postType: props.postType,
            lockedPost: props.lockedPost,
            messageId: props.messageId,
            lockedPostId: props.lockedPostId,
            chatId: props.chatId,
            callBack: () => { open_dialog("successPayment", { successMessage: lang.postSucessPurchased }) },
            purchaseUsingCoins: true,
            title: lang.purchasePost,
            description: lang.unlockPost,
            button: lang.purchasePost
          }, "bottom"
          )
        } else {
          open_dialog("buyPost", {
            creatorId: props.userId,
            postId: props.postId,
            price: props.price || 0,
            currency: (props.currency && props.currency.symbol) || defaultCurrency,
            updatePostPurchase,
            postType: props.postType,
            lockedPost: props.lockedPost,
            messageId: props.messageId,
            lockedPostId: props.lockedPostId,
            chatId: props.chatId,
            callBack: () => { open_dialog("successPayment", { successMessage: lang.postSucessPurchased }) },
            purchaseUsingCoins: true,
            title: lang.purchasePost,
            description: lang.unlockPost,
            button: lang.purchasePost
          });
        }
      })
    })
  }


  const handlePurchaseNewPost = () => {
    handlePaymentThroughWallet()
  }

  const handlePurchaseSuccess = () => {
    mobileView ? close_drawer() : close_dialog()
    mobileView ? open_drawer("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost }, "bottom") : open_dialog("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost })
  }

  const handlePurchasePost = (data = {}) => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath).then(() => {
        mobileView
          ?
          (userWalletBalance < props.price) ?
            open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : handlePurchaseNewPost()
          :
          (userWalletBalance < props.price) ?
            open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) : handlePurchaseNewPost()
      });
    })
  };


  useEffect(() => {
    auth && getAllComments(0, sliderData[currentSlide].postId)
    return () => {
      setComment();
    }
  }, [currentSlide])



  const handleNavigate = () => {
    if (props.rediredcted) {
      close_dialog("PostSlider")
      router.back()
    }
    else if (props.FavPage && isDislikePost) {
      props.updateLikedPost()
      close_dialog("PostSlider")
    }
    else {
      close_dialog("PostSlider")
    }
  }
  const settings = {

    initialSlide: currentSlide,
    // dots: true,
    // infinite: true,
    // speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: ((e) => { setCurrentSlide(e) }),
    arrows: false,
    draggable: (currentSlide === 0 || currentSlide === sliderData?.length - 1) ? false : true
  };

  const getCreatorsList = async (searchText) => {
    const list = {
      search: searchText || "",
    };
    if (isAgency()) {
      list["userId"] = selectedCreatorId;
    }
    creatorSearch(list)
      .then((res) => {
        if (res && res.data) {
          setSuggestions(res?.data?.data);
        } else {
          setSuggestions([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setSuggestions([]);
      });
  };



  const handleCaptionChange = useCallback((e, val) => {
    setInputComment(val)
    if (val) {
      let words;
      let { selectionStart } = e.target
      oldCursorPos.current = selectionStart
      words = val.slice(0, oldCursorPos.current).split("\n").join(" ").split(" ");
      const tagWord = words[words.length - 1];
      currentTagWord.current = tagWord

      if (tagWord.startsWith("@") && tagWord.slice(1)) {
        setIsUserTagged(1);
        getCreatorsList(tagWord.slice(1));
      } else {
        setSuggestions([]);
      }

    } else {
      setSuggestions([]);
    }
  }, [])


  const itemSelectHandler = async (item) => {
    setIsUserTagged(0)
    const words = inputComment.split("\n").join(" ").split(" ");
    let caption = inputComment;
    const taggedWords = currentTagWord.current
    if (
      Object.keys(selectedTags).includes(item.username) &&
      inputComment.includes(item.username)
    ) {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length).replace("@" + item.username, "") + caption.slice(oldCursorPos.current - taggedWords.length).replace("@" + item.username, "").replace(taggedWords, "@" + item.username + " ")
    } else {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length) + caption.slice(oldCursorPos.current - taggedWords.length).replace(taggedWords, "@" + item.username + " ")
    }
    await setInputComment(caption);
    setSuggestions([]);
    await setSelectedTags({
      ...selectedTags,
      [item.username]: item,
    });
    const postElem = document.getElementById(
      "post-caption"
    );
    postElem.focus();
    const selRange = parseInt(caption.length * 2);
    postElem.setSelectionRange(
      selRange,
      selRange,
      "forward"
    );
  };
  const TagUserUI = () => {
    return (
      suggestions.length ? <div className="position-absolute card_bg shadowBoxTaged"
        style={{ width: '100%', zIndex: 1, height: " calc(100vh - 209px)", top: "67px", overflowY: 'scroll', overflowX: 'hidden' }}>
        {suggestions?.length
          ? suggestions.map((item, index) => (
            <div key={index} className="d-flex flex-row tagTile justify-content-start align-items-center py-1 my-1 cursorPtr"
              onClick={() => itemSelectHandler(item)}
            >
              <div className="px-3">
                {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                  :
                  <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                }
              </div>
              <div className="">
                <p className="m-0 fntSz16 font-weight-400 ">@{item.username}</p>
              </div>
              <hr className="m-0" />
            </div>
          ))
          : ""
        }
      </div> : ""
    )
  }
  const makePostActive = async (e, { postId, userId }) => {
    try {
      startLoader()
      await makeScheduledPostActive({ postId, userId })
      //   props?.setPage(1)
      Toast("Post Activated", "success");
      close_dialog()
      props.setActiveNavigationTab("grid_post")
      stopLoader()
    } catch (error) {
      stopLoader()
      Toast(error.message, "error");
      console.error(error.message)
    }
  }

  const handleUpdateBookmark = () => {
    setBookMark(true)
    dispatch(updateBookmarkPostslider({ postId: props.postId, isBookmarked: 1 }))
  }


  return (
    <>

      <div className="position-relative">
        {SliderOptimizedData?.map((post) => {

          return <div key={post.postId} className="parent position-relative">
            <div className="ImageDiv position-relative">
              {!!props?.isScheduled && <div className="d-flex position-absolute align-items-center justify-content-around text-white  mb-2 fntSz12 manageScheduleTimeProfileCard " style={!mobileView ? { opacity: "0.95", bottom: "90%", left: "4%", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)", zIndex: "999" } : { opacity: "0.95", bottom: "8.5rem", left: "10px", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Icon
                  icon={`${calenderIcon}#calender_icon`}
                  alt="calender-icon"
                  color={"white"}
                  width={15}
                  className="dv_setRgtPosAbs"
                />
                <p className="m-0 py-3">Scheduled for {dayjs(props?.onlineStatus).format("MMM DD, h:mm a")} </p>
              </div>}

              {!!props.isScheduled && <div className="position-absolute " style={mobileView ? { bottom: "1rem", right: "1rem", zIndex: "10" } : { bottom: "1.5rem", zIndex: "1" }}>
                <Button
                  type="submit"
                  cssStyles={theme.blueButton}
                  onClick={(e) => makePostActive(e, { postId: props?.postId, userId: props?.userId })}
                  isDisabled={currentTime > props?.onlineStatus ? false : true}
                >
                  {lang.makeActive}
                </Button>
              </div>}
              <div className="position-relative" style={{ width: "100vw", height: "100%" }}>
                {showDoubleClickHeart && <div className="position-absolute doubleClickHeart d-flex justify-content-center align-items-center h-100 w-100">
                  <Icon
                    icon={LIKE_POST_ICON + "#like_posticon"}
                    width={mobileView ? 52 : 88}
                    height={mobileView ? 52 : 88}
                    viewBox="0 0 88 88"
                  />
                </div>}
                {(post.postData[0]?.type == 1 || post.postData[0]?.type == 2) ?
                  <div style={{ height: "100%" }}>
                    <CustomImageSlider
                      aspectWidth={aspectWidth}
                      isFullHeight={true}
                      post={post}
                      className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
                      postType={post.postType}
                      price={post.price}
                      currency={post.currency}
                      isVisible={props.isLockedPost ? props.isVisible : post.isVisible || 0}
                      userId={post.userId}
                      postId={post.postId}
                      userName={post.userName || props.username}
                      updateTipHandler={updateTipHandler}
                      updatePostPurchase={updatePostPurchase}
                      // handlePurchasePost={handlePurchasePost}
                      subscribedEvent={handleUpdateHashTag}
                      onClick={() => handleTouchEnd(post)}
                      // width={aspectWidth > 900 ? 900 : aspectWidth}
                      transformWidth={mobileView ? "90vw" : "50vw"} // Exact For Mob - 83vw and For DV - 44vw
                      imagesList={post.postData.filter(f => f.seqId !== 0)}
                      alt={post.fullName}
                      isProgressiveLoading={true}
                      chatLockPurchasedPost
                      postSliderImage={true}
                    />
                  </div>
                  :
                  <div style={{ height: "50vh" }}>
                    <TextPost
                      className={mobileView ? "dv_postImg" : "dv__profilepostImg"}
                      postType={post.postType}
                      price={post.price}
                      currency={post.currency}
                      isVisible={props.isLockedPost ? props.isVisible : post.isVisible || 0}
                      userId={post.userId}
                      postId={post.postId}
                      updateTipHandler={updateTipHandler}
                      updatePostPurchase={updatePostPurchase}
                      handlePurchasePost={handlePurchasePost}
                      subscribedEvent={handleUpdateHashTag}
                      width={aspectWidth > 900 ? 900 : aspectWidth}
                      textPost={post.postData}
                      alt={post.fullName}
                      showPriceOnGrid={true}
                    />
                  </div>

                }
              </div>
            </div>
            <div className={`col-12 card-post h-100 p-0 contentParent ${((props.isLockedPost || chatLockPurchasedPost) || (post.creationTs > currentTime)) ? 'p-0 lockedPostBg ' : "py-3 "}`}>
              {/* Post Header */}
              <div className={`chatHead ${((props.isLockedPost || chatLockPurchasedPost) || (post.creationTs > currentTime)) && "lockedPostHeaderBg"}`}>
                <div className={`row m-0 align-items-center justify-content-between sidePadding15 ${((props.isLockedPost || chatLockPurchasedPost) || (post.creationTs > currentTime)) && "sidePadding15 paddingTop10 "} `}>
                  <div className="col-auto pl-0 profile-title">
                    <div className="row align-items-end position-relative">
                      <div className="col-auto pr-0 position-relative cursorPtr" onClick={profileClickHandler}>
                        {post.profilePic && (
                          <Image
                            src={s3ImageLinkGen(S3_IMG_LINK, post.profilePic, 30, 42, 42)}
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
                            {post.isHashtagPost ? post.hashtagName : post.username}
                          </h3>
                          {!mobileView ? (
                            <div className="dv__postCreatorIcon">
                              <Image
                                src={props.isHashtagPost
                                  ? hashtag_icon
                                  : Creator_Icon
                                }
                                width={16}
                                height={16}
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
                        </div>
                        <div
                          className={mobileView ? "lastSeenTime" : "dv__lastSeenTime"}
                        >
                          {findDayAgo(post.creationTs || post.postedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto px-0 pr-2 row d-flex align-items-center">

                    {/* DashBoard code commented temporary */}
                    {/* {(!!!props.isLockedPost || !!!chatLockPurchasedPost) && <Tooltip title={lang.postInsight}>
                      <div>
                        {post.userId != uid ? (
                          ""
                        ) : (
                          <div
                            onClick={() =>
                              authenticate(router.asPath).then(() => {
                                mobileView
                                  ? Route.push(
                                    `/dashboard/${post.postId}?f=3&t=1&ct=5`
                                  )
                                  : open_dialog("POST_INSIGHT", {
                                    postId: post.postId,
                                    f: 3,
                                    t: 1,
                                    ct: 5,
                                    theme: theme,
                                  });
                              })
                            }
                          >
                            <Icon
                              icon={`${INSIGHT}#insight_icon`}
                              size={2.6}
                              class="pointer"
                              hoverColor='var(--l_base)'
                              unit={"vw"}
                              viewBox="0 0 52 52"
                            />
                          </div>
                        )}
                      </div>
                    </Tooltip>} */}



                    <MenuModel
                      items={
                        post.userId == uid ? getOwnUserPost() : getOtherUserPost()
                      }
                      // items={post.userId == uid ? ownPostOptionItems : moreOptionItems}
                      isOwnProfile={isOwnProfile(post.userId)}
                      iconColorWhite={theme.type === "light" ? false : true}
                      imageWidth={24}
                      handleChange={(e) => authenticate(router.asPath).then(() => menuHandler(e, post))}
                      selected={{ label: "Revenue", value: 1 }}
                    // className="adjustFilterColor"
                    />
                  </div>


                </div>
                <div className="borderBtm sidePadding15" style={{ marginBottom: "0px", marginTop: "5px", paddingBottom: "5px", maxHeight: "69px", overflowY: "auto" }}>
                  {post.description ?
                    <>
                      <p className="democheckingHei text-break mb-0 hideScroll mv_chat_pro_status text-break" style={{ display: "inline" }}>
                        {commentParser(parsedDescription, props?.taggedUsers)}
                        {post.description &&
                          post.description.length > (mobileView ? 100 : 150) &&
                          (parsedDescription.length > (mobileView ? 100 : 150) ? (
                            <a
                              onClick={() => showMoreDescText(post.description, true)}
                              className="cursorPtr"
                            >
                              {lang.showLess}
                            </a>
                          ) : (
                            <a
                              onClick={() => showMoreDescText(post.description, false)}
                              className="cursorPtr"
                            >
                              {lang.showMore}
                            </a>
                          ))}
                      </p>
                    </>
                    :
                    ""
                  }</div>

              </div>
              {(props.isLockedPost || chatLockPurchasedPost) || (post.isScheduled && post.creationTs > currentTime) ? "" : <div className={` sidePadding15 ${post.description ? "dynamicMappedComments" : "mappedComments pt-3"} ${!comment?.length ? "d-flex align-items-center" : ""} `} id="mComments">
                {!comment?.length ? <div style={{ backgroundImage: `url(${COMMENT_PLACEHOLDER_IMAGE})` }} className="text-muted comment_placeholder w-100">
                  {lang.commentPlaceholder}
                </div> :
                  <div>
                    {comment && comment.map((elem) => {
                      return <CommentTile
                        data={elem}
                        mobileView={mobileView}
                        img={s3ImageLinkGen(S3_IMG_LINK, elem.users.profilePic, 30, 42, 42)}
                        dayAgo={findDayAgo(elem.timeStamp, "comment")}
                        key={elem.creationTs + elem.lastUpdatedOn}
                        userId={props.userId} assetOwnerId={post.userId}
                        setInputComment={setInputComment}
                        setEditComment={setEditComment}
                        isEditComment={isEditComment}
                        setEditPostId={setEditPostId}
                        taggedUserData={elem?.taggedUserData}
                        handleDeletedComments={handleDeletedComments}
                      />
                    })}
                  </div>}

                {/* mappedCommentsEnd */}

              </div>}

              {(props.isLockedPost || chatLockPurchasedPost) || (post.isScheduled && post.creationTs > currentTime) ? "" : <div className="footerSection sidePadding15">

                {/* Post Footer */}
                <div className="d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-row align-items-center gap_12 pl-1">
                    {/* Like Action	 */}
                    <div className="d-flex flex-row align-items-center" >
                      <div
                        className={"hover_bgClr radius_8"}
                        onClick={() => authenticate(router.asPath).then(() => handleLikeDislike(post))}
                      >
                        <Icon
                          icon={`${post.isLike ? LIKE_POST_ICON + "#like_posticon" : UNLIKE_POST_ICON + "#like_posticon"}`}
                          width={2.2}
                          height={2.2}
                          unit={"vw"}
                          color={theme?.type === "light" ? "#D33AFF" : ""}
                          hoverColor='var(--l_base)'
                          className='cursorPtr'
                          viewBox="0 0 52 52"
                        />
                      </div>

                      <div className="light_app_text">
                        {post.likeCount || 0}
                      </div>
                    </div>

                    {/* Comment Action */}
                    <div className="d-flex flex-row align-items-center" >
                      <div className={"hover_bgClr radius_8"}>
                        <Icon
                          icon={`${COMMENT_ICON}#comment_icon`}
                          width={2.2}
                          height={2.2}
                          unit={"vw"}
                          class="pointer"
                          color={theme?.type === "light" ? "#D33AFF" : ""}
                          hoverColor='var(--l_base)'
                          viewBox="0 0 52 52"
                        />
                      </div>
                      <div className="pl-1 light_app_text">
                        {post.commentCount || 0}
                      </div>
                    </div>

                    {/* share post */}
                    {!(["4", "5", "6"].includes(post?.postType)) && <div
                      className="d-flex flex-row align-items-center pointer"
                      onClick={() =>
                        handleSharePost()
                      }
                    >
                      <div className={"hover_bgClr radius_8"}>
                        <Icon
                          icon={`${SEND_POST_ICON}#share_post`}
                          width={2.2}
                          height={2.2}
                          unit={"vw"}
                          class="pointer"
                          color={theme?.type === "light" ? "#D33AFF" : ""}
                          hoverColor='var(--l_base)'
                          viewBox="0 0 52 52"
                        />
                      </div>
                    </div>}

                    {/* Total Tip Received */}
                    {/* <div className="d-flex flex-row align-items-end">
                      {post.totalTipReceived > 0 && <CoinPrice price={post.totalTipReceived || "0"} size="18" suffixText={lang.tip} showCoinText={false} iconSize={15} />}
                    </div> */}
                  </div>

                  <div className="d-flex flex-row justify-content-end align-items-center gap_12">
                    {/* Send Tip Button */}
                    {(props.userId != uid && !isAgency()) && !(["4", "5", "6"].includes(post?.postType)) &&
                      (mobileView ? (
                        <div
                        className="d-flex flex-row gradient_bg px-2 py-1 rounded-pill pointer"
                          onClick={() => {
                            authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                              !isAgency() && authenticate(router.asPath).then(() => {
                                if (props.postType == 1 && !post.isVisible) {
                                  handlePurchasePost()
                                } else if (
                                  props.postType == 2 && !post.isVisible
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
                          {props.postType == 2 && !post.isVisible ? (
                            <div className="btn-subscribe">
                              <span className="txt-heavy fntSz14">
                                {lang.subscribe}
                              </span>
                            </div>
                          ) : props.postType == 1 && !post.isVisible
                            ? <span className="btn-subscribe txt-heavy fntSz14">{lang.unlock}</span>
                            : <div className="btn-subscribe">
                              <span className="txt-heavy ml-2 fntSz14">
                                {lang.chatSendTip}
                              </span>
                            </div>
                          }
                        </div>
                      ) : (
                        <div
                          className="d-flex flex-row gradient_bg px-2 py-1 rounded-pill pointer"
                          onClick={() => {
                            authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                              !isAgency() && authenticate(router.asPath).then(() => {
                                if (props.postType == 1 && !post.isVisible) {
                                  handlePurchasePost()
                                } else if (
                                  props.postType == 2 && !post.isVisible
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
                          {props.postType == 2 && !post.isVisible ? (
                            <span className="txt-heavy dv__fnt14">
                              {lang.subscribe}
                            </span>
                          ) : props.postType == 1 && !post.isVisible
                              ? <span className="txt-heavy dv__fnt14 dv__sendTip d-flex align-items-center justify-content-center cursorPtr mx-3 py-1">{lang.unlock}</span>
                            : <>
                                <span className="txt-heavy  dv__fnt14 dv__sendTip d-flex align-items-center justify-content-center cursorPtr mx-2 py-1">
                                  {lang.chatSendTip}
                              </span>
                            </>
                          }
                        </div>
                      ))}

                    {/* Collection Action */}
                    {/* {(props.postType != "1" || post.isVisible == 1) && ( */}
                    <div
                      className="hover_bgClr cursorPtr"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        authenticate(router.asPath).then(() => {
                          (props.collectionPage ? bookmark : post.isBookmarked)
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
                              :
                              openCollectionDialog(
                                {
                                  postId: sliderData[currentSlide].postId,
                                  postData: sliderData[currentSlide].postData,
                                  collectionId: sliderData[currentSlide].collectionId,
                                  updateBookMark: () => handleUpdateBookmark(),
                                  isVisible: sliderData[currentSlide].isVisible,
                                  postType: sliderData[currentSlide].postType,
                                  userId: sliderData[currentSlide].userId,
                                  userId: isAgency() ? selectedCreatorId : propsData.userId,

                                },
                                mobileView
                              );
                        });
                      }}
                    >
                      {(props.collectionPage ? !bookmark : !post.isBookmarked) ? <Icon
                        icon={`${BOOKMARK_ICON}#bookmark`}
                        color={theme?.type === "light" ? "#D33AFF" : ""}
                        hoverColor='var(--l_base)'
                        width={mobileView ? 27 : 2.2}
                        height={mobileView ? 27 : 2.2}
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



                {/* Comment Actions */}


                <form onSubmit={commentSubmitHandler}
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
                  }>
                  <TextareaAutosize
                    type="text"
                    placeholder={lang.addComment}
                    value={inputComment}
                    rows={1}
                    rowsMax={2}
                    id="post-caption"
                    // autoFocus
                    onKeyPress={handleEnterPress}
                    className={
                      mobileView
                        ? "form-control form-control-textarea m-2 comment_input"
                        : `form-control dv__form-control-textarea m-2 heightControl ${isEditComment && "paddingLeft15 pl-4"} `
                    }
                    onChange={(e) => handleCaptionChange(e, e.target.value)}
                  />
                  <Button style={{ width: "0", background: "none" }} disabled={!inputComment}>
                    <SendIcon
                      className="send-icon cursorPtr"
                      onClick={commentSubmitHandler}
                    />
                  </Button>
                  {isEditComment && <div className="pointer" style={{ position: "absolute", left: "15px", top: "21px" }}>
                    <Icon
                      icon={`${CROSS}#cross`}
                      size={17}
                      unit={"px"}
                      color={"var(--l_app_bg)"}
                      onClick={handleRemoveEdit}
                    />
                  </div>}
                </form>

                {isUserTagged === 1 && TagUserUI()}
              </div>}

            </div>
          </div>
        })}

        <style jsx>{`
  
  :global(.PostSlider){
    min-width:${props.adjustWidth && "77vw !important"}
  }
  :global(.PostSlider .MuiDialog-paperScrollPaper){
    max-height:unset !important;
    border-radius:15px !important;
  }
      :global(.rec.rec-carousel-wrapper){
        width:100% !important;
        min-height:${otherPostSlider && "40vh !important"};
      }

      :global(.MuiDialogContent-root){
        overflow: visible;
      }
      .manageScheduleBtn{
        bottom: 1rem;
        left: 50%;
        transform: translate(-50%, 0px);
        width: 85%;
      }
      .mappedComments{
        max-height: calc(100% - 47px - 60px - 47px) !important;
        min-height: calc(100% - 47px - 60px - 47px) !important;
        overflow-y: auto !important;
      }
      .dynamicMappedComments{
        padding-top: 10px;
        flex: 1 1 auto; 
        overflow-y: auto !important;
      }
      .card-post{
        flex-basis: 50% !important;
        border-radius:0px !important;
        border-top-right-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
        
      }
      .parent{
        display: flex !important;
        flex-wrap: nowrap !important;
        height: 92vh !important;
        width: 100% !important;
        gap:1px;
        background: var(--theme);
        border-radius: 15px;
      }
      .modelImg{
        max-height: 100% !important;
        max-width: 100% !important;
      }
      .heightControl{
        max-height:68px !important; 
      }
      :global(.postSlider .slick-current>div){
        background: var(--theme);
        border-radius: 4px;
      }
      .ImageDiv{
        display: flex !important;
        flex-basis: 50% !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        position:relative !important;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        height: 100%;
      }
      :global(.ImageDiv .rec-carousel-wrapper), :global(.ImageDiv .rec-carousel), :global(.ImageDiv .rec-slider-container), :global(.ImageDiv .rec-slider) {
        height: 100% !important;
      }
        :global(.MuiList-padding) {
          padding: 0 10px !important;
          margin-top: 0px !important;
        }
        :global(.MuiMenu-paper) {
          margin-top: 5px !important;
        }
        :global(.rec.rec-item-wrapper) {
          // min-height: ${mobileView ? "32vw" : "30vw"}
        }
        .post_desc_text a {
          text-decoration: none !important;
        }
        :global(.hastag__img){
          min-height:28vh !important;
          max-height:28vh !important;
        }
        :global(.MuiAvatar-colorDefault, .feed_avatar) {
          background-color: ${theme.palette.l_base} !important;
        }
        .dv__feed_follow_btn {
         color: ${theme.type === "dark" ? theme.palette.white : theme.palette.l_base} !important !important;
        }
        .app-link{
          color: ${theme.type === "dark" ? theme.palette.white : theme.palette.l_base} !important !important;
        }
        .feed_avatar {
          width: 42px !important;
          height: 42px !important;
        }
        .feed_avatar_text {
          font-size: 16px !important;
          color: var(--l_base) !important;
        }
        .footerSection sidePadding15{
          flex: 0 0 30%;  
          
        }
        .borderBtm{
          border-bottom: ${theme.type === "light" ? "1px solid #e9e1e1 !important" : "1px solid #353030 !important"};
        }
        :global(.adjustFilterColor){
          filter:drop-shadow(rgba(0, 0, 0, 0.9) 0px 0px 0px) !important;
        }
        :global(.dv__profilepostImg){
          border-radius:0 !important;
          object-fit: contain;
          max-height:100% !important;
        }
        
      `}</style>



        {currentSlide !== 0 && <div className="customPrevArrow cursor-pointer" onClick={() => { setCurrentSlide(prev => prev - 1) }}>
          <Icon
            icon={`${PREV_ARROW_POSTSLIDER}#vuesax_bold_arrow-right`}
            width={40}
            height={40}
            alt="prev-icon"
            viewBox="0 0 50 50"
          />
        </div>}
        {currentSlide != sliderData?.length - 1 && <div className="customNextArrow cursor-pointer" onClick={() => { setCurrentSlide(prev => prev + 1) }}>
          <Icon
            icon={`${NEXT_ARROW_POSTSLIDER}#vuesax_bold_arrow-right`}
            width={40}
            height={40}
            alt="prev-icon"
            viewBox="0 0 50 50"
          />
        </div>}
        <style>{`

:global(.MuiDialog-paper){
  min-width:60vw !important;
}
:global(.rec.rec-carousel-wrapper){
  width:100% !important;
}

:global(.MuiDialogContent-root){
  overflow: visible;
}

.customPrevArrow {
  position: fixed;
  left: 2%;
  bottom: 45%;
}

.customNextArrow{
  position: fixed;
  right: 2%;
  bottom: 45%;
  
}
.contentParent{
  display: flex;
  flex-direction: column;
  height: 100%; 
}
.chatHead{
  flex: 0 0 auto; 
  max-height: 30%; 
  overflow-y: auto; 
}
.handleCross{
  position:absolute;
  z-index: 10;
  top: 1px;
  right: -40px;
}
          .slider__image {
              width: 100%;
              height: ${props.title != "hashtag" && '100vh'};
              max-height: ${props.title == "hashtag" ? '450px' : "100vh"};
              object-position: bottom;
              object-fit: fill;
          }
          .slick-dots {
              position: absolute;
              bottom: 30px;
          }
          .slick-prev:before,.slick-next:before{
            font-size:27px !important;
          }
          .slick-prev {
            left: -32px;
        }
          .slick-dots li button:before {
            font-family: 'slick';
            font-size: 10px;
            line-height: 20px;
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 49px;
            content: '•';
            text-align: center;
            opacity: 0.4;
            color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .slick-dots li.slick-active button:before {
            opacity: 1;
            color: #fff;
        }
        .sidePadding15{
          padding:0 15px;
        }
        .paddingTop10{
          padding-top:10px;
        }
        .lockedPostBg{
         background:${theme.type === "light" ? 'var(--l_app_bg) ' : 'var(l_profileCard_bgColor)'}
        }

        .lockedPostHeaderBg{
          background:${theme.type === "light" ? 'var(--white)' : 'var(--l_app_bg)'}
         }
      `}
        </style>
      </div>
      <Icon
        icon={`${CROSS_ICON_POSTSLIDER}#Group_133516`}
        color={theme.appColor}
        class="cursorPtr handleCross"
        size={24}
        viewBox="0 0 35 35"
        onClick={handleNavigate}
      />
      <div className={mobileView ? "" : `${props?.isExplorePage ? "dv__tipSec_search" : "dv__tipSec"}  d-flex align-items-center`}>

        {window.location.pathname === "/search" &&
          props.userId != uid && !mobileView && (
            <div
              className={`${!isVisible && props.postType == 1 ? "" : "dv__sendTip"} cursorPtr mx-2 px-2 py-1`}
              onClick={() => {
                authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                  !isAgency() && authenticate(router.asPath).then(() => {
                    if (!isVisible && props.postType == 1) {
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
                    } else {
                      open_dialog("sendTip", {
                        creatorId: props.userId,
                        postId: props.postId,
                        updateTip: (tipCount) =>
                          updateTipHandler && updateTipHandler(tipCount),
                      });
                    }
                  });
                })
              }}
            >
              {!isVisible && props.postType == 1 ? "" : (
                <div className={`d-flex ${props?.isExplorePage ? "py-0 px-2" : "pb-1 mx-2 p-2"} dv__sendTip`}>
                  <Icon
                    icon={`${DV_Sent_Tip}#_Icons_11_Dollar_2`}
                    color={theme.palette.l_app_bg}
                    viewBox="0 0 20 20"
                  />
                  <span className="txt-heavy ml-2 dv__fnt14 pt-1">{lang.sendTip}</span>
                </div>
              )}
            </div>
          )}
      </div>
      <style>{`
        img{
          object-fit:contain;
        }
      `}</style>
    </>
  );
};
export default PostSlider;

