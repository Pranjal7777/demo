import React, { useCallback, useEffect, useState } from 'react'
import { CLOSE_ICON_BLACK, CLOSE_ICON_WHITE_IMG } from '../../lib/config';
import { useTheme } from 'react-jss';
import Button from '../../components/button/button';
import { getSuggetions } from '../../services/explore';
import { getHashtagsAPIForExplore, getPopularHashtagsAPI, getRandomCreatorApi, getRecentSearchAPI, recentSearchAPI } from '../../services/hashtag';
import { Toast, close_progress, open_dialog, open_drawer, open_progress } from '../../lib/global/loader';
import { getBannerImgs, getRecentSearches } from '../../redux/actions';
import UserTile from '../../components/Drawer/UserTile';
import useLang from '../../hooks/language';
import { authenticate } from '../../lib/global/routeAuth';
import { getCookie, setCookie } from '../../lib/session';
import { NO_HASHTAG, NO_RECENT_SEARCH } from '../../lib/config/placeholder';
import { FOLLOW_FOLLOWING } from '../../lib/config/header';
import Img from '../../components/ui/Img/Img';
import Icon from '../../components/image/icon';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from '../../components/header/header';
import { backArrow } from '../../lib/config/homepage';
import isMobile from '../../hooks/isMobile';
import FigureCloudinayImage from '../../components/cloudinayImage/cloudinaryImage';
import CustomDataLoader from '../../components/loader/custom-data-loading';
import ImageSlider from '../../components/hastag/image-slider';
import { useDispatch, useSelector } from "react-redux";
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { getBanner } from '../../services/user_category';
import { otherProfileData } from '../../redux/actions/otherProfileData';
import { CLOSE_ICON_WHITE, JUICY_HEADER_DARK_LOGO, LOGO_SIDEBAR } from '../../lib/config/logo';
import AllPost from '../profile/all-post';
import { getTeaserPostsApi } from '../../services/assets';
import Image from '../../components/image/image';
import PaginationIndicator from '../../components/pagination/paginationIndicator';
import ReactCountryFlag from 'react-country-flag';
import { handleContextMenu } from '../../lib/helper';
import FigureImage from '../../components/image/figure-image';
import debounce from 'lodash/debounce';
import useProfileData from '../../hooks/useProfileData';
import { commonHeader } from '../../lib/request';
import CommonHeader from '../../components/commonHeader/commonHeader';


const Avatar = dynamic(() => import("@material-ui/core/Avatar"));

const ExploreSearch = (props) => {
    const theme = useTheme();
    const [lang] = useLang();
    const userId = getCookie("uid");
    const router = useRouter();
    const dispatch = useDispatch();
    const [mobileView] = isMobile();
    const [activeSearchTab, setActiveSearchTab] = useState("postShow");
    const [hastagUserSearch, setHastagUserSearch] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [hashtagList, setHashtagList] = useState([]);
    const [loader, setLoader] = useState(false);
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const BANNER_IMGS = useSelector((state) => state?.desktopData?.hashtagPage?.bannerImgs);
    const ChangeTheme = useSelector((state) => state?.commonUtility?.changeThemeUtility);
    const [activeSearch, setActiveSearch] = useState(false);
    const [postData, setPostData] = useState([]);
    const [creatorData, setCreatorData] = useState([]);
    const [selectId, setId] = useState("");
    const [isModelOpen, setModelOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [recentSearch, setRecentSearch] = useState(false);
    const auth = getCookie("auth");
    const [profile] = useProfileData();

    const getPostShowData = async () => {
        setLoader(true);
        try {
            const res = await getTeaserPostsApi({
                page: pageCount || 1,
                postType: 3,
            });
            if (res?.status === 200) {
                setPageCount(pageCount + 1);
                setHasMore(true);
                if (pageCount === 1) {
                    setPostData(res?.data?.result);
                } else {
                    setPostData((prev) => ([...prev, ...res?.data?.result]));
                }
            } else {
                setHasMore(false);
            }
            setLoader(false);
        } catch (error) {
            setHasMore(false);
            setLoader(false);
            console.log(error);
        }
    };

    const getCreatorShowData = async () => {
        setLoader(true);
        try {
            const res = await getRandomCreatorApi(1);
            if (res?.status === 200) {
                setCreatorData(res?.data?.data)
            }
            setLoader(false);
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    }

    const getSearchResult = async (hastagUserSearch) => {

        if (activeSearchTab === "user" && !hastagUserSearch) return;
        setRecentSearch(false);
        setLoader(true);
        try {
            if (activeSearchTab === "user") {
                const res = await getSuggetions(hastagUserSearch, 10, 0);
                setUsersList(res?.data?.data);
            } else {
                let payload = {
                    limit: 5,
                    set: 0,
                    mobileView: mobileView,
                };
                if (hastagUserSearch) {
                    payload.searchValue = hastagUserSearch.startsWith("#") ? hastagUserSearch.slice(1) : hastagUserSearch;
                }
                const res = await getPopularHashtagsAPI(payload);
                setHashtagList(res.data.result);
            }
            setLoader(false);
        } catch (err) {
            console.error("ERROR IN searchResult ", err);
            Toast(err?.response?.data?.message || lang.errorMsg, "error");
            setLoader(false);
        }
    }

    // Create a debounced version of searchResult with a 500ms delay
    const debouncedSearchResult = useCallback(debounce(getSearchResult, 500), [activeSearchTab]); // Adjust the debounce delay as needed

    const searchResult = () => {
        debouncedSearchResult(hastagUserSearch);
    };


    const handelProfile = (profile) => {
        open_progress();
        setCookie("otherProfile", `${profile?.username || profile?.userName}$$${profile?.userId || profile?.userid || profile?._id}`);
        profile.userId == getCookie("uid") ? router.push("/profile") : router.push(`/${profile?.username}`);
    };

    const handleDialog = (flag = true) => {
        setModelOpen(flag);
    };

    const getBannerImage = async () => {
        try {
            let res = await getBanner();
            if (res.status == 200) {
                dispatch(getBannerImgs(res?.data?.data));
            }
        } catch (err) {
            console.error("ERROR IN getBannerImage", err);
            Toast(err?.response?.data?.message, "error");
        }
    }

    const bannerClickHandler = (img) => {
        open_progress();
        if (img?.linkedWith === "USER") {
            setCookie("otherProfile", `${img?.user[0]?.username}$$${img?.user[0]?.userid || img?.user[0]?.userId || img?.user[0]?._id}`);
            router.push(`/${img?.user[0]?.username}`);
        } else if (img?.linkedWith === "LINK") {
            window.open(img?.linkedValue, '_blank');
        } else if (img?.linkedWith === "POST") {
            router.push(`/post/${img?.linkedValue}`);
        } else {
            console.warn("Place your Condition Here");
        }
        close_progress();
    }

    const hashtagPostClick = async (data, index, post, upperIndex, currentPost) => {
        let hashtag = data?.name;
        hashtag = hashtag.slice(1);
        if (mobileView) {
            router.push(`/explore/hashtag?h=${hashtag}&id=${index}`)
        } else {
            const payload = {
                hashtag,
                size: 4,
                page: 1
            }
            const res = await getHashtagsAPIForExplore(payload);
            if (res.status == 200) {
                const result = res.data.result
                dispatch(otherProfileData([...result]))
                open_dialog("PostSlider", {
                    profileLogo: result[currentPost].profilePic,
                    price: result[currentPost].price,
                    currency: result[currentPost].currency || {},
                    postImage: result[currentPost].postData,
                    postType: result[currentPost].postType,
                    isBookmarked: result[currentPost].isBookmarked,
                    profileName: result[currentPost].firstName,
                    onlineStatus: result[currentPost].scheduledTimestamp || result[currentPost].postedAt,
                    likeCount: result[currentPost].likeCount,
                    commentCount: result[currentPost].commentCount,
                    postDesc: result[currentPost].description,
                    postId: result[currentPost].postId,
                    userId: result[currentPost].userId,
                    isLiked: result[currentPost].isLike,
                    username: result[currentPost].username || post.userName,
                    totalTipReceived: post.totalTipReceived, // not available
                    // followUnfollowEvent:props.followUnfollowEvent,
                    isVisible: result[currentPost].isVisible || 0,
                    taggedUsers: result[currentPost].taggedUsers,
                    isFollow: result[currentPost].isFollow || 0,
                    allData: result,
                    postToShow: currentPost,
                    isHashtagPost: true,
                    adjustWidth: true,
                })
            }

        }
    }

    const getRecentSearch = async (pageCount) => {
        setRecentSearch(true);
        try {
            setLoader(true);
            const res = await getRecentSearchAPI();
            if (res.status == 200 && !hastagUserSearch) {
                setUsersList(res?.data?.data);
                dispatch(getRecentSearches(res?.data?.data));
            }
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.error("ERROR IN getRecentSearches", err);
        }
    }

    useEffect(() => {
        if (activeSearchTab === "user") {
            searchResult();
        }
        if (activeSearchTab === "hastags") {
            searchResult();
            router.replace('/explore')
        }
        if (activeSearchTab === "postShow" && pageCount === 1) {
            getPostShowData();
        }
        if (activeSearchTab === "creatorShow") {
            getCreatorShowData();
        }
        if (activeSearchTab === "hastags" && !BANNER_IMGS.length) {
            getBannerImage();
        }
        if (activeSearchTab === "user" && !hastagUserSearch && auth) {
            getRecentSearch();
        }
    }, [activeSearchTab, hastagUserSearch]);

    useEffect(() => {
        if (router?.query?.hashtags) {
            setActiveSearch(true);
            setActiveSearchTab("hastags");
        }
    }, [router])

    useEffect(() => {
        if (!router?.query?.hashtags) {
            if (activeSearch) {
                setActiveSearchTab("user");
            } else {
                setActiveSearchTab("postShow");
                setHastagUserSearch("");
            }
        }
    }, [activeSearch])

    const postRecentSearch = async (data) => {
        let commonHeaders = commonHeader();
        try {

            let payload = {
                platform: Number(commonHeaders?.platform),
                ipAddress: commonHeaders?.ipaddress,
                latitude: commonHeaders?.latitude,
                longitude: commonHeaders?.longitude,
                city: commonHeaders?.city,
                country: commonHeaders?.country
            };
            payload = {
                ...payload,
                searchTag: hastagUserSearch,
                type: 1,
                searchId: data._id
            }
            // API Calling (POST)
            const res = await recentSearchAPI(payload);

        } catch (err) {
            console.error("ERROR IN postRecentSearch", err);
            Toast(err?.response?.data?.message, "error");
        }
    }

    const redirectToProfile = (data) => {
        if (hastagUserSearch) postRecentSearch(data);
        open_progress();
        setCookie("otherProfile", `${data?.username?.trim() || data?.userName?.trim()}$$${data?.userId || data?.userid || data?._id}`)
        if (userId === data._id) {
            router.push("/profile")
        } else {
            router.push(`/${data.username || data.userName}`);
        }
    }

    const drawerRedirection = (data) => {
        const hashtagName = data.name ? data.name.slice(1) : data.searchIn;
        router.push(`/explore/${hashtagName}?isexplore=true`);
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
    const handleGuestNavigationMenu = () => {
        open_drawer("GuestSideNavMenu",
            { paperClass: "backNavMenu", setActiveState: props.setActiveState },
            "right"
        );
    };

    const NoDataPlaceholder = () => {
        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center text-center  h-100 w-100"
            >
                {loader ? <div className="d-flex justify-content-center align-items-center mb-3">
                    <CustomDataLoader type="normal" isLoading={loader} />
                </div>
                    : <>
                        {hastagUserSearch === ""
                            ? <Icon
                                icon={`${NO_RECENT_SEARCH}#no_recent_search`}
                                color={theme.palette.l_base}
                                width={150}
                                height={150}
                                viewBox="0 0 152 152"
                            />
                            : activeSearchTab
                                ? <Img
                                    key="empty-placeholder"
                                    className="text"
                                    src={FOLLOW_FOLLOWING}
                                />
                                : <Icon
                                    icon={`${NO_HASHTAG}#hashtag_svg`}
                                    color={theme.palette.l_base}
                                    width={150}
                                    height={150}
                                    viewBox="0 0 152 152"
                                />
                        }
                        <p className="bold mt-3 text-app">
                            {hastagUserSearch === ""
                                ? lang.noRecentSearch
                                : activeSearchTab
                                    ? lang.noUserFound
                                    : lang.noHashtagFound}
                        </p>
                    </>
                }
            </div>
        );
    };

    const coverImg = () => {
        return mobileView
            ? <>
                <div className="d-flex flex-nowrap mb-3 overflowX-auto w-100 scroll-hide">
                    {BANNER_IMGS?.map((img) => (
                        <div className="w-100 mr-2"
                            style={{ aspectRatio: "300/140", minWidth: "100%" }}
                            key={img._id} onClick={() => bannerClickHandler(img)}>
                            <Img
                                src={s3ImageLinkGen(S3_IMG_LINK, img.appImage, 100, null, '27vh')}
                                alt="Cover Image"
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    ))}
                </div>
            </>
            :
            <ImageSlider
                S3_IMG_LINK={S3_IMG_LINK}
                title='hashtag'
                bannerList={BANNER_IMGS}
                bannerClickHandler={bannerClickHandler}
            />
    }

    const MainTile = () => {
        return (
            <>
                {hashtagList.map((data, index) => (
                    <div key={index}
                        className="d-flex flex-column justify-content-center"
                    >
                        {mobileView
                            ? <div className='my-2'>
                                <div
                                    className="d-flex flex-row align-items-center justify-content-between"
                                    onClick={() => {
                                        authenticate().then(() => {
                                            drawerRedirection(data);
                                        });
                                    }}
                                >
                                    <div className='d-flex flex-row align-items-center'>
                                        <div className="">
                                            <Avatar className="hashtags">#</Avatar>
                                        </div>
                                        <div className="pl-2">
                                            <div className="">{data.name}</div>
                                            <div className="">{`${data?.noOfPost || 0} ${data?.noOfPost > 1 ? lang.posts : lang.post}`}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='gradient_text w-500 m-0 cursorPtr px-1'>{lang.viewAll}</p>
                                    </div>
                                </div>
                                <div className="row mx-0 mt-2">
                                    {data?.posts?.map((img) => (
                                        <div className="col-4 p-1 callout-none" onContextMenu={handleContextMenu} key={img?.postId} onClick={() => hashtagPostClick(data, img?.postId, img)}>
                                            <FigureCloudinayImage
                                                publicId={`${img?.postData[0]?.type === 1 ? img?.postData[0]?.url : img?.postData[0]?.thumbnail}`}
                                                className='cursorPtr object-fit-cover radius_8'
                                                transformWidth={102}
                                                height="102"
                                                isVisible={img?.isVisible}
                                                uid={userId}
                                                userId={img?.userId}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            : <div className='my-3 d-flex justify-content-center flex-column'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex align-items-center' onClick={() => drawerRedirection(data)}>
                                        <Avatar className="hashtags mr-2">#</Avatar>
                                        <div className='d-flex flex-column cursorPtr'>
                                            <h4 className='mb-0'>{data.name}</h4>
                                            <span className='light_app_text'>{`${data?.noOfPost} ${data?.noOfPost > 1 ? lang.posts : lang.post}`}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p onClick={() => drawerRedirection(data)} className='gradient_text w-500 m-0 cursorPtr'>{lang.viewAll}</p>
                                    </div>
                                </div>
                                <div className='row mx-0 mt-2 callout-none' onContextMenu={handleContextMenu}>
                                    {data?.posts?.map((img, currentPost) => (
                                        currentPost < 4 && <div className='col-3 p-1' key={img?.postId} onClick={() => hashtagPostClick(data, img?.postId, img, index, currentPost)}>
                                            <FigureCloudinayImage
                                                publicId={`${img?.postData[0]?.type === 1 ? img?.postData[0]?.url : img?.postData[0]?.thumbnail}`}
                                                className='cursorPtr object-fit-cover radius_8'
                                                transformWidth={147}
                                                height="147"
                                                isVisible={img?.isVisible}
                                                uid={userId}
                                                userId={img?.userId}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                ))}
                {loader && (
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <CustomDataLoader type="normal" isLoading={loader} />
                    </div>
                )}
            </>
        )
    }

    const UsersSearch = () => {
        return (
            <ul className="list-unstyled m-0 h-100">
                {recentSearch && <p className='strong_app_text mx-3 w-500'>Recent Search</p>}
                {usersList?.length ? usersList?.map((data) => (
                    <div
                        key={data._id}
                        className='cursorPtr'
                        onClick={() => {
                            redirectToProfile(data)
                        }}
                    >
                        <UserTile
                            auth={authenticate}
                            uUserId={userId}
                            userId={data._id}
                            isFollow={data.follow == 1 ? true : false}
                            {...data}
                            searchBar={true}
                            recentSearch={recentSearch}
                        />
                    </div>
                )) : <NoDataPlaceholder />}
            </ul>
        );
    };

    const HashtagSearch = () => {
        return (
            <div id="scrollEventHashtag" className="h-100 w-100 px-3">
                {hastagUserSearch?.length ?
                    (hashtagList?.length ? hashtagList?.map((data, index) => (
                        <div key={index} className='py-2'>
                            <div
                                className="gap_20 d-flex flex-row justify-content-start align-items-center cursorPtr"
                                onClick={() => {
                                    drawerRedirection(data)
                                }}
                            >
                                <div className="">
                                    <Avatar className="text-capitalize" style={{ color: '#fff' }}>#</Avatar>
                                </div>
                                <div className=" borderBtm w-100 py-1 d-flex flex-row justify-content-between">
                                    <p className="m-0 w-500 fntSz18 text-app">{data.name}</p>
                                    <p className="m-0 fntSz12 w-500 light_app_text">{`${data.noOfPost} ${data.noOfPost > 1 ? lang.posts : lang.post}`}</p>
                                </div>
                            </div>
                        </div>
                    )) : <NoDataPlaceholder />)
                    :
                    <div className="w-100">
                        {coverImg()}
                        {MainTile()}
                    </div>}
                <style jsx>{`
                    :global(.MuiAvatar-colorDefault, .hashtags) {
                    background: ${theme.gradientBgClr};
                    }
                `}</style>
            </div>
        );
    };

    const PostShow = () => {
        return (
            <div className='px-3'>
                <AllPost
                    post={postData}
                    allPost={true}
                    isOtherProfile={mobileView}
                    isMoreMenu={!mobileView}
                    isModelOpen={isModelOpen}
                    handleDialog={handleDialog}
                    title={lang.allPosts}
                    selectId={selectId}
                    postLoader={loader}
                    setId={setId}
                    {...props}
                >
                    allpost
                </AllPost>
                {loader && <div className="text-center">
                    <CustomDataLoader type="normal" isLoading={loader} />
                </div>}
                <PaginationIndicator
                    id="exploreSearchPage"
                    totalData={postData || []}
                    pageEventHandler={() => {
                        if (!loader && hasMore) {
                            getPostShowData();
                        }
                    }}
                />
            </div>
        )
    }

    const CreatorShow = () => {
        return (
            <div className='px-3'>
                {creatorData?.length ?
                    <div className='row mx-0'>
                        {creatorData?.map((data, index) => {
                            return index < 18 && (
                                <div className='col-6 col-md-4 p-1 position-relative cursorPtr' onClick={() => handelProfile(data)}>
                                    <div className='h-100'>
                                        <Image
                                            src={s3ImageLinkGen(S3_IMG_LINK, data?.profilePic, null, 250, 350)}
                                            width="100%"
                                            style={{ filter: "brightness(0.8)" }}
                                            className="radius_12 w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className='position-absolute p-2' style={{ bottom: "4px", left: "4px", zIndex: "9", width: "calc(100% - 8px)", borderRadius: "0px 0px 12px 12px", background: "linear-gradient(180deg, rgba(0, 0, 0, 0) -2.27%, rgba(0, 0, 0, 0.8) 100.01%)" }}>
                                        {/* <div style={{ marginTop: "-1px" }}></div> */}
                                        <div className='d-flex flex-row align-items-center'>
                                            <div>
                                                <Image
                                                    src={s3ImageLinkGen(S3_IMG_LINK, data?.profilePic, null, 40, 40)}
                                                    style={{ width: "42px", heigh: "42px" }}
                                                    className="object-fit-cover rounded-pill"
                                                />
                                            </div>
                                            <div className='pl-2' style={{ maxWidth: "calc(100% - 42px)" }}>
                                                <div className='text-white text-truncate'>{data?.username}</div>
                                                <div className='d-flex flex-row pt-1'>
                                                    <ReactCountryFlag
                                                        countryCode={data?.countryCodeName || "us"}
                                                        aria-label={data?.countryName || "United States"}
                                                        title={data?.countryCodeName || "us"}
                                                        svg
                                                        style={{
                                                            width: '24px',
                                                            height: "18px"
                                                        }}
                                                    />
                                                    <div className='pl-2 text-truncate' style={{ color: "#bbbbbb" }}>{data?.countryName || "USA"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : <NoDataPlaceholder />
                }
            </div>
        )
    }

    const exploreComponents = {
        "user": UsersSearch(),
        "hastags": HashtagSearch(),
        "postShow": PostShow(),
        "creatorShow": CreatorShow(),
    }

    const exploreSearchTabSection = () => {
        return exploreComponents[activeSearchTab]
    }


    return (
        <>
            {mobileView && !auth && <div className='mx-3 pt-2'>
                <FigureImage
                    src={JUICY_HEADER_DARK_LOGO}
                    width="130"
                    height='60'
                    fclassname="m-0 cursorPtr"
                    id="logoUser"
                    alt="logoUser"
                    onClick={() => router.push("/")}
                />
            </div>}
            <div className="sticky-top borderBtm d-flex flex-row align-items-center">
                <div className='w-100'>
                    <CommonHeader
                        title={lang.explore}
                        isSearchBar={"fullWidth"}
                        activeSearch={activeSearch}
                        isProfilePic
                        setSearchResult={(e) => setHastagUserSearch(e.target.value)}
                        setActiveSearch={(value) => setActiveSearch(value)}
                    />
                </div>
                {activeSearch && !mobileView && <Icon
                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                    color={"var(--l_app_text)"}
                    size={16}
                    alt="back_arrow"
                    onClick={() => setActiveSearch(false)}
                    class="cursorPtr mr-3 ml-1"
                    viewBox="0 0 16 16"
                />}
            </div>
            <div id="exploreSearchPage" className='overflowY-auto' style={mobileView ? { marginTop: auth ? "0" : "0px", height: "calc(calc(var(--vhCustom, 1vh) * 100) - 99px - 74px)" } : { width: "calc(100vw - 50vw)", height: "calc(calc(var(--vhCustom, 1vh) * 100) - 64px)" }} >
                {!activeSearch ?
                    <div className='d-flex flex-row gap_12 my-3 px-3'>
                        <div>
                            <Button
                                type="button"
                                fixedBtnClass={activeSearchTab === 'postShow' ? "active" : "inactive"}
                                fclassname='headerBtnPadding'
                                onClick={() => setActiveSearchTab("postShow")}
                                children={lang.posts}
                            />
                        </div>
                        <div>
                            <Button
                                type="button"
                                fixedBtnClass={activeSearchTab === 'creatorShow' ? "active" : "inactive"}
                                fclassname='headerBtnPadding'
                                onClick={() => setActiveSearchTab("creatorShow")}
                                children={lang.creators}
                            />
                        </div>
                    </div>
                    :
                    <div className='d-flex flex-row gap_12 my-3 px-3'>
                        <div>
                            <Button
                                type="button"
                                fixedBtnClass={activeSearchTab === 'user' ? "active" : "inactive"}
                                fclassname='headerBtnPadding'
                                onClick={() => setActiveSearchTab("user")}
                                children={lang.creators}
                            />
                        </div>
                        <div>
                            <Button
                                type="button"
                                fixedBtnClass={activeSearchTab === 'hastags' ? "active" : "inactive"}
                                fclassname='headerBtnPadding'
                                onClick={() => setActiveSearchTab("hastags")}
                                children={lang.hashtags}
                            />
                        </div>
                    </div>}
                <div className='callout-none' style={{height: "calc(100% - 65px)"}} onContextMenu={handleContextMenu}>
                    {
                        exploreSearchTabSection()
                    }
                </div>
            </div>
            <style>{`
                .custom-search-input::-webkit-search-cancel-button {
                    -webkit-appearance: none;
                    height: 14px;
                    width: 14px;
                    background-image: url(${theme.type === "light" ? CLOSE_ICON_BLACK : CLOSE_ICON_WHITE_IMG});
                    background-size: cover;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}

export default ExploreSearch