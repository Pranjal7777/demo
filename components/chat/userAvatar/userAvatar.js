import React from "react";
import { useSelector } from "react-redux";
import { backArrow } from "../../../lib/config";
import CImage from "../../cloudinayImage/cloudinaryImage";
import Route from "next/router";
import AvatarImage from "../../image/AvatarImage";
import Image from "../../image/image";
import { getTransformedImageUrl, open_progress } from "../../../lib/global";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { setCookie } from "../../../lib/session";

/**
 * @description Chatroom header Profile image
 * @author jagannath
 * @param userTypeCode: number
 * @param src: string
 * @param className: string
 * @param id: string
 * @param live: boolean
 */

const userAvatar = (props) => {
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const handleProfileClick = () => {
    if (props.authenticateChatUser(props.userStatus)) return
    if (props.isUserblock) {
      return props.unBlock();
    } else {
      if (props.userTypeCode == 2) {
        open_progress();
        setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id || props?.id}`)
        Route.push(`/${props.userName || props.username}`);
      }
    }
  };

  return (
    <div className="user-avatar-wrap">
      <div className="user-avatar-chat" onClick={handleProfileClick}>
        <AvatarImage
          height={40}
          src={s3ImageLinkGen(S3_IMG_LINK, props.src, 40, 40, 40)}
          width={40}
          className={`user-avatar-image ${props.userTypeCode == 2 ? "pointer" : ""} ${props.className || ""}`}
          userName={props.userName}
        />
        {typeof props.live != "undefined" && (
          <div>
            {props.live ? (
              <div className="chat-dot"></div>
            ) : (
              <div className="chat-dot"></div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .user-avatar-wrap {
          height: fit-content;
          width: fit-content;
          border-radius: 100%;
        }
        .user-avatar-chat {
          // height: ${props.height || "3.2rem"};
          // width: ${props.width || "3.2rem"};
          position: relative;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        :global(.user-avatar-image) {
          // height: ${props.height || "3.2rem"};
          // width: ${props.width || "3.2rem"};
          object-fit: cover;
          border-radius: 100%;
        }

        .chat-dot {
          background-color: ${props.live == true ? "#01fe92" : "#696969"};
          z-index: 2;
          border-radius: 100%;
          height: 9px;
          width: 9px;
          position: absolute;
          bottom: 1px;
          right: 2.5px;
        }
      `}</style>
    </div>
  );
};

export default userAvatar;
