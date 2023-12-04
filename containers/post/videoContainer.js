import React, { useEffect, useState } from "react";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import {
  VIDEO_P_BACKGROUND,
  CANCELCLR,
  CHAT_PLAY,
  PLAY_2,
} from "../../lib/config";
import { generaeVideThumb } from "../../lib/image-video-operation";
import {
  open_dialog,
  open_drawer,
} from "../../lib/global";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import Img from "../../components/ui/Img/Img";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

const fileEmptyObject = {
  files: null,
  filesObject: null,
};

const VideoContainer = (props) => {
  const [lang] = useLang();
  const { bulkMessage, file, changeThumbanail } = props;

  const [video, setVideo] = useState(
    props.defaultImage || [{
      seqId: 1,
      ...fileEmptyObject,
    },
    ]
  );
  const [mobileView] = isMobile();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const clickFunction = () => {
    document.getElementById("video").click();
  };

  // const onVideoSelect = (event) => {
  //   const file = event.target.files[0];
  //   generaeVideThumb(file);
  // };

  useEffect(() => {
    setVideo(props.defaultImage);
  }, [video, props]);

  return (
    <div style={props.style} className={mobileView ? "col-12" : "pt-3 h-100"}>
      {mobileView ? (
        <div
          className="position-relative"
          onClick={() => clickFunction()}>
          <Image
            src={VIDEO_P_BACKGROUND}
            width="100%"
            alt="background-placeholder"
            style={bulkMessage ? { height: "226px", objectFit: "cover" } : {}}
          />
          {props.defaultImage[0]?.thumbnail || props.defaultImage[0]?.files ? <Image
            src={
              props.defaultImage[0]?.thumbnail
                ? s3ImageLinkGen(S3_IMG_LINK, props.defaultImage[0].thumbnail, 30)
                : props.defaultImage[0]?.files
            }
            width="100%"
            className="file-video"
            alt="background-placeholder"
          /> : <div
              className="w-100 h-100 p-2 d-flex align-items-center file-video bg-white justify-content-center text-center fntSz12 text-app card_bg"
            style={{ borderRadius: '10px', border: '1px solid' }}
            onClick={(e) => {
              e && e.stopPropagation();
              open_drawer("thumbSelectore",
                { ...file, onThumSelect: changeThumbanail },
                "bottom"
              );
            }}>
            {lang.manualCover}
          </div>}

          {props.editPost ? "" : (
            <Image
              onClick={(e) => props.remove(e)}
              src={CANCELCLR}
              width="18"
              className="mv_upload_img_close_icon right-0"
              alt="cancel img button"
            />
          )}


          <div
            className="preview-pill"
            onClick={(e) => {
              e && e.stopPropagation();
              props.file.filesObject.type === "video/quicktim"
                ? open_dialog("successOnly", {
                  label: "This File is Too Big to Play.",
                  wraning: true,
                })
                : open_drawer("VDO_DRAWER", { props }, "right");
            }}
          >
            {/* <Img src={CHAT_PLAY} alt="play button" width="70px" /> */}
            <Image
            src={PLAY_2}
            alt="play button"
            width="70px"
            height="25%"
            // className="position-absolute"
            // style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1" }}
          />
          </div>

          {props.editPost ? "" : (
            <div
              className="cover-pill"
              onClick={(e) => {
                e && e.stopPropagation();
                open_drawer("thumbSelectore",
                  { ...file, onThumSelect: changeThumbanail },
                  "bottom"
                );
              }}>
              {lang.cover}
            </div>
          )}

          <div className="text-center">
            <input
              type="file"
              id={"video"}
              accept="video/*"
              onChange={props.onChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      ) : (
        <>
          <div style={bulkMessage ? { width: 'unset' } : { height: '65vh' }} className={bulkMessage ? 'h-100 dv_media_container position-relative p-0' : 'position-relative p-0 custom_image_height_css'}>
            {props.defaultImage[0]?.thumbnail || props.defaultImage[0]?.files
              ? <Image
                src={props.defaultImage[0]?.thumbnail ? s3ImageLinkGen(S3_IMG_LINK, props.defaultImage[0].thumbnail) : props.defaultImage[0]?.files}
                className="w-100 h-100 px-0 dv_img_placeholder"
                style={{ borderRadius: "10px", objectFit: "contain" }}
                alt="background-placeholder"
              /> : (
                <div
                    className="w-100 h-100 p-2 d-flex align-items-center text-center fntSz12 text-app card_bg"
                  style={{ borderRadius: '10px', border: '1px solid' }}
                  onClick={(e) => {
                    e && e.stopPropagation();
                    open_dialog("thumbSelectore", {
                      ...file,
                      onThumSelect: changeThumbanail,
                    });
                  }}>
                  {lang.manualCover}
                </div>
              )
            }

            {props.editPost ? "" : (
              <Image
                onClick={(e) => props.remove(e)}
                src={CANCELCLR}
                width="18"
                className="mv_upload_img_close_icon right-0"
                alt="cancel img button"
              />
            )}

            {/* Preview Post */}
            {props.defaultImage[0]?.thumbnail || props.defaultImage[0]?.files ? (
              <div
                className="preview-pill cursorPtr"
                onClick={(e) => {
                  e && e.stopPropagation();
                  props.file.filesObject.type === "video/quicktime"
                    ? open_dialog("successOnly", {
                      label: "This File is Too Big to Play.",
                      wraning: true,
                    })
                    : open_dialog("VDO_DRAWER", { props })
                }}
              >
                {/* <Img src={CHAT_PLAY} alt="play button" width="50px" /> */}
                <Image
            src={PLAY_2}
            alt="play button"
            width="70px"
            height="25%"
            // className="position-absolute"
            // style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1" }}
          />
              </div>
            ) : ""}

            {/* Change Cover of Post */}
            {props.editPost ? "" : (
              <div
                className="cover-pill cursorPtr"
                onClick={(e) => {
                  e && e.stopPropagation();
                  open_dialog("thumbSelectore", {
                    ...file,
                    onThumSelect: changeThumbanail,
                  });
                }}>
                {lang.cover}
              </div>
            )}

          </div>

          {props.editPost
            ? ""
            : <div className="text-center">
              <input
                type="file"
                id={"video"}
                accept="video/*"
                onChange={props.onChange}
                style={{ display: "none" }}
              />
            </div>
          }
        </>
      )}
    </div >
  );
};

export default VideoContainer;
