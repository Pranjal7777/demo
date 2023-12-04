import React, { useState } from 'react'
import Icon from '../../components/image/icon'
import * as config from '../../lib/config'
import { open_dialog } from '../../lib/global/loader'
import { getCookie, removeCookie } from '../../lib/session'
import { useRouter } from 'next/router'
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import isMobile from '../../hooks/isMobile'
import { useDispatch, useSelector } from 'react-redux'
import { drawerToast } from '../../lib/global/loader'
import useLang from '../../hooks/language'
import useProfileData from '../../hooks/useProfileData'
import { SIDEBAR_WALLET } from '../../lib/config/profile'
import FigureImage from '../../components/image/figure-image'
import { DASHBOARD_ICON, JUICY_HEADER_DARK_LOGO, JUICY_HEADER_LOGO, LOGO_SIDEBAR, MY_VAULT_LOGO } from '../../lib/config/logo'
import { Dark_moon, White_sunny } from '../../lib/config/header'
import Image from '../../components/image/image'
import { useTheme } from 'react-jss'
import Button from '../../components/button/button'
import dynamic from 'next/dynamic'
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), { ssr: false });
import Accordion from '../../components/accordion'
import AgencySelect from '../agency/AgencySelect'
import { setSelectCreator } from '../../redux/actions/agency'
import { isAgency } from '../../lib/config/creds'



function DvSidebar(props) {

    const [activeTab, setActiveTab] = useState('0');
    const [userType] = useState(getCookie("userType"));
    const auth = getCookie("auth");
    const theme = useTheme();
    const router = useRouter();
    let pathname = router.pathname == `/live/[category]` ? `/live/${router.query.category}` : router.pathname;
    const chatNotificationCount = useSelector((state) => state?.chatNotificationCount);
    const notificationCount = useSelector((state) => state?.notificationCount);
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
    const orderCount = useSelector((state) => state?.profileData?.orderCount);
    const [lang] = useLang();
    const [profile] = useProfileData();
    const [hover, setHover] = useState('');
    let userRole = getCookie("userRole") || "ADMIN";
    const [isSelect, setIsSlect] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dispatch = useDispatch();
    const IsAgency = isAgency();

    const guestMenuBarContent = [
        {
            img: {
                src: config.SIDEBAR_HOME,
                id: 'homeicon'
            },
            bartext: 'Home',
            redirect: '/login',
        },
        {
            img: {
                src: config.SIDEBAR_SEARCH,
                id: 'searchicon'
            },
            bartext: 'Explore',
            redirect: '/explore',
        },
    ]

    const usermenubarcontent = [
        {
            img: {
                src: config.SIDEBAR_HOME,
                id: 'homeicon'
            },
            bartext: 'Home',
            redirect: '/',
        },
        {
            img: {
                src: config.SIDEBAR_LIVE,
                id: 'liveicon'
            },
            bartext: 'Live',
            redirect: '/live/popular',
        },
        {
            img: {
                src: config.SIDEBAR_SEARCH,
                id: 'searchicon'
            },
            bartext: 'Explore',
            redirect: '/explore',
        },
        {
            img: {
                src: config.SIDEBAR_MESSAGE,
                id: 'messageicon'
            },
            bartext: 'Messages',
            redirect: '/chat',
            Count: chatNotificationCount
        },
        {
            img: {
                src: config.SIDEBAR_NOTIFICATION,
                id: 'notification'
            },
            bartext: 'Notifications',
            redirect: '/notification',
            Count: notificationCount
        },
        {
            img: {
                src: config.SIDEBAR_PURCHASE,
                id: 'purchaseicon'
            },
            bartext: 'Virtual Requests',
            redirect: '/virtual-request',
        },
        {
            img: {
                src: config.SIDEBAR_DOCUMENT,
                id: 'subscription'
            },
            bartext: 'My Subscriptions',
            redirect: '/my-subscriptions',
        },
        {
            img: {
                src: config.SIDEBAR_USER,
                id: 'usericon'
            },
            bartext: 'My Profile',
            redirect: '/profile',
        },
        {
            img: {
                src: config.SIDEBAR_MORE,
                id: 'moreicon'
            },
            bartext: 'More',
            redirect: '/billing-history',
            icon:
                <ArrowForwardIosIcon
                    className="arrow_on_right position-absolute dv_appTxtClr_web cursor-pointer fntSz15"
                    width='1em'
                    height='1em'
                />,
        },
    ]
    const creatormenubarcontent = [
        {
            img: {
                src: config.SIDEBAR_HOME,
                id: 'homeicon'
            },
            bartext: 'Home',
            redirect: '/',
        },
        {
            img: {
                src: config.SIDEBAR_LIVE,
                id: 'liveicon'
            },
            bartext: 'Live',
            redirect: '/live/popular',
        },
        {
            img: {
                src: config.SIDEBAR_SEARCH,
                id: 'searchicon'
            },
            bartext: 'Explore',
            redirect: '/explore',
        },
        {
            img: {
                src: config.SIDEBAR_MESSAGE,
                id: 'messageicon'
            },
            bartext: 'Messages',
            redirect: '/chat',
            Count: chatNotificationCount
        },
        {
            img: {
                src: config.SIDEBAR_NOTIFICATION,
                id: 'notification'
            },
            bartext: 'Notifications',
            redirect: '/notification',
            Count: notificationCount
        },
        {
            img: {
                src: config.SIDEBAR_SCHEDULE,
                id: 'scheduleicon'
            },
            bartext: 'Video Call Schedule',
            redirect: '/video-schedule',
        },
        {
            img: {
                src: config.SIDEBAR_ORDER,
                id: 'bagicon'
            },
            bartext: 'My Orders',
            redirect: '/my-orders',
            Count: orderCount
        },
        {
            img: {
                src: MY_VAULT_LOGO,
                id: 'myVault'
            },
            bartext: lang.myVault,
            redirect: '/my-vault',
        },
        {
            img: {
                src: DASHBOARD_ICON,
                id: 'dashboard_icon'
            },
            bartext: lang.dashboard,
            redirect: '/insights',
        },
        {
            img: {
                src: config.SIDEBAR_USER,
                id: 'usericon'
            },
            bartext: 'My Profile',
            redirect: '/profile',
        },
        {
            img: {
                src: config.SIDEBAR_MORE,
                id: 'moreicon'
            },
            bartext: 'More',
            redirect: '/favourites',
            icon: true,
        },
    ]
    const handleRedirect = (url) => {
        if (selectedCreatorId) {
            removeCookie("selectedCreator");
            removeCookie("selectedCreatorId");
            dispatch(setSelectCreator())
            if (window.mqttAppClient) {
                try {
                    window.mqttAppClient.disconnect();
                } catch (e) {
                    console.log(e);
                }
            }
        }
        router.push(url)
    }
    const agencyMenuContent = [
        {
            label: "Agency Creators",
            isCreator: true,
            active: router.pathname === "/homePageAgency" ? true : false,
            onClick: () => handleRedirect("/homePageAgency"),
            url: "/homePageAgency"
        },
        {
            label: "Agency Employee",
            isCreator: true,
            onClick: () => handleRedirect("/agencyEmployee"),
            active: router.pathname === "/agencyEmployee" ? true : false,
            url: "/agencyEmployee"
        },
        {
            label: "Agency Wallet",
            isCreator: true,
            onClick: () => handleRedirect("/wallet"),
            active: router.pathname === "/wallet" ? true : false,
            url: "/wallet"
        },
        {
            label: "Agency Profile",
            isCreator: true,
            onClick: () => handleRedirect("/agencyProfile"),
            active: router.pathname === "/agencyProfile" ? true : false,
            url: "/agencyProfile"
        },
        {
            label: "My Profile",
            isCreator: true,
            onClick: () => handleRedirect("/agencyMyprofile"),
            active: router.pathname === "/agencyMyprofile" ? true : false,
            url: "/agencyMyprofile"
        }
    ]
    const togleHanler = () => {
        if (selectedCreatorId) {
            removeCookie("selectedCreator");
            dispatch(setSelectCreator())
        }
        setDropdownVisible(false);
        setIsSlect(true);
        router.push('/my_profile');
    }
    const handleCreatePost = () => {
        if (profile && [5, 6].includes(profile.statusCode)) {
            return drawerToast({
                closing_time: 15000,
                title: lang.submitted,
                desc: lang.unverifiedProfile,
                closeIconVisible: true,
                button: {
                    text: lang.contactUs,
                    onClick: () => {
                        sendMail();
                    },
                },
                titleClass: "max-full",
                autoClose: true,
                isMobile: false,
            });
        }
        else {
            open_dialog("POST_DIALOG", {
                story: false,
                disableEnforceFocus: true
            })
        }
    }

    const clickHandler = (index, items) => {
        setActiveTab(index)
        if (items.redirect) {
            router.push(items.redirect)
        } else return;
    }
    const moreSideBarMethod = (index) => {
        return (props?.withMore && index == ((userType || profile.userTypeCode) == 1 ? usermenubarcontent : creatormenubarcontent).length - 1)
    }
    const SideBarMenu = () => {
        return (
            <div className='row mx-0 side_tab_section overflowY-auto scroll-hide' style={{ maxHeight: `calc(calc(var(--vhCustom, 1vh) * 100) - ${profile.userTypeCode === 1 ? "6.5rem" : "9.7rem"})` }}>
                {(!(auth || profile?._id) ? guestMenuBarContent : ((userType || profile.userTypeCode) == 1 ? usermenubarcontent : creatormenubarcontent))?.map((items, index) => {
                    return (
                        <div className='col-12 px-0 mb-1' onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover('')} key={index}>
                            <div className={(items.redirect === pathname || moreSideBarMethod(index)) && "sidebar_tab_content"} style={{ padding: '1px' }} >
                                <div style={{ borderRadius: '100px' }}>
                                    <div className={`d-flex flex-row flex-nowrap align-items-center cursorPtr  ${(items.redirect === pathname || moreSideBarMethod(index)) ? "sidebar_content specific_section_bg" : "text_inctive_clr"}`} style={{ padding: '9px 20px' }} onClick={() => clickHandler(index, items)}>
                                        <Icon
                                            icon={`${items?.img?.src}#${items?.img?.id}`}
                                            viewBox="0 0 32 32"
                                            width="21"
                                            height="21"
                                            color={(items.redirect === pathname || moreSideBarMethod(index) || hover === index) ? "var(--l_base)" : `${theme?.type === "light" ? "#5F596B" : "#F5D0FF"}`}
                                            class='sidebar_icons'
                                        />
                                        <div className='dv__fnt13 d-flex align-items-center justify-content-between w-100' style={{ letterSpacing: '0.3px', marginLeft: "10px" }}>
                                            <div className={items.redirect === pathname || moreSideBarMethod(index) || hover === index ? "gradient_text font-weight-500" : ""}>
                                                {items?.bartext}
                                            </div>
                                            {items?.Count !== 0 && items?.Count != undefined && items?.Count != null && <p className="m-0 d-flex justify-content-center align-items-center fntSz9 chatCountCss white cursorPtr ml-2 dv_base_bg_color">{items.Count < 100 ? items.Count : "99+"}</p>}
                                        </div>
                                        {items?.icon && <div>
                                            <Icon
                                                icon={`${config.Right_Chevron_Base}#right_arrow`}
                                                viewBox="0 0 96 45"
                                                width={24}
                                                height={24}
                                                color={(items.redirect === pathname || moreSideBarMethod(index) || hover === index) ? "var(--l_base)" : `${theme?.type === "light" ? "#5F596B" : "#F5D0FF"}`}
                                                class="sidebar_icons"
                                            />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    return (
        <>
            {props?.fullbar ? <div className='overflow-hidden' style={{ margin: "13px 20px" }}>
                <div className='d-flex flex-row flex-nowrap align-items-end justify-content-between mt-2 mb-3'>
                    <div className='' onClick={() => router.push('/')}>
                        <FigureImage
                            src={theme?.type === "light" ? JUICY_HEADER_DARK_LOGO : JUICY_HEADER_LOGO}
                            width={`${userType !== "3" ? "105" : "150"}`}
                            height={`${userType !== "3" ? "50" : "70"}`}
                            fclassname="m-0 cursorPtr"
                            id="logoUser"
                            alt="logoUser"
                        />
                    </div>
                    <div className='d-flex flex-nowrap flex-row align-items-center cursorPtr'>
                        {auth && !IsAgency && <div className='rounded-pill mr-2 d-flex align-items-center justify-content-center' style={{ border: '1px solid var(--l_border)', width: "32px", height: "32px" }} onClick={() => router.push('/wallet')}>
                            <Image
                                src={SIDEBAR_WALLET}
                                width="21"
                                height="21"
                            />
                        </div>}
                        <div className="cursorPtr rounded-pill d-flex align-items-center justify-content-center" style={{ border: '1px solid var(--l_border)', width: "32px", height: "32px" }}>
                            {theme?.type === "light" ? (
                                <Image
                                    src={Dark_moon}
                                    width="19"
                                    height="19"
                                    onClick={(e) => props?.changeTheme(e)}
                                />
                            ) : (
                                <Image
                                    src={White_sunny}
                                    width="19"
                                    height="19"
                                    onClick={(e) => props?.changeTheme(e)}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    {IsAgency ? <div className='col-12 px-0'>
                        <div className='col-12 divclass cursorPtr px-0'>
                            {IsAgency && userRole === "ADMIN" ? <Accordion
                                theme={theme}
                                items={agencyMenuContent}
                                defaultExpanded={props.agencyMenuOpen}
                                isAgency
                            >
                                <span className='gradient-text bgColor'>Agency</span>
                            </Accordion>
                                :
                                userType === "3" && userRole !== "ADMIN" &&
                                <div className={`myProfile col-12 d-flex align-items-center position-relative ${router.pathname === "/my_profile" ? "borderActive" : "borderInactive"}`}
                                    onClick={togleHanler}>
                                    <span className={`${isSelect ? "gradient-text" : "text-muted"} pl-3`}>{lang.myProfile}</span>
                                </div>
                            }
                        </div>
                        <div className='bgColor mt-3'>
                            <div className='col-12 px-0' onClick={() => setIsSlect(false)}>
                                <AgencySelect
                                    dropdownVisible={dropdownVisible}
                                    setDropdownVisible={setDropdownVisible}
                                />
                            </div>

                        </div>
                    </div> : ""}
                </div>
                {(IsAgency && selectedCreatorId) ?
                    SideBarMenu()
                    :
                    <>
                        {!IsAgency && SideBarMenu()}
                    </>
                }
                {((IsAgency && !!selectedCreatorId) || ((userType || profile?.userTypeCode) == 2)) ? <div>
                    <Button
                        type="button"
                        fclassname='gradient_bg rounded-pill py-2 mt-3 d-flex align-items-center justify-content-center text-white'
                        btnSpanClass='text-white'
                        leftIcon={{ src: config?.SIDEBAR_CREATE, id: "createicon" }}
                        iconHeight={19}
                        iconWidth={19}
                        iconClass='mr-1'
                        btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                        onClick={handleCreatePost}
                        children={'Create'}
                    />
                </div> : ""
                }
                {!auth ? <div className='position-absolute w-100 p-3' style={{ left: "0px", bottom: "0px" }}>
                    <Button
                        type="button"
                        fclassname='gradient_bg rounded-pill py-2 mt-3 d-flex align-items-center justify-content-start text-white'
                        btnSpanClass='text-white'
                        leftIcon={{ src: config?.SIDEBAR_USER, id: "usericon" }}
                        iconHeight={22}
                        iconWidth={22}
                        iconClass='mr-1'
                        btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                        onClick={() => window.open("/signup-as-user", "_self")}
                        children={'Signup'}
                    />
                </div> : ""}
            </div> :
                <div style={{ margin: '0.98rem' }}>
                    <div className='d-flex flex-row flex-nowrap align-items-center justify-content-center my-2'>
                        <div className='' onClick={() => router.push('/')}>
                            <FigureImage
                                src={LOGO_SIDEBAR}
                                width="60"
                                height='60'
                                fclassname="m-0 cursorPtr"
                                id="logoUser"
                                alt="logoUser"
                            />
                        </div>
                    </div>
                    <div className='row mx-0 side_tab_section'>
                        {(!(auth || profile?._id) ? guestMenuBarContent : ((userType || profile.userTypeCode) == 1 ? usermenubarcontent : creatormenubarcontent))?.map((items, index) => {
                            return (
                                <Tooltip title={items?.bartext}>
                                    <div className='col-12 px-0 my-1' onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover('')}>
                                        <div className={items.redirect === pathname && "sidebar_tab_content"} style={{ padding: '1px' }} >
                                            <div style={{ borderRadius: '8px' }}>
                                                <div className={`d-flex flex-row flex-nowrap p-2 align-items-center justify-content-center cursorPtr ${items.redirect === pathname && "sidebar_content specific_section_bg"}`} onClick={() => clickHandler(index, items)}>
                                                    <Icon
                                                        icon={`${items?.img?.src}#${items?.img?.id}`}
                                                        viewBox="0 0 32 32"
                                                        width="21"
                                                        height="21"
                                                        class='sidebar_icons'
                                                        color={(items.redirect === pathname || moreSideBarMethod(index) || hover === index) ? "var(--l_base)" : `${theme?.type === "light" ? "#5F596B" : "#F5D0FF"}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>
                            )
                        })}
                    </div>
                    {!(auth || profile?._id) ?
                        <div className='position-absolute w-100 p-3' style={{ left: "0px", bottom: "0px" }}>
                            <Icon
                                type="button"
                                icon={config?.SIDEBAR_USER + "#usericon"}
                                viewBox="0 0 32 32"
                                width="21"
                                height="21"
                                onClick={() => window.open("/signup-as-user", "_self")}
                                class='sidebar_icons gradient_bg rounded-pill py-2 mt-3 d-flex align-items-center justify-content-center text-white cursorPtr'
                            />
                        </div>
                        :
                        ((userType || profile.userTypeCode) != 1) && <div>
                            <Icon
                                type="button"
                                icon={config?.SIDEBAR_CREATE + "#createicon"}
                                viewBox="0 0 32 32"
                                width="21"
                                height="21"
                                onClick={handleCreatePost}
                                class='sidebar_icons gradient_bg rounded-pill py-2 mt-3 d-flex align-items-center justify-content-center text-white cursorPtr'
                            />
                        </div>}
                </div>
            }
            <style jsx>{`
            
            .sidebar_icons{
                background: red;
                color: red !important;
            }
            :global(.sidebar_tab_content){
                background: linear-gradient(96.81deg, #D33AFF 0%, #FF71A4 100%);
                padding: 1px;
                border-radius: 100px;
                // transform: scale(1.055);
                transition: all 0.4s ease-in-out;
            }
           :global(.sidebar_content){
                padding: 1px;
                border-radius: 100px;
                color: white;
            }
            :global(.chatCountCss){
                border-radius: 50%;
                height: 18px;
                width: 18px;
                line-height: 0px;
              }
              :global(.MuiAccordion-root){
                background: var(--l_profileCard_bgColor)!important;
                border-radius: 33px !important;
                width: 100%;
              }
              .gradient-text {
                background-color: #f3ec78;
                background-image: linear-gradient(#FF71A4, #D33BFE);
                background-size: 100%;
                font-size:15px;
                text-align:left;
                -webkit-background-clip: text;
                -moz-background-clip: text;
                -webkit-text-fill-color: transparent; 
                -moz-text-fill-color: transparent;
            }
              :global(.MuiAccordion-root:active), :global(.MuiAccordion-root:focus){
                background: var(--l_profileCard_bgColor) !important;
              }
              :global(.MuiCollapse-wrapperInner ){
                background:var(--l_profileCard_bgColor) !important;
                border-radius: 33px !important;
                display:flex !important;
                flex-direction:cloumn !important;
                width:15vw !important;
              }
              :global(.heading){
                text-align:center !important;
                display:flex !important;
                align-item:center !important;
              }
              :global(.lableClass){
                color:var(--l_app_text) !important;
              }
              :global(.MuiAccordionSummary-root.agencyMenu){
                border:2px solid #FE6FA6 !important;
              border-radius: 33px !important;
              }
              :global(.MuiAccordionSummary-root .Mui-expanded),
              :global(.Mui-expanded){
                min-height:0px !important;
                margin:0px 0px !important;
              }
              :global(.MuiIconButton-edgeEnd){
                margin-right:0px !important;
              }
              :global(.MuiAccordionSummary-expandIcon){
                color:#495057 !important;
              }
              :global(.heading){
                text-align:left !important;
              }
              :global(.MuiAccordionSummary-content.summary){
                justify-content:left !important;
              }
              :global(.MuiAccordionDetails-root.selectlable){
                background: var(--l_section_bg);
                color:var(--l_app_text) !important;
                border-radius:5px !important;
                width:13vw !important;
                padding:10px !important;
              }
              :global(.agencyBackground){
                background: none !important;
              }
              :global(.lableClass:hover),
              :global(.labelactive){
                background-image: linear-gradient(#FF71A4, #D33BFE) !important;
                background-size: 100%;
                -webkit-background-clip: text;
                -moz-background-clip: text;
                -webkit-text-fill-color: transparent; 
                -moz-text-fill-color: transparent;
              }
              :global(.MuiCollapse-root){
                margin-top:2vh !important;
              }
              .sideBorder{
                border-right:1px solid #D7D7D7 ;
                width:21%;
                overflow-y:auto;
              }
              :global(.MuiCollapse-wrapperInner){
                padding-left:1vw;
              }
              .myProfile{
                width:20vw;
                height:7vh;
                border-radius:33px;
              }
              .borderActive{
                border:2px solid #FE6FA6;
              }
              .borderInactive{
                border:2px solid #D7D7D7;
              }
              .arrow_on_down{
                top:31%;
                transform: rotate(90deg) !important;
                 left: 88.5%;
              }
              .arrow_on_up{
                top:31%;
                transform: rotate(270deg) !important;
                 left: 88%;
              }
        `}</style>
        </>
    )
}

export default DvSidebar