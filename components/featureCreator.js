import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import PaginationIndicator from "../components/pagination/paginationIndicator";
import isMobile from "../hooks/isMobile";
import useLang from "../hooks/language";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import Icon from "../components/image/icon";
import { getCookie, setCookie } from "../lib/session";
import Wrapper from "../hoc/Wrapper";
import {
    open_progress,
    startLoader,
    stopLoader,
} from "../lib/global/loader";
import { s3ImageLinkGen } from "../lib/UploadAWS/s3ImageLinkGen";
import { backArrow } from "../lib/config/homepage";
import FigureCloudinayImage from "./cloudinayImage/cloudinaryImage";
import { Avatar } from "@material-ui/core";
import { getFeatureCreator, getHeroCreatorsApi, getOnlineCreatorsApi } from "../services/auth";
import FeatureList from "./timeline-control/feature-list";
import CustomDataLoader from "./loader/custom-data-loading";

const SearchBar = dynamic(() => import("../containers/timeline/search-bar"));
const Header = dynamic(() => import("../components/header/header"));

const FeaturedCreator = (props) => {
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const theme = useTheme();
    const router = useRouter();
    const divRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const searchBox = useRef();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [featureList, setFeatureList] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(0);


    const getFeaturedCreatorsList = async (pageCount = 0) => {
        setIsLoading(true);
        const list = {
            country: "INDIA",
            limit: 10,
            offset: searchKey ? 0 : pageCount * 10,
            searchText: searchKey || "",
        };
        let res;
        try {
            if (router?.query?.herocreator) {
                res = await getHeroCreatorsApi(list);
            }
            else if (router?.query?.onlinecreator) {
                res = await getOnlineCreatorsApi(list);
            } else {
                res = await getFeatureCreator(list);
            }
            if (res.status === 200) {
                setPage(pageCount);
                if (!pageCount) {
                    setFeatureList(res.data.data);
                    setHasMore(true);
                } else {
                    setFeatureList((prev) => [...prev, ...res.data.data]);
                }
            } else if (searchKey && res.status == 204) {
                setHasMore(false);
                setFeatureList([]);
            } else {
                setHasMore(false);
                setFeatureList((prev) => [...prev]);
            }
            setIsLoading(false);
        } catch (error) {
            stopLoader();
            setIsLoading(false);
            console.error("ERROR IN getFeaturedCreatorsList", error);
        }
    };


    const handelProfile = (e, profile) => {
        e.stopPropagation();
        open_progress();
        setCookie("otherProfile", `${profile?.username || profile?.userName}$$${profile?.userId || profile?.userid || profile?._id}`);
        profile.userId == getCookie("uid") ? Router.push("/profile") : Router.push(`/${profile?.username}`);
    };

    const scrollToTop = () => {
        if (divRef.current) {
            divRef.current.scrollTop = 0;
        }
    };

    useEffect(() => {
        getFeaturedCreatorsList();
    }, [searchKey, router]);

    useEffect(() => {
        scrollToTop()
    }, [router?.query])

    return (
        <Wrapper>
            {mobileView ? (
                <>
                    <Header
                        icon={backArrow}
                        back={Router.back}
                        title={router?.query?.herocreator ? lang.newestCreator : router?.query?.onlinecreator ? lang.onlineCreator : lang.featureCreators}
                    />
                    <div className="px-3" style={{ paddingTop: "80px" }}>
                        <SearchBar
                            className="px-0 dv_search_bar"
                            fclassname="dv_search_bar_input"
                            value={searchKey}
                            ref={searchBox}
                            search_cont={"search_cont"}
                            handleSearch={(e) => setSearchKey(e.target.value)}
                            onlySearch={true}
                        />
                    </div>
                </>
            ) :
                <div className=" px-3 pt-2">
                    <div className="d-flex pt-1 align-items-center w-100">
                        <Icon
                            height={26}
                            width={26}
                            color={theme.text}
                            alt="back arrow icon"
                            onClick={() => Router.back()}
                            class="cursorPtr"
                            icon={`${backArrow}#left_back_arrow`}
                        />
                        <div className="d-flex w-100 justify-content-center">
                            <h3 className="pr-5 fntSz20 appTextColor">
                                {router?.query?.herocreator ? lang.newestCreator : router?.query?.onlinecreator ? lang.onlineCreator : lang.featureCreators}
                            </h3>
                        </div>
                    </div>
                    <div className="col-12 mt-2 mb-3 px-0">
                        <SearchBar
                            className="px-0 dv_search_bar"
                            fclassname="dv_search_bar_input"
                            value={searchKey}
                            ref={searchBox}
                            search_cont={"search_cont"}
                            handleSearch={(e) => setSearchKey(e.target.value)}
                            onlySearch={true}
                        />
                    </div>

                </div>}
            <div id="featured_creators_container" ref={divRef} className="row mx-0 px-3 overflowY-auto" style={{ maxHeight: mobileView ? "calc(calc(var(--vhCustom, 1vh) * 100) - 140px)" : "calc(calc(var(--vhCustom, 1vh) * 100) - 110px)" }}>
                {featureList?.map((item, index) => (
                    <div
                        className="col-6 col-md-4 py-1 px-0"
                    // onClick={(e) => handelProfile(e, item)}
                    >
                        <FeatureList
                            key={index}
                            id={index}
                            setActiveState={props.setActiveState}
                            userId={item.userId}
                            bannerImage={item.bannerImage}
                            profilePic={item.profilePic}
                            fullName={item.fullName}
                            username={item.username}
                        />
                    </div>
                ))}
                <div className="d-flex align-items-center justify-content-center col-12 pb-3">
                    <CustomDataLoader loading={isLoading} />
                </div>
            </div>
            <PaginationIndicator
                id={"featured_creators_container"}
                totalData={featureList}
                pageEventHandler={() => {
                    if (!isLoading && hasMore) {
                        getFeaturedCreatorsList(page + 1);
                    }
                }}
            />
        </Wrapper >
    );
};

export default FeaturedCreator;
