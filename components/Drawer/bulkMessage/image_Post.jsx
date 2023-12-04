import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "react-jss";
import {
  close_drawer,
  startLoader,
  stopLoader,
  close_dialog,
} from "../../../lib/global";
import { generaeVideThumb } from "../../../lib/image-video-operation";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import CustomHead from "../../../components/html/head";
import Wrapper from "../../../components/wrapper/wrapper";
import PlaceholerComponent from "../../../containers/post/placeholderContainer";
import ImageContainer from "../../../containers/post/imageContainer";
import VideoContainer from "../../../containers/post/videoContainer";

const ImageBulkMessage = (props) => {
  const { setIsDataValid, setFileRef, setFileData, setPostCaption, postCaption,setPostId,postId } = props;
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [videoDuration, setVideoDuration] = useState()
  const fileSelect = useRef(null);
  const fileObject = useRef([]);

  useEffect(() => {
    setFileData(file);
    setFileRef(fileObject.current);
    file ? setIsDataValid(true) : setIsDataValid(false);
  }, [file, fileObject.current]);
useEffect(()=>{
  setPostId();
},[postId])
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

        setVideoDuration(video.duration);

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

  const BulkMessageCaption = () => {
    return (
      <div className={mobileView ? "col-12" : "col-12 px-1"}>
        <div className="mb-4 mt-2">
          <textarea
            value={postCaption}
            className="dv_textarea_lightgreyborder w-100 p-2"
            // rows={2}
            // list="creators"
            id="post-caption"
            placeholder={lang.caption}
            onChange={(e) => setPostCaption(e.target.value)}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {mobileView
        ? <div style={{ paddingTop: '15px' }}>
          <p className="px-3 theme_text">{lang.uploadImgorVdo}</p>

          {file
            ? file.filesObject.type.includes("image")
              ? <ImageContainer
                defaultImage={[file]}
                onChange={(imgs) => {
                  fileObject.current =
                    imgs && imgs.filter((_) =>
                      _.files ? true : false
                    );
                  if (fileObject.current.length == 0) {
                    remove();
                  }
                  setFileRef(fileObject.current);
                }}
                bulkMessage={true} />
              : <VideoContainer
                defaultImage={[file]}
                onChange={onVideoSelect}
                remove={remove}
                changeThumbanail={changeThumbanail}
                file={file}
                bulkMessage={true} />
            : <div onClick={() => fileSelect.current.click()}>
              <PlaceholerComponent
                width="100%"
                height="260px"
                style={{ objectFit: 'cover', borderRadius: '10px' }}
                placeholderText={lang.videoPhotos}
              />
            </div>
          }

          {BulkMessageCaption()}

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
        </div>
        : <div style={{ overflow: 'hidden' }}>
          <div style={{ paddingTop: '15px' }}>
            {file
              ? file.filesObject.type.includes("image")
                ? <div style={{ height: '40vh' }} className="col-12">
                  <ImageContainer
                    defaultImage={[file]}
                    onChange={(imgs) => {
                      fileObject.current =
                        imgs &&
                        imgs.filter((_) =>
                          _.files ? true : false
                        );
                      if (fileObject.current.length == 0) {
                        remove();
                      }
                      setFileRef(fileObject.current);
                    }}
                    bulkMessage={true} />
                </div>
                : <div style={{ height: '35vh' }} className="col-12">
                  <VideoContainer
                    defaultImage={[file]}
                    onChange={onVideoSelect}
                    remove={remove}
                    changeThumbanail={changeThumbanail}
                    file={file}
                    bulkMessage={true} />
                </div>
              : <div className="col-12 custom_placeholder px-1" >
                <p className="txt-roman fntSz14">{lang.uploadSuggestion}</p>
                <div style={{ height: '40vh' }} onClick={() => fileSelect.current.click()}>
                  <PlaceholerComponent
                    bulkMessage={true}
                    placeholderText={lang.videoPhotos}
                    width="100%"
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
              </div>
            }

            {BulkMessageCaption()}

            <input
              style={{ display: "none" }}
              type="file"
              accept={"video/*,image/*"}
              ref={(el) => (fileSelect.current = el)}
              onChange={(e) => {
                const file = e && e.target.files;

                if (file && file[0]) {
                  const fileUrl = URL.createObjectURL(
                    file[0]
                  );

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
          </div>
        </div>
      }
    </>
  );
};

export default ImageBulkMessage;
