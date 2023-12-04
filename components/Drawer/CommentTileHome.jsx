import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import isMobile from '../../hooks/isMobile'
import { EMPTY_PROFILE } from '../../lib/config/placeholder'
import { DELETE_CHAT, HORIZONTAL_DOTS } from '../../lib/config/profile'
import { findDayAgo } from '../../lib/date-operation/date-operation'
import { open_dialog, open_drawer } from '../../lib/global'
import { getCookie } from '../../lib/session'
import FigureCloudinayImage from '../cloudinayImage/cloudinaryImage'
import useLang from '../../hooks/language'
import Icon from '../image/icon'

import { PRIMARY } from '../../lib/config';
import { isAgency } from '../../lib/config/creds';
import { useSelector } from 'react-redux';
import { commentParser } from '../../lib/helper/userRedirection';
import { handleContextMenu } from '../../lib/helper'
const Avatar = dynamic(() => import("@material-ui/core/Avatar"));

const CommentTileHome = (props) => {
  const [mobileView] = isMobile();
  const [parsedDescription, setParsedDescription] = useState("");
  const [data, setData] = useState(props.data)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const loggedInUserId = isAgency() ? selectedCreatorId : getCookie("uid")
  const [lang] = useLang();
  const {profileClickHandler} = props;
  useEffect(() => {
    setData(props.data)
  }, [props.data])
  useEffect(() => {
    showMoreDescText(data.comments, true);
  }, [])


  const showMoreDescText = (text, flag) => {
    const count = mobileView ? 100 : 150;
    if (!text || text.length <= count || !flag) {
      setParsedDescription(text);
    } else {
      let nText = [...text].splice(0, count - 10).join("");
      setParsedDescription(nText);
    }
  };


  return (
    <div>
      {!mobileView ? <div key={data._id + data.timeStamp} className="row align-items-end mx-0 mb-3">
        <div className={`col-12 ${mobileView ? "pr-1" : ""}`}>
          <div className="form-row align-items-start">
            <div onContextMenu={handleContextMenu} className={`callout-none col-auto${data?.users?.userTypeCode != 1 ? " cursorPtr" : ""}`}>
              {data?.users?.profilePic ? (
                <FigureCloudinayImage
                  publicId={data.users.profilePic}
                  className="live"
                  errorImage={EMPTY_PROFILE}
                  style={
                    mobileView
                      ? { borderRadius: "50%" }
                      : {
                        maxWidth: "2.781vw",
                        maxHeight: "2.781vw",
                        borderRadius: "50%",
                      }
                  }
                  width={mobileView ? 50 : null}
                  transformWidth={mobileView ? null : '3.781vw'}
                  transformHeight={mobileView ? null : '3.781vw'}
                  height={mobileView ? 50 : null}
                  onClick={() => profileClickHandler(data)}
                />
              ) : (
                <Avatar
                  className="comment_avatar uppercase solid_circle_border"
                  style={
                    mobileView
                      ? { height: "50px", width: "50px" }
                      : { height: "2.781vw", width: "2.781vw" }
                  }
                >
                  {props.data?.users?.firstName && props.data?.users?.lastName && (
                    <span className="comment_avatar_text">
                      {props.data.users.firstName[0] + props.data.users.lastName[0]}
                    </span>
                  )}
                </Avatar>
              )}
              {/* <span className="mv_online_true" /> */}
            </div>
            <div className={`col${props.data?.users?.userTypeCode != 1 ? " cursorPtr" : ""}`}>
              <div className="d-flex">
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <div
                      className={
                        mobileView
                          ? "mv_comment_name dv_appTxtClr"
                          : "txt-roman dv__fnt12 bold"
                      }
                      onClick={() => profileClickHandler(data)}
                    >
                      {data.users
                        ? data?.users?.username
                        : ""}
                    </div>
                  </div>
                </div>

              </div>
              <div className="row justify-content-between">
                <div className="col-auto">
                  <div
                    className={
                      mobileView
                        ? "mv_chat_pro_status"
                        : "txt-roman dv__lightGrey_color dv__fnt12 text-break"
                    }
                  >
                    {/* <ShowMore key={data.comments} text={data.comments} /> */}
                    {data.comments && commentParser(parsedDescription, props?.taggedUserData)}
                    {data.comments &&
                      data.comments.length > (mobileView ? 100 : 150) &&
                      (parsedDescription.length > (mobileView ? 100 : 150) ? (
                        <a
                          onClick={() => showMoreDescText(data.comments, true)}
                          className="cursorPtr"
                        >
                          {lang.showLess}
                        </a>
                      ) : (
                        <a
                          onClick={() => showMoreDescText(data.comments, false)}
                          className="cursorPtr"
                        >
                          {lang.showMore}

                        </a>

                      ))}
                  </div>
                </div>
              </div>
              <div className="col-auto align-self-start pt-1 px-0 d-flex">
                <div
                  style={{
                    textDecoration: "none",
                    cursor: "context-menu",
                    paddingTop: "2px"
                  }}
                  className={
                    mobileView
                      ? "mv_chat_pro_status"
                      : "dv__Grey_var_11 txt-roman dv__fnt12"
                  }
                >
                  {findDayAgo(data.creationTs * 1000)}
                </div>
                {(props.userId === loggedInUserId && data.users._id === loggedInUserId) ?
                  <Icon
                    icon={`${HORIZONTAL_DOTS}#Group_137936`}
                    width={15}
                    height={15}
                    alt="delete_icon"
                    class="ml-2 pointer mr-1"
                    viewBox="0 0 13.261 3.039"
                    onClick={() => {
                      mobileView ? open_drawer("CommentOptions",
                        {
                          isEditable: data.users._id === loggedInUserId,
                          setInputComment: props.setComment,
                          setEditComment: props.setEditComment,
                          setEditPostId: props.setEditPostId,
                          data: data,
                          handleDeletedComments: props.handleDeletedComments
                        }, "bottom")
                        :
                        open_dialog("CommentOptions",
                          {
                            isEditable: data.users._id === loggedInUserId,
                            setInputComment: props.setComment,
                            setEditComment: props.setEditComment,
                            data: props.data,
                            setEditPostId: props.setEditPostId,
                            handleDeletedComments: props.handleDeletedComments
                          })
                    }}
                  />
                  : (props.userId === loggedInUserId && data.users._id !== loggedInUserId) ?
                    <Icon
                      icon={`${DELETE_CHAT}#vuesax_linear_edit-2`}
                      width={15}
                      height={15}
                      alt="delete_icon"
                      class="ml-2 pointer mr-3"
                      viewBox="0 0 13.465 13.642"
                      onClick={() => {
                        mobileView ?
                          open_drawer("CommentOptions",
                            {
                              isEditable: false,
                              data: props.data,
                              handleDeletedComments: props.handleDeletedComments
                            },
                            "bottom")
                          :
                          open_dialog("CommentOptions",
                            {
                              isEditable: false,
                              data: props.data,
                              handleDeletedComments: props.handleDeletedComments
                            })
                      }}
                    />

                    : (props.userId !== loggedInUserId && data.users._id === loggedInUserId) ?
                      <Icon
                        icon={`${HORIZONTAL_DOTS}#Group_137936`}
                        width={15}
                        height={15}
                        alt="delete_icon"
                        class="ml-2 pointer"
                        viewBox="0 0 13.261 3.039"
                        onClick={() => {
                          mobileView ? open_drawer("CommentOptions",
                            {
                              isEditable: data.users._id === loggedInUserId,
                              setInputComment: props.setComment,
                              setEditComment: props.setEditComment,
                              setEditPostId: props.setEditPostId,
                              data: props.data,
                              handleDeletedComments: props.handleDeletedComments
                            }, "bottom")
                            :
                            open_dialog("CommentOptions",
                              {
                                isEditable: data.users._id === loggedInUserId,
                                setInputComment: props.setComment,
                                setEditComment: props.setEditComment,
                                setEditPostId: props.setEditPostId,
                                data: props.data,
                                handleDeletedComments: props.handleDeletedComments
                              })
                        }}
                      />
                      : ""
                }
                {data.isEdited && <span className=" edit_Comment fntSz10 ml-2 " style={{ paddingTop: "5px" }}>
                  ({lang.edited})
                </span>}
              </div>
            </div>


          </div>
        </div>
      </div> :
        <div key={data._id + data.timeStamp + props.key + 1} className="row align-items-end mx-0 mb-3">
          <div className={`col-12 ${mobileView ? "pr-1" : ""}`}>
            <div className="form-row align-items-start">
              <div onContextMenu={handleContextMenu} className={`callout-none col-auto${data?.users?.userTypeCode != 1 ? " cursorPtr" : ""}`}>
                {data?.users?.profilePic ? (
                  <FigureCloudinayImage
                    publicId={data.users.profilePic}
                    className="live"
                    errorImage={EMPTY_PROFILE}
                    style={
                      mobileView
                        ? { borderRadius: "50%" }
                        : {
                          maxWidth: "2.781vw",
                          maxHeight: "2.781vw",
                          borderRadius: "50%",
                        }
                    }
                    width={mobileView ? 50 : null}
                    transformWidth={mobileView ? null : '3.781vw'}
                    transformHeight={mobileView ? null : '3.781vw'}
                    height={mobileView ? 50 : null}
                    onClick={() => profileClickHandler(data)}
                  />
                ) : (
                  <Avatar
                    className="comment_avatar uppercase solid_circle_border"
                    style={
                      mobileView
                        ? { height: "50px", width: "50px" }
                        : { height: "2.781vw", width: "2.781vw" }
                    }
                  >
                    {data?.users?.firstName && data?.users?.lastName && (
                      <span className="comment_avatar_text">
                        {data.users.firstName[0] + data.users.lastName[0]}
                      </span>
                    )}
                  </Avatar>
                )}
                {/* <span className="mv_online_true" /> */}
              </div>
              <div className={`col${data?.users?.userTypeCode != 1 ? " cursorPtr" : ""}`}>
                <div className="d-flex">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <div
                        className={
                          mobileView
                            ? "mv_comment_name dv_appTxtClr"
                            : "txt-roman dv__fnt12 bold"
                        }
                        onClick={() => profileClickHandler(data)}
                      >
                        {data.users
                          ? data?.users?.username
                          : ""}
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
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <div
                      className={
                        mobileView
                          ? "mv_chat_pro_status text-break w-100"
                          : "txt-roman dv__lightGrey_color dv__fnt12"
                      }
                      style={{ width: mobileView ? "80%" : "100%" }}
                    >
                      {/* {data.comments} */}
                      {/* <ShowMore key={data.comments} text={data.comments} /> */}
                      {data.comments && commentParser(parsedDescription, props?.taggedUserData)}
                      {data.comments &&
                        data.comments.length > (mobileView ? 100 : 150) &&
                        (parsedDescription.length > (mobileView ? 100 : 150) ? (
                          <a
                            onClick={() => showMoreDescText(data.comments, true)}
                            className="cursorPtr"
                          >
                            {lang.showLess}
                          </a>
                        ) : (
                          <a
                            onClick={() => showMoreDescText(data.comments, false)}
                            className="cursorPtr"
                          >
                            {lang.showMore}

                          </a>

                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {(props.userId === loggedInUserId && data.users._id === loggedInUserId) ?
                <Icon
                  icon={`${HORIZONTAL_DOTS}#Group_137936`}
                  width={15}
                  height={15}
                  alt="delete_icon"
                  class="ml-2 pointer mr-3 rotate"
                  viewBox="0 0 13.261 3.039"
                  onClick={() => {
                    mobileView ? open_drawer("CommentOptions",
                      {
                        isEditable: data.users._id === loggedInUserId,
                        setInputComment: props.setComment,
                        setEditComment: props.setEditComment,
                        setEditPostId: props.setEditPostId,
                        data: props.data,
                        handleDeletedComments: props.handleDeletedComments
                      }, "bottom")
                      :
                      open_dialog("CommentOptions",
                        {
                          isEditable: data.users._id === loggedInUserId,
                          setInputComment: props.setComment,
                          setEditComment: props.setEditComment,
                          data: props.data
                        })
                  }}
                />
                : (props.userId === loggedInUserId && data.users._id !== loggedInUserId) ?
                  <Icon
                    icon={`${DELETE_CHAT}#vuesax_linear_edit-2`}
                    width={15}
                    height={15}
                    alt="delete_icon"
                    class="ml-2 pointer mr-3"
                    viewBox="0 0 13.465 13.642"
                    onClick={() => {
                      mobileView ?
                        open_drawer("CommentOptions",
                          {
                            isEditable: false,
                            data: props.data,
                            handleDeletedComments: props.handleDeletedComments
                          },
                          "bottom")
                        :
                        open_dialog("CommentOptions",
                          {
                            isEditable: false,
                            data: props.data
                          })
                    }}
                  />

                  : (props.userId !== loggedInUserId && data.users._id === loggedInUserId) ?
                    <Icon
                      icon={`${HORIZONTAL_DOTS}#Group_137936`}
                      width={15}
                      height={15}
                      alt="delete_icon"
                      class="ml-2 pointer mr-3 rotate "
                      viewBox="0 0 13.261 3.039"
                      onClick={() => {
                        mobileView ? open_drawer("CommentOptions",
                          {
                            isEditable: data.users._id === loggedInUserId,
                            setInputComment: props.setComment,
                            setEditComment: props.setEditComment,
                            setEditPostId: props.setEditPostId,
                            data: props.data,
                            handleDeletedComments: props.handleDeletedComments
                          }, "bottom")
                          :
                          open_dialog("CommentOptions",
                            {
                              isEditable: data.users._id === loggedInUserId,
                              setInputComment: props.setComment,

                              setEditComment: props.setEditComment,
                              data: props.data
                            })
                      }}
                    />
                    : ""
              }
              {data.isEdited && <span className=" edit_Comment fntSz10 mr-3" style={{ paddingTop: "5px" }}>
                ({lang.edited})
              </span>}

            </div>
          </div>
        </div>}
      <style jsx>{`
      :global(.paddingLeft15){
        padding-left:25px;
      }
      .comment_avatar {
        width: 42px;
        height: 42px;
      }
      .comment_avatar_text {
        font-size: 16px;
        color: ${PRIMARY};
      }
      `}</style>
    </div>
  )
}

export default CommentTileHome