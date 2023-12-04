import { useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import { getCognitoToken } from '../../services/userCognitoAWS';
import { getFileType } from '../../lib/helper';
import { getCookie } from '../../lib/session';
import Dashboard from '@uppy/dashboard';
import ImageEditor from '@uppy/image-editor';
// import GoldenRetriever from '@uppy/golden-retriever';
import Compressor from '@uppy/compressor'
// import Transloadit from '@uppy/transloadit';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import '@uppy/progress-bar/dist/style.min.css'
import { useTheme } from 'react-jss';
import { getPresignedUrl } from '../../services/common';
import { generaeVideThumb } from '../../lib/image-video-operation';
import { startLoader, stopLoader } from '../../lib/global/loader';
import { FOLDER_NAME_IMAGES } from '../../lib/config';
import fileUploaderAWS, { addWaterMark } from '../../lib/UploadAWS/uploadAWS';
import imageCompression from 'browser-image-compression';

const useS3Upload = ({ limit, fileTypes, isTransForm, onUploadComplete, beforeUpload, folder, target, quality, open, watermark = true, autoOpenFileEditor = false }) => {
    const uppy = useRef(null);
    const [uppyRef, setUppyRef] = useState(false)
    const [tokenData, setTokenData] = useState()
    const [showButton, setShowButton] = useState(true)
    const theme = useTheme()
    const uId = getCookie('uid');
    const [generateThumb, setGenerateThumb] = useState(false);
    const [applyWatermark, setApplyWatermark] = useState(false);
    const [triggerUpload, setTriggerUpload] = useState(false);

    const handleStartUpload = (filesArr) => {

        setShowButton(false)
        setTriggerUpload(false)
        const notUsedFiles = uppy.current.getFiles().map((f) => {
            if (!filesArr.find(fr => fr.id === f.id)) {
                uppy.current.removeFile(f.id)
            }
            return f;
        })
        let idx = 0;
        filesArr.forEach((async (f, index) => {
            uppy.current.setFileMeta(f.id, { ...f.meta })
            idx = index
            let file = f;
            if (uppy.current.getFiles().filter(f => f.meta.type === "IMAGE").length > 0) {
                if (getFileType(file.data) === "IMAGE" && watermark) {
                    setApplyWatermark(true)
                    const wFile = await addWaterMark(file?.data, false, true)
                    const nFile = await imageCompression.getFilefromDataUrl(wFile)
                    uppy.current.setFileState(file.id, { data: nFile, })
                    uppy.current.setFileMeta(file.id, { isWaterMark: true });
                    if ((uppy.current.getFiles().filter(f => f.meta.type === "IMAGE").filter(f => !f?.meta?.isWaterMark).length === 0) && (idx === filesArr.length - 1)) {
                        setApplyWatermark(false)
                        setTriggerUpload(Date.now())
                    }
                } else {
                    setTriggerUpload(Date.now())
                }
            } else {
                setTriggerUpload(Date.now())
            }
        }))
    }

    useEffect(() => {
        if (triggerUpload) {
            uppy.current.upload()
            setTriggerUpload(false)
        }
    }, [triggerUpload])

    const handleUpload = async () => {
        await beforeUpload(uppy.current.getFiles(), (filesArr) => handleStartUpload(filesArr || uploadRef.getFiles()))
    }

    const getBucket = (type, tokenData, isTransForm) => {
        if (!isTransForm) {
            return tokenData.bucket
        }
        if (type === "IMAGE") {
            return tokenData.imageBucket
        } else if (type === "VIDEO") {
            return tokenData.videoBucket
        } else {
            return tokenData.imageBucket
        }
    }
    const getFolder = (type, tokenData) => {
        if (!isTransForm) {
            return tokenData.bucket
        }
        if (type === "IMAGE") {
            return folder
        } else if (type === "VIDEO") {
            return tokenData.videoFolder
        } else {
            return tokenData.videoFolder
        }
    }
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

    useEffect(async () => {
        if (!tokenData && open) {
            startLoader()
            const cognitoToken = await getCognitoToken();
            const ntokenData = cognitoToken?.data?.data;
            setTokenData(ntokenData)
            stopLoader()
        } else if (open && !uppy.current) {
            uppy.current = new Uppy({
                restrictions: {
                    allowedFileTypes: fileTypes || ['image/*', 'video/*', '.mov'],
                    maxNumberOfFiles: limit || 500
                },
                autoProceed: false,
                onBeforeFileAdded: (file, files) => {
                    const t = Date.now()
                    const newFile = { ...file }
                    newFile.meta.seqId = Object.keys(files).length + 1;
                    newFile.meta.key = `${getFolder(getFileType(file.data), tokenData)}/${uId || t}_${t}_${file.name}`
                    newFile.meta.folder = getFolder(getFileType(file.data), tokenData);
                    newFile.meta.name = `${uId || t}_${t}_${file.name}`;
                    newFile.meta.type = getFileType(file.data);
                    return newFile
                },
            })
                // .use(Transloadit, {
                //     assemblyOptions: {
                //         params: {
                //             auth: { key: '1b15c1cf9e8d4348aec11182124a69d4', expires: new Date(Date.now() + 600000).toISOString()},
                //             template_id: '56eecf82f2d143c481de32cc7282e740',
                //         },
                //         signature: 'generated-signature',
                //     },
                // })
                .use(Dashboard, {
                    inline: true,
                    hideUploadButton: true,
                    theme: theme.type,
                    target: `#${target}`,
                    proudlyDisplayPoweredByUppy: false,
                    autoOpenFileEditor: autoOpenFileEditor
                })
                .use(ImageEditor, { target: Dashboard })
                // .use(GoldenRetriever, { serviceWorker: true })
                .use(Compressor, { quality: quality || 0.7 })
                // .use(ThumbnailGenerator, {waitForThumbnailsBeforeUpload: true})
                .use(AwsS3, {
                    limit: 5, // Maximum number of files allowed to upload
                    timeout: 6000000, // Request timeout in milliseconds
                    getUploadParameters(file) {
                        const bucket = getBucket(getFileType(file.data), tokenData, isTransForm)
                        return getPresignedUrl({
                            "folder": file.meta.folder || getFolder(getFileType(file.data), tokenData),
                            "fileName": `${file.meta.name}`,
                            "bucket": bucket
                        }).then(res => {
                            return {
                                method: 'PUT',
                                url: res.data.data.presignUrl,
                                fields: []
                            }
                        })
                    },
                });
            uppy.current.on('file-editor:start', (file) => {
                setShowButton(false)
            });
            uppy.current.on('file-editor:complete', async(updatedFile) => {
                setShowButton(true)
                const compressedFile = await imageCompression(updatedFile.data, {
                    maxSizeMB: 0.6,
                    maxWidthOrHeight: 720,
                    useWebWorker: true,
                    fileType: updatedFile.data.type,
                });
                var previewImage = await imageCompression.getDataUrlFromFile(compressedFile)
                uppy.current.setFileState(updatedFile.id, { preview: previewImage, })
            });

            setUppyRef(uppy.current)
            uppy.current.on('complete', (result) => {
                const successfulUploads = result.successful;
                const uploadedFiles = successfulUploads.map((file) => ({
                    ...file
                }));
                if (uploadedFiles.length === uppy.current.getFiles().length) {
                    uppy.current.cancelAll()
                }
                onUploadComplete(uploadedFiles);
            });
            uppy.current.on('file-added', async (file) => {
                setShowButton(true)
                if (getFileType(file.data) === "VIDEO") {
                    // startLoader()
                    setGenerateThumb(true)
                    const fileUrl = URL.createObjectURL(file.data)
                    const video = document.createElement("video");
                    video.src = fileUrl;
                    await fileCallbackToPromise(video);
                    const thumbs = await generaeVideThumb(file.data, async () => {
                        // stopLoader();
                    }, video.videoWidth || 720, video.videoHeight || 1280, 1);
                    if (thumbs[0]) {
                        const videoUrl = typeof thumbs[0] != "undefined" && thumbs[0]
                        const thumbFolderName = `${uId}/${FOLDER_NAME_IMAGES.videoThumb}`;
                        const videoFile = await imageCompression.getFilefromDataUrl(videoUrl)
                        const compressedFile = await imageCompression(videoFile, {
                            maxSizeMB: 0.6,
                            maxWidthOrHeight: 720,
                            useWebWorker: true,
                            fileType: file.data.type,
                        });
                        const thumbUrl = await fileUploaderAWS(compressedFile, tokenData, `thumb_${Date.now()}.png`, false, thumbFolderName, true, null, null, true, false,);
                        uppy.current.setFileState(file.id, { preview: thumbs[0], })
                        uppy.current.setFileMeta(file.id, { thumb: thumbUrl });
                    }
                    if (uppy.current.getFiles().filter(f => f.meta.type === "VIDEO").filter(f => !f.meta.thumb).length === 0) {
                        // stopLoader()
                        setGenerateThumb(false)
                    }
                } else if (getFileType(file.data) === "IMAGE") {
                    // setApplyWatermark(true)
                    // const wFile = await addWaterMark(file?.data, false, true)
                    // const nFile = await imageCompression.getFilefromDataUrl(wFile)
                    // uppy.current.setFileState(file.id, { data: nFile, })
                    // uppy.current.setFileMeta(file.id, { isWaterMark: true });
                    // console.log("file with water mark", uppy.current.getFiles())
                    const compressedFile = await imageCompression(file.data, {
                        maxSizeMB: 0.6,
                        maxWidthOrHeight: 720,
                        useWebWorker: true,
                        fileType: file.data.type,
                    });
                    var previewImage = await imageCompression.getDataUrlFromFile(compressedFile)
                    uppy.current.setFileState(file.id, { preview: previewImage, })
                    // if (uppy.current.getFiles().filter(f => f.meta.type === "IMAGE").filter(f => !f?.meta?.isWaterMark).length === 0) {
                    //     // stopLoader()
                    //     setApplyWatermark(false)
                    // }
                }
            })
        } else if (open) {
            setShowButton(true)
        }

        return () => {
            uppy.current.close();
        };
    }, [tokenData, open]);

    return (
        {
            uploadRef: uppyRef ? uppy.current : undefined,
            showButton,
            handleUpload,
            generateThumb,
            applyWatermark
        }

    );
};

export default useS3Upload;