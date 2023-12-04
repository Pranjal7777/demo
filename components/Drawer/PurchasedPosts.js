import React, { useEffect } from "react";
import useLang from "../../hooks/language";
import { backNavMenu, startPageLoader } from "../../lib/global";
import { NO_PURCHASED_POST_PLACEHOLESR } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Allotherpost from "../../containers/profile/Allotherpost";
import MobileGridView from "../mobileGridView/MobileGridView";
import { getCookie } from "../../lib/session";
import Model from "../model/model";
import MobilePostView from "../mobileGridView/MobilePostView";
const Header = dynamic(() => import("../header/header"), { ssr: false })
const ProfileTimeline = dynamic(() => import("../../components/profileTimeline/profileTimelineCard"), { ssr: false })
const PaginationIndicator = dynamic(() => import("../../components/pagination/paginationIndicator"), { ssr: false })
const Placeholder = dynamic(() => import("../../containers/profile/placeholder"), { ssr: false })
const PageLoader = dynamic(() => import("../../components/loader/page-loader"), { ssr: false })
const CustomDataLoader = dynamic(() => import("../loader/custom-data-loading"), { ssr: false })

export default function PurchasedPosts(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const userId = getCookie("uid")
  const {
    data,
    loading,
    setLoading,
    getLikedPost,
    handleReloadItem,
    totalCount,
    offset,
    hasMore,
    setPage,
    apiResponse,
  } = props;

  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  return (
    <div
      id="purchased_post_cont"
      className={mobileView && "vh-100 overflow-auto"}
    >
      {mobileView ? (
        <div className="drawerBgCss">
          <Header
            title={lang.purchasedPosts}
            back={() => {
              backNavMenu(props);
            }}
          />
          <div
            style={{
              paddingTop: "80px",
              paddingBottom: "50px",
            }}
            className="px-2"
          >
            {data && (
              <PaginationIndicator
                id="purchased_post_cont"
                totalData={data}
                totalCount={totalCount}
                pageEventHandler={() => {
                  if (!loading && hasMore) {
                    startPageLoader();
                    setLoading(true);
                    return setPage((p) => p + 1);
                  }
                }}
              />
            )}
            <div id="home" className={`tab-pane active row d-flex mx-0 mb-0`}>
              {apiResponse ? (
                data && data.length > 0 ? (
                  data.map((data, index) => {
                    if (!data.postData || !data.postData.length) {
                      return <span key={index}></span>;
                    }
                    return (
                      <MobileGridView
                        price={data.price}
                        currency={data.currency || {}}
                        key={index}
                        deletePostEvent={props.deletePostEvent}
                        reloadItems={handleReloadItem}
                        profileLogo={data.profilePic}
                        profileName={data.firstName}
                        onlineStatus={data?.purchasedOn || data.postedAt}
                        postImage={data.postData}
                        coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined}
                        postType={data.postType}
                        likeCount={data.likeCount || data.totalLike}
                        isLiked={data.isLike}
                        commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                        postDesc={data.description}
                        postId={data.postId}
                        userId={data.userId}
                        userName={data.userName || data.username}
                        currencySymbol={
                          data.currency && data.currency.symbol
                            ? data.currency.symbol
                            : "$"
                        }
                        totalTipReceived={data.totalTipReceived}
                        isVisible={data.isVisible || 1}
                        taggedUsers={data.taggedUsers}
                        isBookmarked={data.isBookmarked}
                        fullName={`${data.firstName} ${data.lastName}`}
                        isNSFW={data.isNSFW}
                        nsfwData={data.nsfwData}
                        status={data.status}
                        isScheduled={props.isScheduled}
                        scheduledTimestamp={data.scheduledTimestamp}
                        creationTs={data.scheduledTimestamp || data.creationTs}
                        setPage={props?.setPage}
                        isOtherProfile={userId !== data.userId}
                        isAllPosts
                        currentIndex={index}
                        isFollowed={props.isFollowed}
                        allPost={props.data}
                        page={props.page}
                        setNeedApiCall={props.setNeedApiCall}
                        getPersonalAssets={props.getPersonalAssets}
                        size={props.size}
                        otherPostSlider={false}
                        isLockedPost={+data.postType === 4}
                        setId={props.setId}
                        handleDialog={props.handleDialog}
                        isAddBoxShadow={props.isAddBoxShadow}
                        mediaType={data.mediaType}
                        showPriceOnGrid={true}
                        setActiveNavigationTab={props.setActiveNavigationTab}
                      // {...props}
                      />
                    );
                  })
                ) : (
                  <div className="py-5">
                    <Placeholder
                      style={{ height: "20%" }}
                      pageName="purchased-post"
                    />
                  </div>
                )
              ) : (
                <div className="text-center">
                  <CustomDataLoader type="normal" isLoading={!apiResponse} />
                </div>
              )}
              {mobileView && (
                <Model
                  open={props.isModelOpen}
                  className={"full_screen_dialog vw-100"}
                  // closeIcon={true}
                  keepMounted={true}
                  fullScreen={true}
                >
                  <MobilePostView
                    onClose={() => props.handleDialog(false)}
                    selectedPost={props.selectId}
                    posts={props.data}
                    id="search-page"
                    title={props.title}
                    isScheduled={props.isScheduled}
                    setActiveNavigationTab={props.setActiveNavigationTab}
                    handleDialog={props.handleDialog}
                  />
                </Model>)}
            </div>
            <div className="text-center">
              <PageLoader />
            </div>
          </div>
        </div>
      ) : (
        <>
          <h5 className="px-1 myAccount_sticky__section_header m-0 py-3 sectionHeading">
            {lang.purchasedPosts}
          </h5>
          <div className="container">
            <PaginationIndicator
              elementRef={props.homePageref}
              id="page_more_side_bar"
              totalData={data}
              totalCount={totalCount}
              pageEventHandler={() => {
                if (!loading && hasMore) {
                  startPageLoader();
                  setLoading(true);
                  return setPage((p) => p + 1);
                }
              }}
            />

            {apiResponse ? (
              data && data.length > 0 ? (
                <div className={`tab-pane active ${`${data?.length === 0 ? "" : "d-flex"} row `} ${mobileView ? "row mb-0 mx-0 d-flex mt-2" : ""}`}
                >
                  {data.map((data, index) => {
                    if (!data.postData || !data.postData.length) {
                      return <span key={index}></span>;
                    }
                    return (
                      <Allotherpost
                        price={data.price}
                        coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined}
                        currency={data.currency || {}}
                        key={index}
                        reloadItems={handleReloadItem}
                        profileLogo={data.profilePic}
                        profileName={data.firstName}
                        onlineStatus={data?.purchasedOn || data.postedAt}
                        postImage={data.postData}
                        postType={data.postType}
                        likeCount={data.totalLike}
                        isLiked={data.isLike}
                        commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                        postDesc={data.description}
                        postId={data.postId}
                        userId={data.userId}
                        userName={data.username}
                        currencySymbol={data.currency}
                        totalTipReceived={data.totalTipReceived}
                        isVisible={data.isVisible || 1}
                        taggedUsers={data.taggedUsers}
                        isBookmarked={data.isBookmarked}
                        fullName={`${data.firstName} ${data.lastName}`}
                        // isLockedPost={+data.postType === 4}
                        isAllPosts
                        isFollowed={3}
                        allPost={data}
                        page={props.page}
                        setNeedApiCall={props.setNeedApiCall}
                        getPersonalAssets={props.getPersonalAssets}
                        size={props.size}
                        currentIndex={index}
                        otherPostSlider={true}
                        setPage={setPage}
                        postToShow={index}
                        showPriceOnGrid={true}
                        purchasedPostPage={true}
                        showUserName={true}
                        isMoreMenu={props?.isMoreMenu}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-5">
                  <Placeholder
                    style={{ height: "20%" }}
                    pageName="purchased-post"
                  />
                </div>
              )
            ) : (
              // <div className={`text-center`}>
              //   <CustomDataLoader type="normal" isLoading={!apiResponse} />
              // </div>
              <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={!apiResponse} size={60} />
              </div>
            )}
            <div className="col-12 d-flex align-items-center justify-content-center text-center">
              <PageLoader />
            </div>
          </div>
        </>
      )}

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.manageChild > div){
            margin:1px;
          }
          :global(.adjustAspectRatio){
            width: 32% !important;
            // aspect-ratio: 1/1 !important;
            // min-height:unset !important;
            min-height: 36vh !important;
            max-height: 40vh !important;
          } 
          :global(.adjustAspectRatio .hastag__img){
            max-height: 16.5vw!important;
          }   
          :global(.adjustAspectRatio .unsetHeight){
            max-height:unset !important;
          }
          .backColor{
            background-color: #18171C !important;
          }
        `}
      </style>
    </div>
  );
}
