import React, { createRef } from "react";

import { getCookie } from "../../../lib/session";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import Icon from "../../../components/image/icon";
import { generateThubnailFromVideo, handleImageUpload } from "../../../lib/chat";
import { CHAT_DOC, CHAT_DOCUMENT, CHAT_GALLERY, CHAT_PDF, CHAT_TXT, CHAT_VIDEO, CHAT_XLS, FOLDER_NAME_IMAGES, LOCKED_ICON } from "../../../lib/config";
import { close_dialog, close_drawer, close_progress, open_dialog, open_drawer, open_progress, startLoader, stopLoader } from "../../../lib/global";
import * as chatService from "../../../services/chat";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
import { Toast } from "../../../lib/global/loader";

const AttachedFile = (props) => {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const userType = getCookie("userType");

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
    "video/quicktime",
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

  const file = createRef(null);
  const video = createRef(null);
  const doc = createRef(null);

  const fileSelectDialog = () => {
    file.current.click();
    // mobileView ? close_drawer("attachedFile") : close_dialog("attachedFile");
  };

  const videoSelectDialog = () => {
    video.current.click();
    // mobileView ? close_drawer("attachedFile") : close_dialog("attachedFile");
  };

  const docSelectDialog = () => {
    doc.current.click();
    // mobileView ? close_drawer("attachedFile") : close_dialog("attachedFile");
  };


  const handleLockedPost = () => {
    setTimeout(() => props.onClose(), 1000);

    mobileView
      ? open_drawer("createBulkMessage", {
        close: () => close_drawer("createBulkMessage"),
        lockedMessage: true,
        sendMessage: props.sendMessage,
        receiversId: props.receiversId,
        recipientId: props.recipientId,
      }, "right")
      : open_dialog("createBulkMessage", {
        close: () => close_dialog("createBulkMessage"),
        lockedMessage: true,
        sendMessage: props.sendMessage,
        receiversId: props.receiversId,
        recipientId: props.recipientId,
      })
  }

  const fileSelect = async (...arges) => {
    startLoader()
    // this.setState({ show: false });
    if (arges[0].target.files && arges[0].target.files.length > 0) {
      // this.closeDropDown();

      // open_dialog("loading", {
      //   wraning: true,
      //   label: "Unsupported image format!",
      // });

      let notSupported = true;
      let files = arges[0].target.files;
      let filteredFiles = [];
      for (let i = 0; i < files.length; i++) {
        if (imgType.indexOf(files[i].type) != -1) {
          try {
            // console.log("convert success file attachedFiledialog.js ",
            //   files,
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
        // open_dialog("loading", {
        //   wraning: true,
        //   label: "Unsupported image format!",
        // });
        open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported image format!",
        });
      } else {
        fileUploadingActiv(filteredFiles, "image");
      }

      // this.props.open_dialog("chatShare", {
      //   files: arges[0].target.files,
      //   type: "image",
      //   fileUploading: this.fileUpload,
      // });
    }
    stopLoader()
  };

  const fileUpload = (data, type) => {
    if (type == "image") {
      data &&
        data.map((file) => {
          props.sendMessage(file.url, 2, {
            dataSize: file.size.toString(),
            thumbnail: file.thumb,
            fileName: file.name,
          });
        });
    } else if (type == "video") {
      data &&
        data.map((file) => {
          props.sendMessage(file.url, 3, {
            dataSize: file.size.toString(),
            thumbnail: file.thumb,
          });
        });
    } else if (type == "doc") {
      data &&
        data.map((file) => {
          const extension = file.name.substring(file.name.indexOf(".") + 1);
          file.url += "," + extension;

          props.sendMessage(file.url, 10, {
            dataSize: file.size.toString(),
            fileName: file.name,
            // type,
            // extension,
          });
        });
    }

    close_progress();
  };

  const videoSelect = async (...arges) => {
    // this.setState({ show: false });
    startLoader()
    if (arges[0].target.files && arges[0].target.files.length > 0) {
      // this.closeDropDown();

      // open_dialog("loading", {
      //   wraning: true,
      //   label: "Video Uploading Please Wait",
      // });

      let notSupported = true;
      let large = true;
      let files = arges[0].target.files;
      let filteredFiles = [];
      let count = 0;

      for (let i = 0; i < files.length; i++) {
        if (
          videType.indexOf(files[i].type) != -1 &&
          props.convertMB(files[i].size) <= 26
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
        }
        if (props.convertMB(files[i].size) > limit) {
          ++count;
          large = true;
        }
      }

      if (notSupported || large) {
        // open_dialog("loading", {
        //   wraning: true,
        //   label: "Unsupported video format!",
        // });

        open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported video format!",
        });
      } else {
        fileUploadingActiv(filteredFiles, "video");
      }

      // this.props.open_dialog("chatShare", {
      //   files: arges[0].target.files,
      //   type: "video",
      //   fileUploading: this.fileUpload,
      // });
    }
    stopLoader()
  };

  const fileUploadingActiv = async (filteredFiles, type) => {
    props.onClose();
    startLoader();
    let userId = getCookie("uid");
    let fileData = [];
    let publicId;

    for (let i = 0; i < filteredFiles.length; i++) {
      try {
        let thumb = filteredFiles[i].thumb;
        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const imgFileName = `${filteredFiles[i].name.split('.')[0]}_${userId}_${Date.now()}`;
        const folderName = `${FOLDER_NAME_IMAGES.chatMedia}/${userId}`;

        if (type === "image") {
          imgFileName += ".png";
        } else if (type === "video") {
          imgFileName += ".mp4";
        }

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
    fileUpload(fileData, type);
    stopLoader();
  };

  const getThumb = (type) => {
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

  const documentShare = async (...arges) => {
    // this.setState({ show: false });

    if (arges[0].target.files && arges[0].target.files.length > 0) {
      // open_dialog("loading", {
      //   wraning: true,
      //   label: "Video Uploading Please Wait",
      // });

      let notSupported = true;
      let large = true;
      let files = arges[0].target.files;
      let filteredFiles = [];
      let count = 0;

      for (let i = 0; i < files.length; i++) {
        if (
          docType.indexOf(files[i].type) != -1 &&
          props.convertMB(files[i].size) <= limit
        ) {
          let fileName = files[i].name ? files[i].name.split(".") : [];
          let extension = files[i].name
            ? fileName[fileName.length - 1]
            : "file";
          try {
            files[i].extension = extension || "file";
            files[i].thumb = getThumb(extension);
            filteredFiles.push(files[i]);
            large = false;
            notSupported = false;
          } catch (e) {
            console.error("error", e);
          }
        }

        if (props.convertMB(files[i].size) > limit) {
          ++count;
          large = true;
        } else if(props.convertMB(files[i].size) == 0) {
          Toast("file does not contain any data!","error");
          close_dialog("attachedFile");
          return;
        }
      }

      if (notSupported) {
        // open_dialog("loading", {
        //   wraning: true,
        //   label: "Unsupported document format!",
        // });
        open_dialog("successOnly", {
          wraning: true,
          label: "Unsupported document format!",
        });
      } else {
        fileUploadingActiv(filteredFiles, "doc");
      }
    }
  };

  return (
    <div className={`btmModal ${userType == 1 ? "pt-4 pb-2 px-4" : "p-4"}`}>
      <div className="row chat-menu-drawer">
        <div className='col-4 attached__item mb-2 cursorPtr'>
          <input
            type="file"
            accept=".png, .jpg, .jpeg ,.jfif, .webp, .gif"
            ref={file}
            multiple={true}
            className="form-input"
            style={{ display: "none" }}
            onChange={fileSelect}
          />
          <div onClick={fileSelectDialog}>
            <Icon
              icon={`${CHAT_GALLERY}#chat_gallery`}
              size={40}
              viewBox="0 0 60 60"
            />
          </div>
          <p className={`m-0 fntSz14 font-weight-500 dv_appTxtClr mb-2 mt-1 `}>{lang.image}</p>
        </div>

        <div className='col-4 attached__item mb-2 cursorPtr'>
          <input
            type="file"
            // accept=".mov,.mp4,.ogg,.vid,.wmv,.webm"
            accept="video/*"
            ref={video}
            multiple={true}
            className="form-input"
            style={{ display: "none" }}
            onChange={videoSelect}
          />
          <div onClick={videoSelectDialog}>
            <Icon
              icon={`${CHAT_VIDEO}#chat_video`}
              size={40}
              // color={palette.l_base}
              viewBox="0 0 60 60"
            />
          </div>
          <p className="m-0 fntSz14 font-weight-500 dv_appTxtClr mb-2 mt-1">{lang.video}</p>
        </div>
        <div className='col-4 attached__item mb-2 cursorPtr'>
          <input
            type="file"
            accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
            ref={doc}
            multiple={true}
            className="form-input"
            style={{ display: "none" }}
            onChange={documentShare}
          />
          <div onClick={docSelectDialog}>
            <Icon
              icon={`${CHAT_DOCUMENT}#chat_documnet`}
              size={40}
              // color={palette.l_base}
              viewBox="0 0 60 60"
            />
          </div>
          <p className={`m-0 fntSz14 font-weight-500 dv_appTxtClr mb-2 mt-1 ${userType == 1 ? "d-flex justify-content-center" : ""}`}>{lang.documents}</p>
        </div>

        {userType == 2 && <div className='col-4 text-center mb-2 cursorPtr'>
          <div onClick={handleLockedPost}>
            <Icon
              icon={`${LOCKED_ICON}#lock`}
              size={40}
              // color={palette.l_base}
              viewBox="0 0 60 60"
            />
          </div>
          <p className="m-0 fntSz14 font-weight-500 dv_appTxtClr my-1">{lang.uploadLockedPost}</p>
        </div>
        }

      </div>


      <style jsx>{`
        .attached__item {
          text-align: center;
          margin: auto;
        }
      `}</style>
    </div>
  );
};
export default AttachedFile;
