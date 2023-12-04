import React, { useRef } from "react";
import Router from "next/router";
import { useTheme } from "react-jss";
import CustomHeader from "../header/CustomHeader";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { close_dialog, open_progress } from "../../lib/global";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import { BANNER_PLACEHOLDER_IMAGE } from "../../lib/config";
import { handleContextMenu } from "../../lib/helper";

const HomepageVideoDrawer = (props) => {
  const [mobileView] = isMobile();
  const videoRef = useRef();
  const [lang] = useLang();
  const theme = useTheme();

  let vdoURL = props?.props
    ? props && props.props?.editPost
      ? `${props?.props?.defaultImage[0].url}`
      : URL.createObjectURL(props?.props?.file?.filesObject)
    : props.vdoUrl;

  const handleError = () => {
    if (mobileView && videoRef.current) {
      videoRef.current.style.paddingTop = "60px";
    }
  };

  const vdoPreview = () => {
    return (
      <video
        src={vdoURL.includes("m3u8") ? vdoURL.slice(0, -4) + "mp4" : vdoURL}
        autoPlay
        height="100%"
        width="100%"
        controls
        controlsList="nodownload"
        ref={videoRef}
        style={mobileView ? {} : { height: "400px" }}
        onError={handleError}
      />
    );
  };

  return (
    <>
      {mobileView ? (
        <div
          style={{ backgroundColor: "#fff", height: "100vh", width: "100vw" }}
        >
          <CustomHeader back={props.onClose} size={25} />

          {vdoPreview()}
        </div>
      ) : (
        <div style={{background: theme.background}}>
            <div className="py-3 px-5">
              {!props.disableHeader && <div className="d-flex align-items-center  pb-3 callout-none" onContextMenu={handleContextMenu}>
              <FigureCloudinayImage
                publicId={props?.creator?.profilePic}
                height="50px"
                width="50px"
                crop="thumb"
                ratio={1}
                quality={100}
                errorImage={BANNER_PLACEHOLDER_IMAGE}
                className="m-auto"
                alt={props?.creator?.username || "banner_image"}
                style={{ borderRadius: "50%" }}
              />
              <p className="m-0 pl-3 appTextColor font-weight-600">
                {props?.creator?.username}
              </p>
              <p
                className="m-0 ml-3 appTextColor viewprofilelabel cursorPtr py-1 px-3 font-weight-600 fntSz11"
                onClick={() => {open_progress();Router.push(`/${props?.creator?.username}`)}}
              >
                {lang.viewProfile}
              </p>
              </div>}
            <button
              type="button"
              className="close appTextColor dv_modal_close"
              data-dismiss="modal"
              onClick={() => {
                mobileView
                  ? props.onClose()
                  : close_dialog("HOMEPAGE_VIDEO_DRAWER");
              }}
            >
              {lang.btnX}
            </button>

            {vdoPreview()}
            <style jsx>{`
              .viewprofilelabel {
                border: 1px solid ${theme.text};
                border-radius: 20px;
                padding: 0px 5px;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default HomepageVideoDrawer;
