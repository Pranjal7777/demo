import React, { useEffect, useState } from "react";
import {
  startPageLoader,
  stopPageLoader,
} from "../../lib/global";
import { getTaggedPostsApi } from "../../services/assets";
import dynamic from "next/dynamic";
import Placeholder from "./placeholder";
import PageLoader from "../../components/loader/page-loader";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import isMobile from "../../hooks/isMobile"
import Allotherpost from "./Allotherpost";
import { otherProfileData } from "../../redux/actions/otherProfileData";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isAgency } from "../../lib/config/creds";
import { getCookie } from "../../lib/session";
import useLang from "../../hooks/language";
import Button from "../../components/button/button";
import FilterOption from "../../components/filterOption/filterOption";
const MobileGridView = dynamic(() => import("../../components/mobileGridView/MobileGridView"));
const MobilePostView = dynamic(() => import("../../components/mobileGridView/MobilePostView"));
const Model = dynamic(() => import("../../components/model/model"));

const TaggedPosts = (props) => {
  const [offset, setOffset] = useState(0);
  const [lang] = useLang();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile] = isMobile();
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [activeNavigationTab, setActiveNavigationTab] = useState("all_post");
  const [selectedValue, setSelectedValue] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [postCount, setPostCount] = useState({
    totalCount: 0,
    photosCount: 0,
    videosCount: 0,
  });

  useEffect(() => {
    setData([]);
    setPageCount(1);
    getLikedPost(1);
  }, [selectedValue, activeNavigationTab]);

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


  const getLikedPost = async (page = pageCount) => {
    setLoading(true);
    const query = {
      offset: page || pageCount,
      userId: props?.userid,
      sort: selectedValue || 0,
    };
    if (activeNavigationTab !== "all_post") {
      query["mediaType"] = activeNavigationTab === "video_post" ? 2 : 1;
    }
    if (isAgency()) {
      query["creatorId"] = selectedCreatorId;
    }
    try {
      const res = await getTaggedPostsApi(query);
      if (res.status === 200) {
        setPageCount(prev => prev + 1)
        setHasMore(true)
        const updatedValue = res.data.result.map((elem) => ({ ...elem, likeCount: elem.totalLike }))
        if (page !== 1 && pageCount !== 1) {
          setData((prev) => [...prev, ...updatedValue]);
          dispatch(otherProfileData([...data, ...res.data.result]));
        } else {
          setData(updatedValue);
          dispatch(otherProfileData(updatedValue, pageCount - 1));
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
      setLoading(false);

    } catch (error) {
      console.error("liked posts error:", error);
      setLoading(false);
      setHasMore(false)
    }
  };

  const handleReloadItem = () => {
    // console.log("_______reload");
  };
  console.log(data, "adijasjdisajdi")

  return (
    <div className="">
      <PaginationIndicator
        id="profile_page_cont"
        totalData={data}
        pageEventHandler={() => {
          if (!loading && hasMore && pageCount !== 1) {
            getLikedPost();
          }
        }}
      />
      <div className="d-flex col-12 pl-md-0 justify-content-between align-items-center pt-0 pt-md-2" >
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
          <FilterOption leftFilterShow={mobile ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedValue(value)} />
        </div>
      </div>
      {data && data.length > 0 ? (
        <div id="home" className={`tab-pane active row mx-0 mt-2 mb-0`}>
          {data.map((post, index) => {
            if (!post.postData || !post.postData.length) {
              return <span key={index}></span>;
            }
            if (mobile) {
              return (
                <MobileGridView
                  price={post.price}
                  currency={post.currency || {}}
                  key={index}
                  reloadItems={handleReloadItem}
                  profileLogo={post.profilePic}
                  profileName={post.firstName}
                  onlineStatus={post.postedAt}
                  postImage={post.postData}
                  coverImage={post.previewData ? post.previewData[0]?.thumbnail || post.previewData[0]?.url : undefined}
                  postType={post.postType}
                  likeCount={post.totalLike}
                  isLiked={post.isLike}
                  commentCount={post.commentCount || post.commentCount_x || post.commentCount_y}
                  postDesc={post.description}
                  postId={post.postId}
                  userId={post.userId}
                  userName={post.username}
                  currencySymbol={post.currency}
                  totalTipReceived={post.totalTipReceived}
                  isOtherProfile={router?.asPath === "/profile" ? false : true}
                  isVisible={post.isVisible || 1}
                  taggedUsers={post.taggedUsers}
                  isBookmarked={post.isBookmarked}
                  fullName={`${post.firstName} ${post.lastName}`}
                  setId={props.setId}
                  handleDialog={props.handleDialog}
                />
              );
            }
            else if (!mobile) {
              return (
                <Allotherpost
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
                  isLiked={post.isLike}
                  commentCount={post.commentCount || post.commentCount_x || post.commentCount_y}
                  postDesc={post.description}
                  postId={post.postId}
                  userId={post.userId}
                  userName={post.username}
                  currencySymbol={post.currency}
                  totalTipReceived={post.totalTipReceived}
                  isVisible={post.isVisible || 1}
                  taggedUsers={post.taggedUsers}
                  isBookmarked={post.isBookmarked}
                  fullName={`${post.firstName} ${post.lastName}`}
                  isOtherProfile={router?.asPath === "/profile" ? false : true}
                  //  isLockedPost={+post.postType === 4}
                  isAllPosts
                  isFollowed={3}
                  allPost={data}
                  page={props.page}
                  setNeedApiCall={props.setNeedApiCall}
                  getPersonalAssets={props.getPersonalAssets}
                  // size={props.size}
                  currentIndex={index}
                  otherPostSlider={true}
                  setPage={setOffset}

                />
              )
            }
          })}
        </div>
      ) : (
        mobile ? (
          <Placeholder pageName="tagged-post" />
        ) : (
          <div className="text-dark font-weight-bold text-center rounded py-5">
            <Placeholder pageName="tagged-post" />
          </div>
        )
      )}
      <div className="text-center">
        {data && data.length ? <PageLoader /> : <></>}
      </div>
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
            id="search-page"
            title={props.title}
          />
        </Model>)}
    </div>
  );
};
export default TaggedPosts;
