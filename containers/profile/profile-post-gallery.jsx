import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { getAssets, getLockedPost } from "../../services/profile";
import {
  startLoader,
  startPageLoader,
  stopLoader,
  stopPageLoader,
} from "../../lib/global/loader";
import { getCookie } from "../../lib/session";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import isMobile from "../../hooks/isMobile";
import { UpdateModelCardPostSubject, postUpadteSubject } from "../../lib/rxSubject";
import { ParseToken } from "../../lib/parsers/token-parser";
import useLang from "../../hooks/language";
import { useDispatch } from "react-redux";
import { otherProfileData } from "../../redux/actions/otherProfileData";
import usePostsObserver from "../../hooks/usePostsObserver";
import AllPost from "./all-post";
import { isAgency } from "../../lib/config/creds";
import { useRouter } from "next/router";

const LockProfile = dynamic(() => import("./lock-profile"));
const Collections = dynamic(() => import("./collections"));
const LikedPosts = dynamic(() => import("./liked-posts"));
const PurchasedPosts = dynamic(() => import("./purchased-posts"));
const TaggedPosts = dynamic(() => import("./tagged-posts"));
const StreamPostTab = dynamic(() => import("./live-stream/streamPostTab"));
const ShoutoutPosts = dynamic(() => import("./shoutout_posts"));
const ReviewTab = dynamic(() => import("./reviewTab"));
const InfoTab = dynamic(() => import("./infoTab"));

const mediaType = {
  image_post: "1",
  video_post: "2",
  text_post: "4"
};
const postType = {
  lock_post: "1",
  exclusive_post: "1",
};
export default function ProfilePostGallery(props) {
  const { activeNavigationTab, allPostCount = () => { return } } = props;
  const [assets, setassets] = useState([]);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [lockedPost, setLocedPost] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const auth = getCookie('auth');
  const router = useRouter();
  const userTypeCode = getCookie("userType");
  const guestToken = useSelector(state => state.guestToken);
  const [widthRatio, setWidthRatio] = useState(600);
  const userId = isAgency() ? selectedCreatorId : getCookie("uid");
  const [lang] = useLang();
  const [page, setPage] = useState(0);
  const [lockPostPage, setLockpostPage] = useState(0);
  const [isModelOpen, setModelOpen] = useState(false);
  const [selectId, setId] = useState("");
  const [initialApiCall, setInitialApiCall] = useState(false)
  const dispatch = useDispatch();
  const pageRenderCount = useRef(1);
  const [postCount, setPostCount] = useState({})
  const [selectedSorting, setSelectedSorting] = useState(props?.selectedValue);
  const [activeExclusiveTab, setActiveExclusiveTab] = useState("all_post");
  // Author - Bhoomika
  // Description - maintained hasMore state to control the auto API call
  // Date - 13/04/2021
  const [hasMore, setHasMore] = useState(false);
  const usersProfileTabs = [
    "liked_post",
    "collection_post",
    "purchased_post",
    "tagged_post",
    "shoutout_post"
  ];
  const [mobileView] = isMobile();
  const [pageLoading, setPageLoading] = useState(false);
  const deletePostEvent = (id) => {
    let postInstance = assets.filter((item) => item.postId != id);
    setassets([...postInstance]);
  };

  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  // usePostsObserver(assets)
  const container = {};
  const getPostContainer = () => {
    switch (activeNavigationTab) {
      case "image_post":
        return (
          <AllPost
            post={assets}
            deletePostEvent={deletePostEvent}
            reloadItems={getPersonalAssets}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.imagePosts}
            postCount={postCount}
            {...props}
          />
        );
      case "video_post":
        return (
          <AllPost
            post={assets}
            deletePostEvent={deletePostEvent}
            reloadItems={getPersonalAssets}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.videoPosts}
            postCount={postCount}
            {...props}
          />
        );
      case "text_post":
        return (
          <AllPost
            post={assets}
            deletePostEvent={deletePostEvent}
            reloadItems={getPersonalAssets}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.textPosts}
            postCount={postCount}
            {...props}
          />
        );
      case "lock_post":
        return (
          <LockProfile
            isLockedPost={!props.otherProfile ? true : false}
            reloadItems={getPersonalAssets}
            deletePostEvent={deletePostEvent}
            post={!props.otherProfile ? lockedPost : assets}
            setSelectedSorting={(value) => setSelectedSorting(value)}
            // allPost={true}
            page={page}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={!props.otherProfile ? lang.lockedPost : lang.exclusivePost}
            postCount={postCount}
            {...props}
          />
        );
      case "exclusive_post":
        return (
          <LockProfile
            post={assets}
            isLockedPost={false}
            deletePostEvent={deletePostEvent}
            reloadItems={getPersonalAssets}
            setSelectedSorting={(value) => setSelectedSorting(value)}
            setActiveExclusiveTab={(value) => setActiveExclusiveTab(value)}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.exclusivePost}
            postCount={postCount}
            {...props}
          />
        );
      case "collection_post":
        return (
          <Collections
            profileId={props.userId}
            userId={userId}
            homePageref={props.homePageref && props.homePageref}
            setSelectedSorting={(value) => setSelectedSorting(value)}
            postCount={postCount}
          />
        );
      case "liked_post":
        return <LikedPosts
          profileId={props.userId}
          userId={userId}
          homePageref={props.homePageref && props.homePageref}
          setPage={setPage}
          isModelOpen={isModelOpen}
          handleDialog={handleDialog}
          selectId={selectId}
          setId={setId}
          title={lang.favouritePost}
          setSelectedSorting={(value) => setSelectedSorting(value)} {...props} />;
      case "purchased_post":
        return <PurchasedPosts
          setPage={setPage}
          isModelOpen={isModelOpen}
          handleDialog={handleDialog}
          selectId={selectId}
          setId={setId}
          title={"Purchased Gallery"}
          setSelectedSorting={(value) => setSelectedSorting(value)} {...props} />;
      case "tagged_post":
        return <TaggedPosts
          userid={props?.userId}
          isModelOpen={isModelOpen}
          handleDialog={handleDialog}
          setSelectedSorting={(value) => setSelectedSorting(value)}
          selectId={selectId}
          setId={setId}
          title={lang.taggedPosts}
          postCount={postCount}
        />;
      case "shoutout_post":
        return <ShoutoutPosts homePageref={props.homePageref} setSelectedSorting={(value) => setSelectedSorting(value)}  {...props} />;
      case "review_tab":
        return <ReviewTab
          homePageref={props.homePageref}
          isCreatorSelf={!props?.otherProfile}
          {...props} />;
      case "streams_live":
        return <StreamPostTab postCount={postCount} setSelectedSorting={(value) => setSelectedSorting(value)} {...props} />;
      case "info_tab":
        return <InfoTab {...props} />;
      case "scheduled_post":
        return (
          <AllPost
            reloadItems={getPersonalAssets}
            deletePostEvent={deletePostEvent}
            setSelectedSorting={(value) => setSelectedSorting(value)}
            post={assets}
            allPost={true}
            isScheduled={true}
            setPage={setPage}
            isAddBoxShadow={true}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.SchedulePost}
            postCount={postCount}
            {...props}
          >
            allpost
          </AllPost>


        );

      default:
        return (
          <AllPost
            reloadItems={getPersonalAssets}
            deletePostEvent={deletePostEvent}
            setSelectedSorting={(value) => setSelectedSorting(value)}
            post={assets}
            allPost={true}
            page={page}
            setPage={setPage}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={lang.allPosts}
            postCount={postCount}
            {...props}
          >
            allpost
          </AllPost>
        );
    }
  };

  // useEffect(() => {
  //   return () => dispatch(emptyOtherProfileData())
  // }, [])
  useEffect(() => {
    if (window.innerWidth) {
      setWidthRatio(Math.round((window.innerWidth - 70) / 3));
    }
    setPage(0);
    setLockpostPage(0)
    if (activeNavigationTab == "lock_post" && !props.otherProfile) {
      handleLockedPOst(0);
      // getPersonalAssets(1);
      return;
    }
    if (activeNavigationTab !== "lock_post") setLocedPost([]);
    if (!usersProfileTabs.includes(activeNavigationTab)) {
      pageRenderCount.current > 1 && startLoader();
      pageRenderCount.current++
      getPersonalAssets(1);
    }
    setassets([])
  }, [activeNavigationTab, activeExclusiveTab]);

  useEffect(() => {
    if ([0, 1].includes(props?.selectedValue)) {
      setSelectedSorting(props?.selectedValue)
    }
  }, [props?.selectedValue])
  useEffect(() => {
    if ([0, 1].includes(selectedSorting) && initialApiCall) {
      setPage(0);
      setassets([])
      getPersonalAssets(1);
    }
  }, [selectedSorting])

  useEffect(() => {
    if (page > 0) {
      getPersonalAssets();
    }
  }, [page]);

  //edit post and update post flow
  useEffect(() => {
    const updateData = postUpadteSubject.subscribe((params) => {
      if (params.isUpload && params?.postData) {
        setassets(prev => {
          const oldData = Array.isArray(prev) ? [...prev] : []
          const postIndx = oldData.findIndex(p => p.postId === params?.postData?.postId)
          if (postIndx !== -1) {
            oldData[postIndx] = { ...params?.postData }
          }
          return oldData
        })
      } else if (params.isUpload) {
        getPersonalAssets(1);
      }
    })
    return () => updateData.unsubscribe();
  }, [activeNavigationTab])
  useEffect(() => {
    if (isAgency()) {
      getPersonalAssets(1);
    }
  }, [props.userId])
  useEffect(() => {
    if (activeNavigationTab == "lock_post" && lockPostPage > 0 && !props.otherProfile && initialApiCall) {
      handleLockedPOst(lockPostPage);
    }
  }, [lockPostPage])

  useEffect(() => {
    // if (activeNavigationTab == "lock_post" && !props.otherProfile) {
    //   handleLockedPOst();
    //   return;
    // }
    const id = UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setassets((prev) => {
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
        return [...postInst];
      });
    });
    return () => id.unsubscribe()
  }, []);
  useEffect(() => {
    console.log("assets updated", assets)
  }, [assets])
  const handleLockedPOst = (lockPostPage = 0) => {
    startLoader();
    let payload = {
      offset: +lockPostPage * 10,
      limit: 10,
      token: getCookie("token")
    }
    getLockedPost(payload).then((res) => {
      if (res.status == 200) {
        setHasMore(true);
        setTotalCount(res?.data?.data?.length);
        // setLocedPost(prev => [...prev, ...res?.data?.data]);
        if (lockPostPage == 0) {
          setLocedPost([...res?.data?.data]);
          dispatch(otherProfileData([...res?.data?.data], lockPostPage));
          setInitialApiCall(true)

        }
        else {
          setLocedPost(prev => [...prev, ...res?.data?.data]);
          dispatch(otherProfileData([...lockedPost, ...res?.data?.data], lockPostPage));
        }
      } else {
        setHasMore(false);
      }
      stopLoader();
      setPageLoading(false);
    }).catch((e) => {
      setTotalCount(0);
      stopPageLoader();
      stopLoader();
    })
  }

  const getPersonalAssets = (customPage, loader) => {
    if (userTypeCode === '1' && router?.asPath === "/profile") return;
    if (["streams_live", "lock_post", "shoutout_post", "review_tab"].includes(activeNavigationTab)) return;
    if (activeNavigationTab == "lock_post" && !props.otherProfile) return
    startPageLoader();
    setInitialApiCall(true)
    const pageCount = customPage || page;
    getAssets({
      userId: props.userId,
      page: pageCount,
      mediaType: mediaType[activeNavigationTab === "exclusive_post" ? activeExclusiveTab : activeNavigationTab],
      postType: postType[activeNavigationTab],
      status: activeNavigationTab === "scheduled_post" ? 7 : 1,
      sort: selectedSorting || 0,
      creatorId: isAgency() ? selectedCreatorId : ""
    }, auth ? {} : { authorization: ParseToken(guestToken) })
      .then(async (res) => {
        stopLoader();
        if (res.status === 200) {
          setHasMore(true);
          setTotalCount(res.data.totalCount);
          if (pageCount == 1) {
            setassets(res.data.result);
            dispatch(otherProfileData(res.data.result, page));
          } else {
            setassets((prev) => [...prev, ...res.data.result]);
            dispatch(otherProfileData([...assets, ...res.data.result], page));
          }
          if (activeExclusiveTab === "all_post") {
            setPostCount({
              photosCount: res?.data?.photosCount || 0,
              scheduledPostCount: res?.data?.scheduledPostCount || 0,
              textCount: res?.data?.textCount || 0,
              totalCount: res?.data?.totalCount || 0,
              videosCount: res?.data?.videosCount || 0,
            })
          }
          if (activeNavigationTab === "grid_post") {
            allPostCount({
              photosCount: res?.data?.photosCount || 0,
              scheduledPostCount: res?.data?.scheduledPostCount || 0,
              textCount: res?.data?.textCount || 0,
              totalCount: res?.data?.totalCount || 0,
              videosCount: res?.data?.videosCount || 0,
            })
          }
          // setHasMore(true);
        } else if (res.status === 204) {
          setHasMore(false);
        } else if (res.status === 204 && pageCount == 1) {
          if (activeExclusiveTab === "all_post") {
            setPostCount({
              photosCount: 0,
              scheduledPostCount: 0,
              textCount: 0,
              totalCount: 0,
              videosCount: 0,
            })
          }
          if (activeNavigationTab === "grid_post") {
            allPostCount({
              photosCount: 0,
              scheduledPostCount: 0,
              textCount: 0,
              totalCount: 0,
              videosCount: 0,
            })
          }
        }

        stopLoader();
        stopPageLoader();
        setPageLoading(false);
      })
      .catch(async (err) => {
        if (activeExclusiveTab === "all_post") {
          setPostCount({
            photosCount: 0,
            scheduledPostCount: 0,
            textCount: 0,
            totalCount: 0,
            videosCount: 0,
          })
        }
        if (activeNavigationTab === "grid_post") {
          allPostCount({
            photosCount: 0,
            scheduledPostCount: 0,
            textCount: 0,
            totalCount: 0,
            videosCount: 0,
          })
        }
        stopLoader();
        stopPageLoader();
        setTotalCount(0);
        setHasMore(false);
        if (err.response) {
          pageCount == 1 && setassets((prev) => []);
        }
        console.error(err);
      });
  };
  return (
    <>
      <div
        className={
          props.otherProfile ? `${activeNavigationTab === "lock_post" && "mt-2"} ${mobileView ? "p-3" : "mb-5"} pb-2 mx-auto profile_post` : `pb-2 ${mobileView ? "pt-3" : "mb-5"}`
        }
        id="scroll_to_top"
      >
        <div className="">
          <div className="p-0">
            {!usersProfileTabs.includes(activeNavigationTab) && !pageLoading && (
              <PaginationIndicator
                id={mobileView ? "home-page" : "profile_page_cont"}
                elementRef={props.homePageref}
                totalData={!props.otherProfile ? lockedPost : assets}
                totalCount={totalCount}
                offset={mobileView ? 350 : 250}
                pageEventHandler={() => {
                  if (!pageLoading && hasMore) {
                    setPageLoading(true);
                    if (activeNavigationTab === "lock_post" && !props.otherProfile && initialApiCall) return setLockpostPage((p) => p + 1)
                    else return setPage((p) => p + 1);
                  }
                }}
              />
            )}

            <div className={mobileView ? "tab-content mb-5" : props.activeNavigationTab === "lock_post" ? "tab-content" : "tab-content"}>
              {getPostContainer()}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
        // .profile_post{
        //   margin-top: -83px;
        // }
        :global(.tab-content>div){
          // justify-content: center;
        }
      `}
      </style>
    </>
  );
}
