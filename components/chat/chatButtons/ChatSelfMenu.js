import * as React from 'react';
import isMobile from '../../../hooks/isMobile';
import { useSelector } from 'react-redux';
import { open_dialog, open_drawer } from '../../../lib/global/loader';
import { BLOCK_CHAT, CLEAR_CHAT, DELETE_CHAT, Search_chat } from '../../../lib/config/chat';
import Icon from '../../image/icon';

export const ChatSelfMenu = ({ menuData, menuClick, searchShowHandler, handleBlockUnBlock }) => {
    console.log("menu dataaaa", menuData)
    const [mobileView] = isMobile()
    const userTypeCode = useSelector((state) => state.profileData.userTypeCode)
    const filteredMenu = userTypeCode == 2 ?
        [
            {
                text: 'Block',
                icon: <Icon
                    icon={BLOCK_CHAT + "#blockChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            },
            {
                text: 'Unblock',
                icon: <Icon
                    icon={BLOCK_CHAT + "#blockChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            },
            {
                text: 'Clear chat',
                icon: <Icon
                    icon={CLEAR_CHAT + "#clearChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            },
            {
                text: 'Delete chat',
                icon: <Icon
                    icon={DELETE_CHAT + "#delete_icon_b"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            }
        ] : [
            {
                text: 'Block',
                icon: <Icon
                    icon={BLOCK_CHAT + "#blockChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            },
            {
                text: 'Unblock',
                icon: <Icon
                    icon={BLOCK_CHAT + "#blockChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            },
            {
                text: 'Clear chat',
                icon: <Icon
                    icon={CLEAR_CHAT + "#clearChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                />
            }
        ]

    const handleMenuClick = (data) => {
        if (data.header === 'Clear chat' || data.header === 'Delete chat') {
            menuClick(data)
        }
        if (data.header === 'Block' || data.header === 'Unblock') {
            handleBlockUnBlock(data.header === 'Block' ? 'BLOCK' : 'UNBLOCK')
        }
    }
    return (
        <div className='selfMenu_inner px-4 light_app_text'>
            <div className='menu-item py-2 cursorPtr  d-flex flex-row flex-nowrap align-items-end' onClick={searchShowHandler}>
                <Icon
                    icon={Search_chat + "#searchChat"}
                    color="var(--l_light_app_text)"
                    size={20}
                    viewBox="0 0 24 24"
                    class="pr-2"
                />
                Search Chat
            </div>
            {
                menuData.filter(mf => filteredMenu.find((hh) => mf.header === hh.text)).map((menu, index) => {
                    return (<div key={menu?.id} className='menu-item py-2 cursorPtr d-flex flex-row flex-nowrap align-items-end' onClick={() => handleMenuClick(menu)}>
                        <span className='pr-2'>{filteredMenu.find((hh) => menu.header === hh.text).icon}</span>
                        {menu.header}</div>)
                })
            }
            <style jsx>
                {
                    `
                    :global(.selfMenuWrap) {
                        border-radius: 18px;
                        padding: 10px 0;
                        // box-shadow: 0px 4px 4px 0px#00000040;
                    }
                    :global(.isoChat .chat_header_right .selfMenuWrap) {
                        width: fit-content !important;
                    }
                    `
                }
            </style>
        </div>
    );
};