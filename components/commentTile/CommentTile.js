import React from 'react'
import dynamic from "next/dynamic";
import { open_dialog } from '../../lib/global';
import { getCookie } from '../../lib/session';
import { DELETE_CHAT, HORIZONTAL_DOTS } from '../../lib/config/profile';
import Icon from '../image/icon';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import { useState } from 'react';
import { useEffect } from 'react';
import { commentParser } from '../../lib/helper/userRedirection';
const Image = dynamic(() => import("../../components/image/image"), {
    ssr: false,
  });
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
   ssr: false,
 });

export default function CommentTile(props) {
  const loggedInUserId = getCookie("uid")
  const [mobileView] = isMobile();
  const [parsedDescription, setParsedDescription] = useState("");
  const [data, setData] = useState(props.data)
  const [lang] = useLang();
  useEffect(() => {
    showMoreDescText(props.data.comments, true);
  }, [])
  useEffect(() => {
    setData(props.data)
  }, [props.data])

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
      <div className="row m-0 align-items-center justify-content-between ">
          <div className=" pl-0 profile-title " >
          <div className=" position-relative ">
            <div className='d-flex' style={{ gap: "14px" }}>
              <div className=" pr-0 position-relative cursorPtr mb-auto mtReq">
                {  props.data.users.profilePic ? 
                  <Image
                    src={props.img}
                    className="live cursorPtr"
                    style={props.mobileView
                      ? {
                        borderRadius: "50%",
                        maxWidth: "42px",
                        maxHeight: "42px",
                      }
                      : {
                        borderRadius: "50%",
                        maxWidth: "2vw",
                        maxHeight: "2vw",
                      }
                    }
                    width={42}
                    height={42}
                  />
                :
                <Avatar
                className="comment_avatar uppercase solid_circle_border"
                style={
                  props.mobileView
                    ? { height: "50px", width: "50px" }
                    : { height: "2vw", width: "2vw" }
                }
              >
                {props.data?.users?.firstName && props.data?.users?.lastName && (
                  <span className="comment_avatar_text">
                    {props.data.users.firstName[0] + props.data.users.lastName[0]}
                  </span>
                )}
              </Avatar>
                }
              </div>
              <div className="nameAndComment d-flex align-items-center">

                <div className="name" style={{ gap: "5px" }}>
                <p
                    role="button"
                    className={props.mobileView ? "m-0 fntSz17 text-truncate" : "m-0 fntSz14 w-600"}
                   
                  >
                    {props.data.users.username}
                  </p>
                  <p className="mb-0 hideScroll dv__Grey_var_13 txt-roman dv__fnt13 text-break" >
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
                  </p> 
                </div>
                {/* <div className="comment">
                    <p className="mb-0 ">{props.data.comments}</p>
                </div> */}

              </div>
            </div>
            <div className="commentTime d-flex" style={{ paddingLeft: "40px" }}>
              <p className="dv__lastSeenTime fntSz11">{props.dayAgo}</p>
              {(props.assetOwnerId === loggedInUserId && props.data.users._id === loggedInUserId) ?
                <Icon
                  icon={`${HORIZONTAL_DOTS}#Group_137936`}
                  width={15}
                  height={15}
                  alt="delete_icon"
                  class="ml-2 pointer"
                  viewBox="0 0 13.261 3.039"
                  onClick={() => {
                    open_dialog("CommentOptions",
                      {
                        isEditable: props.data.users._id === loggedInUserId,
                        setInputComment: props.setInputComment,
                        setEditComment: props.setEditComment,
                        setEditPostId: props.setEditPostId,
                        data: props.data,
                        handleDeletedComments: props.handleDeletedComments
                      })
                  }}
                />
                : (props.assetOwnerId === loggedInUserId && props.data.users._id !== loggedInUserId) ?
                  <Icon
                    icon={`${DELETE_CHAT}#vuesax_linear_edit-2`}
                    width={15}
                    height={15}
                    alt="delete_icon"
                    class="ml-2 pointer"
                    viewBox="0 0 13.465 13.642"
                    onClick={() => {
                      open_dialog("CommentOptions",
                        {
                          isEditable: false,
                          handleDeletedComments: props.handleDeletedComments,
                          data: props.data,
                        })
                    }}
                  />

                  : (props.assetOwnerId !== loggedInUserId && props.data.users._id === loggedInUserId) ?
                    <Icon
                      icon={`${HORIZONTAL_DOTS}#Group_137936`}
                      width={15}
                      height={15}
                      alt="delete_icon"
                      class="ml-2 pointer"
                      viewBox="0 0 13.261 3.039"
                      onClick={() => {
                        open_dialog("CommentOptions",
                          {
                            isEditable: props.data.users._id === loggedInUserId,
                            setInputComment: props.setInputComment,
                            setEditComment: props.setEditComment,
                            setEditPostId: props.setEditPostId,
                            data: props.data,
                            handleDeletedComments: props.handleDeletedComments
                          })
                      }}
                    />
                    : ""
              }
              {props.showEditIcon && props.data.isEdited && <span className="ml-2 edit_Comment mr-3" style={{ paddingTop: "5px" }}>
                ({lang.edited})
              </span>}
            </div>
            </div>
          </div>
        </div> 
        <style jsx>{`
          .username{
            line-height: 1.2;
            font-size: 1.145vw !important;
          }
         .paddingSet{
           padding:0px 15px
              }
         .alignGap{
          gap:10px
              }

         .mtReq{
            margin-top:5px
         }
         .hideScroll::-webkit-scrollbar {
          display: none !important;
        }
        `}</style>
    </div>
    // <p>hi</p>
  )
}
