import Router from "next/router";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { close_drawer, open_drawer, returnLogin } from "../lib/global";
import { getCookie, getCookiees } from "../lib/session";
import { getUserNotifications, notificationUnreadCount } from "../services/notification";
import { findDayAgo } from "../lib/date-operation/date-operation";
import {
    NOTIFICATION_PLACEHOLDER,
} from "../lib/config";
import useLang from "../hooks/language";
import { getNotificationCount } from "../redux/actions/auth";
import PaginationIndicator from "../components/pagination/paginationIndicator";
import CustomDataLoader from "../components/loader/custom-data-loading";
import { getSharedPost, getStories } from "../services/assets";
import isMobile from "../hooks/isMobile";
import { guestLogin } from "../lib/global/guestLogin";
import { open_dialog } from "../lib/global/loader";
import { otherProfileData } from "../redux/actions/otherProfileData";
import MobilePostView from "./mobileGridView/MobilePostView";
import Model from "./model/model";
import { isAgency } from "../lib/config/creds";
import { handleContextMenu } from "../lib/helper";
import CommonHeader from "./commonHeader/commonHeader";

const FigureCloudinayImage = dynamic(() => import("../components/cloudinayImage/cloudinaryImage"), { ssr: false });
const Header = dynamic(() => import("../components/header/header"), { ssr: false });
const Img = dynamic(() => import("../components/ui/Img/Img"), { ssr: false });
const CustomSlider = dynamic(() => import("./CustomSlider"), { ssr: false });

const Notification = (props) => {
    const [lang] = useLang();
    const theme = useTheme();
    const dispatch = useDispatch();
    let userId = getCookie("uid");
    let userType = getCookie("userType");
    const [mobileView] = isMobile();
    const [count, setCount] = useState(0)
    const slider = React.useRef(null);
    const [notifyType, setNotifyType] = useState();
    // const [notificationHeight, setNotificationHeight] = useState('auto')
    const [notifyTypeArray, setNotifyTypeArray] = useState([
        {
            label: 'All',
            notifyType: null,
        },
        {
            label: "Purchases",
            notifyType: [6, 16, 44]
        },
        {
            label: "Tips",
            notifyType: 12
        },
        {
            label: "Subscriptions",
            notifyType: 35,
        },
        {
            label: "Virtual Requests",
            notifyType: [36, 37, 39, 50, 48],
        },
        {
            label: "Mentions",
            notifyType: 41,
        },
        {
            label: "Live Streams",
            notifyType: [42, 60]
        },
        {
            label: "Stories",
            notifyType: 13,
        },
        {
            label: "Comments",
            notifyType: [2, 49],
        },
        {
            label: "Follows",
            notifyType: 3,
        },
        {
            label: "Likes",
            notifyType: 1,
        }
    ])
    const [notifyTypeArrayUser, setNotifyTypeArrayUser] = useState([
        {
            label: 'All',
            notifyType: null,
        },
        {
            label: "Mentions",
            notifyType: 41,
        },
        {
            label: "Stories",
            notifyType: 13,
        },
        {
            label: "Live Streams",
            notifyType: [42, 60]
        },
        {
            label: "Virtual Requests",
            notifyType: [36, 37, 39, 50, 48],
        },
    ])
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

    const settings = {
        dots: false,
        slidesToScroll: 1,
        vertical: false,
        swipeToSlide: true,
        arrows: true,
        infinite: false,
        variableWidth: true,
        afterChange: (current) => setCount(current),
        beforeChange: (current) => setCount((prev) => prev + 1),
    };

    const [loader, setLoader] = useState(true);
    const [pageCount, setPageCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0);
    const [notifications, setNotifications] = useState(null);
    const [isApiResponse, setIsApiResponse] = useState(true);
    const [isModelOpen, setModelOpen] = useState(false)
    const [postData, setPostData] = useState([])

    useEffect(() => {
        getNotifications();
        // return () => close_dialog("PostSlider");
    }, []);
    // useEffect(() => {
    //     setNotificationHeight(getElementMaxHeight([document.getElementById('notificationHeader'), document.querySelector('.sectionHeading'), document.querySelector('.notifyFilters')], '100vh'))
    // }, [])
    const postHandler = async (postid) => {
        let response = {};
        let token = getCookiees("token");
        try {
            if (!token) {
                const guestData = await guestLogin();
                token = guestData.token;
            }
            response = await getSharedPost(postid, props.referId, decodeURI(token));
            if (response.status == 200) {
                const results = response?.data?.result[0] || {}
                setPostData(results);
                dispatch(otherProfileData([results]));
                {
                    results && mobileView ? setModelOpen(true) : open_dialog("PostSlider", {
                        profileLogo: results.profilePic,
                        price: results.price,
                        currency: results.currency || {},
                        postImage: results.postImage,
                        postType: results.postType,
                        isBookmarked: results.isBookmarked,
                        profileName: results.firstName,
                        onlineStatus: results.creationTs,
                        likeCount: results.likeCount,
                        commentCount: results.commentCount || results.commentCount_x || results.commentCount_y,
                        postDesc: results.description,
                        postId: results.postId || id,
                        userId: results.userId,
                        isLiked: results.isLike,
                        username: results.username || results.userName,
                        totalTipReceived: results.totalTipReceived, // not available
                        followUnfollowEvent: results.followUnfollowEvent,
                        isVisible: results.isVisible || 0,
                        taggedUsers: results.taggedUsers,
                        isFollow: results.isFollowed || 0,
                        postToShow: 0,
                        isOtherProfile: results.isOtherProfile,
                        setPage: () => { },
                        page: results.page,
                        setNeedApiCall: results.setNeedApiCall,
                        getPersonalAssets: results.getPersonalAssets,
                        adjustWidth: true,
                        otherPostSlider: true,
                        allData: [results],
                        userType: results.userType,
                    })
                }
            }
        } catch (e) {
            console.error("Error in getInitialProps", e);
        }
    }

    const handleOpenStory = async (item) => {

        // API Call
        let payload = {
            skip: 0,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        const res = await getStories(payload);
        if (res.status === 200 && res.data?.data?.length) {
            const storyData = [...res.data.data];
            const activeIndex = storyData.findIndex((story) => story?.userId === item?.metaData?.userId);

            const propsToPass = {
                drawerData: storyData,
                activeStory: activeIndex,
                // setActiveState: setActiveState,
                theme: theme,
                back: () => close_drawer(),
            }
            open_drawer(mobileView ? "STORY_CAROUSEL_MOB" : "STORY_CAROUSEL_DESKTOP", propsToPass, "right");
        };
    }

    const clickOnNotification = (item = {}) => {
        // This Notification Flow is for MobileView

        switch (item?.notifyType) {

            case 1:
            case 2:
            case 6:
            case 46:
                return Router.push(`/post/${item.metaData?.assetId || item.metaData?.id}`);

            case 0:
                return Router.push(`/live/popular`);

            case 3:
                if (item.metaData.userTypeCode === 2) {
                    return Router.push(`/${item?.metaData?.userName} `);
                }

            case 13:
                handleOpenStory(item);
                break;

            case 41:
                return Router.push(`/post/${item.metaData?.postId}`)
            case 49:
                return Router.push(`/post/${item.metaData?.postId}?commentId=${item.metaData?.commentId}`)
            case 43:
            case 44:
                return Router.push(`/chat?uid=${item.metaData?.userId}`)

            case 14:
            case 25:
            case 26:
            case 27:
            case 28:
                return;
            case 15:
                return Router.push(`/profile`)

            case 16:
            case 35:
            case 45:
            case 12:
            case 42:
                return Router.push('/wallet');

            case 36:
                return Router.push('/my-orders');

            case 37:
            case 38:
            case 39:
                return Router.push(`/virtual-request`);

            case 40:
                if (item?.userType == 1) {
                    return Router.push('virtual-request')
                }
                else {
                    return Router.push('/my-orders')
                }
            case 50:
            case 48:
                if (item?.metaData.purchasedById === userId) Router.push('/virtual-request');
                else Router.push('/my-orders');
                break;
            case 53:
            case 51:
                return Router.push('/profile')

            default:
                return close_drawer();
        }
    };


    const getNotification = (data = {}, lastIndex = false) => {
        const { metaData = {} } = data;
        return (
            <div
                className="row align-items-start justify-content-center mx-0 mb-2"
                onClick={() => clickOnNotification(data)}
            >
                <div className="col-auto pl-0 pr-3 d-flex align-items-center callout-none" onContextMenu={handleContextMenu}>
                    {!data?.body?.includes("anonymous")
                        ? metaData?.userProfilePic || data?.metaData?.profilePic || data?.image
                            ? <FigureCloudinayImage
                                publicId={metaData?.userProfilePic || data?.metaData?.profilePic || data?.image}
                                width={60}
                                height={60}
                                ratio={1}
                                className="avatarProfile"
                            />
                            : <Avatar className="mui-cust-avatar">
                                <span>{metaData?.userName?.[0] || data?.userName?.[0]}</span>
                            </Avatar>
                        : <Avatar className="mui-cust-avatar" src="/not-pic-specified.jpg" />
                    }
                </div>

                <div className={`col-9 col-sm-10 px-0 d-flex flex-column align-items-start pb-3 ${lastIndex && "borderBtm"}`}>
                    <h6 className="light_app_text">
                        {data.title}
                    </h6>

                    <div className="fntSz13">
                        <span className="mr-2">{data.body}</span>
                        <span className="bullet fntSz16">&#8226;</span>
                        <span className="light_app_text w-500 ml-2">{data.createdtimestamp && findDayAgo(data?.createdtimestamp, true)}</span>
                    </div>
                </div>
                <style jsx>{`
                :global(.avatarProfile){
                    height:60px !important;
                    width::60px !important;
                    border-radius:50% !important;
                    object-fit:cover !important;
                }
                .bullet {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    text-align: center;
                    vertical-align: middle;
                    line-height: 10px;
                }
                `}</style>
            </div>
        );
    };

    const getNotifications = async (page = 0, notifyType = "") => {
        setNotifyType(notifyType)
        setLoader(true);
        try {
            const payload = {
                skip: page * 10,
                limit: 10,
            }
            if (notifyType) {
                payload["notifyType"] = notifyType;
            }
            if (isAgency()) {
                payload["userId"] = selectedCreatorId;
            }
            let data = await getUserNotifications(payload);
            let dataToShow;
            if (data.data.data.some(dataItem => dataItem.notifyType === 15 || dataItem.notifyType === 25 || dataItem.notifyType === 49)) {
                dataToShow = data.data.data;
            } else {
                dataToShow = data.data.data.filter(dataItem => dataItem.userMetaData._id !== userId);
            }
            if (!dataToShow?.length) {
                setIsApiResponse(false)
            }

            if (page === 0) {
                setNotifications(dataToShow);
            } else {
                setNotifications([...notifications, ...dataToShow]);
            }
            setTotalCount(data.data.total_count);

            if (page === 0 && window['myPrevRoute'] && !window['myPrevRoute']?.includes?.('/login')) {
                let notificationCnt = await notificationUnreadCount();
                dispatch(getNotificationCount(notificationCnt?.data?.unreadCount));
            }
            setPageCount(page + 1);
            setLoader(false);


        } catch (err) {
            console.error("ERROR IN getNotifications", err);
            setLoader(false);
        }
    };

    const notificationTimeFilter = (item) => {
        return (Math.ceil((Date.now() - item?.createdtimestamp * 1000) / 86400000) < 7)
    }

    const weekArray = [];
    const monthArray = [];

    notifications && notifications.length > 0 && notifications.forEach((item) => {
        if (notificationTimeFilter(item)) {
            weekArray.push(item)
        } else {
            monthArray.push(item)
        }
    });

    return (
        <div className="d-flex w-100">
            <div
                className="text-app wrap d-flex flex-column w-100 position-relative overflow-auto"
                style={{ height: "calc(var(--vhCustom, 1vh) * 100)" }}
                id="notificationBody"
            >
                {mobileView ? <div>
                    <Header
                        id="notificationHeader"
                        back={props.onClose}
                        closeTrigger={props.onCloseDrawer}
                        title={"Notifications"}
                    />
                </div> :
                    <div className="sticky-top borderBtm d-flex flex-row align-items-center">
                        <CommonHeader
                            title={"Notifications"}
                        />
                    </div>
                }
                <div className="notifyFilters w-100" style={{ paddingTop: `${mobileView ? '60px' : '0px'}` }}>
                    <CustomSlider options={userType === "1" ? notifyTypeArrayUser : notifyTypeArray} onChange={(index, notifyType) => getNotifications(0, notifyType)} />
                </div>
                <div className="col-12 cursorPtr">
                    {notifications && notifications.length > 0
                        ? (<>
                            {weekArray && weekArray.length > 0 && <h6 className="text-app">This Week</h6>}
                            {weekArray && weekArray.length > 0 && <div className={`py-2 specific_section_bg radius_16 ${theme.type === "light" && "borderStroke"}`}>{weekArray && weekArray.map((notification, index) => {
                                return <div key={index} className="mt-0 mt-2 px-2 px-sm-0">{getNotification(notification, (index < (weekArray?.length - 1)))}</div>;
                            })}</div>}
                            {monthArray && monthArray.length > 0 && <h6 className="text-app mt-3">This Month</h6>}
                            {monthArray && monthArray.length > 0 && <div className={`py-2 specific_section_bg radius_16 ${theme.type === "light" && "borderStroke"}`}>{monthArray && monthArray.map((notification, index) => {
                                return <div key={index} className="mt-0 mt-sm-2 px-2 px-sm-0">{getNotification(notification, (index < (monthArray?.length - 1)))}</div>;
                            })}</div>}
                        </>)
                        : !loader ?
                            <div className="d-flex flex-column justify-content-center w-100 align-items-center" style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 130px)" }}>
                                <Img
                                    height="80px"
                                    src={NOTIFICATION_PLACEHOLDER}
                                    alt="Notification Placeholder image"
                                />
                                <p className="mt-3 text-app bold">
                                    {lang.noNotifications}
                                </p>
                            </div>

                            : ""}
                    {loader && <div className="d-flex align-items-center justify-content-center py-4">
                        <CustomDataLoader loading={loader} />
                    </div>}
                </div>
                <PaginationIndicator
                    id="notificationBody"
                    totalData={notifications + 1}
                    totalCount={totalCount}
                    checkHeight={true}
                    pageEventHandler={(repeat) => {
                        if (!loader && isApiResponse) {
                            getNotifications(pageCount, notifyType)
                        }
                        if (repeat) {
                            getNotifications(pageCount + 1, notifyType)
                        }
                    }}
                />
            </div>
            {mobileView && <Model
                open={isModelOpen}
                className={"full_screen_dialog vw-100"}
                // closeIcon={true}
                keepMounted={true}
                fullScreen={true}
            >
                <MobilePostView
                    onClose={() => setModelOpen(false)}
                    // selectedPost={results.selectId}
                    posts={[postData]}
                    id="search-page"
                    title={postData.username}
                    isLockedPost={postData.isLockedPost}
                />
            </Model>}
        </div>
    );
};

Notification.getInitialProps = async ({ Component, ctx }) => {
    const { query = {}, req, res } = ctx;
    const referId = query.slug[1];

    const auth = getCookiees("auth", req);
    if (auth) return returnLogin(req, res);
    return { referId: referId };
};

export default Notification;
