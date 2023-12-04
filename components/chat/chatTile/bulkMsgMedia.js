import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

import { textdecode } from "../../../lib/chat";
import Wrapper from "../chatWrapper/chatWrapper";
import FeedVideoPlayer from "../../videoplayer/feed-video-player";
import CustomImageSlider from "../../image-slider/ImageSlider";
import TextPost from "../../TextPost/textPost";
import { getCookie } from "../../../lib/session";
import isMobile from "../../../hooks/isMobile";
import { open_dialog, open_drawer } from "../../../lib/global";
import { CHAT_PLAY, FILM_ICON, MULTI_IMG_SVG } from "../../../lib/config";
import Image from "../../image/image";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import useLang from "../../../hooks/language";
import { handleContextMenu } from "../../../lib/helper";

const BulkMsgMedia = (props) => {
  const { message } = props;
  const uid = getCookie("uid");
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [lang] = useLang();

  const { d_background, lightThemeColor } = theme.palette;

  const media = textdecode(props.message.payload);
  const parsedMedia = JSON.parse(`${media}`);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const BulkMsgPost = () => {
    if (parsedMedia.type === 2) {
      return (
        <div className="position-relative">
          <Image
            height="200px"
            src={s3ImageLinkGen(S3_IMG_LINK, parsedMedia.thumbnail, 40, 188, 200)}
            alt="Video Bulk Message"
          />
          <Image
            src={CHAT_PLAY}
            alt="play button"
            width="70px"
            height="25%"
            className="position-absolute"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1" }}
          />
          <Image
            src={FILM_ICON}
            alt="video-thumbnail-icon"
            className="position-absolute"
            style={{ height: "25px", top: "0", right: "5px" }}
          />
        </div>
      );
    } else if (parsedMedia.type === 1) {
      return (
        <CustomImageSlider
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__postImg"}
          postType={5}
          price={parsedMedia.price || 0}
          currency={parsedMedia.currency || "$"}
          isVisible={parsedMedia.isVisible || 0}
          userId={uid}
          postId={parsedMedia.postId}
          height={"200px"}
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
          imagesList={[{
            url: parsedMedia.url,
            seqId: parsedMedia.seqId,
            type: parsedMedia.type,
          }]}
          // subscribedEvent={props.subscribedEvent}
          alt={"Image Bulk Post"}
          exclusiveIconHeight={"50px"}
          exclusiveBtnTxt={"11px"}
        />
      )
    } else {
      return (
        <TextPost
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__profilepostImg"}
          postType={parsedMedia.type}
          price={parsedMedia.price || 0}
          currency={parsedMedia.currency || "$"}
          isVisible={parsedMedia.isVisible || 0}
          userId={uid}
          postId={parsedMedia.postId}
          fromHashtag={true}
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
          height={"200px"}
          textPost={[parsedMedia]}
          alt={"Text Bulk Post"}
          exclusiveIconHeight={"50px"}
          exclusiveBtnTxt={"11px"}
        />
      );
    }
  }

  const handleOpenPost = () => {
    if (props?.isUserblock) {
      return open_dialog("successOnly", {
        wraning: true,
        label: "You can't view this message as you're blocked.",
      })
    }
    mobileView
      ? open_drawer("bulkMsgViewer", {
        parsedMedia,
        message,
        paperClass: "card_bg"
      }, "right")
      : open_dialog("bulkMsgViewer", {
        parsedMedia,
        message,
      })
  }

  return (
    <Wrapper
      index={props.index}
      message={message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block rounded border shadow-sm">

        {/* Bulk Chat Header */}
        <div className="bulk-chat-header-text">
          {lang.bulkMsg}
        </div>

        {/* Bulk Chat Content */}
        <div className="d-flex align-items-start cursorPtr bulk-chat-content" style={{ height: "200px" }} onClick={handleOpenPost}>
          <div className="h-100 w-100 position-relative">
            {BulkMsgPost()}
            {parsedMedia.mediaCount > 1
              ? <img src={MULTI_IMG_SVG} alt="multiple image icon" onContextMenu={handleContextMenu} className="position-absolute callout-none" style={{ top: "10px", right: "10px" }} />
              : ""}

          </div>
        </div>

        {/* Bulk Chat Footer */}
        {parsedMedia.postDescription
          ? <div className="bulk-chat-footer-text">
            {parsedMedia.postDescription}
          </div>
          : ""}
      </div>

      <style jsx>{`
        .chat-block {
          width: fit-content;
          max-width: 190px;
          width: 190px;
        }
        .bulk-chat-footer-text {
          overflow:auto;
          height:4rem;
          background-color: ${theme.type === "light"
          ? lightThemeColor
          : d_background
        };
          border-radius: 0 0 10px 10px;
          font-weight: 600;
          padding: 7px;
          font-size: 14px;
          word-break: break-word;
				}
        .bulk-chat-header-text {
          background-color: ${theme.type === "light"
          ? lightThemeColor
          : d_background
        };
          border-radius: 10px 10px 0 0;
          font-weight: 600;
          padding: 7px;
          font-size: 14px;
          word-break: break-word;
        }
        .bulk-chat-content {
          background-color: ${theme.type === "light"
          ? lightThemeColor
          : d_background
        };
        }
        :global(.react_jw_palyer .jw-error.jw-reset) {
          height: 100% !important;
        }
        :global(.react_jw_palyer > div) {
          height: 100% !important;
          display: flex;
          align-item: center;
        }
      `}
      </style>
    </Wrapper>
  );
};

export default BulkMsgMedia;
