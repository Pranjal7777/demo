import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import { close_dialog, close_drawer, open_dialog } from '../../lib/global/loader';
import { getCookiees } from '../../lib/session';
import { getFileType } from '../../lib/helper';
import { FOLDER_NAME_IMAGES } from '../../lib/config/creds';
import { useTheme } from 'react-jss';
const SelectMediaFrom = dynamic(() => import("../post/SelectMediaFrom"), { ssr: false });
const SelectFromVault = dynamic(() => import("../post/SelectFromVault"), { ssr: false });


const AttachVaultMedia = (props) => {
    const { isTransForm = true, fileTypeVideo = false, targetId = 'ShoutOut', folderName = 'shoutOut' } = props;
    const [currentStep, setCurrentStep] = useState(props?.currentStep || 2);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedFolder, setSelectedFolder] = useState()
    const userId = getCookiees("uid");
    const theme = useTheme()

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
        props?.selectedFiles && props?.selectedFiles([...allFiles])
        close_dialog("S3Uploader");
        close_drawer("S3Uploader");
        close_dialog("AttachVaultMedia")
        close_drawer("AttachVaultMedia")
    }
    const handleBeforUpload = (files, startUpload) => {
        startUpload(files)
    }
    const SelectType = () => {
        open_dialog("S3Uploader", {
            autoProceed: false,
            showUploadButton: true,
            targetId: targetId,
            fileTypes: props?.fileTypes || (fileTypeVideo ? ['video/*'] : ['image/*', 'video/*']),
            handleClose: function () { close_dialog("S3Uploader") },
            open: true,
            folder: `${userId}/${FOLDER_NAME_IMAGES[folderName]}`,
            successCallback: (files) => handleUploadSuccess(files),
            // removeFile: removeFile,
            theme: theme.type,
            limit: 1,
            beforeUpload: (files, startUpload) => handleBeforUpload(files, startUpload),
            isTransForm: isTransForm,
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
        props?.selectedFiles([...allFiles])
        if (isClose) {
            close_dialog("AttachVaultMedia")
            close_drawer("AttachVaultMedia")
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
            {currentStep === 3 &&
                <SelectFromVault
                    isSingle
                    removePostFile={handleRemoveFile}
                    selectedFiles={selectedFiles.filter(f => f.mediaContentId)}
                    handleSelectFiles={handleFileSelectVault}
                    selectedFolder={selectedFolder}
                    uploadFromDevice={() => { }}
                    handleSelect={handleSelectFromVault}
                    fileTypes={props?.fileTypeVideo}
                    onClose={() => { close_dialog("AttachVaultMedia"), close_drawer("AttachVaultMedia") }}
                />}

            {currentStep === 2 && (
                <SelectMediaFrom
                    handleSelect={handleSelectFrom}
                    onClose={() => { close_dialog("AttachVaultMedia"), close_drawer("AttachVaultMedia") }}
                />)
            }
        </>
    )
}

export default AttachVaultMedia