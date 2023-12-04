import React, { useState } from "react";
import Wrapper from "../../../hoc/Wrapper";
import Head from "next/head";
import CloseIcon from "@material-ui/icons/Close";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { color4 } from "../../../lib/config";
import Switch from "../../../components/formControl/switch";
import { withStyles } from "@material-ui/core/styles";
import {
  close_dialog,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import { getCookie } from "../../../lib/session";
import useLang from "../../../hooks/language";
import { FOLDER_NAME_IMAGES } from "../../../lib/config"
import SelectFromVault from "../../../components/post/SelectFromVault"
import SelectMediaFrom from "../../../components/post/SelectMediaFrom";
import { PostPlaceHolder } from "../../../components/post/PostPlaceHolder";
import { getFileType } from "../../../lib/helper";
const Button = dynamic(() => import("../../../components/button/button"), {
  ssr: false,
});

const style = () => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#c0c0c0",
    transform: "translate(-50%, -50%)",
    fontSize: "50px",
  },
});

const OrderVideoShotOut = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const [notes, setNotes] = useState("");
  const userId = getCookie("uid");
  const [showOnProfile,setShowOnProfile] = useState(props?.allowProfileView)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedFolder, setSelectedFolder] = useState()

  const handleSelectFromVault = (vdata) => {
    setSelectedFolder(vdata);
  }
  const handleUploadSuccess = (files) => {
    const allFiles = [{
      seqId: 1,
      preview: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].preview,
      id: files[0].id,
      thumb: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].meta.key,
      type: getFileType(files[0].data),
      file: files[0].meta.key,
    }]
    setSelectedFiles(allFiles);
    close_dialog("S3Uploader");
    setCurrentStep(1);
  }
  const handleBeforUpload = (files, startUpload) => {
    startUpload(files)
  }
  const SelectType = () => {
    open_dialog("S3Uploader", {
      autoProceed: false,
      showUploadButton: true,
      targetId: 'ShoutOut',
      // fileTypes: ['video/*'],
      handleClose: function () { close_dialog("S3Uploader") },
      open: true,
      folder: `${userId}/${FOLDER_NAME_IMAGES.shoutOut}`,
      successCallback: (files) => handleUploadSuccess(files),
      // removeFile: removeFile,
      theme: theme.type,
      limit: 1,
      beforeUpload: (files, startUpload) => handleBeforUpload(files, startUpload),
      isTransForm: false
    })
  };
  const uploadSelectedVideo = () => {
    uploadVdo();
    props.onClose();
  };

  const uploadVdo = async () => {
    try {
      startLoader();
      const isImage = selectedFiles[0]?.type === "IMAGE"
      let thumb;
      var postImage = {
        seqId: 1,
        type: 2,
      };

      if (isImage) {
        thumb = selectedFiles[0]?.file
        postImage["thumbnail"] = thumb;
        postImage["url"] = thumb;
      }
      else {
        let url = selectedFiles[0]?.file
        // Uploading Video To AWS
        // Thumb Uploading
        thumb = selectedFiles[0]?.thumb || selectedFiles[0]?.preview
        postImage["thumbnail"] = thumb;
        postImage["url"] = url
      }
      stopLoader();
      const orderUrl = postImage.url;
      const thumbUrl = postImage.thumbnail;
      props.handleVideoUpload("COMPLETED", orderUrl, thumbUrl, notes, showOnProfile, isImage);
    } catch (err) {
      Toast("ERROR IN uploadVdo", "error");
      stopLoader();
    }
  };
  const handleBtnValidation = () => {
    if (selectedFiles.length > 0 && notes) {
      return true;
    } else {
      return false;
    }
  };
  const handleSelectFrom = (type) => {
    if (type === 1) {
      SelectType()
    } else {
      setCurrentStep(3)
    }
  }
  const handleFileSelectVault = (filesArr, isClose) => {

    let allFiles = [...filesArr].map((f, index) => {
      return {
        ...f,
        seqId: index + 1
      }
    })
    setSelectedFiles([...allFiles])
    if (isClose) {
      setCurrentStep(1)
    }

  }
  const handleRemoveFile = (id) => {
    const currentFile = selectedFiles.find(f => f.id === id);
    const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
    if (currentFile) {
      const allFiles = [...selectedFiles]
      allFiles.splice(currentFileIndex, 1)
      setSelectedFiles([...allFiles])
      // setRemoveFile(id)
    }
  }
  return (
    <Wrapper>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      {currentStep === 1 ? <div className="p-3">
        <div
          className="row pb-2 position-relative "
          style={{ borderBottom: "1px solid #00000029" }}
        >
          <div
            className="col-auto position-absolute cursorPtr pr-0"
            onClick={() => props.onClose()}
            style={{ zIndex: "99" }}
          >
            <CloseIcon style={{ color: theme?.text }} />
          </div>
          <p className="col text-center appTextColor fntWeight600 fntSz20 pl-0 m-0">{lang.videoUpload}</p>
        </div>
        <div className="d-flex justify-content-center pb-3">
          <div className="mt-3 position-relative h-100 videoINpCss ">
                <div className="d-flex justify-content-center">
              <div className="position-relative iconWidth">
                    <PostPlaceHolder isEdit showTitle={false} isSingle setFiles={setSelectedFiles} handleRemoveFile={handleRemoveFile} onClick={() => setCurrentStep(2)} files={selectedFiles} />
                </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mx-auto col-10">
          <textarea
            className="p-3 m-0 videoInfoCss mb-3"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ background: theme.sectionBackground, color: theme?.text }}
            placeholder="Say Something..."
            required={true}
          />
          {props?.allowProfileView && <div className="d-flex px-0 align-items-center justify-content-between">
            <p style={{ color: "#666666" }}>{lang.showOnProfile}</p>
            <Switch isShoutout={true} onChange={(val)=>setShowOnProfile(val.value)} checked={showOnProfile} />
          </div>}
          <Button
            type="button"
            cssStyles={theme.dv_blueButton}
            onClick={uploadSelectedVideo}
            isDisabled={!handleBtnValidation()}
          >
            {lang.done}
          </Button>
        </div>
      </div> : ""}
      {currentStep === 3 ? <SelectFromVault
        isSingle
        removePostFile={handleRemoveFile}
        selectedFiles={selectedFiles.filter(f => f.mediaContentId)}
        handleSelectFiles={handleFileSelectVault}
        selectedFolder={selectedFolder}
        uploadFromDevice={() => { }}
        handleSelect={handleSelectFromVault}
        onClose={() => { setCurrentStep(1); }}
      /> : ""}
      {
        currentStep === 2 ? (<SelectMediaFrom handleSelect={handleSelectFrom} onClose={() => { setCurrentStep(1); }} />) : ""
      }
      <style jsx>{`
        .videoInfoCss {
          background: ${color4};
          border-radius: 10px;
        }

        .videoINpCss {
          width: 130px;
          height: 130px;
        }

        .inputFileTagCss {
          top: 0;
          left: 0;
          opacity: 0;
        }
        :global(.iconWidth > .MuiSvgIcon-root){
          width:3em !important;
          height:3em !important;
         }
      `}</style>
    </Wrapper>
  );
};

export default withStyles(style)(OrderVideoShotOut);
