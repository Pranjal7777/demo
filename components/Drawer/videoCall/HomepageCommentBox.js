import React, { useEffect, useRef, useState } from "react";
import Route from "next/router";
import dynamic from "next/dynamic";
// import moment from "moment";

import {
  backNavMenu,
  close_dialog,
  isOwnProfile,
  open_dialog,
  open_drawer,
  open_progress,
  scrollToView,
  startLoader,
  startPageLoader,
  stopLoader,
  stopPageLoader,
  Toast,
} from "../../../lib/global";
import * as config from "../../../lib/config";
import { editComment, getComments, postComment } from "../../../services/comments";
import { findDayAgo } from "../../../lib/date-operation/date-operation";
import isMobile from "../../../hooks/isMobile";
import { getCookie, setCookie } from "../../../lib/session";
import Wrapper from "../../../hoc/Wrapper";
import { creatorSearch } from "../../../services/assets";
import Icon from "../../image/icon";
import { Creator_Icon, hashtag_icon } from "../../../lib/config/homepage";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/s3ImageLinkGen";
import { useDispatch, useSelector } from "react-redux";
import isTablet from "../../../hooks/isTablet";
import { Tooltip } from "@material-ui/core";
import Image from "../../image/image";
import { authenticate } from "../../../lib/global/routeAuth";
import { follow } from "../../../services/profile";
import { close_progress } from "../../../lib/global/loader";
import { UPDATE_PROFILE_FOLLOWING } from "../../../redux/actions/auth";
import useProfileData from "../../../hooks/useProfileData";
import { useTheme } from "react-jss";
// import { linkify } from "../../lib/global/linkify";
import parse from "html-react-parser"
import { Button } from "@mui/material";
import useLang from "../../../hooks/language";
import { CROSS_POSTSLIDER } from "../../../lib/config/profile";
import { isAgency } from "../../../lib/config/creds";

const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });
const SendIcon = dynamic(() => import("@material-ui/icons/Send"), { ssr: false });
const CloseIcon = dynamic(() => import("@material-ui/icons/Close"), { ssr: false });
const TextareaAutosize = dynamic(() => import("@material-ui/core/TextareaAutosize"), { ssr: false });
const Header = dynamic(() => import("../../header/header"), { ssr: false });
const PageLoader = dynamic(() => import("../../loader/page-loader"), { ssr: false });
const CommentTileHome = dynamic(() => import(".././CommentTileHome"), { ssr: false })

/**
 * @description comment box component
 * @author Jagannath
 * @date 2020-12-31
 * @param props {
 *  getLatestComponent: f({latestComment, commentCount});
 *  back: f();
 *  drawerData: {};
 *  theme: string - dark/light
 *  profileName: string - for light mode
 *  totalViews: any - for light mode
 * }
 */
const HomepageCommentBox = (props) => {
  const {
    icon,
    getLatestComment,
    drawerData,
    back,
    profileName,
    username,
    userName,
    totalLikes,
    totalViews,
  } = props;
  const theme = useTheme();
  const [skip, setSkip] = useState(0);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [commentLoader, setCommentLoader] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const uid = getCookie("uid");
  const [pageChange, setPageChange] = useState(0);
  const [selectedTags, setSelectedTags] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isUserTagged, setIsUserTagged] = useState(0);
  const [mobileView] = isMobile();
  const [tabletView] = isTablet()
  const oldCursorPos = useRef(0)
  const [newPostType, setNewPostType] = useState('3');
  const currentTagWord = useRef("")
  const [lang] = useLang();
  const loading = React.useRef(false);
  const loggedInUserId = getCookie("uid")
  const [isEditComment, setEditComment] = useState(false)
  const [editPostId, setEditPostId] = useState("")
  const dispatch = useDispatch()
  const [currProfile] = useProfileData();
  const [singleData, setSingleData] = useState(props?.propsData)
  const [parsedDescription, setParsedDescription] = useState("");
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    startPageLoader();
    getAllComments();
    const commentNode = document.getElementById("comment_box");
    commentNode?.addEventListener("scroll", handleScroller);
    return () => {
      setComment("");
      setCommentList([]);
      setTotalComments(0);
      setCommentLoader(false);
      commentNode?.removeEventListener("scroll", handleScroller);
      getLatestComment();
    };
  }, []);

  useEffect(() => {
    if (comment.trim() == "") {
      return setIsValid(false)
    } else return setIsValid(true)
  }, [comment])

  var handleScroller = async () => {
    const commentNode = document.getElementById("comment_box");
    const isScrollTouchingBottom = commentNode?.scrollHeight <= commentNode?.scrollTop + commentNode?.clientHeight + 1;

    if (isScrollTouchingBottom && !loading.current) {
      loading.current = true;
      setPageChange(Math.random());
    }
  };

  const handleRemoveEdit = () => {
    setEditComment(false)
    setEditPostId("")
    setComment("")
  }

  const handleDeletedComments = (id) => {
    if (mobileView) {
      setCommentList((prev) => {
        let updatedList = prev.filter((post) => post._id !== id)
        return updatedList
      })
    } else {
      setCommentList((prev) => {
        let updatedList = prev.filter((post) => post._id !== id)
        return updatedList
      })
    }
  }

  useEffect(() => {
    const commentNode = document.getElementById("comment_box");
    const isScrollTouchingBottom = commentNode?.scrollHeight <=
      commentNode?.scrollTop + commentNode?.clientHeight + 1;

    if (isScrollTouchingBottom && commentList.length < totalComments) {
      startPageLoader();
      getAllComments(skip + 10);
    }
  }, [pageChange]);

  const getAllComments = (offset = 0) => {
    setSkip(offset);
    const list = {
      postId: drawerData.postId,
      skip: offset,
    };
    getComments(list)
      .then((res) => {
        if (res && res.data && res.data.data && res.data.data.length) {
          if (offset == 0) {
            setCommentList(res.data.data);
          } else {
            setCommentList((prev) => {
              return [...prev, ...res.data.data];
            });
          }
          setTotalComments(res.data.totalCount);
        }
        setCommentLoader(false);
        stopPageLoader();
        loading.current = false;
      })
      .catch((err) => {
        console.error("ERROR IN getAllComments", err);
        loading.current = false;
        stopPageLoader();
        setCommentLoader(false);
      });
  };

  const handleSubmitComment = (e) => {
    if (e.key === "Enter") {
      commentSubmitHandler(e);
    }
  };

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    startLoader();
    if (!comment) return;

    setCommentLoader(true);
    scrollToView("comment_box");
    setIsUserTagged(0)
    let taggedUserIds = [];
    // Removed Tagged Users if Content is NSFW

    Object.keys(selectedTags).map((item) => {
      if (comment.includes("@" + item)) {
        return taggedUserIds.push(selectedTags[item].userId);
      }
    });
    if (isEditComment) {
      const payload = {
        commentId: [editPostId],
        comments: comment,
        taggedUserIds: taggedUserIds,
      }
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }

      editComment(payload)
        .then(async (res) => {
          setComment("");
          await getAllComments();
          setCommentLoader(false);
          stopLoader();
          Toast(res.data.message)
          setComment("");
          setCommentLoader(false);
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
      setEditComment(false)
      setEditPostId("")
      return
    }
    const payload = {
      comments: comment,
      assetId: drawerData.postId,
      taggedUserIds: taggedUserIds,
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
  const profileClickHandler = (data) => {
    if (getCookie("uid") == data?.users?._id) {
      // close_dialog();
      open_progress();
      Route.push(`/profile`);
    } else {
      if (data?.users?.userTypeCode != 1) {
        // close_dialog();
        open_progress();
        setCookie("otherProfile", `${data?.users?.username || data?.users?.userName}$$${data?.users?.userId || data?.users?.userid || data?.users?._id}`)
        Route.push(`/${data?.users?.username}`);
      }
    }
  };
  const userProfileClick = () => {
    if (getCookie("uid") == props?.userId) {
      // close_dialog();
      open_progress();
      Route.push(`/profile`);
    } else {
      open_progress();
      setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id}`)
      Route.push(`${props?.username}`);
    }
    close_dialog();
  };
  const handleFollowUser = () => {
    open_progress();
    const payload = {
      followingId: props.userId,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    follow(payload)
      .then((res) => {
        Toast(res.data && res.data.message, "success");
        const cardDataInstance = { ...props.propsData };
        cardDataInstance.isFollowed = 1;
        props.setProfileTimelineData(cardDataInstance);
        // props.followUnfollowEvent(propsData.userId);
        close_progress();
        const updatedData = props.homepageData.map((item) => {
          if (item.userId === cardDataInstance.userId) {
            return { ...item, isFollowed: 1 }
          }
          return item
        })
        setSingleData(cardDataInstance)
        props.setHomePageData(updatedData)
        // props.setPropsData(cardDataInstance)
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

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    commentSubmitHandler(e)
  }

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

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
  const handleCaptionChange = (e, val) => {
    setComment(val)
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
  };
  const itemSelectHandler = async (item) => {
    const words = comment.split("\n").join(" ").split(" ");
    let caption = comment;
    const taggedWords = currentTagWord.current
    if (
      Object.keys(selectedTags).includes(item.username) &&
      comment.includes(item.username)
    ) {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length).replace("@" + item.username, "") + caption.slice(oldCursorPos.current - taggedWords.length).replace("@" + item.username, "").replace(taggedWords, "@" + item.username + " ")
    } else {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length) + caption.slice(oldCursorPos.current - taggedWords.length).replace(taggedWords, "@" + item.username + " ")
    }
    await setComment(caption);
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
      suggestions?.length ? <div className="position-absolute card_bg shadowBoxTaged"
        style={{ width: '100%', zIndex: 1, top: "65px", height: " calc(100vh - 199px)", overflowY: 'scroll', overflowX: 'hidden' }}>
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
                <p className="m-0 fntSz16 font-weight-400">@{item.username}</p>
              </div>
              <hr className="m-0" />
            </div>
          ))
          : ""
        }
      </div> : ""
    )
  }
  return (
    <Wrapper>
      <div
        id="chat_cont"
        className={
          mobileView
            ? `drawerBgCss ${theme == "light" ? "vh-80" : "vh-100"}`
            : ` ${theme == "light" ? "vh-80" : "h-100"}`
        }
      >
        <Wrapper>
          <div
            className={`col-12 p-0 ${theme == "light" && "bg-white black"}`}
            style={{ overflow: "hidden" }}
          >
            <div className="row m-0 p-3 borderBtm">
              {mobileView ? (
                <Header
                  title={lang.comments}
                  back={props.onClose}
                  icon={config.backArrow}
                  closeTrigger={props.onCloseDrawer}
                />
              ) : (
                <div className="row m-0 align-items-center justify-content-between">
                  <div className={`col-auto pl-0 ${mobileView ? "profile-title" : ""}`}>
                    <div className="row align-items-end position-relative">
                      <div className="col-auto pr-0 position-relative cursorPtr" onClick={userProfileClick}>
                        {props.profileLogo && !props.isHashtagPost ? (
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
                            : "d-flex align-items-center justify-content-between dv__post_pro_name"
                          }
                        >
                          <h3
                            role="button"
                            className={mobileView ? "m-0 fntSz17 text-truncate" : "m-0 dv__fnt17"}
                            onClick={userProfileClick}
                          >
                            {props.isHashtagPost ? props.hashtagName : props.username}
                          </h3>
                          {!mobileView ? (
                            <div className="dv__postCreatorIcon">
                              <Image
                                src={Creator_Icon}
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
                          {singleData.isFollowed == 0 &&
                            !isOwnProfile(props.userId) && (
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
                                <span
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
                                </span>
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

                </div>
              )}
            </div>

            <div
              id="comment_box"
              className={`chat_cont comment_cont pt-3  ${theme == "light" && "comment_section_wht"
                } ${mobileView ? "" : "pt-0"}`}
              style={mobileView ? { height: "calc(var(--vhCustom, 1vh) * 100)", overflowX: "hidden" } : { height: "29.282vw", marginBottom: "67px" }}
            >
              {mobileView ? (
                <label className="text-start col-12 pt-3">
                  {theme == "light" && (
                    <span className="pr-3">{totalLikes || "0"} Likes</span>
                  )}
                  {theme == "light" && (
                    <span className="pr-2 dv_base_color">
                      {totalComments} {lang.comments}
                    </span>
                  )}
                  {theme != "light" && <span>{totalComments} {lang.comments}</span>}
                </label>
              ) : (
                ""
              )}
              {/* {theme != "light" && <hr className="m-0" />} */}
              {/* <p className="text-center muted">
                                {commentLoader && (
                                    <CustomDataLoader type="PulseLoader" size={10} />
                                )}
                            </p> */}
              {!commentList.length && !commentLoader && (
                <div style={{ backgroundImage: `url(${config.COMMENT_PLACEHOLDER_IMAGE})` }} className="text-muted comment_placeholder">
                  {lang.commentPlaceholder}
                </div>
              )}
              {commentList.map((commentItem, index) => {
                return <CommentTileHome
                  data={commentItem}
                  index={index}
                  key={commentItem.creationTs + commentItem.lastUpdatedOn}
                  profileClickHandler={profileClickHandler}
                  userId={props.userId}
                  setComment={setComment}
                  setEditComment={setEditComment}
                  setEditPostId={setEditPostId}
                  taggedUserData={commentItem?.taggedUserData}
                  handleDeletedComments={handleDeletedComments}
                />
              })}
              <div className="text-center">
                <PageLoader />
              </div>
            </div>

            <form
              onSubmit={commentSubmitHandler}
              className={`px-2 pb-2 col-auto p-0 d-flex justify-content-center card_bg fntClrTheme
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
                  : {
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    zIndex: 2,
                    height: "67px"
                  }
              }
            >
              <TextareaAutosize
                type="text"
                placeholder={lang.addComment}
                value={comment}
                rows={1}
                rowsMax={3}
                autoFocus
                id="post-caption"
                onKeyPress={handleEnterPress}
                className={
                  mobileView
                    ? "form-control form-control-textarea m-2 comment_input"
                    : `form-control dv__form-control-textarea comment_input m-2 ${isEditComment && "paddingLeft15"}`
                }
                onChange={(e) => handleCaptionChange(e, e.target.value)}

                style={isEditComment ? { paddingLeft: "25px", overflowY: "scroll" } : {}}
              // onKeyDown={
              //   handleSubmitComment
              // }
              />
              <Button style={{ minWidth: "0" }}
                disabled={!isValid}
              >
                <SendIcon
                  className="send-icon cursorPtr"
                  onClick={commentSubmitHandler}
                />
              </Button>
              {isEditComment && <div className="pointer" style={{ position: "absolute", left: "25px", top: "19px" }}>
                <Icon
                  icon={`${CROSS_POSTSLIDER}#noun-close-1043558`}
                  size={12}
                  unit={"px"}
                  color={"#000"}
                  viewBox="0 0 15.736 15.736"
                  onClick={handleRemoveEdit}
                />
              </div>}
            </form>
          </div>
          {isUserTagged === 1 && TagUserUI()}

        </Wrapper>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
          :global(.MuiAvatar-colorDefault, .comment_avatar) {
            font-size: 16px;
            background-color: #fff;
            color: ${config.PRIMARY};
          }
          :global(.paddingLeft15){
            padding-left:25px;
            overflow-y:scroll !important;
          }
          .comment_avatar {
            width: 42px;
            height: 42px;
          }
          .comment_avatar_text {
            font-size: 16px;
            color: ${config.PRIMARY};
          }
          :global(.HomepageCommentBox){
            border-radius:10px ;
          }
          :global(.comment_cont){
            padding-bottom:0 !important;
          }
          :global(.HomepageCommentBox .MuiDialog-paperScrollPaper){
            max-height:unset !important;
          }
          .dv__inp_chat_cont_light{
           background-color: var(--l_app_bg) !important;
          } 
        `}
      </style>
    </Wrapper>
  );
};

export default HomepageCommentBox;
