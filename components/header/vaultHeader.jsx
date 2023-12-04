import React, { useState } from 'react'
import Icon from '../image/icon';
import { P_CLOSE_ICONS } from '../../lib/config';
import useLang from '../../hooks/language';
import { goBack } from '../../lib/global';
import { Arrow_Left2, more_symbol } from '../../lib/config/homepage';
import isMobile from '../../hooks/isMobile';
import { DELETE_FOLDER, MOVE_FOLDER } from '../../lib/config/vault';
import { CLOSE_ICON_WHITE } from '../../lib/config/logo';
import useVault from '../../containers/customHooks/useVault';
import { useRouter } from 'next/router';
import { useTheme } from 'react-jss';

/**
 * @description
 * @author kashinath
 * @date 26/05/2023
 */

const VaultHeader = (props) => {
    const { userType, title, isDefault } = props;
    const theme = useTheme();
    const router = useRouter();
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const { myFiles, id, type } = router?.query;

    const [actionJoin, setActionJoin] = useState(false);

    return (
        <>
            {!props?.moveFileData ? <div
                className={`d-flex align-items-center justify-content-between px-3 ${userType == 1 ? "userCollectionheaderCss" : "myAccount_sticky__section_header"}`}>
                <div className="d-flex align-items-center ">
                    <div className='hover_bgClr' onClick={goBack} style={{ borderRadius: "10px", padding: '6px' }}>
                        <Icon
                            icon={`${Arrow_Left2}#arrowleft2`}
                            hoverColor='var(--l_base)'
                            width={20}
                            height={20}
                            alt="Back Arrow"
                        />
                    </div>
                    {!mobileView && <div className="py-3 ml-2">
                        <h4 className=" m-0">{title + ` (${props.count || 0})`}</h4>
                    </div>}
                </div>
                {mobileView && <div className="py-3 ml-2">
                    <h4 className=" m-0">{title + ` (${props.count || 0})`}</h4>
                </div>}
                {!mobileView && props?.dataMoving && <div className='px-4 py-2 rounded-pill white' style={{ background: "linear-gradient(90deg, #FE70A5 0%, #D33AFC 100%)" }}>Copying...</div>}
                {!mobileView && props?.dataMovedMsg && <div className='px-4 py-2 rounded-pill white' style={{ background: props?.dataMoving === "success" ? "#531C62" : "#1C6234" }}>{props?.dataMovedMsg === "success" ? "Copied Successfully!" : "Something went Wrong!"}</div>}
                {
                    type !== 'TRASH' ? <div className="cursorPtr hover_bgClr position-relative" style={{ borderRadius: "10px" }} onClick={() => Number(props.count) ? setActionJoin(!actionJoin) : {}}>
                        <Icon
                            icon={`${more_symbol}#_Icons_Close_Copy_4`}
                            hoverColor='var(--l_base)'
                            size={mobileView ? (props.imageWidth ? props.imageWidth : 30) : 2.6}
                            unit={mobileView ? "px" : "vw"}
                            viewBox="0 0 52 52"
                            class={props.className}
                        />
                        <div>
                            {actionJoin && <div className="vh-100 position-fixed dropdown_backdrop" onClick={() => setActionJoin(!actionJoin)}></div>}
                            <div className={`position-absolute ${!actionJoin && 'd-none'}`} style={{ right: '0px', top: '3rem', zIndex: '999' }}>
                                <ul className="dropdown_list_box text-center specific_section_bg borderStroke">
                                    <li className="" onClick={props?.handleManageFiles}>{lang.manage}</li>
                                    {
                                        !isDefault ? <><li className=""
                                            onClick={() => props.handleRenameFolder(props.title, id, props.folderDetail, () => {
                                                props.getVaultFolderDetail()
                                            })}>
                                            {lang.edit}
                                        </li>
                                            <li className="border-0"
                                                onClick={() => props.handleDeleteFolder(id)}>
                                                {lang.delete}
                                            </li>
                                        </> : ""
                                    }

                                </ul>
                            </div>
                        </div>
                    </div> : ""
                }
            </div> :
                mobileView ?
                    <div
                        className={`d-flex align-items-center justify-content-between px-3 ${userType == 1 ? "userCollectionheaderCss" : "myAccount_sticky__section_header"}`}>
                        <div className="d-flex align-items-center ">
                            <div className='hover_bgClr' style={{ borderRadius: "10px", padding: '6px' }}>
                                <Icon
                                    icon={`${P_CLOSE_ICONS}#cross_btn`}
                                    hoverColor='var(--l_base)'
                                    color={'var(--l_app_text)'}
                                    width={20}
                                    height={20}
                                    onClick={() => props.handleMoveDelete(props, "close", id)}
                                    alt="Back Arrow"
                                />
                                {!mobileView && <div className="py-3 ml-2">
                                    <h4 className=" m-0">{title + ` (${props.count || 0})`}</h4>
                                </div>}
                            </div>
                        </div>
                        {mobileView && <div className="py-3 ml-2">
                            <h4 className=" m-0">{title + ` (${props.count || 0})`}</h4>
                        </div>}
                        <div className='d-flex flex-row'>
                            <div className="d-flex align-items-center justify-content-center move_folder_section" onClick={() => props.handleMoveDelete(props, "moveFiles", id)}>
                                <Icon
                                    icon={`${MOVE_FOLDER}#move_folder`}
                                    hoverColor='var(--l_base)'
                                    size={props.imageWidth ? props.imageWidth : 26}
                                    unit={mobileView ? "px" : "vw"}
                                    viewBox="0 0 52 52"
                                    class=""
                                />
                            </div>
                            <div className="d-flex align-items-center justify-content-center move_folder_section" onClick={() => props.handleMoveDelete(props, "deleteFiles", id)}>
                                <Icon
                                    icon={`${DELETE_FOLDER}#delete_fill`}
                                    size={props.imageWidth ? props.imageWidth : 26}
                                    unit={mobileView ? "px" : "vw"}
                                    viewBox="0 0 52 52"
                                    class=""
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div
                        className={`row mx-0 specific_section_bg ${userType == 1 ? "userCollectionheaderCss" : "myAccount_sticky__section_header"}`}>
                        {type !== 'TRASH' ? <div className="col d-flex align-items-center justify-content-center move_folder_section" onClick={() => props.handleMoveDelete(props, "moveFiles", id)}>
                            <Icon
                                icon={`${MOVE_FOLDER}#move_folder`}
                                hoverColor='var(--l_base)'
                                size={mobileView ? (props.imageWidth ? props.imageWidth : 30) : 1.7}
                                unit={mobileView ? "px" : "vw"}
                                viewBox="0 0 52 52"
                                class="px-2"
                            />
                            {lang.moveFolder}</div> : ""}
                        <div className="col d-flex align-items-center justify-content-center move_folder_section" onClick={() => props.handleMoveDelete(props, "deleteFiles", id)}>
                            <Icon
                                icon={`${DELETE_FOLDER}#delete_fill`}
                                size={mobileView ? (props.imageWidth ? props.imageWidth : 30) : 1.7}
                                unit={mobileView ? "px" : "vw"}
                                viewBox="0 0 52 52"
                                class="px-2"
                            />
                            {lang.delete}</div>
                        <div className="col d-flex align-items-center justify-content-center move_folder_section" onClick={() => props.handleMoveDelete(props, "close", id)}>
                            <Icon
                                icon={`${CLOSE_ICON_WHITE}#close-white`}
                                size={mobileView ? (props.imageWidth ? props.imageWidth : 30) : 1.5}
                                unit={mobileView ? "px" : "vw"}
                                viewBox="0 0 52 52"
                                class="px-2"
                            />
                            {lang.close}</div>
                    </div>
            }
            <style jsx>{`
                  .dropdown_list_box{
                    border-radius: 13px;
                    width: max-content;
                    padding: 0px;
                  }
                  .dropdown_list_box li{
                    list-style: none;
                    padding: 14px 55px;
                    border-bottom: ${isDefault ? '0px' : '1.5px'} solid var(--l_border);
                    letter-spacing: 0.49996px;
                    cursor: pointer;
                  }
                  .dropdown_list_box li:hover{
                    color: var(--l_base);
                  }
                  .dropdown_backdrop{
                    z-index: 1;
                    top: 0px;
                    right: 0px;
                    background: transparent;
                    width: 100vw;
                  }
                  .move_folder_section{
                    cursor: pointer;
                    padding: 20px 10px;
                  }
                  .move_folder_section:hover{
                    background: ${theme.type === "light" ? "#f2f2f2" : "#322137"} !important;
                  }
            `}</style>
        </>
    )
}

export default VaultHeader;