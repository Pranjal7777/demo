import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

import {
  close_drawer,
  startLoader,
  stopLoader,
  close_dialog,
  open_drawer,
} from "../../../lib/global";
import { generaeVideThumb } from "../../../lib/image-video-operation";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import CustomHead from "../../../components/html/head";
import Wrapper from "../../../components/wrapper/wrapper";
import PlaceholerComponent from "../../../containers/post/placeholderContainer"
import ImageContainer from "../../../containers/post/imageContainer"
import VideoContainer from "../../../containers/post/videoContainer"
import RadioButtonsGroup from "../../radio-button/radio-button-group";
import Icon from "../../../components/image/icon";
import { defaultCurrency, DOLLAR_ICON } from "../../../lib/config";
import { ValidateTwoDecimalNumber } from "../../../lib/validation/validation";
import AllLockedPosts from "./all_locked_post";
import TextPost from "../../TextPost/textPost";

const LockedPost = (props) => {
  const { setIsDataValid, fileData, setFileData, setFileRef, setPostCaption, postCaption, price, setPrice, postId, setPostId, postSelection, setPostSelection } = props;

  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  const postTpe = useRef(1);
  const fileObject = useRef([]);
  const fileSelect = useRef(null);

  const [type, setType] = useState("");
  const [file, setFile] = useState();
  const [priceAlert, setPriceAlert] = useState("");
  const [videoDuration, setVideoDuration] = useState(10)
  const [isLockedGallery, setIsLockedGallery] = useState(false);

  // Redux State
  const minLockedPostVal = useSelector((state) => state?.appConfig?.minLockedPostValue);
  const maxLockedPostValue = useSelector((state) => state?.appConfig?.maxLockedPostValue);

  useEffect(() => {
    setFileData(file);
    setFileRef(fileObject.current);

    file && (parseInt(price) >= minLockedPostVal && parseInt(price) <= maxLockedPostValue) ? setIsDataValid(true) : setIsDataValid(false);

    if (!(parseInt(price) >= minLockedPostVal && parseInt(price) <= maxLockedPostValue)) {
      setPriceAlert(`${lang.amountCheck} ${defaultCurrency} ${minLockedPostVal} ${lang.maxText} ${defaultCurrency} ${maxLockedPostValue}`);
    } else {
      setPriceAlert("");
    }
  }, [file, price, fileObject.current]);

  const remove = (e) => {
    e && e.stopPropagation();
    fileObject.current = [];
    setFile(null);
  };

  const fileCallbackToPromise = (fileObj) => {
    return Promise.race([
      new Promise((resolve) => {
        if (fileObj instanceof HTMLImageElement) fileObj.onload = resolve;
        else fileObj.onloadedmetadata = resolve;
      }),
      new Promise((_, reject) => {
        setTimeout(reject, 1000);
      }),
    ]);
  };

  const onVideoSelect = async (file) => {
    try {
      if (file && file[0]) {
        startLoader();
        const url = URL.createObjectURL(file[0]);
        const video = document.createElement("video");
        video.src = url;
        await fileCallbackToPromise(video);
        setVideoDuration(video.duration)
        await generaeVideThumb(file[0], (thumbs) => {
          stopLoader();
          setFile({
            seqId: 1,
            filesObject: file[0],
            files: typeof thumbs[0] != "undefined" && thumbs[0],
            selectedThumb: 0,
            thumb: thumbs,
            videoDuration: video.duration || 10
          });
          fileObject.current = [{
            seqId: 1,
            filesObject: file[0],
            files: typeof thumbs[0] != "undefined" && thumbs[0],
            thumb: thumbs,
            videoDuration: video.duration || 10
          },
          ];
        }, video.videoWidth, video.videoHeight);
      }
    } catch (err) {
      Toast("For this file, Please Select Custom Cover !", "info");
      stopLoader();
    }
  };

  const changeThumbanail = (thumb, index) => {
    setFile((prevState) => {
      return {
        ...prevState,
        selectedThumb: index,
        files: thumb,
      };
    });

    fileObject.current[0] = {
      ...fileObject.current[0],
      files: thumb,
    };

    mobileView ? close_drawer("thumbSelectore") : close_dialog("thumbSelectore");
  };

  const selectType = () => {
    mobileView
      ? open_drawer("radioSelectore", {
        button: lang.continue,
        title: lang.uploadLockedPost,
        value: type,
        data: [{
          name: "posting",
          value: 1,
          label: lang.newLockedPost,
        }, {
          name: "posting",
          value: 2,
          label: lang.selectLockedGallery,
        }
        ].map((option) => {
          return option;
          ``;
        }),
        onSelect: (type) => {
          setType(type);
          postTpe.current = type;

          type == 1
            ? fileSelect.current.click()
            : setTimeout(() => {
              open_drawer("allLockedPost", {
                setFile,
                setPrice,
                setPostId,
                setPostCaption,
                setIsLockedGallery,
              }, "right")
            }, 1000)
        },
      },
        "bottom"
      )
      : open_dialog("radioSelector", {
        button: lang.continue,
        title: lang.uploadLockedPost,
        value: type,
        data: [{
          name: "posting",
          value: 1,
          label: lang.newLockedPost,
        }, {
          name: "posting",
          value: 2,
          label: lang.selectLockedGallery,
        }
        ].map((option) => {
          return option;
          ``;
        }),
        onSelect: (type) => {
          setType(type);
          postTpe.current = type;
          type == 1
            ? fileSelect.current.click()
            : open_dialog("allLockedPost", {})
        },
      });
  }

  const PostCaptionTxtArea = () => {
    return (
      <div className={mobileView ? "col-12" : "col-12 px-1"}>
        <div className={mobileView ? "mb-0 mt-2" : "mt-2"}>
          <textarea
            value={postCaption}
            className="w-100 dv_textarea_lightgreyborder p-2"
            // rows={2}
            // list="creators"
            disabled={isLockedGallery}
            id="post-caption"
            placeholder={lang.caption}
            onChange={(e) => setPostCaption(e.target.value)}
          />
        </div>
      </div>
    )
  }

  const handlePrice = (e) => {
    let value = e.target.value;
    const regex = ValidateTwoDecimalNumber(value);
    const decimalRegex = /^(?:\d*\.\d{0,2}|\d+)$/.test(value);

    if (regex || !value) {
      setPrice(value);
    } else if (decimalRegex || !value) {
      setPrice(value);
    }
  }

  const currencyTxtBx = () => {
    return (
      <div className={mobileView ? "col-12" : "col-12 px-2 pb-2"}>
        <p className="fntWeight600 m-0">{lang.price}</p>
        <div className="my-1 position-relative">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={price}
            onChange={(e) => handlePrice(e)}
            className="locked-post-price"
            onWheel={(e) => {
              e.target.blur()
              e.stopPropagation()
            }}
          />
          <p className="locked-post-currency">{defaultCurrency}</p>
        </div>
        <p className="text-danger font-weight-600 m-0">{priceAlert}</p>
      </div>
    )
  }

  const FileExists = () => {
    if (file?.[0]?.type === 4) return <div style={{ height: '35vh' }} className="col-12 px-1">
      <TextPost textPost={file} isVisible={1} />
    </div>
    return (
      file.filesObject
        ? file.filesObject.type.includes("image")
          ? <div style={{ height: '50vh' }} className="col-12 px-1">
            <ImageContainer
              defaultImage={[file]}
              onChange={(imgs) => {
                fileObject.current = imgs &&
                  imgs.filter((_) => _.files ? true : false
                  );
                if (fileObject.current.length == 0) {
                  remove();
                }
              }}
              bulkMessage={true}
            />
          </div>
          : <div style={{ height: '35vh' }} className="col-12 px-1">
            <VideoContainer
              defaultImage={[file]}
              onChange={onVideoSelect}
              remove={remove}
              changeThumbanail={changeThumbanail}
              file={file}
              bulkMessage={true} />
          </div>
        : file.length && file[0].type == 1
          ? <div style={{ height: '35vh' }} className="col-12 px-1">
            <ImageContainer
              defaultImage={file}
              onChange={(imgs) => {
                fileObject.current =
                  imgs &&
                  imgs.filter((_) => (_.files || _.url ? true : false));
                if (fileObject.current.length == 0) {
                  remove();
                }
              }}
              bulkMessage={true}
              galleryLockedPost={true}
            />
          </div>
          : <div style={{ height: '35vh' }} className="col-12 px-1">
            <VideoContainer
              defaultImage={file}
              // onChange={onVideoSelect}
              // remove={remove}
              changeThumbanail={changeThumbanail}
              // file={file}
              bulkMessage={true}
              editPost={true}
            />
          </div>
    )
  }

  return (
    <>
      {mobileView
        ? <>
          <CustomHead {...props.seoSettingData} />

          <div className="overflow-auto">

            {isLockedGallery
              ? ""
              : <p className="px-3 theme_text">{lang.uploadImgorVdo}</p>
            }

            {file
              ? FileExists()
              : <div onClick={selectType}>
                <PlaceholerComponent
                  width="100%"
                  height="260px"
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                  placeholderText={lang.addLockedPost}
                />
              </div>
            }

            {PostCaptionTxtArea()}

            <input
              style={{ display: "none" }}
              type="file"
              accept={"video/*,image/*"}
              ref={(el) => (fileSelect.current = el)}
              onChange={(e) => {
                const file = e && e.target.files;

                if (file && file[0]) {
                  const fileUrl = URL.createObjectURL(file[0]);

                  if (file[0].type.includes("video"))
                    onVideoSelect(file);
                  else
                    setFile({
                      seqId: 1,
                      filesObject: file[0],
                      files: fileUrl,
                    });
                }
              }}
            />

            {currencyTxtBx()}
          </div>
        </>
        : <>
          <div className="selectpostType col-12 px-1">
            <RadioButtonsGroup
              radioLabelClass="m-0"
              radioClass="text-muted"
              labelPlacement="start"
              value={postSelection}
              onRadioChange={(val) => {
                setPostSelection(val);
              }}
              buttonGroupData={[
                { value: 1, label: isLockedGallery ? lang.alreadyCreatedPost : lang.createNew },
                { value: 2, label: lang.lockedGallery },
              ]}
            />
          </div>

          {postSelection == 2
            ? <AllLockedPosts setFile={setFile} setPrice={setPrice} setPostSelection={setPostSelection} setPostCaption={setPostCaption} setPostId={setPostId} setIsLockedGallery={setIsLockedGallery} />
            : <div>
              {file
                ? FileExists()
                : <div style={{ height: '35vh' }} className="col-12 px-1 custom_placeholder" onClick={() => fileSelect.current.click()}>
                  <PlaceholerComponent
                    bulkMessage={true}
                    width="100%"
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                    placeholderText={lang.addLockedPost}
                  />
                </div>
              }

              <input
                style={{ display: "none" }}
                type="file"
                accept={"video/*,image/*"}
                ref={(el) => (fileSelect.current = el)}
                onChange={(e) => {
                  const file = e && e.target.files;
                  if (file && file[0]) {
                    const fileUrl = URL.createObjectURL(file[0]);
                    if (file[0].type.includes("video"))
                      onVideoSelect(file);
                    else
                      setFile({
                        seqId: 1,
                        filesObject: file[0],
                        files: fileUrl,
                      });
                  }
                }}
              />

              {PostCaptionTxtArea()}
              {currencyTxtBx()}
            </div>
          }
        </>
      }

      <style jsx>{`
        .selectpostType :global(.MuiFormGroup-root){
          flex-direction:row;
        }
        .selectpostType :global(.MuiFormControlLabel-labelPlacementStart){
          flex-direction:row;
        }
      `}
      </style>
    </>
  );
};

export default LockedPost;
