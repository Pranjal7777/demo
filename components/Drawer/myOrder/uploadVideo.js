import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import Head from "next/head";
import useLang from "../../../hooks/language";
import { startLoader, stopLoader, Toast, close_dialog, close_drawer } from "../../../lib/global";
import { getCookiees } from "../../../lib/session";

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ClearIcon from '@material-ui/icons/Clear';
import CustButton from "../../button/button";
import Switch from '../../formControl/switch';
import Wrapper from '../../../hoc/Wrapper';
import { open_dialog } from '../../../lib/global/loader';
import { FOLDER_NAME_IMAGES } from '../../../lib/config/creds';
import { getFileType } from '../../../lib/helper';
const SelectMediaFrom = dynamic(() => import("../../post/SelectMediaFrom"), { ssr: false });
const SelectFromVault = dynamic(() => import("../../post/SelectFromVault"), { ssr: false });
const PostPlaceHolder = dynamic(() => import("../../post/PostPlaceHolder").then(module => module.PostPlaceHolder), { ssr: false });


function OrderConfirm(props) {
    const theme = useTheme()
    const [lang] = useLang();
    const { handleVideoUpload } = props
    const userId = getCookiees("uid");

    const [note, setNote] = useState('')
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedFolder, setSelectedFolder] = useState()
    const [showOnProfile,setShowOnProfile] = useState(props?.allowProfileView)

    const back = () => {
        close_drawer(
            "VideoUpload",
            {},
            "bottom"
        )
    }

    const uploadVdo = async () => {
        try {
            startLoader();
            const isImage = selectedFiles[0]?.type === "IMAGE"
            let thumb;
            var postImage = {
                seqId: 1,
                type: 2,
            };
            // Thumb Uploading
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
            const thumbUrl = postImage.thumbnail
            props.handleVideoUpload("COMPLETED", orderUrl, thumbUrl, note, showOnProfile, isImage);
        } catch (err) {
            console.error(err)
            stopLoader();
            Toast("ERROR IN uploadVdo", "error")
        }
    }

    const handleUploadVideo = () => {
        uploadVdo()
        close_drawer(
            "VideoUpload",
            {},
            "bottom"
        )
    }

    const handleNoteChange = (e) => {
        setNote(e.target.value)
    }

    const handleBtn = () => {
        if (selectedFiles.length > 0 && note) {
            return true
        } else {
            return false
        }
    }
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
            isTransForm: true
        })
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
        <>
            <Head>
                <script
                    defer={true}
                    src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
                />
            </Head>
            <div>
                {currentStep == 1 ? <div className='p-3 py-4'>
                                <div className='w-100 d-flex justify-content-between'>
                                    <div onClick={back}>
                                        <ClearIcon style={{ color: `${theme?.text}` }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '4.7vw', fontWeight: '600', color: `${theme?.text}` }}>{lang.uploadMedia}</p>
                                    </div>
                                    <div></div>
                                </div>
                                <div className='mb-5 text-center'>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '10px', marginTop: '20px', marginBottom: '20px' }}>
                            <PostPlaceHolder isEdit showTitle={false} isSingle setFiles={setSelectedFiles} handleRemoveFile={handleRemoveFile} onClick={() => setCurrentStep(2)} files={selectedFiles} />

                        </div>
                                    <TextareaAutosize
                                        style={{ width: '100%', border: 'none', borderBottom: '1px solid #323448', outline: 'none', paddingLeft: "7px", background: `${theme?.background}`, color: `${theme?.text}` }}
                                        aria-label="minimum height"
                                        rowsMin={1}
                                        placeholder="Say Something..."
                                        value={note}
                                        onChange={handleNoteChange}
                                    />
                                    {props?.allowProfileView && <div className="col-12 px-0 d-flex py-2 justify-content-between">
                                        <div className={`pr-4 ${theme.type === "dark" ? "text-white" : ""}`}>{lang.showOnProfile}</div>
                                         <Switch isShoutout={true} onChange={(val)=>setShowOnProfile(val.value)} checked={showOnProfile} />
                                    </div>}
                                </div>
                                <div className="col-12 d-flex justify-content-center">
                                    <CustButton
                                        type="submit"
                                        style={{ position: "fixed", width: '85%', textAlign: 'center', margin: 'auto', bottom: '10px' }}
                                        onClick={handleUploadVideo}
                                        cssStyles={theme.blueButton}
                                        isDisabled={!handleBtn()}
                                    >
                                        {lang.done}
                                    </CustButton>
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

            </div>
        </>
    )
}

export default OrderConfirm;
