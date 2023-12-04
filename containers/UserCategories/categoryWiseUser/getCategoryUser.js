import React, { useState, useEffect, useRef } from "react";
import Wrapper from "../../../hoc/Wrapper";
import { getUserCardCategories } from "../../../services/user_category";
import Router, { useRouter } from "next/router";
import {
  authenticate,
  close_progress,
  open_progress,
  startLoader,
  stopLoader,
} from "../../../lib/global";
import Header from "../../../components/header/header";
import { backArrow } from "../../../lib/config";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../../lib/session";
import isMobile from "../../../hooks/isMobile";
import { useTheme } from "react-jss";
import Icon from "../../../components/image/icon";
import PaginationIndicator from "../../../components/pagination/paginationIndicator";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";

const SearchBar = dynamic(
  () => import("../../../containers/timeline/search-bar"),
  {
    ssr: false,
  }
);

const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});

const GetCategoryUser = (props) => {
  const router = useRouter();
  const query = router?.query?.type;
  const searchBox = useRef();
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [catUserList, setCatUserList] = useState([]); // catUser --> categoryUser

  const [page, setPage] = useState(0);
  const [skeleton, setSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [headerHeight, setHeaderHeight] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [header, setHeader] = useState(router?.query?.modal_type);

  useEffect(async () => {
    if (mobileView) {
      let headerRef = document.getElementById("header").offsetHeight;
      setHeaderHeight(headerRef + 10);
    }
    startLoader();
    getCatUserList(0);
  }, []);

  useEffect(() => {
    startLoader();
    getCatUserList(0);
  }, [searchKey]);

  const getCatUserList = async (pageCount = 0) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
      groupId: query,
      searchText: searchKey || "",
    };
    getUserCardCategories(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setCatUserList(res?.data?.data?.creatorData);
          } else {
            setCatUserList((prev) => [
              ...prev,
              ...res?.data?.data?.creatorData,
            ]);
          }
        }else if(searchKey && res.status == 204){
          setCatUserList([]);
        } 
        else{
          setCatUserList((prev) => [...prev]);
        }
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setIsLoading(false);
        setHasMore(true);
      })
      .catch(async (err) => {
        setHasMore(false);

        stopLoader();
        setSkeleton(false);
        setIsLoading(false);
        console.error(err);
      });
  };

  const profileClickHandler = (user) => {
    if(getCookie("auth")){
      open_progress()
      if (getCookie("uid") == user.creatorId) {
        Router.push(`/profile`);
      } else {
      setCookie("otherProfile", `${user?.username || user?.userName}$$${user?.userId || user?.userid || user?._id}`)
        Router.push(`/${user.username || user.userName}`);
      }
    }else{
      close_progress()
      Router.push("/login")
    }
 
  };

  // API pagination for web
  const pageEventHandler = async (e) => {
    setIsLoading(true);
    getCatUserList(page + 1);
  };

  return (
    <Wrapper>
      <div className="subPageScroll">
        {!mobileView ? (
          <div className="main_header_css col-12 d-flex align-items-center px-5">
            <div className="col-4 d-flex align-items-center">
              <Icon
                icon={`${backArrow}#left_back_arrow`}
                color={theme.type == "light" ? theme.text : theme.text}
                onClick={Router.back}
                height={40}
                width={40}
                class="cursorPtr"
              />
              <div className="fntWeight700 fntSz22 pl-4">{header}</div>
            </div>
            <div className="col-4 d-flex justify-content-center px-5">
              <SearchBar
                value={searchKey}
                ref={searchBox}
                onlySearch
                handleSearch={(e) => setSearchKey(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <Header id="header" title={header} icon={backArrow} />
        )}
        <div className={`positionTop ${mobileView ? "px-2" : "px-5"}`}>
          {mobileView && (
            <div className="col-12 px-0">
              <SearchBar
                value={searchKey}
                ref={searchBox}
                onlySearch
                handleSearch={(e) => setSearchKey(e.target.value)}
              />
            </div>
          )}
          {!mobileView ? (
            <div className="row m-0 px-2" id="user_according_category">
              {!mobileView && (
                <PaginationIndicator
                  id={"user_according_category"}
                  totalData={catUserList}
                  totalCount={catUserList?.length}
                  pageEventHandler={() => {
                    if (!isLoading && hasMore) {
                      return pageEventHandler();
                    }
                  }}
                />
              )}
              {skeleton
                ? [...new Array(6)].map((loop, index) => (
                    <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                      <Skeleton
                        variant="rect"
                        width="100%"
                        height="200px"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                  ))
                : catUserList.length > 0 ? catUserList?.map((catUser, index) => (
                    <div
                      className={`${
                        mobileView ? "col-6" : "col-3"
                      } p-2 cursorPtr`}
                      onClick={() => profileClickHandler(catUser)}
                    >
                      <div style={{ height: "200px" }}>
                        <img
                          src={s3ImageLinkGen(S3_IMG_LINK, catUser.profilePic, null, null, 200)}
                          height="100%"
                          width="100%"
                          className="imgStyle"
                          style={{ borderRadius: "8px" }}
                        />
                      </div>
                      <div className="py-1">{`${catUser.firstName} ${catUser.lastName}`}</div>
                    </div>
                  )): <h3 className="w-100 text-center">No Posts</h3>}
            </div>
          ) : (
            <div className="row w-100 m-0 px-0">
              {skeleton
                ? [...new Array(6)].map((loop, index) => (
                    <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                      <Skeleton
                        variant="rect"
                        width="100%"
                        height="200px"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                  ))
                : catUserList.length > 0 ? catUserList?.map((catUser, index) => (
                    <div
                      className={`${
                        mobileView ? "col-6" : "col-3"
                      } p-2 cursorPtr`}
                      onClick={() => profileClickHandler(catUser)}
                    >
                      <div style={{ height: "200px" }}>
                        <img
                          src={s3ImageLinkGen(S3_IMG_LINK, catUser.profilePic, null, null, 200)}
                          height="100%"
                          width="100%"
                          className="imgStyle"
                          style={{ borderRadius: "8px" }}
                        />
                      </div>
                      <div className="py-1">{`${catUser.firstName} ${catUser.lastName}`}</div>
                    </div>
                  )) : <h3  className="w-100 text-center">No Posts</h3>}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .subPageScroll {
          overflow-y: auto !important;
          height: 100vh;
        }

        .positionTop {
          padding-top: ${headerHeight || 30}px !important;
        }

        .imgStyle {
          border-radius: 8px !important;
          object-fit : cover;
        }

        .main_header_css {
          height: 80px;
        }

        :global(.dv_search_bar_input) {
          max-width: 300px;
        }
      `}</style>
    </Wrapper>
  );
};

export default GetCategoryUser;
