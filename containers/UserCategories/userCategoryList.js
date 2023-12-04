import React from "react";
import Router from "next/router";
import { getCookie } from "../../lib/session";
import { open_progress } from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import { BANNER_PLACEHOLDER_IMAGE, tagIcon } from "../../lib/config";
import dynamic from "next/dynamic";
const FigureCloudinayImage = dynamic(
  () => import("../../components/cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
import { useTheme } from "react-jss";
import useLang from "../../hooks/language";
import Icon from "../../components/image/icon";
import { handleContextMenu } from "../../lib/helper";

export default function UserCategoryCard(props) {
  const uid = getCookie("uid");
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();

  const profileClickHandler = () => {
      if (uid == props.userId) {
        open_progress();
        Router.push(`/profile`);
      } else {
        setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id}`)
        open_progress();
        Router.push(
          `/${props.username || props.userName}`
        );
      }
   
  };
  return (
    <React.Fragment>
      <div
        key={props.id}
        className={`cursorPtr callout-none ${
          mobileView
            ? "position-relative mx-2"
            : "position-relative img-zoom-hover px-2 webStyleCss"
        }`}
        onContextMenu={handleContextMenu}
        onClick={profileClickHandler}
      >
        <FigureCloudinayImage
          publicId={props.profilePic || props.bannerImage}
          width={mobileView ? 133 : "auto"}
          height={mobileView ? 155 : 209}
          ratio={mobileView ? "" : 1.33}
          crop="thumb"
          // ratio={1}
          errorImage={BANNER_PLACEHOLDER_IMAGE}
          style={
            mobileView
              ? {
                  height: "155px",
                  width: "133px",
                  borderRadius: "8px",
                }
              : {
                  width: "100%",
                  borderRadius: "0.366vw",
                  objectFit: "cover",
                  objectPosition: "top",
                  height:"100%",
                }
          }
          className={mobileView ? "titleImg bg-shadow" : "titleImg bg-shadow"}
          alt={props.fullName || props.username || "banner_image"}
          id={props.userId}
        />

        <div
          className={
            mobileView ? "d-flex pt-1" : "d-flex align-items-center pt-3"
          }
        >

          <span className="userName">{props.fullName}</span>
        </div>
        <div
          className={
            mobileView ? "d-flex pt-1" : "d-flex align-items-center pt-1 pb-1"
          }
        >
          <span className="fntSz14" style={{color:"#ADAEB5"}}>NFL Hall of Fame - Londen</span>
        </div>
        <div className="d-flex justify-content-between">
          <div className="fntSz14 d-flex align-items-center">
            <Icon
              icon={`${tagIcon}#tagIconId`}
              size={12}
              color={theme.text}
              class="pr-1"
              viewBox="0 0 14.693 14.57"
            />
            <span>$50</span>
          </div>
          <div className="fntSz14 bookBtnStyle cursorPtr">{lang.book}</div>
        </div>
      </div>
      <style jsx>{`
        .userName {
          font-family: "Roboto", sans-serif !important;
          color: ${theme.type == "light" ? "#393939" : theme.text};
          font-size: 15px;
        }

        :global(.webStyleCss .lazy-load-image-loaded){
           overflow : hidden
        }
      `}</style>
    </React.Fragment>
  );
}
