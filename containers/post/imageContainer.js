import React, { useEffect, useState } from "react";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import { CANCELCLR, IMAGE_TYPE, POSTING_PLACEHOLDER } from "../../lib/config";
import { ReactSortable } from "react-sortablejs";
import isMobile from "../../hooks/isMobile";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";

// MUI Icon
import ControlPointRoundedIcon from "@material-ui/icons/ControlPointRounded";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

const fileEmptyObject = {
  files: null,
  filesObject: null,
};
const ImageContainer = (props) => {
  const { defaultImage = [], bulkMessage } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const theme = useTheme();

  let postImgCount = props.galleryLockedPost ? defaultImage.length : 6;

  const ref = React.createRef(null);
  const [images, setImages] = useState([
    ...defaultImage,
    ...[...new Array(postImgCount - defaultImage.length)].map((_, index) => {
      return {
        seqId: defaultImage.length + index + 1,
        ...fileEmptyObject,
      };
    }),
  ]);

  const getPlaceholder = (index) => {
    return (
      <>
        {mobileView ? (
          <div
            className={`${theme.type === "light"
              ? "mv_upload_timeline_img"
              : "mv_upload_timeline_img_dark"
              } no-drag`}
            key="placeholder"
          >
            <Image
              src={POSTING_PLACEHOLDER}
              className="img_upld_icons"
              alt="Posting Image Placeholder"
            />
          </div>
        ) : (
            <div style={bulkMessage ? { height: '95%' } : { height: '25vh' }} className={`dv_img_placeholder position-relative cursorPtr no-drag ${bulkMessage ? '' : ''}`} >
            <ControlPointRoundedIcon
              style={bulkMessage ? { fontSize: 30, color: 'var(--l_app_text)' } : { fontSize: 59, color: 'var(--l_app_text)' }}
              className={mobileView ? "mv_set_mid_poAbs" : "dv_set_mid_poAbs"}
            />
          </div>
        )}
      </>
    );
  };

  const getSelectedImage = (image, index) => {
    return (
      <div className="position-relative" style={{ height: "95%" }}>
      <div
        className={mobileView
          ? "mv_upload_timeline_img position-relative p-0 createBlueBox"
          : `position-relative p-0 createBlueBox w-100 ${bulkMessage ? "h-100 position-relative" : "dv_media_container"}`
        }
        key="selectedImage"
      >
        <Image
          src={image.url ? s3ImageLinkGen(S3_IMG_LINK, image.url) : image["files"]}
          className={mobileView
            ? "img_upld_icons w-100 h-100 obj-cover px-0"
            : "w-100 h-100 px-0 img-style"
          }
          alt="Posting Image"
        />

        

      </div>
      {props.galleryLockedPost
          ? ""
          : <div>
            <Image
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedImage(index);
              }}
              src={CANCELCLR}
              width="18"
              className='mv_upload_img_close_icon'
              alt="Selected Image will be Removed On Click of This Button"
            />
          </div>
        }
      </div>
    );
  };

  const clickFunction = (index) => {
    if (!props.galleryLockedPost)
      document.getElementById("file" + index).click();
  };

  const removeSelectedImage = (index) => {
    let imgs = [...images];
    imgs.splice(index, 1);
    imgs.map((imageData, index) => {
      return {
        seqId: index + 1,
        ...imageData,
      };
    });
    imgs.push({
      seqId: 6,
      ...fileEmptyObject,
    });
    setImages(imgs);
  };

  const onImageChange = (index, event) => {
    let imgs = [...images];
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    let findIndex = imgs.findIndex((im) => {
      return !im.files && !im.url;
    });

    // Image Reordring
    if (findIndex == -1) findIndex = index;
    imgs[findIndex]["filesObject"] = file;
    imgs[findIndex]["files"] = URL.createObjectURL(file);
    if (imgs[findIndex]["url"]) {
      delete imgs[findIndex].url;
    }
    setImages(imgs);

    // props.onChange && props.onChange();
  };

  useEffect(() => {
    images && props.onChange && props.onChange(images);
  }, [images]);

  const reorderImage = (imgs) => {
    setImages(imgs);
  };

  const onUpdate = (val) => {
    console.warn("onUpdate", val);
  };

  return (
    <React.Fragment>
      <>
        {mobileView
          ? <div className="h-100 pt-3 dv_img_container col-12">
            <ReactSortable
              ref={(el) => {
                // this.ref = el;
              }}
              delayOnTouchStart={true}
              direction="horizontal"
              className={`${props.galleryLockedPost ? "row h-100" : "form-row justify-content-center"}`}
              // filter=".no-drag"
              animation={50}
              handle=".createBlueBox"
              list={images}
              setList={reorderImage}
              onUpdate={onUpdate}
              onMove={(event) => {
                // console.log(
                //   "onMpove",
                //   event.related.classList,
                //   event.related.classList.contains("no-drag")
                // );
                return !event.related.classList.contains("no-drag");
              }}
            >
              {images.map((_, index) => {
                return (
                  <div
                    className={`${_["files"] ? "" : "no-drag "}mb-2 mr-1`}
                    key={index}
                    onClick={() => clickFunction(index)}
                  >
                    <input
                      type="file"
                      id={"file" + index}
                      accept={IMAGE_TYPE}
                      onChange={
                        (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // this.onImageChange(index, e);
                          const el = document.getElementById("file" + index);
                          onImageChange(index, e);
                        }
                        // this.props.handleChange.bind(this, index)
                      }
                      style={{ display: "none" }}
                    />
                    {_["files"] || _["url"]
                      ? getSelectedImage(_, index)
                      : getPlaceholder(index)}
                  </div>
                  // {/* </div> */ }
                );
              })}
            </ReactSortable>
          </div>
          : <div className="h-100 pt-3 dv_img_container col-12">
            <ReactSortable
              delayOnTouchStart={true}
              direction="horizontal"
              handle=".createBlueBox"
              animation={50}
              list={images}
              className="row h-100"
              setList={reorderImage}
              onUpdate={onUpdate}
              onMove={(event) => {
                // console.log(
                //   "onMpove",
                //   event.related.classList,
                //   event.related.classList.contains("no-drag")
                // );
                return !event.related.classList.contains("no-drag");
              }}
            >
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`${_["files"] ? "" : "no-drag"}${bulkMessage ? ' col-4 pb-2 h-50 mb-2' : ' col-4 p-2'} `}
                >
                  <div className={`${bulkMessage ? 'h-100' : ''}`} onClick={() => clickFunction(index)}>
                    <input
                      type="file"
                      id={"file" + index}
                      accept={IMAGE_TYPE}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const el = document.getElementById("file" + index);
                        onImageChange(index, e);
                      }}
                      className="d-none"
                    />
                    {_["files"] || _["url"]
                      ? getSelectedImage(_, index)
                      : getPlaceholder(index)}
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        }
      </>

      <style jsx>{`
        :global(.custom-border-radius) {
            border-radius: 10px !important;
            overflow: hidden !important;
          }
        :global(.custom_bulkmessage_mv_upload_img_close_icon){
          position: absolute;
          z-index: 1;
          cursor: pointer;
          bottom: 10px;
          right: 15px;
          width: 20px;
          background: #fff;
          border-radius: 50%;
        }
        `}</style>
    </React.Fragment>
  );
};

export default ImageContainer;
