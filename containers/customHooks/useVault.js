import useLang from '../../hooks/language';
import { Toast, open_dialog, open_drawer, startLoader, stopLoader } from '../../lib/global/loader';
import isMobile from '../../hooks/isMobile';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addFolderDetails, addMediafiles, deleteFolderDetails, deleteMediaFiles, editFolderDetails, getDefaultVaultFolders, getMediaFiles, getMediaVaultDetails, moveMediafiles } from '../../services/myvault';
import { generaeVideThumb } from '../../lib/image-video-operation';
import { getCognitoToken } from '../../services/userCognitoAWS';
import fileUploaderAWS from '../../lib/UploadAWS/uploadAWS';
import { FOLDER_NAME_IMAGES, isAgency } from '../../lib/config/creds';
import useProfileData from '../../hooks/useProfileData';
import { getCookie, setCookie } from '../../lib/session';
import { getFileType } from '../../lib/helper';
import { useSelector } from 'react-redux';

const useVault = (props) => {
    const id = props?.id;
    const type = props?.type;
    const sharedTo = props?.sharedTo;
    const sharedType = props?.sharedType;
    const userId = getCookie('uid')
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const { profileData } = useProfileData();
    const router = useRouter();
    const [moveFolder, setMoveFolder] = useState(false);
    const [dataMoving, setDataMoving] = useState(false);
    const [dataMovedMsg, setDataMoveMsg] = useState("");
    const [moveFileData, setMoveFileData] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState();
    const [selectPostId, setSelectPostId] = useState({});
    const [folderList, setFolderList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [updateData, setUpdate] = useState(false);
    const [timeGroup, setTimeGroup] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState({});
    const [folderName, setFolderName] = useState(getCookie("vaultFolderName"));
    const [activeBtn, setActiveBtn] = useState("ALL");
    const [openFileInput, setOpenFileInput] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [loader, setLoader] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

    const filterOption = [
        { title: "NEWEST", value: "NEWEST" },
        { title: "OLDEST", value: "OLDEST" },
    ]

    // get folder details ----------------------------
    const handleFilterOpen = (v) => {
        setFilterOpen(!!v)
    }
    const getFolderDetails = async (limit = 10, offset = 0) => {
        setLoader(true)
        let payload = {
            offset: offset * limit,
            limit: limit,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        let payload2 = {}
        if (isAgency()) {
            payload2["userId"] = selectedCreatorId;
        }
        try {
            // let dres = [];
            let defaultList = []
            if (!offset) {
                const dres = await getDefaultVaultFolders(payload2)
                if (dres?.status === 200) {
                    defaultList = dres?.data?.data
                    defaultList = defaultList.map(d => {
                        return ({
                            ...d,
                            isDefault: true
                        })
                    });
                    const trashIndex = defaultList.findIndex(d => d.type == "TRASH")
                    const trashFolder = defaultList.find(d => d.type == "TRASH")
                    if (trashIndex !== -1) {
                        defaultList.splice(trashIndex, 1)
                        console.log(trashFolder);
                        defaultList.push(trashFolder)
                    }
                }
            }

            const res = await getMediaVaultDetails(payload)
            const newFolderList = res?.data?.data || []

            if (res.status === 200) {

                if (!offset) {
                    setFolderList([...defaultList, ...newFolderList])
                } else {
                    setFolderList((prev) => [...prev, ...newFolderList])

                }
                setLoader(false);
                setHasMore(true);
            } else if (res.status === 204) {
                setLoader(false);
                setHasMore(false);
                if (!offset) {
                    setFolderList([...defaultList])
                }
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
            setHasMore(false);
            Toast(error?.message, "error")
        }
    }

    const getMediaFilesDetails = async ({ id, type }, offset = "0", callback = () => { }, sortBy = "NEWEST") => {
        let payload = id ? {
            offset: offset * 10,
            limit: 10,
            vaultCollectionId: id,
            mediaType: activeBtn,
            sortBy: sortBy,
        } : {
            offset: offset * 10,
            limit: 10,
            mediaType: activeBtn,
            sortBy: sortBy,
            trigger: type,
        }
        if (isAgency()) {
            payload["creatorId"] = selectedCreatorId;
        }
        if (!!sharedTo) {
            payload.sharedTo = sharedTo
        }
        if (!!sharedType) {
            payload.sharedType = sharedType
        }

        try {
            const res = await getMediaFiles(payload)

            if (res.status === 200) {
                if (offset === 0) {
                    setFileList(() => {
                        callback([...res?.data?.data.mediaVault]);
                        return res?.data?.data.mediaVault
                    })
                } else {
                    setFileList((prev) => {
                        callback([...prev, ...res?.data?.data.mediaVault])
                        return [...prev, ...res?.data?.data.mediaVault];
                    })
                }
                const count = res?.data?.data?.count ? { ...res?.data?.data?.count } : undefined;
                if (count) {
                    if (activeBtn === "ALL") {
                        setTotalCount(res?.data?.data?.count)
                    } else if (activeBtn === "VIDEO") {
                        setTotalCount((prevCount) => {
                            return ({
                                ...prevCount,
                                video: count.video
                            })
                        })
                    } else if (activeBtn === "IMAGE") {
                        setTotalCount((prevCount) => {
                            return ({
                                ...prevCount,
                                image: count.image
                            })
                        })
                    }
                }

                setPageCount(offset + 1)
                if (mobileView && count?.all > 10 && offset < 1) {
                    getMediaFilesDetails({ id, type }, offset + 1, callback = () => {
                        setLoader(false);
                    }, sortBy)
                }
            } else if (res?.status === 204) {
                setFileList((prev) => {
                    callback(prev);
                    return [...prev]
                });
            }

        } catch (error) {
            console.log(error);
            Toast(error?.message, "error")
            callback()
        }
    }


    const handleSortBy = (sortBy) => {
        setLoader(true)
        setFileList([])
        setTimeGroup([])
        setPageCount(0);
        getMediaFilesDetails({ id, type }, 0, () => {
            setLoader(false)
        }, sortBy)
    }
    useEffect(() => {
        if (selectedFilter && ['NEWEST', 'OLDEST'].includes(selectedFilter) && (id || type)) {
            handleSortBy(selectedFilter)
        } else if (selectedFilter === 0) {
            handleSortBy("NEWEST")
        }
    }, [selectedFilter])

    const handleMoveFolder = async (data) => {
        const id = Object.keys(selectPostId)
        let payload = {
            mediaContentsIds: id,
            vaultCollectionId: data[0],
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        try {
            const res = await moveMediafiles(payload)

        } catch (error) {
            console.log(error);
            Toast(error?.message, "error")
        }
        setDataMoving(true)
        setTimeout(() => {
            setDataMoving(false)
            setDataMoveMsg("success");
            setTimeout(() => {
                setDataMoveMsg("")
            }, 1000);
        }, 1500)
    }


    // Create Folder -----------------------------

    const handleCreateFolder = () => {
        mobileView ? open_drawer("renameFiles",
            {
                titleName: lang.createFolder,
                submitBtn: lang.create,
                imageInput: true,
                mobile: true,
                handleName: (data) => CreateFileHandler(data)
            }, "bottom") :
            open_dialog("renameFiles",
                {
                    titleName: lang.createFolder,
                    submitBtn: lang.create,
                    imageInput: true,
                    mobile: false,
                    handleName: (data) => CreateFileHandler(data),
                })
    }

    const CreateFileHandler = async (data) => {
        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const imgFileName = Date.now();
        const folderName = `users/${userId}/${FOLDER_NAME_IMAGES.vaultMedia}`;
        let url = ''
        if (data?.imageUrl) {
            url = await fileUploaderAWS(
                data?.imageUrl,
                tokenData,
                imgFileName,
                false,
                folderName,
                null, null, null, false
            );
        }
        startLoader();
        let addDetails = {
            title: data?.rename,
            coverImage: url || '/default-pic.png',
        }
        if (isAgency()) {
            addDetails["userId"] = selectedCreatorId
        }
        try {
            const res = await addFolderDetails(addDetails);
            if (res.status === 200) {
                setUpdate(Date.now())
                stopLoader();
                Toast("Successfully Created")
            }
        } catch (error) {
            console.log(error);
            stopLoader()
            Toast(error?.message, "error")
        }
    }

    // Rename Folder -----------------------

    const handleRenameFolder = (myFiles, id, folderDetail, successCallBack) => {
        mobileView ? open_drawer("renameFiles",
            {
                titleName: lang.renameCategory,
                submitBtn: lang.submit,
                filename: myFiles,
                imageInput: true,
                folderDetail: folderDetail,
                handleName: (data, isCoverImageChanged) => RenameFileHandler(data, id, isCoverImageChanged, successCallBack)
            },
            "bottom"
        ) : open_dialog("renameFiles",
            {
                titleName: lang.renameCategory,
                submitBtn: lang.submit,
                filename: myFiles,
                imageInput: true,
                folderDetail: folderDetail,
                handleName: (data, isCoverImageChanged) => RenameFileHandler(data, id, isCoverImageChanged, successCallBack)
            }
        )
    }

    const RenameFileHandler = async (data, id, isCoverImageChanged, successCallBack) => {
        let editDetails = {
            vaultCollectionId: id,
            title: data.rename,
        }

        if (isCoverImageChanged) {
            const cognitoToken = await getCognitoToken();
            const tokenData = cognitoToken?.data?.data;
            const imgFileName = Date.now();
            const folderName = `users/${userId}/${FOLDER_NAME_IMAGES.vaultMedia}`;
            let url = ''
            url = await fileUploaderAWS(
                data.imageUrl,
                tokenData,
                imgFileName,
                false,
                folderName,
                null, null, null, false
            );
            editDetails["coverImage"] = url || '/default-pic.png';
        }
        if (isAgency()) {
            editDetails["userId"] = selectedCreatorId;
        }
        startLoader();
        try {
            const res = await editFolderDetails(editDetails)
            if (res.status === 200) {
                setFolderName(data.rename);
                setCookie("vaultFolderName", data.rename)
                successCallBack?.()
                stopLoader()
                Toast("Edited Successfully!")
            }
        } catch (error) {
            console.log(error);
            stopLoader()
            Toast(error?.message, "error")
        }
    }

    // Delete Folder --------------------------------

    const handleDeleteFolder = (id) => {
        mobileView ? open_drawer("deleteFiles",
            {
                title: lang.category,
                subTitle: lang.folder,
                delete: () => DeleteFolderHandler(id)
            }, "bottom"
        ) : open_dialog("deleteFiles",
            {
                title: lang.folder,
                subTitle: lang.folder,
                cancelBtn: lang.cancel,
                delete: () => DeleteFolderHandler(id)
            }
        )
    }

    const DeleteFolderHandler = async (vaultId) => {
        let payload = {
            vaultCollectionIds: [
                vaultId
            ]
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        startLoader();
        try {
            const delRes = await deleteFolderDetails(payload);
            stopLoader();
            router.push("/my-vault")
            Toast("Successfully Deleted!")
        } catch (error) {
            console.log(error);
            stopLoader()
            Toast(error?.message, "error")

        }

    }



    const handleSelectedFilter = (value) => {
        setSelectedFilter(value)
    }

    const handleManageFiles = () => {
        handleManager()
    }

    const handleManager = async (props, data, id) => {
        await getFolderDetails();
        if (data === "moveFiles") {
            mobileView ? open_drawer("selectFiles", {
                currId: id,
                folderNameList: folderList,
                submitBtn: lang.copy,
                // cancelBtn:lang.cancel,
                handleName: (selectedOptions) => handleMoveFolder(selectedOptions)
            }, "bottom") :
                open_dialog("selectFiles", {
                    currId: id,
                    folderNameList: folderList,
                    submitBtn: lang.copy,
                    cancelBtn: lang.cancel,
                    handleName: (selectedOptions) => handleMoveFolder(selectedOptions)
                })
        } else if (data === "deleteFiles") {
            let deleteTextData = {
                title: lang.media,
                description: props.trigger === "ALL" ? lang.deletetextForAllType : props.trigger === "CUSTOM" ? lang.deletetextForCustomType : lang.deleteText,
                cancelBtn: lang.cancel,
                delete: () => DeleteFileHandler(props)
            }
            if (mobileView) {
                delete deleteTextData.cancelBtn
                open_drawer("deleteFiles",
                    deleteTextData,
                    "bottom"
                )
            } else {
                open_dialog("deleteFiles",
                    deleteTextData)
            }
        }
        setSelectPostId({});
        setMoveFileData(!moveFileData)
    }

    const handleMoveDelete = (props, data, id) => {
        if (Object.keys(props.postId).length) {
            handleManager(props, data, id);
            setMoveFileData(!moveFileData)
        } else if (data === "close") {
            handleManager;
            setMoveFileData(!moveFileData)
        }
    }

    const handleCheckboxChange = (e, data) => {
        e.stopPropagation();
        if (selectPostId[data]) {
            const prevPost = { ...selectPostId };
            delete prevPost[data];
            setSelectPostId(prevPost);
        }
        else {
            setSelectPostId((prevSelectPostId) => {
                return {
                    ...prevSelectPostId,
                    [data]: data,
                };
            })
        }
    }

    const DeleteFileHandler = async (props) => {
        let postId = Object.keys(props.postId)
        let payload = props.folderId ? {
            vaultCollectionId: props?.folderId,
            mediaContentsIds: postId,
        } : {
            trigger: props?.trigger,
            mediaContentsIds: postId,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        startLoader();
        try {
            const res = await deleteMediaFiles(payload);
            if (res.status === 200) {
                setUpdate(Date.now())
                stopLoader();
                Toast("Successfully Deleted!")
            }
        } catch (error) {
            console.log(error);
            stopLoader()
            Toast(error?.message, "error")

        }
    }

    // import files --------------------

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

    const handleMediaUpload = (id) => {
        setOpenFileInput(true)
    }

    const handleBeforeUpload = (filesArr, startUpload, { id, type }) => {
        return new Promise((resolve, reject) => {
            handleImageChange(filesArr, { id, type }, startUpload)
            resolve(true)
        })
    }

    const handleImageChange = async (filesArr, { id, type }, startUpload) => {

        if (!filesArr || ![...filesArr].length) {
            return
        }
        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const files = [...filesArr].map((f, index) => { return ({ file: f.data, seqId: index + 1, type: getFileType(f.data), fileName: f.meta.name, key: f.meta.key, thumb: f.meta.thumb }) });
        const selected = [];

        const handleFileUploaderAWSFunc = async (data) => {
            const videoSuccessCallback = () => {
                setUpdate(Date.now())
                stopLoader()
                Toast("Media Successfully Uploaded!")
            }
            try {
                const updatesList = [];
                const count = 1;
                stopLoader()
                for (let i = 0; i < files.length; i++) {
                    const fileName = files[i].type === "IMAGE" ? files[i].fileName : `${data.find(d => d.seqId == files[i].seqId).mediaContentId}_media_${files[i].seqId}.mp4`;

                    const uFile = { ...filesArr[i] }
                    uFile.meta.name = fileName
                    updatesList.push(uFile);
                    if (updatesList.length === files.length) {
                        startUpload(updatesList)
                    }
                    count++;
                }
            } catch (err) {
                console.error(err, 'in Posting Video API !!!');
            }
        }

        try {
            startLoader()
            const count = 1;
            async function fileUploadCallback(fileCount, payload) {
                console.log("upload callback")
                selected.push(payload);
                if (count === files.length) {
                    let payload = id ? {
                        mediaDetails: selected,
                        vaultCollectionId: id,
                    } : {
                        mediaDetails: selected,
                        trigger: type,
                    }
                    if (isAgency()) {
                        payload["userId"] = selectedCreatorId;
                    }
                    try {
                        startLoader()
                        const res = await addMediafiles(payload);
                        const resMedia = res?.data?.data
                        handleFileUploaderAWSFunc(resMedia)
                    } catch (e) {
                        stopLoader()
                        Toast("Something went wrong pleae try again", 'error')
                        console.log("erorr =>", e)
                    }
                } else {
                    count++;
                }
            }
            for (let i = 0; i < files.length; i++) {
                if (!files[i]) {
                    break;
                }
                const imageUrl = URL.createObjectURL(files[i].file)
                const imgFileName = files[i].fileName;
                const folderName = `${(id !== "" && id) ? id : `${userId}_${type}`}/${FOLDER_NAME_IMAGES.vaultMedia}`;
                let mediaDetails;
                if (files[i].type == "IMAGE") {

                    // stopLoader()
                    const j = i;
                    // const url = await fileUploaderAWS(
                    //     imageUrl,
                    //     tokenData,
                    //     imgFileName,
                    //     false,
                    //     folderName,
                    //     false,
                    //     true,
                    //     null,
                    //     true,
                    //     true,
                    //     files?.length,
                    //     count
                    // );
                    mediaDetails = {
                        seqId: files[j].seqId,
                        mediaType: files[j].type,
                        mediaUrl: `${folderName}/${files[j].fileName}`,
                        mediaThumbnailUrl: `${folderName}/${files[j].fileName}`,
                    }

                    fileUploadCallback(i, mediaDetails)
                }

                if (files[i].type === "VIDEO") {
                    try {
                        const k = i;
                        mediaDetails = {
                            seqId: files[k].seqId,
                            mediaType: files[k].type,
                            mediaThumbnailUrl: files[k].thumb,
                        }
                        fileUploadCallback(count, mediaDetails)

                    } catch (error) {
                        console.log(error);
                    }
                }

            }

        } catch (error) {
            console.log(error);
            stopLoader()
            Toast(error?.message, "error")
        }
    };

    return (
        {
            folderList,
            folderName,
            totalCount,
            pageCount,
            timeGroup,
            fileList,
            moveFolder,
            dataMoving,
            dataMovedMsg,
            moveFileData,
            selectedFilter,
            selectPostId,
            updateData,
            activeBtn,
            openFileInput,
            filterOpen,
            filterOption,
            loader,
            hasMore,
            setOpenFileInput,
            setActiveBtn,
            setPageCount,
            setFileList,
            getFolderDetails,
            handleManageFiles,
            handleCreateFolder,
            handleMoveDelete,
            handleSelectedFilter,
            handleCheckboxChange,
            handleRenameFolder,
            handleDeleteFolder,
            handleImageChange,
            getMediaFilesDetails,
            handleMediaUpload,
            handleBeforeUpload,
            setUpdate,
            handleFilterOpen,
            setLoader
        }
    )
}

export default useVault