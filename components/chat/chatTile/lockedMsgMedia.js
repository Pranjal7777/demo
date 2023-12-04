import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";

import { textdecode } from "../../../lib/chat";
import Wrapper from "../chatWrapper/chatWrapper";
import FeedVideoPlayer from "../../videoplayer/feed-video-player";
import CustomImageSlider from "../../image-slider/ImageSlider";
import TextPost from "../../TextPost/textPost";
import { getCookie } from "../../../lib/session";
import isMobile from "../../../hooks/isMobile";
import { open_dialog, open_drawer, open_post_dialog } from "../../../lib/global";
import { CHAT_PLAY, FILM_ICON, MULTIPLE_IMAGE_ICON, MULTI_IMG_SVG } from "../../../lib/config";
import Image from "../../image/image";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import useLang from "../../../hooks/language";
import { DOLLAR_ICON } from "../../../lib/config/homepage";
import Icon from "../../image/icon";
import { handleContextMenu } from "../../../lib/helper";

const LockedMsgMedia = (props) => {
  const { message } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const ownUserId = getCookie("uid");

  const { d_background, lightThemeColor } = theme.palette;

  const media = textdecode(props.message.payload);
  const parsedMedia = JSON.parse(`${media}`);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const LockedMsgPost = () => {
    if (parsedMedia.type === 2) {
      return (
        message.isVisible
          ? <div className="position-relative">
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
          : <FeedVideoPlayer
            publicId={parsedMedia.url}
            thumbnail={parsedMedia.thumbnail}
            isVisible={parsedMedia.isVisible || 0}
            // updatePostPurchase={updatePostPurchase}
            // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__postImg"}
            postId={parsedMedia.postId}
            postType={1}
            price={parsedMedia.price || 0}
            userId={message.senderId}
            currency={parsedMedia.currency || "$"}
            height={"200px"}
            // setVideoAnalytics={postData.setVideoAnalytics}
            // width={aspectWidth > 900 ? 900 : aspectWidth}
            // subscribedEvent={props.subscribedEvent}
            alt={"Video Bulk Post"}
            // latestPage={props.latestPage}
            exclusiveIconHeight={"50px"}
            exclusiveBtnTxt={"11px"}
            chatView={true}
            lockedPost={true}
            messageId={message.messageId}
            lockedPostId={parsedMedia.postId}
            chatId={props.chatId}
            size={65}
            adjustUnlockSubscribetext={true}
          />
      )
    } else if (parsedMedia.type === 1) {
      return (
        <CustomImageSlider
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__postImg"}
          postType={5}
          price={parsedMedia.price || 0}
          currency={parsedMedia.currency.symbol || "$"}
          isVisible={message.isVisible || 0}
          userId={message.senderId}
          postId={parsedMedia.postId}
          height={"200px"}
          // updateTipHandler={updateTipHandler}
          // updatePostPurchase={purchaseLockedPost}
          // onClick={() => {
          //   if (message.isVisible) {
          //     open_post_dialog({
          //       data: parsedMedia.url,
          //       postType: 5,
          //       // width: aspectWidth + 70,
          //       width: 70,
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
          alt={"Image Lock Post"}
          lockedPost={true}
          messageId={message.messageId}
          lockedPostId={parsedMedia.postId}
          chatId={props.chatId}
          size={65}
          adjustUnlockSubscribetext={true}
        />
      )
    } else {
      return (
        <TextPost
          // className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain dv_border w-100" : "dv__profilepostImg"}
          postType={parsedMedia.type}
          price={parsedMedia.price || 0}
          currency={parsedMedia.currency || "$"}
          isVisible={message.isVisible || 0}
          userId={message.senderId}
          postId={parsedMedia.postId}
          fromHashtag={true}
          // updateTipHandler={updateTipHandler}
          // updatePostPurchase={purchaseLockedPost}
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
          lockedPost={true}
          messageId={message.messageId}
          lockedPostId={parsedMedia.postId}
          chatId={props.chatId}
          size={65}
          adjustUnlockSubscribetext={true}
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
    if (message.isVisible || message.senderId == ownUserId) {
      mobileView
        ? open_drawer("bulkMsgViewer", {
          parsedMedia,
          message,
        }, "right")
        : open_dialog("bulkMsgViewer", {
          parsedMedia,
          message,
        })
    }
  }

  return (
    <Wrapper
      index={props.index}
      message={message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block" style={{ border: "1px solid #f1f1f1", borderRadius: "10px" }}>

        {/* Locked Post Header */}
        <div className="bulk-chat-header-text">
          {lang.uploadLockedPost}
        </div>

        {/* Locked Post Content */}
        <div className="d-flex align-items-start cursorPtr bulk-chat-content" style={{ height: "200px" }} onClick={handleOpenPost}>
          <div className="h-100 w-100 position-relative">
            {LockedMsgPost()}

            {(parsedMedia.type == 1 || parsedMedia.type == 2 || parsedMedia.type == 4) && (message.isVisible || message.senderId == ownUserId)
              ?
              <div className="">
                <div className="purchasedPrice dv__sendTip d-flex align-items-center px-2 py-1 ml-auto">
                  <Icon
                    icon={`${DOLLAR_ICON}#Dollar_tip`}
                    color={theme.palette.white}
                    size={16}
                    class="d-flex align-items-center"
                    viewBox="0 0 20 20"
                  />
                  <span className="txt-heavy ml-1 fntSz12">
                    {parsedMedia.price}
                  </span>
                </div>
              </div>
              : ""} 

            {parsedMedia.mediaCount > 1
              ? <img src={MULTI_IMG_SVG} alt="multiple image icon" onContextMenu={handleContextMenu} className="position-absolute callout-none" style={{ top: "10px", right: "10px" }} />
              : ""}
          </div>
        </div>

        {/* Locked Post Footer */}
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
          word-break: break-word;
          max-height: 7em;
          overflow-y: auto;
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
        .purchasedPrice{
          position: absolute;
          top: -28px;
          right: 7px;
          height: 23px;
          padding:6px 7px !important; 
        }
      `}
      </style>
    </Wrapper>
  );
};

export default LockedMsgMedia;
