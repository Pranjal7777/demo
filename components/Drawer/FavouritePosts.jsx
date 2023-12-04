import React, { useEffect, useState } from "react";
import { backNavMenu } from "../../lib/global";
import { getLikedPurchasedPostApi } from "../../services/assets";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { UpdateModelCardPostSubject } from "../../lib/rxSubject";
import Allotherpost from "../../containers/profile/Allotherpost";
import { otherProfileData } from "../../redux/actions/otherProfileData";
import { useDispatch, useSelector } from "react-redux";
import MobileGridView from "../mobileGridView/MobileGridView";
import Model from "../model/model";
import MobilePostView from "../mobileGridView/MobilePostView";
import { getCookie } from "../../lib/session";
import { isAgency } from "../../lib/config/creds";
const PaginationIndicator = dynamic(() => import("../../components/pagination/paginationIndicator"), { ssr: false })
const CustomDataLoader = dynamic(() => import("../../components/loader/custom-data-loading"), { ssr: false })
const Placeholder = dynamic(() => import("../../containers/profile/placeholder"), { ssr: false })
const Header = dynamic(() => import("../header/header"), { ssr: false })

export default function FavouritePosts(props) {
  const [lang] = useLang();
  const userId = getCookie('uid')
  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [mobileView] = isMobile();
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const [isModelOpen, setModelOpen] = useState(false);
  const [selectId, setId] = useState("");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator.creatorId);

  useEffect(() => {
    getLikedPost(10, 0);
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setData((prev) => {
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
    });
  }, []);

  const subscribedEvent = (id) => {
    let postInstance = data;

    postInstance.map((item) => {
      item.userId == id && item.postType == 2 ? (item["isVisible"] = 1) : "";
    });

    setData([...postInstance]);
  };

  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  const getLikedPost = async (limit = 20, skip = 0) => {
    setPageLoading(true);
    const query = {
      limit: mobileView ? 20 : limit,
      offset: skip + 1,
      postType: 1,
      sort: 0,
    };
    if (isAgency()) {
      query["userId"] = selectedCreatorId;
    }
    try {
      const res = await getLikedPurchasedPostApi(query)
      if (res.status == 200) {
        setPage((p) => p + 1)
        const updatedValue = res.data.result.map((elem) => ({ ...elem, likeCount: elem.totalLike, isLike: true }))
        if (skip) {
          dispatch(otherProfileData([...data, ...updatedValue]));
          setData((prev) => [...prev, ...res.data.result]);
        } else {
          dispatch(otherProfileData(updatedValue));
          setData(res.data.result);
        }
        setHasMore(true);
        setPageLoading(false);
      }
      if (res && res.status == 204) {
        setData((prev) => [...prev]);
        setHasMore(false);
        setPageLoading(false);
      }
    }
    catch (error) {
      console.error("liked posts error:", error);
      setHasMore(false);
      setPageLoading(false);
    }
  };

  const updateLikedPost = () => {
    getLikedPost(0, page);
  }

  const handleClose = () => {
    updateLikedPost()
  }

  return (
    <div
      id="favourite_post_cont"
      className={mobileView && "vh-100 overflow-auto"}
    >
      {mobileView ? (
        <div className="drawerBgCss">
          <Header
            title={lang.favouritePost}
            back={() => {
              backNavMenu(props);
            }}
          />
          <div
            style={{ paddingTop: "70px" }}
            id="fav_post_cont"
            className="vh-100 overflow-auto px-2"
          >
            {
              <PaginationIndicator
                id="fav_post_cont"
                pageEventHandler={() => {
                  if (!pageLoading && hasMore) {
                    getLikedPost(10, page);
                  }
                }}
              />
            }
            {data && data.length > 0 ? (
              <div id="home" className={`row mx-0`}>
                {data.map((post, index) => {
                  if (!post.postData || !post.postData.length) {
                    return <span key={index}></span>;
                  }
                  return (
                    <MobileGridView
                      price={post.price}
                      currency={post.currency || {}}
                      key={index}
                      deletePostEvent={props.deletePostEvent}
                      // reloadItems={handleReloadItem}
                      profileLogo={post.profilePic}
                      profileName={post.firstName}
                      onlineStatus={data?.purchasedOn || post.postedAt}
                      postImage={post.postData}
                      coverImage={post.previewData ? post.previewData[0]?.url : undefined}
                      postType={post.postType}
                      likeCount={post.likeCount || post.totalLike}
                      isLiked={post.isLike}
                      commentCount={post.commentCount || post.commentCount_x || post.commentCount_y}
                      postDesc={post.description}
                      postId={post.postId}
                      userId={post.userId}
                      userName={post.userName || post.username}
                      currencySymbol={
                        post.currency && post.currency.symbol
                          ? post.currency.symbol
                          : "$"
                      }
                      totalTipReceived={post.totalTipReceived}
                      isVisible={post.isVisible || 0}
                      taggedUsers={post.taggedUsers}
                      isBookmarked={post.isBookmarked}
                      fullName={`${post.firstName} ${post.lastName}`}
                      isNSFW={post.isNSFW}
                      nsfwData={post.nsfwData}
                      status={post.status}
                      isScheduled={props.isScheduled}
                      scheduledTimestamp={post.scheduledTimestamp}
                      creationTs={post.scheduledTimestamp || post.creationTs}
                      setPage={setPage}
                      isOtherProfile={userId !== post.userId}
                      isAllPosts
                      currentIndex={index}
                      isFollowed={props.isFollowed}
                      allPost={data}
                      page={page}
                      setNeedApiCall={props.setNeedApiCall}
                      getPersonalAssets={props.getPersonalAssets}
                      size={props.size}
                      otherPostSlider={false}
                      isLockedPost={+post.postType === 4}
                      setId={setId}
                      handleDialog={handleDialog}
                      isAddBoxShadow={props.isAddBoxShadow}
                      mediaType={post.mediaType}
                      showPriceOnGrid={true}
                      setActiveNavigationTab={props.setActiveNavigationTab}
                    // {...props}
                    />
                  );
                })}
              </div>
            )
              : (
                <>
                  {!pageLoading && (
                    <Placeholder
                      style={{ paddingTop: "10vh" }}
                      pageName="liked-post"
                    />
                  )}
                </>
              )}
            <div className="text-center">
              <CustomDataLoader type="normal" isLoading={pageLoading} />
            </div>
          </div>
          {mobileView && (
            <Model
              open={isModelOpen}
              className={"full_screen_dialog vw-100"}
              // closeIcon={true}
              keepMounted={true}
              fullScreen={true}
            >
              <MobilePostView
                onClose={() => handleDialog(false)}
                selectedPost={selectId}
                posts={data}
                likedPost={true}
                updateLikedPost={updateLikedPost}
                subscribedEvent={subscribedEvent}
                id="search-page"
                title={lang.favouritePost}
                isScheduled={props.isScheduled}
                setActiveNavigationTab={props.setActiveNavigationTab}
                handleDialog={handleDialog}
              />
            </Model>)}
        </div>
      ) : (
        <>
          <h5 className="px-1 myAccount_sticky__section_header py-3 sectionHeading">
            {lang.favourites}
          </h5>
          <div className="container">
            <PaginationIndicator
              elementRef={"page_more_side_bar"}
              id={"page_more_side_bar"}
              pageEventHandler={() => {
                if (!pageLoading && hasMore) {
                  getLikedPost(10, page);
                }
              }}
            />
            {data && data.length > 0 ? (
              <div className={`tab-pane active ${`${data?.length === 0 ? "" : "d-flex"} row `} ${mobileView ? "row mb-0 mx-0 d-flex mt-2" : ""}`}
              >
                {data.map((data, index) => {
                  if (!data.postData || !data.postData.length) {
                    return <span key={index}></span>;
                  }
                  return (
                    <Allotherpost
                      price={data.price}
                      coverImage={data.previewData ? data.previewData[0]?.url : undefined}
                      currency={data.currency || {}}
                      key={data.postId}
                      // reloadItems={props.handleReloadItem}
                      profileLogo={data.profilePic}
                      profileName={data.firstName}
                      onlineStatus={data.postedAt}
                      postImage={data.postData}
                      postType={data.postType}
                      likeCount={data.totalLike}
                      isLiked={true}
                      commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                      postDesc={data.description}
                      postId={data.postId}
                      userId={data.userId}
                      userName={data.username}
                      currencySymbol={data.currency}
                      totalTipReceived={data.totalTipReceived}
                      isVisible={data.isVisible || 0}
                      taggedUsers={data.taggedUsers}
                      isBookmarked={data.isBookmarked}
                      fullName={`${data.firstName} ${data.lastName}`}
                      updateLikedPost={updateLikedPost}
                      likedPost={true}
                      isAllPosts
                      isFollowed={3}
                      allPost={data}
                      page={props.page}
                      setNeedApiCall={props.setNeedApiCall}
                      getPersonalAssets={props.getPersonalAssets}
                      size={80}
                      currentIndex={index}
                      otherPostSlider={true}
                      setPage={setPage}
                      postToShow={index}
                      FavPage={true}
                      handleClose={handleClose}
                      isMoreMenu={props?.isMoreMenu}
                    />
                  );
                })}
              </div>
            ) : !pageLoading ? (
              <div className="py-5">
                <Placeholder
                  style={{ height: "20%" }}
                  pageName="liked-post"
                />
              </div>
            ) : ""}
            {
              pageLoading ? <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={pageLoading} size={60} />
              </div> : ""
            }

          </div>
        </>
      )}

      <style jsx>
        {`
        :global(#favourite_post_cont .BlurImageSlider) {
          border-radius: 6px !important;
        }
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.manageChild > div){
            margin:1px;
          }
          :global(.adjustAspectRatio){
            width: 32% !important;
            aspect-ratio: 1/1 !important;
            min-height:unset !important;
          } 
          :global(.adjustAspectRatio .hastag__img){
            max-height: 38vh !important;
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
