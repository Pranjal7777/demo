import React, { useRef } from "react";
import CustomHeader from "../header/CustomHeader"
import isMobile from "../../hooks/isMobile"
import useLang from "../../hooks/language"
import { useSelector } from "react-redux";
import { close_dialog } from "../../lib/global";
import ReactJWPlayer from "react-jw-player";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";

const VdoDrawer = (props) => {
  const [mobileView] = isMobile();
  const videoRef = useRef();
  const [lang] = useLang()
  // const VIDEO_LINK = useSelector((state) => state.cloudinaryCreds.VIDEO_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  let vdoURL = props?.props
    ? props && props.props?.editPost
      ? `${props?.props?.defaultImage[0].url}`
      : URL.createObjectURL(props?.props?.file?.filesObject)
    : props.vdoUrl

  const handleError = () => {
    if (mobileView && videoRef.current) {
      videoRef.current.style.paddingTop = "60px";
    }
  }
  const handlePlayAndResume = (playerId) => {
    const player = document.getElementById(playerId); // Get the JW Player element
    if (player && player.requestFullscreen) {
      player.requestFullscreen(); // Request fullscreen mode
    }
  };
  const vdoPreview = () => {
    return (
      <div className="videoDrawer">
        {vdoURL.includes("m3u8") ? <ReactJWPlayer
          playerId={vdoURL}
          playerScript="https://content.jwplatform.com/libraries/YIw8ivBC.js"
          playlist={[{
            image: s3ImageLinkGen(S3_IMG_LINK, props.thumbnail, 70, 640, 640),
            file: vdoURL
          }]}
          aspectRatio='9:16'
        />
          :
          <video
            src={vdoURL.includes("m3u8")
              ? vdoURL.slice(0, -4) + "mp4"
              : vdoURL}
            autoPlay
            height="100%"
            width="100%"
            controls
            controlsList="nodownload"
            ref={videoRef}
            style={mobileView ? {} : { height: "400px" }}
            onError={handleError}
            aspectRatio='9:16'
          />}
        <style jsx>
          {
            `
          :global(.videoDrawer .jwplayer.jw-flag-aspect-mode) {
            height: ${mobileView ? '100vh' : 'auto'} !important
          })
          `
          }
        </style>
      </div>

    )
  }

  return (
    <>
      {mobileView ? (
        <div style={{ backgroundColor: "#fff", height: "100vh", width: "100vw" }}>
          <CustomHeader iconColor={'#fff'}  back={props.onClose} size={25} />
          {vdoPreview()}
        </div>
      ) : (
        <div className="py-3 px-5">
          <div className="text-center pb-3">
            <h5 className="txt-black dv__fnt30">{lang.vdoPreview}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => {
              mobileView ? props.onClose() : close_dialog("VDO_DRAWER");
            }}
          >
            {lang.btnX}
          </button>

          {vdoPreview()}
        </div>
      )}
    </>
  )
}

export default VdoDrawer