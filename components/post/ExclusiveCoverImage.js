import * as React from 'react';
import { PlusIcon } from './PlusIcon';
import S3Upload from '../FileUploadS3/S3Upload';
import { useTheme } from 'react-jss';
import { CROSS_ICON_POSTSLIDER, FOLDER_NAME_IMAGES } from '../../lib/config';
import { getCookie } from '../../lib/session';
import Image from 'next/image';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import isMobile from '../../hooks/isMobile';
import Icon from '../image/icon';
import { PostPlaceHolder } from './PostPlaceHolder';
import unionBy from 'lodash/unionBy';
import useLang from '../../hooks/language';

export const ExclusiveCoverImage = ({ title, selectedFile, setCoverStep, autoProceed = false, showUpload = true, fromDevice, setSelectedFile, isEdit, isSingle }) => {
    const [openFileInput, setOpenFileInput] = React.useState(false)
    const [removeFile, setRemoveFile] = React.useState()
    const [autoUpload, setAutoUpload] = React.useState(false)
    const userId = getCookie('uid');
    const theme = useTheme();
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    const onCoverSelect = () => {
        setCoverStep(1)
    }

    React.useEffect(() => {
        if (autoProceed) {
            setOpenFileInput(true)
            setAutoUpload(true)
        }
    }, [autoProceed])

    React.useEffect(() => {
        if (fromDevice) {
            setOpenFileInput(true)
        }
    }, [fromDevice])


    const handleSuccess = (files) => {
        const filesArr = files.map(file => {
            return {
                file: file.data,
                seqId: selectedFile.length + 1,
                type: file.meta.type,
                preview: file.meta.type === "VIDEO" ? file.meta.thumb : URL.createObjectURL(file.data),
                thumb: file.meta.type === "VIDEO" ? file.meta.thumb : null,
                id: file.id,
                url: file.meta.key
            }
        })
        let allFiles = [...unionBy(selectedFile, filesArr, 'id')].map((f, index) => {
            return {
                ...f,
                seqId: index + 1
            }
        })
        if (
            allFiles.length > 6
        ) {
            allFiles = allFiles.slice(0, 25)
            Toast("Maximum 6 media files are allowed")
        }
        setSelectedFile([...allFiles])
        setOpenFileInput(false)
        setCoverStep()
    }

    const handleBeforUpload = (files, startUpload) => {
        console.log(files, startUpload)
        startUpload(files);
    }

    const handleRemoveFile = (id) => {
        const currentFile = selectedFile.find(f => f.id === id);
        const currentFileIndex = selectedFile.findIndex(f => f.id === id);
        if (currentFile) {
            const allFiles = [...selectedFile]
            allFiles.splice(currentFileIndex, 1)
            setSelectedFile([...allFiles])
            setRemoveFile(id)
        }
    }

    const handleFileSelect = (files) => {
        const filesArr = files.map(file => {
            return {
                file: file.data,
                seqId: selectedFile.length + 1,
                type: file.meta.type,
                preview: file.meta.type === "VIDEO" ? file.meta.thumb : URL.createObjectURL(file.data),
                thumb: file.meta.type === "VIDEO" ? file.meta.thumb : null,
                id: file.id,
                url: file.meta.key
            }
        })
        let allFiles = [...unionBy(selectedFile, filesArr, 'id')].map((f, index) => {
            return {
                ...f,
                seqId: index + 1
            }
        })
        if (
            allFiles.length > 25
        ) {
            allFiles = allFiles.slice(0, 25)
            Toast("Maximum 25 media files are allowed")
        }
        setSelectedFile([...allFiles])
        setCoverStep()
    }

    return (
        <div className='coverImgae mb-3 mt-2 w-100'>
            <div style={{ zIndex: 9999 }}>
                <S3Upload
                    autoProceed={autoUpload}
                    showUploadButton={showUpload || false}
                    targetId={'coverImage'}
                    handleClose={() => { setOpenFileInput(false); setCoverStep(); }}
                    open={openFileInput}
                    folder={`${userId}/${FOLDER_NAME_IMAGES.post}`}
                    successCallback={handleSuccess}
                    removeFile={removeFile}
                    theme={theme.type}
                    beforeUpload={handleBeforUpload}
                    onAddFiles={handleFileSelect}
                />
            </div>
            <label className='postLabel'>{title || ''}</label>
            {
                isSingle ? <>{!selectedFile ? <PlusIcon handleOnClick={onCoverSelect} /> : <div className='cImage'>
                    <Image
                        src={s3ImageLinkGen(S3_IMG_LINK, selectedFile.meta.key, 60, 120, 120)}
                        height={mobileView ? 80 : 120}
                        width={mobileView ? 80 : 120}
                    />
                    {isEdit ? <div className='removeFile' onClick={() => handleRemoveFile(selectedFile.id)}>
                        <Icon
                            icon={`${CROSS_ICON_POSTSLIDER}#Group_133516`}
                            class="cursorPtr handleCross"
                            color="#000000"
                            size={mobileView ? 20 : 25}
                            style={{ opacity: 0.8 }}
                            viewBox="0 0 35 35"
                        />
                    </div> : ""}
                </div>}</> : <PostPlaceHolder showTitle={false} isEdit={isEdit} setFiles={setSelectedFile} handleRemoveFile={handleRemoveFile} onClick={() => setCoverStep(1)} files={selectedFile} />
            }
            <style jsx>
                {`
                  .cImage {
                    height: ${mobileView ? '80px' : '120px'};
                    width: ${mobileView ? '80px' : '120px'};
                    position: relative;
                    border-radius: 18px;
                    overflow: hidden;
                  }
                  .cImage .removeFile {
                    position: absolute;
                    bottom: ${mobileView ? '6px' : '12px'};
                    right: ${mobileView ? '6px' : '12px'};
                    z-index: 2;
                }
                `}
            </style>
        </div>
    );
};