import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  open_drawer,
  startPageLoader,
  stopLoader,
  stopPageLoader,
} from "../../lib/global/loader";
import { getCookie } from "../../lib/session";
import { TIMELINE_PLACEHOLDER } from "../../lib/config/homepage";
import isMobile from "../../hooks/isMobile";
import { UpdateModelCardPostSubject } from "../../lib/rxSubject";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { getLatestPostsHook, getPopularPostsHook } from "../../hooks/dashboardDataHooks";
import { getNotificationCount, getChatNotificationCount } from "../../redux/actions/auth";
import { getLatestPostAction, getPopularPostsAction, updatePostsDataAction } from "../../redux/actions/dashboard/dashboardAction";
import { notificationUnreadCount } from "../../services/notification";
import ScrollToTop from "../../components/scrollToTop/scrollToTop";

const Button = dynamic(() => import("../../components/button/button"));
const Placeholder = dynamic(() => import("../profile/placeholder"));
const PullToRefresh = dynamic(() => import("react-simple-pull-to-refresh"));
const DvSidebar = dynamic(() => import("../DvSidebar/DvSidebar"));
import CustomDataLoader from "../../components/loader/custom-data-loading";
const TimelineSkeleton = dynamic(() => import("../../components/timeline-control/timeline-card-skeleton"));
const TimelineStories = dynamic(() => import("../../containers/stories/TimelineStories"));
const TimelineHeader = dynamic(() => import("../timeline/timeline-header"));
const FeatureCreators = dynamic(() => import("../timeline/featured-creators"));
const FeatureOptions = dynamic(() => import("../timeline/options"));
const PopularModels = dynamic(() => import("../timeline/popular-feature"));
const LatestModels = dynamic(() => import("../timeline/latest-feature"));

const DvHomePage = dynamic(() => import("../DvHomePage/DvHomePage"));
const PageLoader = dynamic(() => import("../../components/loader/page-loader"));
const DvFeaturedCreators = dynamic(() => import("../DvHomePage/DvFeaturedCreators"));
const MarkatePlaceHeader = dynamic(() => import("../markatePlaceHeader/markatePlaceHeader"));
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import { isAgency } from "../../lib/config/creds";

export default function HomePage(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const auth = getCookie("auth");
  const [posts, setPosts] = useState(props?.serverPopularPosts || []);
  const [popularPostsState] = getPopularPostsHook();
  const [latestPostsState] = getLatestPostsHook();
  const [tab, setTab] = useState("POPULAR");
  const [showSkeleton, setSkeleton] = useState(props?.serverPopularPosts ? false : true);
  const [refreshPage, setRefreshPage] = useState(0);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [latestHasMore, setLatestHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);


  useEffect(() => {
    setSkeleton(true);
    if (tab == "POPULAR") {
      if (popularPostsState.data.length) {
        setPosts(popularPostsState.data);
        setTotalPostCount(popularPostsState.totalCount);
        setSkeleton(false);
        setIsLoading(false);
      } else getPopularFeed();
    } else {
      if (latestPostsState.data.length) {
        setPosts(latestPostsState.data);
        setLatestHasMore(latestPostsState.hasMore);
        setSkeleton(false);
        setIsLoading(false);
      } else getTimelinePosts();
    }

    const notificationCnt = async () => {
      try {
        let res = await notificationUnreadCount();
        dispatch(getNotificationCount(res?.data?.unreadCount))
      } catch (err) {
        console.error('ERROR IN notificationCnt', err)
      }
    }
    if (auth && window['myPrevRoute'] && !window['myPrevRoute']?.includes?.('/login')) {
      notificationCnt();
    }
  }, []);
  const setHomePageData = (data) => {
    setPosts(data)
  }
  const getTimelinePosts = async (loader, pageCount) => {
    if (loader) startPageLoader();
    const pageToGo = pageCount == undefined ? latestPostsState.page : pageCount;
    dispatch(getLatestPostAction({
      isAPICall: true,
      limit: 10,
      skip: pageToGo * 10,
      callBackFn: (dataToSave, hasMore) => {
        setPosts(pageToGo ? [...latestPostsState.data, ...dataToSave] : dataToSave);
        setLatestHasMore(hasMore);
        stopLoader();
        stopPageLoader();
        setIsLoading(false);
        setSkeleton(false);
      },
      userId: isAgency() ? selectedCreatorId : "",
    }));
  };

  const handleTabChange = (tabName) => {
    // setPosts([]);
    setTab(tabName);
    setSkeleton(true);
    if (tabName == "POPULAR") {
      if (popularPostsState.data.length) {
        setPosts(popularPostsState.data);
        setSkeleton(false);
      } else getPopularFeed();
    } else {
      if (latestPostsState.data.length) {
        setPosts(latestPostsState.data);
        setSkeleton(false);
      } else getTimelinePosts();
    }
  };

  const handleRefresh = () => {
    return new Promise(async (resolve) => {
      setPosts([]);
      setSkeleton(true);
      if (tab == "POPULAR") {
        getPopularFeed(false, 1);
      } else {
        getTimelinePosts(false, 0);
      }
      await setRefreshPage((prev) => prev + 1);
      setTimeout(resolve, 1);
    });
  };

  const getPopularFeed = async (loader, pageCount) => {
    if (loader) startPageLoader();
    const pageToGo = pageCount || popularPostsState.page + 1;
    dispatch(getPopularPostsAction({
      page: pageToGo,
      callBackFn: (dataToSave, totalCount) => {
        setTotalPostCount(totalCount);
        setPosts(pageToGo == 1 ? dataToSave : [...popularPostsState.data, ...dataToSave]);
        stopLoader();
        stopPageLoader();
        setIsLoading(false);
        setSkeleton(false);
      },
      isAPICall: true,
      userId: isAgency() ? selectedCreatorId : ""
    }));
  };

  const followUnfollowEvent = (id) => {
    let postInstance = posts;
    postInstance.map((item) => {
      item.userId == id ? (item["isFollowed"] = 1) : "";
    });
    setPosts([...postInstance]);
  };

  const subscribedEvent = (id) => {
    let postInstance = posts;
    postInstance.map((item) => {
      item.userId == id && item.postType == 2 ? (item["isVisible"] = 1) : "";
    });

    setPosts([...postInstance]);
  };

  const deletePostEvent = (id) => {
    let postInstance = posts.filter((item) => item.postId != id);
    setPosts([...postInstance]);
    dispatch(updatePostsDataAction({ postId: id, isDelete: true }));
  };


  useEffect(() => {
    // console.log('-------homepage')
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setPosts((prev) => {
        let postInst = prev.map((item) => {
          if (item.postId === postId) {
    
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        });
        return postInst;
      });
      dispatch(updatePostsDataAction({ postId, data }));
    });
  }, []);

  return (
    <React.Fragment>
      <div id="home_tab" className="d-flex flex-row w-100">
        <div id="top" />
        {!mobileView ? (
          <Wrapper>
            {/* Desktop Header Module */}
            {/* <MarkatePlaceHeader
          setActiveState={props.setActiveState}
          {...props}
        /> */}
            <div className="d-flex flex-row justify-content-between w-100">
              <div className="px-3 w-100">
                <div className="w-100">
                  <div className="sticky-top">
                    {auth && (
                      <TimelineStories
                        setActiveState={props.setActiveState}
                        handleRefresh={refreshPage}
                      />
                    )}
                  </div>
                  <DvHomePage
                    {...props}
                    handleTabChange={handleTabChange}
                    posts={posts}
                    showSkeleton={showSkeleton}
                    followUnfollowEvent={followUnfollowEvent}
                    subscribedEvent={subscribedEvent}
                    handleRefresh={handleRefresh}
                    deletePostEvent={deletePostEvent}
                    activeTab={tab}
                    setHomePageData={setHomePageData}
                  />
                  <div className="text-center">
                    <PageLoader />
                  </div>
                </div>
                <div>
                  <ScrollToTop />
                </div>
              </div>
            </div>
            {/* {posts && posts.length > 4 ? (
              <PaginationIndicator
                id="home-page"
                elementRef={props?.homePageref}
                totalData={posts}
                totalCount={totalPostCount || 500}
                offset={4000}
                pageEventHandler={() => {
                  if (tab == "POPULAR" && !isLoading && totalPostCount) {
                    setIsLoading(true);
                    getPopularFeed(true);
                  } else if (tab == "LATEST" && !isLoading && latestHasMore) {
                    setIsLoading(true);
                    getTimelinePosts(true);
                  }
                }}
              />
            ) : ""} */}
          </Wrapper>
        ) : (
          <Wrapper>
            <div className="w-100">
              <TimelineHeader
                setActiveState={props.setActiveState}
                scrollAndRedirect={async (e) => {
                  let sc = await document.getElementById("top");
                  sc.scrollIntoView({ behavior: "smooth" });
                }}
                {...props}
              />
              <PullToRefresh onRefresh={handleRefresh} fetchMoreThreshold={500}>
                <div className="mv_cont_posts p-0 pt-2">
                  {auth && (
                    <TimelineStories
                      setActiveState={props.setActiveState}
                      handleRefresh={refreshPage}
                    />
                  )}
                  <div className="col-12">
                    <div className="row">
                      <div className={`col-auto ${mobileView ? 'px-0' : 'px-2'} mx-auto w_960`}>
                        <FeatureOptions handleTabChange={handleTabChange} />
                        {showSkeleton && (
                          <TimelineSkeleton itemCount={[1, 2, 3, 4, 5]} />
                        )}
                        <div style={{ position: "relative" }}
                          className={`tab-content pb-2 ${posts && posts.length ? "mb-5" : ""
                            }`}
                          id="myTabContent"
                        >
                          {
                            tab === "POPULAR" ? (<>
                              <PopularModels
                                setActiveState={props.setActiveState}
                                posts={posts}
                                tab={tab}
                                refreshPage={refreshPage}
                                followUnfollowEvent={followUnfollowEvent}
                                subscribedEvent={subscribedEvent}
                                deletePostEvent={deletePostEvent}
                                setSkeleton={setSkeleton}
                              />

                            </>
                            ) : <></>}
                          {
                            tab === "LATEST" ? (
                              <LatestModels
                                setActiveState={props.setActiveState}
                                subscribedEvent={subscribedEvent}
                                posts={posts}
                                tab={tab}
                                deletePostEvent={deletePostEvent}
                              />
                            ) : <></>
                          }

                          {(!posts && !showSkeleton) ||
                            (posts && !posts.length && !showSkeleton && (
                              <Placeholder
                                label="You're not following anybody."
                                style={{ height: "auto" }}
                                placeholderImage={TIMELINE_PLACEHOLDER}
                              >
                                <div className="mt-3">
                                  <Button
                                    type="submit"
                                    fixedBtnClass={"active"}
                                    onClick={() => {
                                      open_drawer(
                                        "search",
                                        {
                                          handleClose: () => {
                                            handleRefresh();
                                          },
                                          theme,
                                        },
                                        "right"
                                      );
                                    }}
                                  >
                                    {lang.followPopularCreator}
                                  </Button>
                                </div>
                              </Placeholder>
                            ))}
                          <div className="text-center">
                            <CustomDataLoader
                              isLoading={isLoading}
                              type="normal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {posts && posts.length > 4 ? (
                  <PaginationIndicator
                    totalData={posts}
                    totalCount={totalPostCount || 500}
                    id="home-page"
                      offset={4000}
                    // elementRef={props.homePageref}
                    pageEventHandler={(event) => {
                      if (!isLoading) {
                        if (tab == "POPULAR" && totalPostCount) {
                          setIsLoading(true);
                          getPopularFeed(true);
                        } else if (tab == "LATEST" && latestHasMore) {
                          setIsLoading(true);
                          getTimelinePosts(true);
                        }
                      }
                    }}
                  />
                ) : (
                  ""
                )}
              </PullToRefresh>
              <ScrollToTop />
              {/* {mobileView &&<ScrollToTop />} */}
            </div>
          </Wrapper>
        )}
        <style jsx>
          {`
            .timeline_placeholder {
              width: 92%;
              border-radius: 20px;
              font-size: 14px;
            }
          `}
        </style>
      </div>
    </React.Fragment>
  );
}
