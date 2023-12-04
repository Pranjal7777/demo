import * as React from 'react';
import useLang from '../../hooks/language';
import { useTheme } from 'react-jss';
import Image from '../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../lib/config';
import { useRouter } from 'next/router';
import useVault from '../../containers/customHooks/useVault';
import { useSelector } from 'react-redux';
import isMobile from '../../hooks/isMobile';
import Icon from '../image/icon';
import Button from '../button/button';
import { dateformatter } from '../../lib/date-operation/date-operation';
import { FOLDER_SHOW, MEDIA_ALBUM } from '../../lib/config/vault';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import CustomDataLoader from '../loader/custom-data-loading';
import { SelectVaultFiles } from './SelectVaultFiles';
import unionBy from 'lodash/unionBy';
import { Arrow_Left2 } from '../../lib/config/homepage';
import PaginationIndicator from '../pagination/paginationIndicator';
import { NoFolders } from '../myVault/NoFolders';

const SelectMediaFrom = ({ isSingle, sharedTo = '', sharedType = '', handleSelect, handleSelectFiles = () => { }, selectedFiles, removePostFile, uploadFromDevice, selectedFolder, ...props }) => {
    const [lang] = useLang();
    const theme = useTheme();
    const [mobileView] = isMobile();
    const router = useRouter();
    const { folderList, updateData, hasMore, loader, getFolderDetails } = useVault();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [selectedFiles, setSelectedFiles] = React.useState(isSingle ? [] : [...selectedFiles]);
    const [pageCount, setPageCount] = React.useState(0);

    React.useEffect(() => {
        getFolderDetails()
    }, [updateData])

    const handleRemoveFile = (id) => {
        const currentFile = selectedFiles.find(f => f.id === id);
        const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
        if (currentFile) {
            if (currentFile.mediaContentId) {
                const allFiles = [...selectedFiles]
                allFiles.splice(currentFileIndex, 1)
                setSelectedFiles([...allFiles])
                removePostFile(id)
            }
        }
    }
    const handleVaultMediaSelect = (filesArr) => {
        setSelectedFiles([...unionBy(selectedFiles, filesArr, 'id')])
        handleSelect()
    }

    React.useEffect(() => {
        if (selectedFiles.length > 0) {
            handleSelectFiles(selectedFiles)
        }
    }, [selectedFiles])

    const handleDoneClick = (selectedFiles) => {
        handleSelectFiles([...selectedFiles], true)
    }

    const getFilesCount = ({ id, type }) => {
        if (type !== 'CUSTOM') {
            return selectedFiles.filter(f => f.folderType === type).length
        }
        return selectedFiles.filter(f => f.folderId === id).length
    }

    return (
        <>
            <div className='selectMedia px-md-4 px-3 py-3 position-relative'>
                {
                    !mobileView ? <div className='sticky-top top-0 py-2 d-flex justify-content-between'>
                        <div className='backIcon' style={{ opacity: selectedFolder ? 1 : 0 }}>
                            <Icon
                                icon={`${Arrow_Left2}#arrowleft2`}
                                color='var(--l_base_light)'
                                width={20}
                                height={20}
                                onClick={() => handleSelect()}
                                class="backArrow"
                                alt="Back Arrow"
                            />
                        </div>
                        <h3 className='text-center title dv_appTxtClr'>{lang.selectMedia}</h3>
                        <div className='clos_icon cursorPtr'>
                            <Image
                                src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                                onClick={() => props.onClose()}
                                color="white"
                                width="20"
                                alt="close_icon"
                                style={{ marginBottom: "4px" }}
                            />
                        </div>
                    </div> : <div className='close_icon cursorPtr'>
                        <Image
                            src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                            onClick={() => props.onClose()}
                            color="white"
                            width="20"
                            alt="close_icon"
                            style={{ marginBottom: "4px" }}
                        />
                    </div>
                }
                <div className=''>
                    {
                        selectedFolder ?
                            <><SelectVaultFiles
                                sharedTo={sharedTo}
                                sharedType={sharedType}
                                isSingle={isSingle}
                                handleRemoveFile={handleRemoveFile}
                                handleClose={() => handleSelect()}
                                currSelectedFiles={selectedFiles}
                                handleSelectMedia={handleVaultMediaSelect}
                                currFolder={selectedFolder}
                            /></>
                            : (<div className={`px-2 px-sm-3 pt-md-0`}>
                                <div className='d-flex w-100 justify-content-between align-items-center  py-md-2 pt-4'>
                                    <h3 className='title mainTitle'>{lang.myVault}</h3>
                                    {mobileView ? "" : <div className='uploadFromDevice cursorPtr' onClick={uploadFromDevice}>{lang.uploadFromDevice}</div>}
                                </div>
                                <div className='d-flex w-100 justify-content-between align-items-center  py-2 pb-3'>
                                    <p className='mb-0'>{`${selectedFiles.length} files selected`}</p>
                                    {mobileView ? <div className='uploadFromDevice cursorPtr' onClick={uploadFromDevice}>{lang.uploadFromDevice}</div> : ""}
                                </div>
                                {
                                    !loader && !folderList?.filter(f => f.type !== 'TRASH')?.length ? <NoFolders height={'100px'} /> : <div id='vaultFolder' className='row mx-0' style={{ maxHeight: mobileView ? 'calc(var(--vhCustom, 1vh) * 60)' : 'calc(var(--vhCustom, 1vh) * 48)', overflowY: 'auto' }}>
                                        {folderList.filter(f => f.type !== 'TRASH')?.map((data, index) => {
                                            const fileCount = getFilesCount({ id: data._id, type: data.type });
                                            return (
                                                <div key={data?._id} className={`col-12 col-md-6 mb-1 ${(index + 1) % 2 === 0 ? "pr-1 pr-sm-0 pl-1 pl-sm-2" : "pl-1 pl-sm-0 pr-1 pr-sm-2"}`}>
                                                    <div className={`position-relative folderBorder specific_section_bg d-flex flex-row radius_12 cursorPtr mb-2`} onClick={() => handleSelect(data)}>
                                                        {
                                                            fileCount > 0 ? <div className='selectedCount'>{fileCount}</div> : ""
                                                        }
                                                        <div className='col-auto px-0 radius_12 folderImage overflow-hidden'>
                                                            <Image
                                                                src={s3ImageLinkGen(S3_IMG_LINK, data?.coverImage, 80, 120, 120)}
                                                                width="120"
                                                                height='120'
                                                                style={{ objectFit: "cover", objectPosition: 'center', width: '100%', height: '100%' }}
                                                            />
                                                        </div>
                                                        <div className='col d-flex flex-column justify-content-between py-2 pr-2' style={{ letterSpacing: '0.05em' }}>
                                                            <div>
                                                                <h6 className=' text-truncate text-nowrap mb-0' style={{ maxWidth: '150px' }}>
                                                                    {data?.title}
                                                                </h6>
                                                                <span className='light_app_text fntSz12 font-weight-500'>
                                                                    {dateformatter(data?.creationTs)}
                                                                </span>
                                                            </div>
                                                            <div className='d-flex flex-row flex-nowrap align-items-center justify-content-between'>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className=''>
                                                                        <Icon
                                                                            icon={`${MEDIA_ALBUM}#media_album`}
                                                                            width="14"
                                                                            height="17"
                                                                            color={'var(--l_app_text)'}
                                                                        />
                                                                    </div>
                                                                    <div className='px-2 fntSz12 mt-1'>
                                                                        {data?.mediaCount} Files
                                                                    </div>
                                                                </div>
                                                                {data?.type !== "CUSTOM" && <div className=''>
                                                                    <Image
                                                                        src={FOLDER_SHOW}
                                                                        width="24"
                                                                        height="20"
                                                                    />
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <PaginationIndicator
                                            id="vaultFolder"
                                            totalData={folderList}
                                            pageEventHandler={() => {
                                                if (!loader && hasMore) {
                                                    getFolderDetails(10, pageCount + 1);
                                                    setPageCount(pageCount + 1)
                                                }
                                            }}
                                        />
                                {loader && <div className='text-center p-3 d-flex justify-content-center w-100'>
                                    <CustomDataLoader loading={loader} />
                                </div>}
                                    </div>
                                }
                                {
                                    !folderList.length ? <div className='py-4'>
                                        <h6 className='dv_appTxtClr'>Loading Folders...</h6>
                                    </div> :
                                        <Button
                                            type="button"
                                            fclassname='gradient_bg rounded-pill py-3 mt-3 d-flex align-items-center justify-content-center text-white'
                                            btnSpanClass='text-white'
                                            btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                                            onClick={() => handleDoneClick(selectedFiles)}
                                            children={lang.done}
                                        />
                                }
                            </div>)}
                </div >
            </div>
            <style jsx>
                {
                    `
                    .selectMedia .title {
                        font-size: 1.75em;
                        position: sticky;
                        top: 0;
                    }
                    .folderImage {
                        height: 90px;
                        width: 90px;
                    }
                    .folderBorder {
                        border: 1.5px solid var(--l_border);
                    }
                    .submit-button {
                        position: sticky;
                        bottom: 0;
                        padding: 1rem;
                        z-index: 2;
                      }
                    .selectMedia .close_icon {
                        top: -0.75rem;
                        right: 0.5rem;
                    }
                    .uploadFromDevice {
                        color: ${theme.primary};
                        cursor: pointer;
                    }
                    .selectedCount {
                        padding: 2px 8px;
                        border-radius: 14px;
                        background: var(--l_app_bg2);
                        position: absolute;
                        right: 6px;
                        top: 6px;
                        z-index: 1;
                        line-height: 1.4;
                        font-size: 14px;
                        font-weight: 500;
                    }
                    `
                }
            </style>
        </>
    );
};

export default SelectMediaFrom;