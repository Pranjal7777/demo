import React, { createRef } from "react";
import Fade from "react-reveal/Fade";
import { connect } from "react-redux";

import {
  color8,
  color1,
  ATTECHMENT,
  CHAT_GALLERY,
  CHAT_VIDEO,
  CHAT_DOCUMENT,
  QR_CODE,
  CHAT_CAMERA_ICON,
  CHAT_DOC,
  CHAT_XLS,
  CHAT_TXT,
  CHAT_PDF,
  DEFAULT_DOC,
  FOLDER_NAME_IMAGES,
} from "../../../lib/config";

import {
  handleImageUpload,
  generateThubnailFromVideo,
} from "../../../lib/chat";

import DialogForShare from "../../../hoc/chatDalogHoc";
import { generateQrcode, postQrCode } from "../../../services/chat";
import Icon from "../../image/icon";
import { palette } from "../../../lib/palette";
import { getCookie } from "../../../lib/session";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import fileUploaderAWS, { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";

const imgType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/jfif",
  "image/webp",
  "image/gif",
];
const limit = 26;
const videType = [
  "video/mov",
  "video/mp4",
  "video/ogg",
  "video/wmv",
  "video/webm",
  "video/vid",
  "video/x-quicktime",
  "video/avi"
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
class ChatShare extends React.Component {
  file = createRef(null);
  video = createRef(null);
  doc = createRef(null);
  node = createRef(null);
  constructor(props) {
    super(props);
    this.state = { show: false, dealSuccess: props.chatData.dealStatus };
    this.handleClick = this.handleClick.bind(this);
    this.handleAttached = this.handleAttached.bind(this);
  }

  convertMB = (size) => {
    return size / (1024 * 1024);
  };

  handleAttached() {
    if (this.props.authenticateChatUser(this.props.chatData.userStatus)) return
    this.props.isUserblock
      ? this.props.unBlock()
      : this.props.mobileView
        ? this.props.open_drawer("attachedFile", {
          sendMessage: this.props.sendMessage,
          convertMB: this.convertMB,
          receiversId: this.props.chatData.receiverId,
          recipientId: this.props.chatData.recipientId,
        }, "bottom")
        : this.props.open_dialog("attachedFile", {
          sendMessage: this.props.sendMessage,
          convertMB: this.convertMB,
          receiversId: this.props.chatData.receiverId,
          recipientId: this.props.chatData.recipientId,
        });
  }

  handleClick() {
    this.props.hideEmoji();
    // console.log("saasjdd", this.props);
    this.props.isUserblock
      ? (this.setState({ show: false }), this.props.unBlock())
      : this.setState({ show: !this.state.show });
  }
  closeDropDown() {
    this.setState({ show: false });
  }
  fileSelectDialog = () => {
    this.state.show && this.file.current.click();
  };
  videoSelectDialog = () => {
    this.state.show && this.video && this.video.current.click();
  };

  docSelectDialog = () => {
    this.state.show && this.doc && this.doc.current.click();
  };

  fileSelect = async (...arges) => {
    this.setState({ show: false });
    if (arges[0].target.files && arges[0].target.files.length > 0) {
      this.closeDropDown();

      this.props.open_dialog("loading", {
        wraning: true,
        label: "Unsupported image format!",
      });

      let notSupported = true;
      let files = arges[0].target.files;
      let filteredFiles = [];

      for (let i = 0; i < files.length; i++) {
        if (imgType.indexOf(files[i].type) != -1) {
          try {
            // console.log("convert success fileaa ===>",
            //   file,
            //   imgType.indexOf(files[i].type)
            // );

            let file = await handleImageUpload(files[i]);

            filteredFiles.push(file);
          } catch (e) {
            console.error("faile to convert fileaa", e);
          }
          notSupported = false;
        }
      }

      if (notSupported) {
        this.props.close_dialog("loading", {
          wraning: true,
          label: "Unsupported image format!",
        });
        this.props.open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported image format!",
        });
      } else {
        this.fileUploadingActiv(filteredFiles, "image");
      }

      // this.props.open_dialog("chatShare", {
      //   files: arges[0].target.files,
      //   type: "image",
      //   fileUploading: this.fileUpload,
      // });
    }
  };

  fileUpload = (data, type) => {
    if (type == "image") {
      data &&
        data.map((file) => {
          this.props.sendMessage(
            s3ImageLinkGen(this.props.S3_IMG_LINK, file.url), 2, {
            dataSize: file.size,
            thumbnail: file.thumb,
          });
        });
    } else if (type == "video") {
      data &&
        data.map((file) => {
          this.props.sendMessage(`${this.props.APP_IMG_LINK}/${file.url}`, 3, {
            dataSize: file.size,
            thumbnail: file.thumb,
          });
        });
    } else if (type == "doc") {
      data &&
        data.map((file) => {
          const extension = file.name.substring(file.name.indexOf(".") + 1);
          file.url += "," + extension;

          this.props.sendMessage(file.url, 10, {
            dataSize: file.size,
            fileName: file.name,
            type,
            extension,
          });
        });
    }
    this.props.close_dialog();
  };

  videoSelect = async (...arges) => {
    this.setState({ show: false });

    if (arges[0].target.files && arges[0].target.files.length > 0) {
      this.closeDropDown();

      this.props.open_dialog("loading", {
        wraning: true,
        label: "Video Uploading Please Wait",
      });

      let notSupported = true;
      let large = true;
      let files = arges[0].target.files;
      let filteredFiles = [];
      let count = 0;

      for (let i = 0; i < files.length; i++) {
        if (
          videType.indexOf(files[i].type) != -1 &&
          this.convertMB(files[i].size) <= 26
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
            console.error("ERROR IN videoSelect", e);
          }

          // thumbnailify(URL.createObjectURL(files[i]), 100, (thumb) => {
          //   console.log("convert video url", thumb);
          // });
        }
        if (this.convertMB(files[i].size) > limit) {
          ++count;
          large = true;
        }
      }

      if (notSupported || large) {
        this.props.close_dialog("loading", {
          wraning: true,
          label: "Unsupported video format!",
        });

        this.props.open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported video format!",
        });
      } else {
        this.fileUploadingActiv(filteredFiles, "video");
      }

      // this.props.open_dialog("chatShare", {
      //   files: arges[0].target.files,
      //   type: "video",
      //   fileUploading: this.fileUpload,
      // });
    }
  };

  fileUploadingActiv = async (filteredFiles, type) => {
    let userId = getCookie("uid");
    let fileData = [];
    let publicId;

    for (let i = 0; i < filteredFiles.length; i++) {
      try {
        let thumb = filteredFiles[i].thumb;
        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const imgFileName = `${userId}_${Date.now()}`;
        const folderName = `${FOLDER_NAME_IMAGES.chatMedia}/${userId}`;

        publicId = await fileUploaderAWS(
          filteredFiles[0],
          tokenData,
          imgFileName,
          false,
          folderName,
          false,
          'no'
        );

        fileData.push({
          url: publicId,
          size: filteredFiles[i].size,
          name: filteredFiles[i].name,
          thumb: thumb || "",
        });
        // sendMessage(url, 2);
      } catch (e) {
        console.error("failed to convert file", e);
      }
    }
    this.fileUpload(fileData, type);
  };

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

  documentShare = async (...arges) => {
    this.setState({ show: false });

    if (arges[0].target.files && arges[0].target.files.length > 0) {
      this.props.open_dialog("loading", {
        wraning: true,
        label: "Video Uploading Please Wait",
      });

      let notSupported = true;
      let large = true;
      let files = arges[0].target.files;
      let filteredFiles = [];
      let count = 0;

      for (let i = 0; i < files.length; i++) {
        // console.log("selected docuemtn", files[i].type, files[i].size);
        if (
          docType.indexOf(files[i].type) != -1 &&
          this.convertMB(files[i].size) <= limit
        ) {
          let fileName = files[i].name ? files[i].name.split(".") : [];
          let extension = files[i].name
            ? fileName[fileName.length - 1]
            : "file";
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

        if (this.convertMB(files[i].size) > limit) {
          ++count;
          large = true;
        }
      }

      if (notSupported) {
        this.props.close_dialog("loading", {
          wraning: true,
          label: "Unsupported document format!",
        });
        this.props.open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported document format!",
        });
      } else {
        this.fileUploadingActiv(filteredFiles, "doc");
      }

      // this.closeDropDown();
      // this.props.open_dialog("chatShare", {
      //   files: arges[0].target.files,
      //   type: "doc",
      //   fileUploading: this.fileUpload,
      // });
    }
  };
  sendLocation = ({ lat, long, address }) => {
    let locationArray = [];

    locationArray.push(`(${lat + "," + long})`);
    locationArray.push(address);
    locationArray.push(address);
    let location = locationArray.join(" ");
    this.props.sendMessage(location, 4);
  };

  handleDropDown = (e) => {
    // console.log("containsss", e.target);
    if (this.node.contains(e.target)) {
      return;
    }
    this.closeDropDown();
  };
  componentDidMount() {
    // console.log(this.props, "props in class compojne");
    document.addEventListener("mousedown", this.handleDropDown, false);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.chatData.dealStatus == 3 &&
      this.state.dealSuccess != this.props.chatData.dealStatus
    ) {
      this.props.close_dialog("successOnly", {
        // wraning: true,
        label: "Deal Success",
      });
      setTimeout(() => {
        this.props.open_dialog("successOnly", {
          // wraning: true,
          label: "Deal Success",
        });
      }, 400);

      this.setState({
        dealSuccess: 3,
      });
      setTimeout(() => {
        this.props.close_dialog("successOnly", {
          // wraning: true,
          label: "Deal Success",
        });
      }, 1500);
    }
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDropDown, false);
  }

  openQrCode = async () => {
    let { chatData = {} } = this.props;
    let { orderId } = chatData;
    this.handleClick();
    try {
      let response = await generateQrcode({ orderId });
      let qrData = response.data.data;
      // console.log("sxdadnsjad", qrCode);

      this.props.open_dialog("qrCode", {
        qrCode: qrData.qrCode,
      });
    } catch (e) {
      console.error("sxdadnsjad", e);
    }
  };

  scanSuccess = (data) => {
    // console.log("data sadad", data);

    let dealSuccess = "deal success";
    let { chatData = {}, type } = this.props;
    let { orderId, assetDetail, lastOfferAmount } = chatData;

    let dealStatus = 3;
    if (data) {
      // startLoader(true);
      this.props.close_dialog("qrScan", {});
      let extendData = {};
      // if (type == "exchangeSend") {
      //   extendData["buyerQrcodeStatus"] = true;
      //   extendData["sellerQrcodeStatus"] = chatData.sellerQrcodeStatus
      //     ? chatData.sellerQrcodeStatus
      //     : false;

      //   dealSuccess =
      //     "Thank you for scanning Qr code, please scan buyer qr code for complete deal";
      // }
      // if (type == "exchangeRecived") {
      //   extendData["buyerQrcodeStatus"] = chatData.buyerQrcodeStatus
      //     ? chatData.buyerQrcodeStatus
      //     : false;
      //   extendData["sellerQrcodeStatus"] = true;

      //   dealSuccess =
      //     "Thank you for scanning Qr code, please scan seller qr code for complete deal";
      // }

      // if (chatData.isExchange) {
      //   if (
      //     extendData["sellerQrcodeStatus"] &&
      //     extendData["buyerQrcodeStatus"]
      //   ) {
      //     dealStatus = 3;

      //     dealSuccess =
      //       "Thank you for using the Fanzly for exchanging products";
      //   } else {
      //     dealStatus = 1;
      //   }
      // }

      postQrCode({ orderId, qrCode: data })
        .then(async (data) => {
          // stopLoader(false);

          this.props.open_dialog("successOnly", {
            label:
              dealStatus == 3
                ? "Deal Success"
                : !extendData["sellerQrcodeStatus"]
                  ? "Thank you for scanning Qr code, please scan buyer qr code for complete deal"
                  : "Thank you for scanning Qr code, please scan seller qr code for complete deal",
          });
          setTimeout(() => {
            this.props.close_dialog("successOnly", {});
          }, 1500);

          // if (this.props.type == "shopping") {
          //   let curruncy =
          //     assetDetail && assetDetail.units && assetDetail.units.symbol;
          //   try {
          //     let data = await appCommitionAssets(
          //       assetDetail._id,
          //       lastOfferAmount,
          //       assetDetail &&
          //         assetDetail.units &&
          //         assetDetail.units.currency_code
          //     );
          //     let commission = data.data.data.appCommission;
          //     console.log("sdad", data);
          //     let amount = commission;

          //     dealSuccess = JSON.stringify({
          //       offerAmount: lastOfferAmount,
          //       commission: commission,
          //       currencySymbol: curruncy,
          //     });
          //   } catch (e) {
          //     console.log("sadasd", e);
          //   }
          // }

          this.props.sendMessage(dealSuccess, 21, {
            dealStatus: dealStatus,
            orderId: orderId,
            ...extendData,
          });
        })
        .catch((e) => {
          // stopLoader(false);

          this.props.open_dialog("successOnly", {
            wraning: true,
            label: e.response.data.message,
          });
          console.error("deal error", e.response);
        });
    }
  };
  scanQrCode = async () => {
    this.handleClick();

    let constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((devices) => {
        this.props.open_dialog("qrScan", {
          scanSuccess: this.scanSuccess,
        });
        //code for when none of the devices are available
      })
      .catch((err) => {
        if (err.name == "NotAllowedError") {
          this.props.open_dialog("permissionBlock", {
            title: "Camera permissions is blocked",
            desc: "Looks like your Camera permissions are blocked. Please, provide Camera access permissions in your browser settings for qr code scan.",
          });
        }
      });
  };

  render() {
    let { chatData = {}, type } = this.props;
    // console.log(
    //   "sadadasdasdsdadad",
    //   chatData,
    //   type == "sale" ||
    //     (!sellerQrcodeStatus && type == "exchangeSend") ||
    //     (!buyerQrcodeStatus && type == "exchangeRecived")
    // );
    let { orderId, dealStatus, buyerQrcodeStatus, sellerQrcodeStatus } =
      chatData;
    return (
      <div className="chat-share-drawer" ref={(node) => (this.node = node)}>
        <div className={`chat-drawe-open-button ${this.state.show ? "is-open-chat" : ""}`}>
          {/* <Img
            src={ATTECHMENT}
            title="Attach"
            height="23px"
            onClick={this.handleClick}
          ></Img> */}
          <div onClick={this.handleAttached}>
            <Icon
              icon={`${ATTECHMENT}#clip_icon`}
              color={
                this.props.theme === "light"
                  ? palette.l_app_text
                  : palette.white
              }
              size={23}
              viewBox="0 0 469.333 469.333"
            />
          </div>
        </div>
        <Fade top cascade when={this.state.show} duration={200}>
          {this.state.show && (
            <div className="chat-menu-drawer">
              <div>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg ,.jfif, .webp, .gif"
                  ref={this.file}
                  multiple={true}
                  className="form-input"
                  style={{ display: "none" }}
                  onChange={this.fileSelect}
                />
                <div onClick={this.fileSelectDialog}>
                  <Icon
                    icon={`${CHAT_GALLERY}#chat_gallery`}
                    size={39}
                    color={
                      this.props.theme.type === "light"
                        ? palette.l_base
                        : palette.d_base
                    }
                    viewBox="0 0 37 37"
                  />
                </div>
                {/* <Img
                  onClick={this.fileSelectDialog}
                  src={CHAT_GALLERY}
                  height="39px"
                ></Img> */}
              </div>
              <div>
                <input
                  type="file"
                  // accept=".mov,.mp4,.ogg,.vid,.wmv,.webm"
                  accept="video/*"
                  ref={this.video}
                  multiple={true}
                  className="form-input"
                  style={{ display: "none" }}
                  onChange={this.videoSelect}
                ></input>
                <div onClick={this.videoSelectDialog}>
                  <Icon
                    icon={`${CHAT_VIDEO}#chat_video`}
                    size={39}
                    color={palette.l_base}
                    viewBox="0 0 37 37"
                  />
                </div>
                {/* <Img
                  onClick={this.videoSelectDialog}
                  src={CHAT_VIDEO}
                  height="39px"
                ></Img> */}
              </div>

              {/* <div>
                <Img
                  src={CHAT_LOCATION}
                  height="39px"
                  onClick={() => {
                    this.closeDropDown();
                    this.state.show &&
                      this.props.open_dialog("location", {
                        sendLocation: this.sendLocation,
                      });
                  }}
                ></Img>
              </div> */}
              <div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                  ref={this.doc}
                  multiple={true}
                  className="form-input"
                  style={{ display: "none" }}
                  onChange={this.documentShare}
                />
                <div onClick={this.docSelectDialog}>
                  <Icon
                    icon={`${CHAT_DOCUMENT}#chat_documnet`}
                    size={39}
                    color={palette.l_base}
                    viewBox="0 0 37 37"
                  />
                </div>
                {/* <Img
                  onClick={this.docSelectDialog}
                  src={CHAT_DOCUMENT}
                  height="39px"
                ></Img> */}
              </div>
              {orderId && dealStatus != 2 && dealStatus != 3 && (
                <div>
                  {(type == "sale" || type == "exchangeRecived") && (
                    // (!sellerQrcodeStatus &&
                    //   !buyerQrcodeStatus &&
                    //   type == "exchangeRecived") ||
                    // (buyerQrcodeStatus &&
                    //   !sellerQrcodeStatus &&
                    //   type == "exchangeSend"))

                    <div
                      className={`mr-3 mb-3  chat-drawe-open-button p-0 ${this.state.show ? "is-open-chat" : ""
                        }`}
                    >
                      <div onClick={this.openQrCode}>
                        <Icon
                          src={`${QR_CODE}#chat_qrcode`}
                          size={39}
                          color={palette.l_base}
                          viewBox="0 0 54 54"
                        />
                      </div>
                      {/* <Img
                        src={QR_CODE}
                        title="Attach"
                        height="39px"
                        onClick={this.openQrCode}
                      ></Img> */}
                    </div>
                  )}
                  {(type == "shopping" || type == "exchangeSend") && (
                    // (!buyerQrcodeStatus &&
                    //   !sellerQrcodeStatus &&
                    //   type == "exchangeSend") ||
                    // (!sellerQrcodeStatus &&
                    //   buyerQrcodeStatus &&
                    //   type == "exchangeRecived")
                    //   )
                    <div
                      className={`mr-3 chat-drawe-open-button p-0 ${this.state.show ? "is-open-chat" : ""
                        }`}
                    >
                      <div onClick={this.scanQrCode}>
                        <Icon
                          icon={`${CHAT_CAMERA_ICON}#chat_camera_icon`}
                          size={39}
                          color={palette.l_base}
                          viewBox="0 0 70 70"
                        />
                      </div>
                      {/* <Img
                        src={CHAT_CAMERA_ICON}
                        title="Attach"
                        height="39px"
                        onClick={this.scanQrCode}
                      ></Img> */}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Fade>
        <style jsx>{`
          .chat-menu-drawer {
            position: absolute;
            top: 55px;
            z-index: 3;
          }
          .chat-drawe-open-button {
            padding: 8px;
          }
          .chat-menu-drawer > div {
            margin-bottom: 13px;
          }
          .is-open-chat {
            border-radius: 100%;
            background-color: ${palette.l_base};
          }

          // .choose-options {
          //   font-size: 0.8rem;
          //   color: ${color1};
          //   font-size: 0.8rem;
          // }
          // .chat-share-drawer {
          //   position: absolute;
          //   z-index: 1;
          //   bottom: 60px;
          //   padding: 1rem 0rem 0.6rem 1rem;
          //   width: 100%;
          //   background-color: ${color8};
          // }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    theme: store?.theme,
  };
};

export default connect(mapStateToProps)(DialogForShare(ChatShare));
