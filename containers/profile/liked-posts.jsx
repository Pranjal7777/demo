import React, { useEffect, useState } from "react";
import { getLikedPurchasedPostApi } from "../../services/assets";
import Placeholder from "./placeholder";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import { UpdateModelCardPostSubject } from "../../lib/rxSubject";
import Allotherpost from "./Allotherpost";
import { getCookie } from "../../lib/session";
import isMobile from "../../hooks/isMobile";
import { otherProfileData } from "../../redux/actions/otherProfileData";
import { useDispatch } from "react-redux";
import Button from "../../components/button/button";
import useLang from "../../hooks/language";
import FilterOption from "../../components/filterOption/filterOption";
import Model from "../../components/model/model";
import MobilePostView from "../../components/mobileGridView/MobilePostView";
import MobileGridView from "../../components/mobileGridView/MobileGridView";

const LikedPosts = (props) => {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(500);
  const [pageLoading, setPageLoading] = useState(false);
  const [lang] = useLang();
  const [mobile] = isMobile();
  const [hasMore, setHasMore] = useState(false);
  const userType = getCookie("userType")
  const dispatch = useDispatch()
  const [activeNavigationTab, setActiveNavigationTab] = useState("all_post");
  const [selectedValue, setSelectedValue] = useState(0);
  const [firstCall, setFirstCall] = useState(true);
  const [postCount, setPostCount] = useState({
    totalCount: 0,
    photosCount: 0,
    videosCount: 0,
  });

  const postTypeList = [
    {
      label: lang.allPosts,
      navigationTab: "all_post",
      count: "totalCount",
    },
    {
      label: lang.photos,
      navigationTab: "image_post",
      count: "photosCount",
    },
    {
      label: lang.videos,
      navigationTab: "video_post",
      count: "videosCount",
    }
  ]
  const filterList = [
    {
      title: "NEWEST",
      tab: "newest",
      value: 0,
    },
    {
      title: "OLDEST",
      tab: "oldest",
      value: 1,
    }
  ]

  useEffect(() => {

    setOffset(0);
    if (activeNavigationTab !== "all_post" && !postCount?.["totalCount"]) return;
    if (activeNavigationTab === "all_post" && !postCount?.["totalCount"] && !firstCall) return;
    getLikedPost();
  }, [selectedValue, activeNavigationTab]);

  const getLikedPost = async (limit = 10, offset = 0) => {
    setPageLoading(true);
    const query = {
      limit: mobile ? 20 : limit,
      offset: offset + 1,
      postType: 1,
      sort: selectedValue || 0,
    };
    if (activeNavigationTab !== "all_post") {
      query["mediaType"] = activeNavigationTab === "video_post" ? 2 : 1;
    }
    try {
      const res = await getLikedPurchasedPostApi(query)
      if (res?.status === 200) {
        setHasMore(true)
        const updatedValue = res.data.result.map((elem) => ({ ...elem, likeCount: elem.totalLike }))
        setOffset((prev) => prev + 1);
        if (offset) {
          setData((prev) => [...prev, ...updatedValue]);
          dispatch(otherProfileData([...data, ...updatedValue], offset));
        } else {
          setData(updatedValue);
          dispatch(otherProfileData(updatedValue, offset));
        }
        if (res.data.totalCount) {
          setTotalCount(res.data.totalCount);
        }
      } else {
        setHasMore(false)
      }
      if (activeNavigationTab === "all_post") {
        setPostCount({
          totalCount: res.data.totalCount || 0,
          photosCount: res.data.photosCount || 0,
          videosCount: res.data.videosCount || 0,
        })
      }
      setPageLoading(false);
    } catch (error) {
      console.error("liked posts error:", error);
      setHasMore(false)
      setPageLoading(false);
      setFirstCall(false);
    };
  };

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

  const handleReloadItem = () => {
    // console.log("_______reload");
  };

  const updateLikedPost = () => {
    getLikedPost(10, offset);
  }

  return (
    <div className="liked_post_cont d-flex flex-column">
      <PaginationIndicator
        id={mobile ? "home-page" : "profile_page_cont"}
        totalData={data}
        totalCount={totalCount}
        pageEventHandler={() => {
          if (!pageLoading && hasMore) {
            getLikedPost(10, offset);
          }
        }}
      />
      <div className="d-flex col-12 pl-1 justify-content-between align-items-center pt-0 pt-sm-2" >
        <div className="scroll gap_8 d-flex">
          {postTypeList?.map((item, index) => {
            return (
              <div key={index}>
                <Button
                  type="button"
                  fclassname={`${(activeNavigationTab == item?.label || activeNavigationTab == item?.navigationTab) ? "btnGradient_bg" : "background_none borderStroke"} rounded-pill py-2 text-nowrap`}
                  onClick={() => setActiveNavigationTab(item?.navigationTab)}
                  children={`${item?.label} (${postCount?.[item?.count] || 0})`}
                />
              </div>
            )
          })}
        </div>
        <div>
          <FilterOption
            leftFilterShow={mobile ? false : true}
            filterList={filterList}
            setSelectedValue={(value) => {
              if (activeNavigationTab === "all_post" && !postCount?.["totalCount"]) return;
              setSelectedValue(value)
            }}
          />
        </div>
      </div>
      {data && data.length > 0 ? (
        <div id="home" className={`tab-pane active row mx-0 px-3 mt-3 px-md-0`}>
          {data.map((post, index) => {
            if (!post.postData || !post.postData.length) {
              return <span key={index}></span>;
            }
            if (mobile) {
              return (
                <MobileGridView
                  price={post.price}
                  coverImage={post.previewData ? post.previewData[0]?.thumbnail || post.previewData[0]?.url : undefined}
                  currency={post.currency || {}}
                  key={index}
                  deletePostEvent={props.deletePostEvent}
                  reloadItems={handleReloadItem}
                  profileLogo={post.profilePic}
                  profileName={post.firstName}
                  onlineStatus={data?.purchasedOn || post.postedAt}
                  postImage={post.postData}
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
                  setPage={props?.setPage}
                  isOtherProfile={props.userId !== post.userId}
                  isAllPosts
                  currentIndex={index}
                  isFollowed={props.isFollowed}
                  allPost={props.data}
                  page={props.page}
                  setNeedApiCall={props.setNeedApiCall}
                  getPersonalAssets={props.getPersonalAssets}
                  size={props.size}
                  otherPostSlider={false}
                  isLockedPost={+post.postType === 4}
                  setId={props.setId}
                  handleDialog={props.handleDialog}
                  isAddBoxShadow={props.isAddBoxShadow}
                  mediaType={post.mediaType}
                  showPriceOnGrid={true}
                  setActiveNavigationTab={props.setActiveNavigationTab}
                // {...props}
                />
              )
            }
            else if (!mobile) {
              return (<Allotherpost
                price={post.price}
                coverImage={post.previewData ? post.previewData[0]?.thumbnail || post.previewData[0]?.url : undefined}
                currency={post.currency || {}}
                key={index}
                reloadItems={handleReloadItem}
                profileLogo={post.profilePic}
                profileName={post.firstName}
                onlineStatus={post.postedAt}
                postImage={post.postData}
                postType={post.postType}
                likeCount={post.totalLike}
                isLiked={true}
                commentCount={post.commentCount || post.commentCount_x || post.commentCount_y}
                postDesc={post.description}
                postId={post.postId}
                userId={post.userId}
                userName={post.username || post.userName}
                currencySymbol={post.currency}
                totalTipReceived={post.totalTipReceived}
                isVisible={post.isVisible || 0}
                taggedUsers={post.taggedUsers}
                isBookmarked={post.isBookmarked}
                updateLikedPost={updateLikedPost}
                likedPost={true}
                fullName={`${post.firstName} ${post.lastName}`}
                subscribedEvent={subscribedEvent}
                currentIndex={index}
                allData={data}
                otherPostSlider={props.otherPostSlider}
                status={post.status}
                isScheduled={props.isScheduled}
                scheduledTimestamp={post.scheduledTimestamp}
                creationTs={post.scheduledTimestamp || post.creationTs}
                setPage={setOffset}
                isAllPosts
                isFollowed={3}
                allPost={data}
                page={props.page}
                setNeedApiCall={props.setNeedApiCall}
                getPersonalAssets={props.getPersonalAssets}
                size={props.size}
                userType={userType}
              />)
            }
          })}
          {mobile && (
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
                posts={data}
                likedPost={true}
                updateLikedPost={updateLikedPost}
                subscribedEvent={subscribedEvent}
                id="search-page"
                title={props.title}
                isScheduled={props.isScheduled}
                setActiveNavigationTab={props.setActiveNavigationTab}
                handleDialog={props.handleDialog}
              />
            </Model>)}
        </div>
      ) : (
        <div className="col">
          {!pageLoading && (
            <Placeholder
              style={{ height: "20%" }}
              pageName="liked-post"
            />
          )}
        </div>
      )}
      {pageLoading && <div className="text-center mt-5">
        <CustomDataLoader type="normal" isLoading={pageLoading} />
      </div>}
    </div>
  )
}
export default LikedPosts;
