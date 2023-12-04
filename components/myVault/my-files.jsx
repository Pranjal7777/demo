import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import VaultHeader from '../header/vaultHeader';
import Image from '../image/image';
import FileFilterMenu from '../Drawer/myOrder/menu_items';
import Button from '../button/button';
import Checkbox from '../formControl/checkBox';
import { ADD_FILE_LOGO } from '../../lib/config/placeholder';
import useVault from '../../containers/customHooks/useVault';
import isMobile from '../../hooks/isMobile';
import Icon from '../image/icon';
import { IMAGE_TYPE, videoPlay_icon } from '../../lib/config';
import { open_dialog, open_drawer, startLoader, stopLoader } from '../../lib/global/loader';
import { useRef } from 'react';
import useLang from '../../hooks/language';
import Script from 'next/script';
import { useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { dateformatter } from '../../lib/date-operation/date-operation';
import useDetectHeaderHight from '../../hooks/detectHeader-hight';
import PaginationIndicator from '../pagination/paginationIndicator';
import { getCookie } from '../../lib/session';
import CustomDataLoader from '../loader/custom-data-loading';
import FilterListIcon from "@material-ui/icons/FilterList";
const S3Upload = dynamic(() => import('../FileUploadS3/S3Upload'), { ssr: false })
import { FOLDER_NAME_IMAGES, isAgency } from '../../lib/config/creds';
import { useTheme } from 'react-jss';
import dynamic from 'next/dynamic';
import { getVaultFolderDetailsById } from '../../services/myvault';
import FilterOption from '../filterOption/filterOption';
import { NoFolders } from './NoFolders';
import { carouselPaginationSubject } from '../../lib/rxSubject';



const MyFilesPage = (props) => {
    const [lang] = useLang();
    const [mobileView] = isMobile();
    const router = useRouter();
    const scrolledPositionRef = useRef(0);
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const { id, type } = router?.query;
    const {
        fileList,
        folderName,
        totalCount,
        pageCount,
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
        setLoader,
        setActiveBtn,
        setPageCount,
        setFileList,
        handleManageFiles,
        handleSelectedFilter,
        handleCheckboxChange,
        handleMoveDelete,
        handleImageChange,
        getMediaFilesDetails,
        handleRenameFolder,
        handleDeleteFolder,
        handleMediaUpload,
        setOpenFileInput,
        handleBeforeUpload,
        setUpdate,
        handleFilterOpen
    } = useVault({ id, type });
    const uid = getCookie("uid");
    const fileSelect = useRef(null);
    const [timeGroup, setTimeGroup] = useState([]);
    const [currentFolderDetail, setCurrentFolderDetail] = useState({})
    const theme = useTheme()
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);


    useDetectHeaderHight("vaultMediaHeader", "vaultMedia");

    useEffect(() => {
        setLoader(true)
        setFileList([])
        setTimeGroup([])
        setPageCount(0);
        getMediaFilesDetails({ id, type }, 0, () => {
            setLoader(false)
        },)
    }, [activeBtn, updateData], id);

    useEffect(() => {
        let tempArray = [];
        const currIndex = 0;
        const tempFileList = fileList || [];
        tempFileList?.forEach((data, index) => {
            if (index == 0) {
                tempArray[currIndex] = [data]
            } else {
                const prevDate = new Date(tempFileList[index - 1].creationTs).getDate();
                const currDate = new Date(tempFileList[index].creationTs).getDate();
                if (currDate == prevDate) {
                    tempArray[currIndex].push(data)
                } else {
                    currIndex++;
                    tempArray[currIndex] = [data]
                }
            }
        })
        setTimeGroup(tempArray)
    }, [fileList, activeBtn])

    const SelectType = (id) => {
        handleMediaUpload(id)
        setOpenFileInput(true)
    };

    const paginationCallback = (pCount) => {
        startLoader()
        if ((totalCount?.[activeBtn?.toLocaleLowerCase()] || 0) !== fileList?.length && !loader) {
            setLoader(true);
            getMediaFilesDetails({ id, type }, pCount, (filedata = []) => {
                setLoader(false)
                stopLoader()
                if (filedata && filedata?.length > 0) {
                    carouselPaginationSubject.next({ pageCount: pCount + 1, data: [...filedata], replace: true, hasMore: (totalCount?.[activeBtn?.toLocaleLowerCase()] || 0) !== filedata?.length })
                }
            }, selectedFilter);
        }
    }

    const handleOpenMedia = (e, index, id) => {
        open_drawer("openMediaCarousel", {
            assets: fileList,
            selectedMediaIndex: index,
            scrolledPositionRef: scrolledPositionRef,
            selectedMediaId: id,
            paginationCallback: paginationCallback
        }, "right")
    }

    const getVaultFolderDetail = async () => {
        if (!router.query.id) return
        const payload = {
            offset: 0,
            limit: 10,
            id: router.query.id
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        try {
            const folderDetail = await getVaultFolderDetailsById(payload)
            setCurrentFolderDetail(folderDetail.data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getVaultFolderDetail()
    }, [])



    return (
        <>
            <Script
                defer={true}
                src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
            />
            <div>
                <div className="">
                    <VaultHeader
                        title={folderName}
                        count={totalCount?.all || "0"}
                        folderId={id}
                        trigger={type}
                        handleManageFiles={handleManageFiles}
                        handleMoveDelete={handleMoveDelete}
                        handleRenameFolder={handleRenameFolder}
                        handleDeleteFolder={handleDeleteFolder}
                        dataMoving={dataMoving}
                        moveFileData={moveFileData}
                        dataMovedMsg={dataMovedMsg}
                        postId={selectPostId}
                        folderDetail={currentFolderDetail}
                        getVaultFolderDetail={getVaultFolderDetail}
                        isDefault={type !== 'CUSTOM'}
                        {...props} />
                </div>
                <div id="notificationBody" className={`px-2 px-sm-3 pb-3 ${moveFileData && "pt-3"} overflow-auto scroll-hide`} style={{ maxHeight: "calc(calc(var(--vhCustom, 1vh) * 100) - 74px)", overflow: 'auto' }}>
                    {!moveFileData && <div className='d-flex justify-content-between align-items-center px-1 pb-3'>
                        <div className='d-flex flex-row overflow-auto scroll-hide' >
                            <div className='mr-2'>
                                <Button
                                    type="button"
                                    fclassname={`rounded-pill text-nowrap py-2 ${activeBtn === "ALL" ? "btnGradient_bg" : "background_none borderStroke"}`}
                                    onClick={() => setActiveBtn("ALL")}
                                    children={`All (${totalCount?.all || "0"})`}
                                />
                            </div>
                            <div className='mr-2'>
                                <Button
                                    type="button"
                                    fclassname={`rounded-pill text-nowrap py-2 ${activeBtn === "IMAGE" ? "btnGradient_bg" : "background_none borderStroke"}`}
                                    onClick={() => setActiveBtn("IMAGE")}
                                    children={`Photos (${totalCount?.image || "0"})`}
                                />
                            </div>
                            <div className='mr-2'>
                                <Button
                                    type="button"
                                    fclassname={`rounded-pill text-nowrap py-2 ${activeBtn === "VIDEO" ? "btnGradient_bg" : "background_none borderStroke"}`}
                                    onClick={() => setActiveBtn("VIDEO")}
                                    children={`Videos (${totalCount?.video || "0"})`}
                                />
                            </div>
                        </div>
                        <div className='position-relative'>
                            <FilterOption setSelectedValue={(value) => handleSelectedFilter(value)} filterList={filterOption} leftFilterShow />
                            {/* <div className='cursorPtr' onClick={() => handleFilterOpen(!filterOpen)}>
                                <FilterListIcon color={theme.sectionBackground} />
                            </div>
                            {filterOpen && <div className="vh-100 position-fixed dropdown_backdrop" onClick={() => handleFilterOpen(false)}></div>}
                            {
                                filterOpen ? <div className={`position-absolute`} style={{ right: '0px', top: '2rem', zIndex: '999' }}>
                                    <ul className="dropdown_list_box text-center specific_section_bg borderStroke">
                                        {
                                            filterOption.map((foption) => {
                                                return (
                                                    <li className={`${selectedFilter === foption.label ? "active" : ""} border-0`}
                                                        onClick={() => { handleSelectedFilter(foption); handleFilterOpen(false) }}>
                                                        {foption.label}
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div> : ""
                            } */}
                            {/* <FileFilterMenu filterOption={filterOption} handleSelectedFilter={handleSelectedFilter} selectedFilter={selectedFilter} /> */}
                        </div>
                    </div>}
                    <div className='row mx-0'>
                        {
                            type == "CUSTOM" || type == "ALL" ? <div className='col-3 col-md-3 padding_5'>
                                <div className='files_cover_img_box files_cover_img_box2 d-flex flex-column justify-content-center align-items-center specific_section_bg cursorPtr' onClick={() => SelectType(id)} id='uploadFile'>
                                    <Image
                                        src={ADD_FILE_LOGO}
                                        width={mobileView ? 30 : 50}
                                        height={mobileView ? 30 : 50}
                                    />
                                </div>
                                <S3Upload
                                    targetId={'vault-upload'}
                                    triggerId={'uploadFile'}
                                    handleClose={() => setOpenFileInput(false)}
                                    open={openFileInput}
                                    folder={`${(id !== "" && id) ? id : `${uid}_${type}`}/${FOLDER_NAME_IMAGES.vaultMedia}`}
                                    successCallback={() => { setUpdate(Math.random()); setOpenFileInput(false) }}
                                    theme={theme.type}
                                    beforeUpload={(files, startUpload) => handleBeforeUpload(files, startUpload, { id, type })}
                                    showUploadButton={true}
                                />
                                <input
                                    type="file"
                                    className='d-none'
                                    multiple
                                    accept=".mp4,.avi,.mov,.wmv,.jpg,.jpeg,.png,.gif"
                                    ref={fileSelect}
                                    onChange={(e) => {
                                        handleImageChange(e, id, "VIDEO")
                                    }}
                                />
                            </div> : ""
                        }
                    </div>
                    {
                        !loader && !timeGroup.length ? <NoFolders title={lang.noMediaFiles} height={'200px'} /> : <div>
                            {timeGroup.map((tData, tIndex) => {
                                const timeLine = dateformatter(tData[0].creationTs)
                                return (
                                    <div key={`tData_${tIndex}`}>
                                        <h5 className='timeLine'>
                                            {timeLine}
                                        </h5>
                                        <div className='row mx-0'>
                                            {tData?.map((data, index) => {
                                                return (
                                                    <div key={data?._id} className='col-3 col-md-3 padding_6'>
                                                        <div className='files_cover_img_box cursorPtr' onClick={(e) => handleOpenMedia(e, fileList.findIndex(f => f._id === data?._id), data._id)}>
                                                            {data?.mediaType === "VIDEO" ? <div className='position-relative w-100 h-100 video_section'>
                                                                <div className='video_play_icon'>
                                                                    <Icon
                                                                        icon={videoPlay_icon + "#videoPlayIcon"}
                                                                        width={mobileView ? 32 : 40}
                                                                        height={mobileView ? 32 : 40}
                                                                        viewBox="0 0 70.311 70.313"
                                                                    />
                                                                </div>
                                                                <Image
                                                                    src={s3ImageLinkGen(S3_IMG_LINK, data?.mediaThumbnailUrl, 70, 120, 120)}
                                                                    width="100%"
                                                                    height='100%'
                                                                    style={{ objectFit: "cover", filter: "brightness(0.8)" }}
                                                                />
                                                            </div> : <Image
                                                                src={s3ImageLinkGen(S3_IMG_LINK, data?.mediaUrl, 80, 120, 120)}
                                                                width="100%"
                                                                height='100%'
                                                                style={{ objectFit: "cover" }}
                                                            />}
                                                        </div>
                                                        {moveFileData && <div className='checkBox_section'>
                                                            <Checkbox checked={false} onChange={(e, value) => handleCheckboxChange(e, data?.mediaContentId)} />
                                                        </div>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }


                    <div className='text-center p-3 d-flex justify-content-center'>
                        <CustomDataLoader loading={loader} />
                    </div>


                    <div className='response_data_status'>
                        {mobileView && dataMoving && <div className='px-4 py-2 rounded-pill text-center white' style={{ background: "linear-gradient(90deg, #FE70A5 0%, #D33AFC 100%)" }}>Copying...</div>}
                        {mobileView && dataMovedMsg && <div className='px-4 py-2 rounded-pill text-center white' style={{ background: dataMoving === "success" ? "#531C62" : "#1C6234" }}>{dataMovedMsg === "success" ? "Copied Successfully!" : "Something went Wrong!"}</div>}
                    </div>
                    <PaginationIndicator
                        id="notificationBody"
                        totalData={fileList}
                        totalCount={totalCount?.[activeBtn?.toLocaleLowerCase()]}
                        pageEventHandler={() => {
                            console.log(loader)

                            if ((totalCount?.[activeBtn?.toLocaleLowerCase()] || 0) !== fileList?.length && !loader) {
                                setLoader(true);
                                getMediaFilesDetails({ id, type }, pageCount, () => {
                                    setLoader(false)
                                }, selectedFilter);
                            }
                        }}
                    />
                </div>
            </div>
            <style jsx>{`
                .padding_5{
                    padding: 5px;
                }
                .padding_6{
                    padding: ${mobileView ? '4px' : '6px'};
                }
                .marginTop_65{
                    margin-top: 65px;
                }
                .checkBox_section{
                    position: absolute;
                    z-index: 99;
                    top: 4%;
                    left: 9%;
                }
                .response_data_status{
                    position: absolute;
                    z-index: 999;
                    bottom: 2rem;
                    left: 0;
                    padding: 1rem;
                    width: 100%;
                }
                .video_play_icon{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                }
                .timeLine {
                    font-size: 18px;
                    font-weight: 400;
                    margin-top: 20px;
                    margin-bottom: 8px;
                }
                .dropdown_list_box{
                    border-radius: 13px;
                    width: max-content;
                    padding: 0px;
                  }
                  .dropdown_list_box li:last-child {
                    border-width: 0px !important;
                    border-bottom-left-radius: 13px;
                    border-bottom-right-radius: 13px
                  }
                  .dropdown_list_box li:first-child {
                    border-width: 0px !important;
                    border-top-left-radius: 13px;
                    border-top-right-radius: 13px
                  }
                  .dropdown_list_box li{
                    list-style: none;
                    padding: 14px 55px;
                    border-bottom:1.5px solid var(--l_border) !important;
                    letter-spacing: 0.49996px;
                    cursor: pointer;
                  }
                  .dropdown_list_box li:hover{
                    color: var(--l_base);
                  }
                  .dropdown_list_box li.active {
                    color: var(--l_base);
                    background: var(--l_app_bg2)
                  }
                  .dropdown_backdrop{
                    z-index: 1;
                    top: 0px;
                    right: 0px;
                    background: transparent;
                    width: 100vw;
                  }
                .files_cover_img_box {
                    height: 100% !important;
                    aspect-ratio: 1/1;
                }
                .files_cover_img_box2 {
                    height: ${mobileView ? '84px' : '11.533vw'} !important;
                    background-color:var(--l_sidebar_bg) !important;
                }
            `}</style>
        </>
    )
}

export default MyFilesPage