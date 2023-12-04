import dynamic from "next/dynamic";
// import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import FigureCloudinayImage from "../components/cloudinayImage/cloudinaryImage";
import Header from "../components/header/header";
import CustomHead from "../components/html/head";
import Image from "../components/image/image";
import LazyLoadImg from "../components/imageLazy/LazyLoadImage";
import PageLoader from "../components/loader/page-loader";
import PaginationIndicator from "../components/pagination/paginationIndicator";
import isMobile from "../hooks/isMobile";
import useLang from "../hooks/language";
import {
  backArrow,
  BANNER_PLACEHOLDER_IMAGE,
  LOGO,
  WEB_LINK,
  NO_FEATURE_CREATORE_HOLDER
} from "../lib/config";
import {
  authenticate,
  // getTransformedImageUrl,
  open_progress,
  startLoader,
  stopLoader,
} from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
// import { getFeatureCreator } from "../services/auth";
import Img from "../components/ui/Img/Img";
const SearchBar = dynamic(() => import("../containers/timeline/search-bar"), {
  ssr: false,
});
import { useTheme } from "react-jss";
import Icon from "../components/image/icon";
import { s3ImageLinkGen } from "../lib/UploadAWS/uploadAWS";
import { getFeaturedCreatorsAction } from "../redux/actions/dashboard/dashboardAction";
import { getFeaturedCreatorsHook } from "../hooks/dashboardDataHooks";


const Creators = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const dispatch = useDispatch();
  const uid = getCookie("uid");
  const [mobileView] = isMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredCreatorState] = getFeaturedCreatorsHook();
  const [searchKey, setSearchKey] = useState("");
  const searchBox = useRef();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  // useEffect(() => {
  //   startLoader();
  //   getFeaturedCreatorsList(0, 20);
  // }, []);

  useEffect(() => {
    if (!featuredCreatorState.data?.length || featuredCreatorState.searchTxt) {
      startLoader();
      getFeaturedCreatorsList()
    };
  }, []);

  useEffect(() => {
    if (searchKey) {
      startLoader();
      getFeaturedCreatorsList()
    };
  }, [searchKey]);

  const getFeaturedCreatorsList = () => {
    dispatch(getFeaturedCreatorsAction({
      countryName: "INDIA",
      limit: 10,
      skip: featuredCreatorState.page * 10,
      callBackFn: () => {
        stopLoader();
        setIsLoading(false);
      },
      isAPICall: true,
      searchTxt: searchKey
    }));

    // const list = {
    //   country: "INDIA",
    //   limit: limit || 20,
    //   offset: pageCount * 20,
    //   searchText: searchKey,
    // };
    // getFeatureCreator(list)
    //   .then(async (res) => {
    //     if (res.status === 200) {
    //       setPage(pageCount);
    //       if (!pageCount) {
    //         setFeatureCreatorList(res.data.data);
    //         setHasMore(true);
    //       } else {
    //         setFeatureCreatorList((prev) => [...prev, ...res.data.data]);
    //       }
    //     }else if(searchKey && res.status == 204){
    //       setHasMore(false);
    //       setFeatureCreatorList([]);
    //     }else {
    //       setHasMore(false);
    //       setFeatureCreatorList((prev) => [...prev]);
    //     }
    //     // setTimeout(() => {
    //     //   setSkeleton(false);
    //     // }, 500);
    //     stopLoader();
    //     setIsLoading(false);
    //   })
    //   .catch(async (err) => {
    //     // if (err.response) {
    //     // }
    //     stopLoader();
    //     // setSkeleton(false);
    //     setIsLoading(false);
    //     console.error("ERROR IN getFeaturedCreatorsList", err);
    //   });
  };

  const pageEventHandler = async (e) => {
    setIsLoading(true);
    getFeaturedCreatorsList();
  };

  const profileClickHandler = (user) => {
    open_progress();
    if (uid == user.userId) {
      Router.push(`/profile`);
    } else {
      setCookie("otherProfile", `${user?.username || user?.userName}$$${user?.userId || user?.userid || user?._id}`)
      Router.push(
        `${user.username || user.userName}`
        // `/user/${user.userId}`
      );
    }
  };

  // const handleSearch = (e) => {
  //   setSearchKey(e.target.value);
  //   getFeaturedCreatorsList();
  // };

  return (
    <React.Fragment>
      <CustomHead
        pageTitle={lang.featureCreators}
        url={`${WEB_LINK}/featured-creators`}
        {...props.seoSettingData}
      />

      {!mobileView ? (
        <div className="f_header_cont">
          <div className="featured-creator-header d-flex">
            <Image
              src={LOGO}
              className="logo_img position-absolute cursorPtr"
              style={{ zIndex: 1 }}
              onClick={() => authenticate().then(() => Router.replace("/"))}
              alt="app logo image"
            />
            <SearchBar
              className="px-0 dv_search_bar"
              fclassname="dv_search_bar_input"
              value={searchKey}
              ref={searchBox}
              onlySearch
              search_cont={"search_cont"}
              // handleSearch={handleSearch}
              handleSearch={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <div className="sub_header d-flex">
            <Icon
              icon={`${backArrow}#left_back_arrow`}
              color={theme.type == "light" ? theme.text : theme.text}
              onClick={Router.back}
              height={40}
              width={40}
              class="cursorPtr"
            />
            <h2 className="bold ml-5">{lang.featureCreators}</h2>
          </div>
        </div>
      ) : (
        <Header
          icon={backArrow}
          back={Router.back}
          title={lang.featureCreators}
        />
      )}
      <div
        id="featured_creators_container"
        className={mobileView ? "container" : "container-fluid"}
      >
        <PaginationIndicator
          id={"featured_creators_container"}
          // elementRef={props.homePageref}
          totalData={featuredCreatorState.data}
          totalCount={featuredCreatorState.data.length}
          pageEventHandler={() => {
            if (!isLoading && featuredCreatorState.hasMore) {
              return pageEventHandler();
            }
          }}
        />
        <div className="featured-creators">
          {!mobileView ? (
            <div className={`col-12 row py-3 ${featuredCreatorState.data.length < 1 && "d-flex justify-content-center align-items-center"}`}>
              {featuredCreatorState.data.length > 0 ? featuredCreatorState.data.map((user, index) => {
                let url = user.profilePic?.startsWith("http")
                  ? user.profilePic
                  : s3ImageLinkGen(S3_IMG_LINK, user.profilePic, false, false, '22vw');
                let link =
                  uid == user.userId
                    ? `/profile`
                    : `${user.username || user.userName}`;

                return (
                  <div className="col-md-3 p-0 pointer">
                    <div className="p-2 px-0 dv_grid">
                      <LazyLoadImg
                        image={{
                          src: url,
                          alt: user.fullName || "featured creator profile",
                        }}
                        id={user.userId}
                        className={""}
                        width="auto"
                        height="100%"
                        mobileView={true}
                        style={{
                          height: "100%",
                          width: "100%",
                          maxHeight: "22.5vw",
                          borderRadius: "8px",
                        }}
                        errorImage={BANNER_PLACEHOLDER_IMAGE}
                        onClick={() => profileClickHandler(user)}
                      />
                      <div>
                        <span
                          onClick={() => profileClickHandler(user)}
                          className="ml-2"
                        >
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }) : <div className="d-flex mt-5 flex-column justify-content-center align-items-center">
                  <div
                    className="text-center container"
                  >
                    <Img
                      src={NO_FEATURE_CREATORE_HOLDER}
                      alt="No Post Yet! Placeholder Image"
                      className="pt-5"
                    />
                    <h5 className="pt-2">{lang.noFeatureCre}</h5>
						</div>
					</div>}
            </div>
          ) : (
            <>
              <SearchBar
                className="px-0"
                value={searchKey}
                ref={searchBox}
                onlySearch
                handleSearch={(e) => setSearchKey(e.target.value)}
              />
              {featuredCreatorState.data.length >0 ? featuredCreatorState.data.map((user, index) => {
                let url = user.profilePic?.startsWith("http")
                  ? user.profilePic
                  : s3ImageLinkGen(S3_IMG_LINK, user.profilePic, false, '44vw');

                return (
                  <div key={user.userId || index + 1} className="grid">
                    <LazyLoadImg
                      image={{
                        src: url,
                        alt: user.fullName || "featured creator profile",
                      }}
                      id={user.userId}
                      className={""}
                      width="auto"
                      height="100%"
                      mobileView={true}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "8px",
                      }}
                      errorImage={BANNER_PLACEHOLDER_IMAGE}
                      onClick={() => profileClickHandler(user)}
                    />
                    <span
                      onClick={() => profileClickHandler(user)}
                      className="ml-2"
                    >
                      @{user.username}
                    </span>
                  </div>
                );
              }) :<div className="d-flex mt-5 flex-column justify-content-center align-items-center">
                <div
                  className="text-center container"
                >
                  <Img
                    src={NO_FEATURE_CREATORE_HOLDER}
                    alt="No Post Yet! Placeholder Image"
                    className="pt-5"
                  />
                  <h5 className="pt-2">{lang.noFeatureCre}</h5>
                </div>
              </div>}
            </>
          )}
        </div>
        <div className="text-center">
          {isLoading && featuredCreatorState.data?.length ? (
            <PageLoader start={true} />
          ) : (
            <></>
          )}
        </div>
      </div>
      <style jsx="true">{`
        .container {
          overflow: auto;
          height: 100vh;
        }
        .container-fluid {
          overflow: auto;
          height: calc(100vh - 160px);
        }
        .featured-creators {
          padding-top: ${mobileView ? "80px" : ""};
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
        .grid {
          height: 44vw;
          width: 44vw;
          background: #000;
          margin-bottom: 10px;
          align-items: center;
          display: flex;
          border-radius: 8px;
          position: relative;
        }
        .grid > span {
          position: absolute;
          position: absolute;
          bottom: 5px;
          color: white;
        }
        .dv_grid {
          // margin-bottom: 10px;
          // align-items: center;
          // display: flex;
          border-radius: 8px;
          position: relative;
        }
        :global(.dv_grid > span > img) {
          object-fit: cover;
        }
        .dv_grid > div {
          position: absolute;
          bottom: 8px;
          color: white;
          background: #0000004f;
          width: calc(100% - 16px);
          border-bottom-right-radius: 8px;
          border-bottom-left-radius: 8px;
          padding: 10px 2px;
          font-weight: bold;
        }
        .featured-creator-header {
          border-bottom: 2px solid #f1f2f6;
          background: ${theme.type == "light" ? "#fafafa" : theme.background};
          padding: 18px;
          height: 80px;
          align-items: center;
        }
        .sub_header {
          border-bottom: 2px solid #f1f2f6;
          background: ${theme.type == "light" ? "#fafafa" : theme.background};
          padding: 18px;
          height: 80px;
          align-items: center;
        }
        :global(.sub_header > img) {
          margin-right: 50px;
        }
        :global(.featured-creator-header > img) {
          margin-right: 50px;
        }
        :global(.dv_search_bar_input) {
          max-width: 300px;
        }
        .f_header_cont {
          height: 160px;
          position: sticky;
          top: 0;
        }
        :global(.search_cont) {
          margin: auto;
          width: 300px;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Creators;
