import React, { useEffect, useState } from 'react'
import isMobile from '../../hooks/isMobile';
import Image from '../image/image';
import { useRouter } from 'next/router';
import { FOLDER_SHOW, MEDIA_ALBUM } from '../../lib/config/vault';
import { Arrow_Left2 } from '../../lib/config/homepage';
import useVault from '../../containers/customHooks/useVault';
import Button from '../button/button';
import Icon from '../image/icon';
import { goBack } from '../../lib/global';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import { dateformatter } from '../../lib/date-operation/date-operation';
import { setCookie } from '../../lib/session';
import { useTheme } from 'react-jss';
import dynamic from 'next/dynamic';
import { NoFolders } from './NoFolders';
import useLang from '../../hooks/language';
import CommonHeader from '../commonHeader/commonHeader';
const CustomDataLoader = dynamic(() => import('../loader/custom-data-loading'), { ssr: false });
const PaginationIndicator = dynamic(() => import("../../components/pagination/paginationIndicator"), { ssr: false })


const MyVault = (props) => {
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [lang] = useLang()
    const router = useRouter();
    const [pageCount, setPageCount] = useState(0)
    const { folderList, updateData, hasMore, loader, handleCreateFolder, getFolderDetails } = useVault();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    useEffect(() => {
        getFolderDetails()
    }, [updateData])

    const handleOpenFolder = (id, title, type) => {
        setCookie("vaultFolderName", title)
        router.push({
            pathname: `my-vault/${(title)}`,
            query: {
                id: id,
                type: type
            }
        })
    }

    const createFolderBtn = {
        label: 'Create Folder',
        active: true,
        clickAction: handleCreateFolder
    }

    return (
        <>
            <div className=''>
                {mobileView ? <div className="pl-2 pl-md-4 pr-4 py-3 d-flex flex-row justify-content-between align-items-center specific_section_bg">
                    <div className='hover_bgClr' onClick={() => goBack()} style={{ borderRadius: "10px", padding: '6px' }}>
                        <Icon
                            icon={`${Arrow_Left2}#arrowleft2`}
                            hoverColor='var(--l_base)'
                            width={20}
                            height={20}
                            alt="Back Arrow"
                        />
                    </div>
                    <h3 className="mb-0 sectionTitleMobile dv_appTxtClr">
                        {lang.myVault}
                    </h3>
                    <div className='fntSz35 fntWeight400' style={{ lineHeight: "36px" }} onClick={handleCreateFolder}>
                        <span className='gradient_text'>
                            +
                        </span>
                    </div>
                </div> :
                    <div className="sticky-top borderBtm">
                        <CommonHeader
                            title={lang.myVault}
                            button1={createFolderBtn}
                        />
                    </div>
                }
                <div id="vault_folder_list" className={`px-2 px-sm-3 py-3 overflow-auto scroll-hide`} style={{ maxHeight: "calc(calc(var(--vhCustom, 1vh) * 100) - 83px)" }}>
                    {
                        !loader && !folderList.length ? <NoFolders /> : <div className='row mx-0 pb-md-3'>
                            {folderList?.map((data, index) => {
                                return (
                                    <div key={data?._id} className={`col-12 col-md-6 mb-1 ${(index + 1) % 2 === 0 ? "pr-1 pr-sm-0 pl-1 pl-sm-2" : "pl-1 pl-sm-0 pr-1 pr-sm-2"}`}>
                                        <div className='specific_section_bg d-flex flex-row radius_12 cursorPtr mb-2 folderBorder' onClick={() => handleOpenFolder(data?._id, data?.title, data.type)}>
                                            <div className='col-auto px-0 radius_12 overflow-hidden' style={{ height: mobileView ? 80 : 120, width: mobileView ? 80 : 120 }}>
                                                <Image
                                                    src={s3ImageLinkGen(S3_IMG_LINK, data?.coverImage, 80, mobileView ? 80 : 120, mobileView ? 80 : 120)}
                                                    width={mobileView ? 80 : 120}
                                                    height={mobileView ? 80 : 120}
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className='col d-flex flex-column justify-content-between py-2 pr-2' style={{ letterSpacing: '0.05em', maxWidth: mobileView ? 'calc(100% - 80px)' : 'calc(100% - 120px)' }}>
                                                <div>
                                                    <h6 className=' text-truncate text-nowrap mb-0'>
                                                        {data?.title}
                                                    </h6>
                                                    <span className='light_app_text fntSz12 font-weight-500'>
                                                        {dateformatter(data?.creationTs)}
                                                    </span>
                                                </div>
                                                <div className='d-flex flex-row flex-nowrap align-items-center justify-content-between'>
                                                    <div className='d-flex align-items-end'>
                                                        <div className=''>
                                                            <Icon
                                                                icon={`${MEDIA_ALBUM}#media_album`}
                                                                width="14"
                                                                height="17"
                                                                color={'var(--l_app_text)'}
                                                            />
                                                        </div>
                                                        <div className='px-2 fntSz12'>
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
                        </div>
                    }

                    {loader && <div className='text-center p-3 d-flex justify-content-center'>
                        <CustomDataLoader loading={loader} />
                    </div>}
                </div>
                <PaginationIndicator
                    id="vault_folder_list"
                    totalData={folderList}
                    pageEventHandler={() => {
                        if (!loader && hasMore) {
                            getFolderDetails(10, pageCount + 1);
                            setPageCount(pageCount + 1)
                        }
                    }}
                />
            </div >
            <style jsx>
                {`
                .folderBorder {
                    border: 1.5px solid var(--l_border);
                }
                `}
            </style>
        </>
    )
}

export default MyVault;