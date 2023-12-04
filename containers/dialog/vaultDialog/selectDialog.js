import React, { useState } from 'react'
import useLang from '../../../hooks/language';
import Button from '../../../components/button/button';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import isMobile from '../../../hooks/isMobile';
import { dateformatter } from '../../../lib/date-operation/date-operation';
import Image from '../../../components/image/image';
import { FOLDER_SHOW, MEDIA_ALBUM } from '../../../lib/config/vault';
import { useTheme } from 'react-jss';
import Icon from '../../../components/image/icon';

const SelectFolderDialog = (props) => {

    const [lang] = useLang();
    const [mobileView] = isMobile();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    const [selectedItems, setSelectedItems] = useState([]);
    const theme = useTheme()

    // Function to toggle selection
    const handleCheckboxChange = (item) => {
        console.log("item ...............", item)
        setSelectedItems([item]);
    };

    const selectHandler = (id) => {
        const res = selectedItems.filter(data => data === id);
        return res.length ? true : false;
    }

    const filteredFolderList = props?.folderNameList?.filter(d => d.type == 'CUSTOM').filter(d => d._id !== props?.currId) || []

    return (
        <>
            <div className='position-relative py-2 px-3 text-app'>
                <h4 className='mx-1 mb-3'>{lang.selectFolder}</h4>

                <div className='row mx-0' style={{ maxHeight: '80vh' }}>
                    {
                        !filteredFolderList.length ? <h6 className='text-center py-3'>No folders available to select</h6> : ""
                    }
                    {filteredFolderList.map((data, index) => {
                        return (
                            <div key={data?._id} className={`col-12 col-md-6 mb-1 ${(index + 1) % 2 === 0 ? "pr-1 pr-sm-0 pl-2" : "pl-1 pl-sm-0 pr-2"}`}>
                                <div className={`specific_section_bg borderStroke position-relative d-flex flex-row radius_8 cursorPtr mb-2 ${selectHandler(data?._id) ? "selcetedSection" : "unSelectedSection"}`} onClick={() => handleCheckboxChange(data?._id)}>
                                    <div className='col-4 px-0 radius_8 overflow-hidden' style={{ height: "5rem", maxWidth: "5rem" }}>
                                        <Image
                                            src={s3ImageLinkGen(S3_IMG_LINK, data?.coverImage)}
                                            width="100%"
                                            height='100%'
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className='col d-flex flex-column justify-content-between py-1' style={{ letterSpacing: '0.05em' }}>
                                        <div>
                                            <h6 className='text-truncate text-nowrap mb-0' style={{ maxWidth: '150px' }}>
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
                                                <div className='px-2 fntSz11'>
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
                                    {selectHandler(data?._id) && <div className="overlay-gradient radius_8"></div>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className='dialogActions specific_section_bg d-flex flex-row mt-3'>
                    {props?.cancelBtn && <Button
                        type="button"
                        cssStyles={{
                            background: "none",
                            border: '1px solid var(--l_base)'
                        }}
                        fclassname='rounded-pill my-2 mr-2'
                        btnSpanClass="gradient_text font-weight-500 letterSpacing3"
                        onClick={props.onClose}
                        children={props?.cancelBtn || lang?.cancel}
                    />}
                    <Button
                        type="button"
                        fclassname='rounded-pill my-2 ml-2 btnGradient_bg'
                        btnSpanClass=" font-weight-500 letterSpacing3"
                        onClick={() => { props?.handleName(selectedItems), props.onClose() }}
                        disabled={!selectedItems?.length}
                        children={props?.submitBtn || lang?.rename}
                    />
                </div>
            </div>
            <style jsx>{`
                :global(.selectFolder_radioBtn .dv__RadioContainer input:checked~.checkmark), 
                :global(.selectFolder_radioBtn .radioContainer input:checked~.checkmark){
                    background: none !important;
                }
                :global(.selectFolder_radioBtn .dv__RadioContainer .checkmark),
                :global(.selectFolder_radioBtn .radioContainer .checkmark){
                    background: none !important;
                }
                .dialogActions {
                    position: sticky;
                    bottom: 0.5em;
                    width: calc(100%);
                }
            `}</style>
        </>
    )
}

export default SelectFolderDialog