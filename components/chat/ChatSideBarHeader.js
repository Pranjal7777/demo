import * as React from 'react';
import useLang from '../../hooks/language';
import Icon from '../image/icon';
import { close_progress, open_drawer } from '../../lib/global/loader';
import isMobile from '../../hooks/isMobile';
import { useRouter } from 'next/router';
import FilterOption from '../filterOption/filterOption';
import { SIDEBAR_SEARCH } from '../../lib/config';
import { getCookie } from '../../lib/session';
import { useSelector } from 'react-redux';
import useProfileData from '../../hooks/useProfileData';
import { Avatar } from '@material-ui/core';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';

const filterList = [
    {
        title: "NEWEST",
        tab: "newest"
    },
    {
        title: "OLDEST",
        tab: "oldest"
    }
]

const bulkFilterList = [
    {
        title: "Conversion Rate",
        value: "NO_OF_PURCHASES"
    },
    {
        title: "Price: Low to High",
        value: "LOW_TO_HIGH"
    },
    {
        title: "Price: High to Low",
        value: "HIGH_TO_LOW"
    },
    {
        title: 'Total Income',
        value: 'TOTAL_EARNING'
    }
]

export const ChatSideBarHeader = ({ addBulkMessageHandler, onSearchClick, onSortBy = () => { }, ...props }) => {
    const [lang] = useLang();
    const [profile] = useProfileData()
    const router = useRouter();
    const auth = getCookie("auth");
    const [mobileView] = isMobile();
    const userType = useSelector(state => state.profileData.userTypeCode);
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const { bulkMsg } = router?.query


    const handleNavigationMenu = () => {
        open_drawer("SideNavMenu", {
            paperClass: "backNavMenu",
            setActiveState: props?.setActiveState,
            changeTheme: props?.changeTheme,
            noBorderRadius: true
        },
            "right"
        );
    };

    const handleChatTab = (data) => {
        if (data?.length) {
            router.replace(`/chat?${data}=true`)
        } else {
            router.replace('/chat')
        }
    }

    const onSuccess = () => {
        close_progress();
        props.bulkMsgListRef?.refreshList?.({});
    }

    return (
        <>
            <div className='sidebar-header chat-side-header pt-3'>
                <div className="d-flex justify-content-between align-items-center px-3 mb-2">
                    <h1 className={`mb-0 ${mobileView ? 'sectionTitleMobile' : 'sectionTitle'}`}>{lang.messages}</h1>
                    <div className='d-flex flex-row align-items-center'>
                        {bulkMsg && userType == 2 && <div className='fntSz35 px-1 mx-1 gradient_text cursorPtr' style={{ lineHeight: "24px", fontWeight: "300" }} onClick={addBulkMessageHandler}>
                            +
                        </div>}
                        {
                            !bulkMsg ? <div className='px-1 mx-1 cursorPtr' onClick={onSearchClick}>
                                <Icon
                                    icon={`${SIDEBAR_SEARCH}#searchicon`}
                                    color="var(--l_app_text)"
                                    width={28}
                                    height={28}
                                    viewBox="0 0 34 34"
                                />
                            </div> : ""
                        }
                        {mobileView ?
                            <div
                                className='d-flex align-items-center justify-content-end'
                                onClick={() => handleNavigationMenu()}>
                                {profile.profilePic ?
                                    <Avatar
                                        style={{ height: '36px', width: '36px' }}
                                        className='profile-pic solid_circle_border'
                                        alt={profile.firstName}
                                        src={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic)}
                                    />
                                    :
                                    <div
                                        className="tagUserProfileImage solid_circle_border"
                                        style={{ height: '36px', width: '36px' }}
                                    >
                                        {profile?.firstName[0] + (profile?.lastName && profile?.lastName[0])}
                                    </div>
                                }

                            </div>
                            : ""}
                    </div>
                </div>
                {
                    userType == 2 ?
                        <div className='row mx-0 text-center cursorPtr'>
                            <div className={`fntSz14 col-6 px-0 py-2 ${!bulkMsg ? "borderBtmStroke gradient_text w-600" : "borderBtm muted"}`} onClick={handleChatTab}>
                                {lang.allChat}
                            </div>
                            <div className={`fntSz14 col-6 px-0 py-2 ${bulkMsg ? "borderBtmStroke gradient_text w-600" : "borderBtm muted"}`} onClick={() => handleChatTab("bulkMsg")}>
                                {lang.bulkMsg}
                            </div>

                        </div> : <></>}
                {
                    bulkMsg ?

                        <div className='blkMsgMenu' style={{ padding: '0px 10px' }}>
                            <div className='my-2 ml-0 d-flex justify-content-end'>
                                <FilterOption setSelectedValue={(value) => onSortBy(value)} filterList={bulkMsg ? bulkFilterList : filterList} leftFilterShow />
                            </div>
                        </div> : ""
                }

            </div>
            <style jsx>{`
                .borderBtmStroke{
                    border-bottom: 2px solid var(--l_base);
                }
                :global(.chat-side-header .mv_profile_logo) {
                    height: 28px !important;
                    width: 28px !important;
                }
                :global(.isoChat .tabItem) {
                    padding: 4px 16px;
                    font-size: 15px;
                    color: var(--l_light_app_text);
                    border: 1px solid var(--l_border);
                    border-radius: 28px;
                    cursor: pointer;
                }
                :global(.isoChat.tabItem.active) {
                    color:#fff;
                }
                :global(.isoChat.tabItem:not(:first-child)) {
                    margin-left: 10px;
                }
            `}</style>
        </>
    );
};