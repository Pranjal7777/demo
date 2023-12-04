import React, { useState } from 'react';
import Button from '../button/button';
import FilterOption from "../filterOption/filterOption";
import isMobile from '../../hooks/isMobile';
import { getCookie } from '../../lib/session';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import useProfileData from '../../hooks/useProfileData';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { CLOSE_ICON_WHITE } from '../../lib/config/logo';
import Icon from '../image/icon';
import { open_drawer } from '../../lib/global/loader';

const CommonHeader = ({
    title,
    button1 = {},
    button2 = {},
    isSearchBar,
    filterList = [],
    setSearchResult,
    activeSearch,
    setActiveSearch,
    isProfilePic,
    isFilterShow = false,
    setSelectedFilterValue,
    ...props
}) => {

    const [mobileView] = isMobile();
    const [searchValue, setSearchValue] = useState("");
    const auth = getCookie('auth');
    const [profile] = useProfileData();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const ChangeTheme = useSelector((state) => state?.commonUtility?.changeThemeUtility);

    const handleSearch = (e) => {
        setSearchValue(e?.target?.value)
        setSearchResult(e)
    }

    const handleNavigationMenu = () => {
        open_drawer(
            "SideNavMenu",
            {
                paperClass: "backNavMenu",
                setActiveState: props.setActiveState,
                changeTheme: ChangeTheme,
            },
            "right"
        );
        // close_drawer(Router.asPath.replace("/", "").charAt(0).toUpperCase() + Router.asPath.replace("/", "").slice(1) !== title)
    };

    return (
        <div className='d-flex flex-column card_bg w-100' style={{ padding: "12px" }}>
            {!mobileView ? <div className='d-flex flex-row justify-content-between align-items-center'>
                <div className='sectionTitle mb-1'>{title || 'title'}</div>
                <div className={`d-flex gap_8 align-items-center ${isSearchBar === "fullWidth" ? "w-100 pl-5" : ""}`}>
                    {isSearchBar ?
                        <input
                            type='search'
                            name="search"
                            value={searchValue}
                            onFocus={() => setActiveSearch(true)}
                            placeholder='Search here'
                            onChange={handleSearch}
                            className='form-control background_none borderStroke rounded-pill pl-3 text-app custom-search-input fntSz14 lh_1 h-auto'
                        /> : null}
                    {button1?.label ? <Button
                        type="button"
                        fixedBtnClass={button1?.active ? "active" : "inactive"}
                        fclassname="text-nowrap headerBtnPadding w-fit-content"
                        onClick={button1?.clickAction}
                        children={button1?.label}
                    /> : null}
                    {button2?.label ? <Button
                        type="button"
                        fixedBtnClass={button2?.active ? "active" : "inactive"}
                        fclassname="text-nowrap headerBtnPadding w-fit-content"
                        onClick={button2?.clickAction}
                        children={button2?.label}
                    /> : null}
                    {filterList?.length ? <div>
                        <FilterOption leftFilterShow={mobileView ? false : isFilterShow ? true : false} filterList={filterList} setSelectedValue={(value) => setSelectedFilterValue(value)} />
                    </div> : null}
                </div>
            </div> :
                <div className=''>
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <div className={`sectionTitle mb-1 ${mobileView ? 'sectionTitleMobile' : 'sectionTitle'}`}>{title || 'title'}</div>
                        <div className='d-flex flex-row align-items-center gap_8'>
                            {button1?.label ? <Button
                                type="button"
                                fixedBtnClass={button1?.active ? "active" : "inactive"}
                                fclassname="text-nowrap headerBtnPadding w-fit-content"
                                onClick={button1?.clickAction}
                                children={button1?.label}
                            /> : null}
                            {button2?.label ? <Button
                                type="button"
                                fixedBtnClass={button2?.active ? "active" : "inactive"}
                                fclassname="text-nowrap headerBtnPadding w-fit-content"
                                onClick={button2?.clickAction}
                                children={button2?.label}
                            /> : null}
                            {filterList?.length ? <div>
                                <FilterOption leftFilterShow={mobileView ? false : isFilterShow ? true : false} filterList={filterList} setSelectedValue={(value) => setSelectedFilterValue(value)} />
                            </div> : null}
                            {(auth && isProfilePic) ?
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
                                : null}
                        </div>
                    </div>
                    {isSearchBar ? <div className='d-flex flex-row align-items-center pt-1'>
                        <input
                            type='search'
                            name="search"
                            value={searchValue}
                            onFocus={() => setActiveSearch(true)}
                            placeholder='Search here'
                            onChange={handleSearch}
                            className='form-control background_none borderStroke rounded-pill pl-3 text-app custom-search-input fntSz14 lh_1 h-auto'
                        />
                        {activeSearch && <Icon
                            icon={`${CLOSE_ICON_WHITE}#close-white`}
                            color={"var(--l_app_text)"}
                            size={16}
                            alt="back_arrow"
                            onClick={() => setActiveSearch(false)}
                            class="cursorPtr ml-3 mr-2"
                            viewBox="0 0 16 16"
                        />}
                    </div>
                        : null}
                </div>
            }
        </div>
    )
}

export default CommonHeader;