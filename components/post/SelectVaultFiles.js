import * as React from 'react';
import useVault from '../../containers/customHooks/useVault';
import { getCookie } from '../../lib/session';
import { useTheme } from 'react-jss';
import { dateformatter } from '../../lib/date-operation/date-operation';
import { TICK, videoPlay_icon } from '../../lib/config';
import Image from '../image/image';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useRouter } from 'next/router';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import { useSelector } from 'react-redux';
import CustomDataLoader from '../loader/custom-data-loading';
import Icon from '../image/icon';
import Button from '../button/button';
import PaginationIndicator from '../pagination/paginationIndicator';
import { NoFolders } from '../../components/myVault/NoFolders';
import FilterOption from '../filterOption/filterOption';
import { open_drawer } from '../../lib/global/loader';

export const SelectVaultFiles = ({ isSingle, sharedTo, sharedType, handleSelectMedia = () => { }, handleRemoveFile, handleClose, currSelectedFiles = [], currFolder, ...props }) => {
    const [lang] = useLang();
    const [mobileView] = isMobile();
    const [selectedFiles, setSelectedFiles] = React.useState([...currSelectedFiles])
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const {
        fileList,
        totalCount,
        pageCount,
        selectedFilter,
        activeBtn,
        filterOpen,
        filterOption,
        loader,
        setActiveBtn,
        setPageCount,
        setFileList,
        handleSelectedFilter,
        handleFilterOpen,
        getMediaFilesDetails,
        setLoader,
    } = useVault({ id: currFolder._id, type: currFolder.type, sharedTo: sharedTo, sharedType: sharedType });
    const uid = getCookie("uid");
    const [timeGroup, setTimeGroup] = React.useState([]);
    const theme = useTheme()
    const scrolledPositionRef = React.useRef()

    React.useEffect(() => {
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
    }, [fileList])

    React.useEffect(() => {
        if (currFolder) {
            setLoader(true)
            setFileList([])
            setTimeGroup([])
            setPageCount(0);
            getMediaFilesDetails({ id: currFolder._id, type: currFolder.type }, 0, () => {
                setLoader(false)
            },)
        }
    }, [currFolder, activeBtn]);

    const handleFileClick = (fileData) => {
        console.log(fileData)
        const allFiles = [...selectedFiles]
        const isSelected = allFiles.findIndex(f => f.id === fileData._id)
        if (isSelected == -1) {
            if (isSingle) {
                allFiles = [{
                    seqId: allFiles.length + 1,
                    preview: fileData.mediaType === "IMAGE" ? fileData.mediaUrl : fileData.mediaThumbnailUrl,
                    id: `${fileData._id}`,
                    type: fileData.mediaType,
                    file: fileData.mediaUrl,
                    mediaContentId: fileData.mediaContentId,
                    folderId: currFolder._id,
                    folderType: currFolder.type
                }]
            } else {
                allFiles.push({
                    seqId: allFiles.length + 1,
                    preview: fileData.mediaType === "IMAGE" ? fileData.mediaUrl : fileData.mediaThumbnailUrl,
                    id: `${fileData._id}`,
                    type: fileData.mediaType,
                    file: fileData.mediaUrl,
                    mediaContentId: fileData.mediaContentId,
                    folderId: currFolder._id,
                    folderType: currFolder.type
                })
            }
        } else {
            allFiles.splice(isSelected, 1)
            handleRemoveFile(fileData._id)
        }
        setSelectedFiles(allFiles)
    }

    const handleOpenMedia = (e, index, id) => {
        open_drawer("openMediaCarousel", {
            assets: fileList,
            selectedMediaIndex: index,
            scrolledPositionRef: scrolledPositionRef,
            selectedMediaId: id
        }, "right")
    }

    const isFileSelected = (id) => {
        return !!selectedFiles.find(f => f.id === id)
    }

    return (
        <div className='clearfix' style={mobileView ? {} : {marginTop: "-25px"}}>
            <div className='d-flex w-100 justify-content-between align-items-center py-md-2 pt-4 position-relative'>
                <h3 className='title mainTitle'>{currFolder?.title}</h3>
                {mobileView ? "" : <FilterOption setSelectedValue={(value) => handleSelectedFilter(value)} filterList={filterOption} leftFilterShow />}
            </div>
            <div className={`${mobileView ? 'mobileFilterMenu py-3' : ''} d-flex flex-row overflow-auto scroll-hide`} >
                <div className={`mr-2 fItem ${activeBtn === "ALL" ? 'active' : ""}`}>
                    <Button
                        type="button"
                        fclassname={`rounded-pill text-nowrap font-weight-400 py-2 ${activeBtn === "ALL" ? "btnGradient_bg" : "background_none borderStroke"}`}
                        onClick={() => setActiveBtn("ALL")}
                        children={`All (${totalCount?.all || "0"})`}
                    />
                </div>
                <div className={`mr-2 fItem ${activeBtn === "IMAGE" ? 'active' : ""}`}>
                    <Button
                        type="button"
                        fclassname={`rounded-pill text-nowrap font-weight-400 py-2 ${activeBtn === "IMAGE" ? "btnGradient_bg" : "background_none borderStroke"}`}
                        onClick={() => setActiveBtn("IMAGE")}
                        children={`Photos (${totalCount?.image || "0"})`}
                    />
                </div>
                <div className={`mr-2 fItem ${activeBtn === "VIDEO" ? 'active' : ""}`}>
                    <Button
                        type="button"
                        fclassname={`rounded-pill text-nowrap font-weight-400 py-2 ${activeBtn === "VIDEO" ? "btnGradient_bg" : "background_none borderStroke"}`}
                        onClick={() => setActiveBtn("VIDEO")}
                        children={`Videos (${totalCount?.video || "0"})`}
                    />
                </div>
            </div>
            {mobileView ? <FilterOption setSelectedValue={(value) => handleSelectedFilter(value)} filterList={filterOption} leftFilterShow /> : ""}
            <div id='vaultFiles' className='py-5 py-md-0 overflowY-auto' style={{height: mobileView ? "calc(var(--vhCustom, 1vh) * 62)" : "calc(var(--vhCustom, 1vh) * 46)"}}>
                {
                    !loader && !timeGroup.length ? <NoFolders title={lang.noMediaFiles} height={'140px'} /> : <div>
                        {timeGroup.map((tData, tIndex) => {
                            const timeLine = dateformatter(tData[0].creationTs)
                            return (
                                <div>
                                    <p className='my-3'>
                                        {timeLine}
                                    </p>
                                    <div className='row mx-0'>
                                        {tData?.map((data, index) => {
                                            return (
                                                <div key={data?._id} className='col-3 col-md-3 p-1 position-relative cursorPtr' onClick={(e) => handleOpenMedia(e, fileList.findIndex(f => f._id === data?._id), data._id)}>
                                                    <div className='files_cover_img_box cursorPtr' >
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

                                                    <div className={isFileSelected(data._id) ? 'activeBorder selectedOverlay' : 'selectedOverlay'}>
                                                        <div className='tickIcon' onClick={(e) => { e.stopPropagation(); handleFileClick(data) }} style={{opacity: isFileSelected(data._id) ? 1 : 0.7 }}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="10" cy="10" r="10" fill={"rgba(255, 255,255, 0.8)"} />
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10ZM9.42933 14.28L15.1867 7.08267L14.1467 6.25067L9.23733 12.3853L5.76 9.488L4.90667 10.512L9.42933 14.2813V14.28Z" fill={isFileSelected(data._id) ? "#00B012" : 'var(--l_badge_light)'} />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {
                                                        data?.isShared ? <div className='shared d-flex justify-content-center align-items-center'>
                                                            <Icon
                                                                icon={`${TICK}#tick`}
                                                                color='#fff'
                                                                size={22}
                                                            />
                                                        </div> : ""
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <PaginationIndicator
                                        id={"vaultFiles"}
                                        totalData={fileList}
                                        totalCount={totalCount?.[activeBtn?.toLocaleLowerCase()]}
                                        pageEventHandler={() => {
                                            if (totalCount && (totalCount?.[activeBtn?.toLocaleLowerCase()] !== fileList?.length) && !loader) {
                                                setLoader(true);
                                                getMediaFilesDetails({ id: currFolder._id, type: currFolder.type }, pageCount, () => {
                                                    setLoader(false)
                                                }, selectedFilter);
                                            }
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                }

                <div className='text-center py-3 d-flex justify-content-center'>
                    <CustomDataLoader loading={loader} />
                </div>
            </div>

            <div className={mobileView ? 'd-flex justify-content-between mobileBtn' : 'pt-3 d-flex justify-content-between position-sticky'} style={{ bottom: 0, background: 'var(--l_profileCard_bgColor)', zIndex: 2 }}>
                <Button
                    type="button"
                    cssStyles={{
                        background: "none",
                        border: '1px solid var(--l_base)'
                    }}
                    fclassname='rounded-pill my-2 mr-2'
                    btnSpanClass="gradient_text font-weight-500 letterSpacing3"
                    onClick={handleClose}
                    children={lang?.back}
                />
                <Button
                    type="button"
                    fclassname='rounded-pill my-2 gradient_bg ml-2'
                    btnSpanClass=" font-weight-500 letterSpacing3"
                    onClick={() => handleSelectMedia(selectedFiles)}
                    children={lang?.done}
                />

            </div>
            <style jsx>
                {`
                .video_play_icon{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                }
                .selectedOverlay .tickIcon{
                    position: absolute;
                    top: 9px;
                    right: 9px;
                    z-index: 1;
                }
                .activeBorder.selectedOverlay .tickIcon{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                }
                .activeBorder.selectedOverlay {
                    background-image: linear-gradient(to right, rgba(211, 58, 255, 0.4) 0%, rgba(255, 113, 164, 0.4) 100%);
                    border-width: 4px;
                    border-color: ${theme.primary};
                    border-style: solid;
                }
                .selectedOverlay {
                    position: absolute;
                    width: calc(100% - 0.5rem);
                    height: calc(100% - 0.5rem);
                    top: 0.25rem;
                    left: 0.25rem;
                    z-index: 1;
                    border-radius: 18px;
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
                  .mobileBtn{
                    position: fixed !important;
                    width: calc(100% - 2rem);
                    left: 1rem;
                    bottom: 0 !important;
                  }
                .mobileFilterMenu {
                    position: sticky;
                    top: 0;
                    background-color: var(--l_app_bg) !important;
                    z-index: 2;
                }
                :global(.mobileFilterMenu button){
                    background: transparent !important;
                    border: none !important;
                }
                :global(.mobileFilterMenu .fItem){
                    flex: 1 1 33.333%;
                    border-bottom: 1.5px solid var(--l_border);
                    margin: 0 !important;
                }
                :global(.mobileFilterMenu .fItem.active){
                    border-bottom: 1.5px solid var(--l_base);
                }
                // .mobileSortMenu {
                //    position: absolute;
                //    right: 15px;
                // }
                .mobileSortLabel {
                    background: var(--l_app_bg2);
                    padding: 3px 8px;
                    border-radius: 15px;
                }
                .files_cover_img_box {
                    height: 100% !important;
                    aspect-ratio: 1/1;
                }
                .shared {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
                :global(.btnGradient_bg span) {
                    color: ${mobileView ? 'var(--l_app_text)' : '#fff'} !important;
                  }
                `}
            </style>
        </div>
    );
};