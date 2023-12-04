import React from "react";
import Wrapper from "../dialogBodyWrapper/dialogBodyWrapper";
import Img from "../../../components/ui/Img/Img";
import {
  handleImageUpload,
  thumbnailify,
  generateThubnailFromVideo,
} from "../../../lib/chat";
import {
  PRIMARY,
  color3,
  color7,
  SEND_REVIEW,
  WHITE,
  CHAT_DOCUMENT,
  CHAT_DOC,
  CHAT_XLS,
  CHAT_TXT,
  CHAT_PDF,
  DEFAULT_DOC,
  FOLDER_NAME_IMAGES,
} from "../../../lib/config";
import Loader from "../../../components/ui/loader/loader";
import { fileUpload } from "../../../services/chat";
import Icon from "../../../components/image/icon";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
// import { Toast } from "../../../utils/eventEmiter";
const imgType = ["image/png", "image/jpg", "image/jpeg", "image/jfif"];
const limit = 26;
const videType = [
  "video/mov",
  "video/mp4",
  "video/ogg",
  "video/wmv",
  "video/webm",
  "video/vid",
];

const docType = [
  "application/xlsx",
  "application/xls",
  "application/doc",
  "application/docx",
  "application/ppt",
  "application/pptx",
  "application/txt",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/msword",
];
const convertMB = (size) => {
  return size / (1024 * 1024);
};
class ChatShare extends React.Component {
  state = {
    activeIndex: 0,
    notSupported: false,
    loader: false,
  };
  componentDidMount() {
    if (this.props.type === "image") {
      this.FilterImages();
    } else if (this.props.type === "video") {
      this.FilterVideo();
    } else if (this.props.type === "doc") {
      this.FilterDocument();
    }
  }

  getThumb = (type) => {
    if (type.toString().includes("doc")) {
      return CHAT_DOC;
    } else if (type.toString().includes("xls")) {
      return CHAT_XLS;
    } else if (type.toString().includes("txt")) {
      return CHAT_TXT;
    } else if (type.toString().includes("pdf")) {
      return CHAT_PDF;
    } else {
      return DEFAULT_DOC;
    }
  };
  FilterDocument = async () => {
    let notSupported = true;
    let large = true;
    let { files } = this.props;
    let filteredFiles = [];
    let count = 0;

    for (let i = 0; i < files.length; i++) {
      // console.log("selected docuemtn", files[i].type, files[i].size);
      if (
        docType.indexOf(files[i].type) != -1 &&
        convertMB(files[i].size) <= limit
      ) {
        let fileName = files[i].name ? files[i].name.split(".") : [];
        let extension = files[i].name ? fileName[fileName.length - 1] : "file";
        try {
          files[i].extension = extension || "file";
          files[i].thumb = this.getThumb(extension);
          filteredFiles.push(files[i]);
          large = false;
          notSupported = false;
        } catch (e) {
          console.error("error", e);
        }

        // thumbnailify(URL.createObjectURL(files[i]), 100, (thumb) => {
        //   console.log("convert video url", thumb);
        // });
      }

      if (convertMB(files[i].size) > limit) {
        ++count;
        large = true;
      }
    }

    if (count > 0 && filteredFiles.length > 0) {
      // Toast(
      //   `${count} File you are tried adding is larger than the ${limit} MB limit`,
      //   "error"
      // );
    }

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          files: filteredFiles,
          large,
          notSupported,
        };
      },
      () => {
        // console.log("image sgare", this.state);
      }
    );
  };
  FilterVideo = async () => {
    let notSupported = true;
    let large = true;
    let { files } = this.props;
    let filteredFiles = [];
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      if (
        videType.indexOf(files[i].type) != -1 &&
        convertMB(files[i].size) <= 26
      ) {
        try {
          let thumb = await generateThubnailFromVideo(
            URL.createObjectURL(files[i])
          );
          files[i].thumb = thumb;
          filteredFiles.push(files[i]);
          large = false;
          notSupported = false;
        } catch (e) {
          console.error(e);
        }

        // thumbnailify(URL.createObjectURL(files[i]), 100, (thumb) => {
        //   console.log("convert video url", thumb);
        // });
      }

      if (convertMB(files[i].size) > limit) {
        ++count;
        large = true;
      }
    }

    if (count > 0 && filteredFiles.length > 0) {
      // Toast(
      //   `${count} File you are tried adding is larger than the ${limit} MB limit`,
      //   "error"
      // );
    }

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          large,
          files: filteredFiles,
          notSupported,
        };
      },
      () => {
        // console.log("image sgare", this.state);
      }
    );
  };

  FilterImages = async () => {
    let notSupported = true;

    let { files } = this.props;
    let filteredFiles = [];

    for (let i = 0; i < files.length; i++) {
      if (imgType.indexOf(files[i].type) != -1) {
        try {
          // console.log("convert success file chatShare.js ===>",
          //   file,
          //   imgType.indexOf(files[i].type)
          // );

          let file = await handleImageUpload(files[i]);

          filteredFiles.push(file);
        } catch (e) {
          console.error("fail to convert file ===>", e);
        }
        notSupported = false;
      }
    }

    this.setState(
      (prevState) => {
        return {
          ...prevState,
          files: filteredFiles,
          notSupported,
        };
      },
      () => {
        // console.log("image sgare", this.state);
      }
    );
  };

  onChangePreview = (index) => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          activeIndex: index,
        };
      },
      () => {
        // console.log("image sgare", this.state);
      }
    );
  };

  uploadFile = async () => {
    let { files } = this.state;
    let { type } = this.props;
    let fileObject = [...files];
    let fileData = [];

    this.setState((prevState) => {
      return {
        loader: true,
      };
    });
    for (let i = 0; i < fileObject.length; i++) {
      try {
        let thumb = fileObject[i].thumb;

        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const imgFileName = `${userId}_${Date.now()}`;
        const folderName = `${userId}/${FOLDER_NAME_IMAGES.chatImages}`;

        if (type == "doc" || type == "video") {
          publicId = await fileUploaderAWS(
            fileObject[0],
            tokenData,
            imgFileName,
            false,
            folderName,
            false,
            'no'
          );
        } else {
          publicId = await fileUploaderAWS(
            fileObject[0],
            tokenData,
            imgFileName,
            false,
            folderName,
          );
        }

        fileData.push({
          url: publicId,
          size: fileObject[i].size,
          name: fileObject[i].name,
          thumb: thumb || "",
        });
        // sendMessage(url, 2);
      } catch (e) {
        console.error("faile to convert fileaa", e);
      }
    }

    this.props.onClose();

    this.props.fileUploading(fileData, this.props.type);
  };

  getPreviwType = () => {
    let { activeIndex, files } = this.state;
    let { type } = this.props;

    // console.log("dnsjdnjd jdw djw", files);
    if (type == "image") {
      return (
        <Img
          className="share-preview"
          src={URL.createObjectURL(files[activeIndex])}
        ></Img>
      );
    } else if (type == "video") {
      return (
        <video key={activeIndex} controlsList="nodownload" className="share-preview-video" controls>
          <source
            src={URL.createObjectURL(files[activeIndex])}
            type={"video/avi"}
          ></source>
          <source
            src={URL.createObjectURL(files[activeIndex])}
            type={files[activeIndex].type}
          ></source>
        </video>
      );
    } else if (type == "doc") {
      return (
        <div className="font-size-small text-center">
          <Img src={files[activeIndex].thumb || CHAT_DOCUMENT}></Img>
          <div className="mt-2">{files[activeIndex].name}</div>
        </div>
      );
    }
  };

  getThumbnails = (file, index) => {
    let { activeIndex, files } = this.state;
    let { type } = this.props;
    if (type == "image") {
      return (
        <Img
          className={` image-preview `}
          key={index}
          height="61px"
          onClick={() => {
            this.onChangePreview(index);
          }}
          width="61px"
          src={URL.createObjectURL(file)}
        ></Img>
      );
    } else if (type == "video") {
      return (
        <video
          className={` image-preview `}
          key={index}
          height="61px"
          onClick={() => {
            this.onChangePreview(index);
          }}
          width="61px"
          controlsList="nodownload"
        >
          <source src={URL.createObjectURL(file)} type={file.type}></source>
        </video>
      );
    } else if (type == "doc") {
      return (
        <div
          onClick={() => {
            this.onChangePreview(index);
          }}
          className={`doc-preview  image-preview doc-preview `}
        >
          <Img height="36px" src={file.thumb || CHAT_DOCUMENT}></Img>
        </div>
      );
    }
  };

  render() {
    let { activeIndex, files } = this.state;
    let { type } = this.props;
    let title = "";
    let errorMessage = "";
    if (type == "image") {
      title = "Image share";
    } else if (type == "video") {
      title = "Video share";
    } else if (type == "doc") {
      title = "Document share";
    }

    return (
      <Wrapper
        className="file-share"
        title={title}
        titleClass="file-share-dialog"
        onClose={this.props.onClose}
      >
        {this.state.files && this.state.files.length > 0 && (
          <div className="d-flex align-items-center preview-block justify-content-center p-4">
            {this.getPreviwType()}
          </div>
        )}
        {this.state.files && this.state.files.length > 0 && (
          <div className="row m-0 align-items-center thumbanail-bottom position-relative">
            <div className="send-review-button position-absolute">
              <div
                className="send-review-icon"
                onClick={this.uploadFile}
              >
                <Icon
                  icon={`${SEND_REVIEW}#send_review`}
                  size={50}
                  color={PRIMARY}
                  viewBox="0 0 39.54 39.535"
                />
              </div>
              {/* <Img
                className="send-review-icon"
                onClick={this.uploadFile}
                src={SEND_REVIEW}
              ></Img> */}
              {this.state.loader && (
                <div className="d-flex align-items-center button-loader-div justify-content-center p-2 ">
                  <Loader
                    className="m-0"
                    loading={true}
                    size={30}
                    color={WHITE}
                  ></Loader>
                </div>
              )}
            </div>
            <div className="d-flex  justify-content-center my-2 px-5 w-100">
              <div className="d-flex thumbnail-div ">
                {[...this.state.files].map((file, index) => {
                  return (
                    <div
                      className={`weraper-div m-1 ${index == activeIndex ? "active-preview" : ""
                        }`}
                    >
                      {this.getThumbnails(file, index)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {this.state.notSupported && (
          <div className="d-flex align-items-center justify-content-center p-2 no-support">
            <div>
              {this.state.large
                ? `1 File you are tried adding is larger than the ${limit} MB limit`
                : "File type not Supported"}
            </div>
          </div>
        )}
        {!this.state.files && (
          <div className="d-flex align-items-center justify-content-center p-2 no-support">
            <Loader className="m-0" loading={true}></Loader>
          </div>
        )}
        <style jsx>{`
          .thumbanail-bottom {
            background-color: ${color7};
            background-color: #cccccc;
            border-bottom-left-radius: 6px;

            border-bottom-right-radius: 6px;
            height: 19%;
            margin-top: 22px !important;
          }
          .weraper-div {
            height: 65px;
            width: 65px;
            border: 1.5px solid ${color3};
            box-sizing: border-box;
          }
          :global(.doc-preview) {
            height: 64px;
            width: 64px;

            display: flex;
            justify-content: center;
            align-items: center;
          }
          :global(.font-size-small) {
            font-size: 0.8rem;
            margin-top: 1rem;
          }

          :global(.share-preview-video) {
            height: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          :global(.share-preview-video:focus) {
            border: none;
            outline: none;
          }

          .button-loader-div {
            position: absolute;
            z-index: 1;
            top: 0px;
            left: 0px;
            background-color: ${PRIMARY};
            border-radius: 100%;
            height: 53px !important;
            width: 100%;
          }
          :global(.button-loader-div .cliploader) {
            margin: 0px !important;
          }

          .no-support {
            color: ${color3} !important;
            font-size: 0.9rem !important;
            height: 87% !important;
          }

          .send-review-button {
            top: -26%;
            right: 43px;
          }

          :global(.file-share .send-review-icon) {
            height: 53px;
            cursor: pointer;
            border-radius: 100%;
            background-color: ${PRIMARY};
          }

          :global(.file-share) {
            height: 32rem !important;
          }
          :global(.active-preview) {
            border: 1.3px solid ${PRIMARY} !important;
          }
          .thumbnail-div {
            overflow-x: auto;
          }
          :global(.preview-block) {
            height: 67%;
          }
          :global(.image-preview) {
            object-fit: cover;
          }
          :global(.share-preview) {
            max-height: 100% !important;
            object-fit: contain;
            max-width: 100% !important;
          }
        `}</style>
      </Wrapper>
    );
  }
}
export default ChatShare;
