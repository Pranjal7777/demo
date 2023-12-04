import Link from "next/link";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import TimelineSkeleton from "../../../components/timeline-control/timeline-card-skeleton";
import TimelineHeader from "../../../containers/timeline/timeline-header";
import Route, { useRouter } from "next/router";
import { APP_NAME, backArrow, OG_LOGO, WEB_LINK } from "../../../lib/config";
import { getSharedPost } from "../../../services/assets";
import ModelCard from "../../../components/timeline-control/timeline-card";
import { getCookiees } from "../../../lib/session";
import { close_drawer, guestLogin, stopLoader } from "../../../lib/global";
import CustomHead from "../../../components/html/head";
import DvHeader from "../../../containers/DvHeader/DvHeader";
import isMobile from "../../../hooks/isMobile";
import PageLoader from "../../../components/loader/page-loader";
import useReduxData from "../../../hooks/useReduxState";
import Header from "../../../components/header/header";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { UpdateModelCardPostSubject } from "../../../lib/rxSubject";
import MarkatePlaceHeader from "../../../containers/markatePlaceHeader/markatePlaceHeader";
import JuicyHeader from "../../../components/landingHeader/Header";
import DesktopFooter from "../../../containers/timeline/desktop_footer";
import DvSidebar from "../../../containers/DvSidebar/DvSidebar";
import DvFeaturedCreators from "../../../containers/DvHomePage/DvFeaturedCreators";
import TimelineStories from "../../../containers/stories/TimelineStories";
import useProfileData from "../../../hooks/useProfileData";
import GuestHeader from '../../../containers/Header';
import GuestFooter from '../../../containers/Footer';

const Index = (props) => {
  const router = useRouter();
  const { query = {} } = router;
  const [showSkeleton, setSkeleton] = useState(true);
  const [data, setData] = useState(props.postData);
  const [mobileView] = isMobile();
  const [refreshPage, setRefreshPage] = useState(0);
  const reduxData = useReduxData(["language"]);
  const auth = getCookiees('auth');
  const [profileData] = useProfileData();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  useEffect(() => {
    stopLoader();
    if (query.slug[1] == "hashtag") {
      close_drawer("HashtagFollow");
    }
    if (props.postData) {
      setSkeleton(false);
    }
  }, []);

  useEffect(() => {
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setData((prev) => {
        if (prev.postId === postId) {
          return {
            ...prev,
            ...data,
          };
        } else {
          return prev;
        }
      });
    });
  }, []);

  const setActiveState = () => {
    Route.push("/");
  };

    useEffect(()=>{
    setData(props.postData)
    },[props.postData])
  // handleCallbackModelCardChange = (postId, key, value) => {
  //   postId="abcd"
  //   key: "isLiked"
  //   value: true
  //   data = [{ postId: '1234', isLiked: false }, { postId: 'abcd', isLiked: false }]
  //   setData((item)=>{
  //     itemInst = item.find((i) => i.postId === postId) // {postId: 'abcd', isLiked: false}
  //     itemInst[key] = value
  //     return {
  //       ...item,
  //       itemInst
  //     }
  //   })
  // }

  const handleRefresh = () => {
    return new Promise(async (resolve) => {
      setPosts([]);
      setSkeleton(true);
      if (tab == "POPULAR") {
        await getPopularFeed();
      } else {
        await getTimelinePosts();
      }
      await setRefreshPage((prev) => prev + 1);
      setTimeout(resolve, 1);
    });
  };

  const handleTabChange = (tabName) => {
    // setPosts([]);
    setTab(tabName);
    setSkeleton(true);
    if (tabName == "POPULAR") {
      getPopularFeed();
    } else {
      getTimelinePosts();
    }
  };

  const followUnfollowEvent = (id) => {
    // console.log("id", id);
    let postInstance = posts;
    postInstance.map((item) => {
      item.userId == id ? (item["isFollowed"] = 1) : "";
    });
    setPosts([...postInstance]);
  };

  return (
    <>
      <CustomHead
        ogTitle={data && data.firstName + " " + data.lastName + " on " + APP_NAME}
        ogImage={
          data.postType && data.postType == 1
            ? OG_LOGO
            : s3ImageLinkGen("https://d3ibjckw2fut1c.cloudfront.net", data?.postData?.[0]?.type == 1 ? data.postData[0].url : data.postData?.[0].thumbnail)
        }
        language={reduxData.language}
        altText={`${data && data.firstName} ${data.lastName} ${data.country && `- ${data.country}`}`}
        url={`${WEB_LINK}/post/${data && data.postId}`}
        description={data && data.description}
        pageTitle={data && data.firstName + " " + data.lastName}
        metaTags={[data && data.firstName + " " + data.lastName, ...props.seoSettingData?.metaTags]}
      />
      {mobileView ? (
        <div
          className="mv_timeline_home overflow-atuo"
          style={{ overflow: "auto", height: "100vh" }}
        >
          {query.slug[1] == "hashtag"
            ? <Header
              title={props?.postData?.username}
              back={() => router.back()}
              icon={backArrow}
              align={"text-left"}
            />
            : <TimelineHeader
              isSharedProfile={true}
              setActiveState={props.setActiveState}
            />
          }
          <div className={`mv_cont_posts${query.slug[1] == "hashtag" ? "" : " p-0 pt-3"}`}>
            <div className="col-12">
              <div className="row">
                <div className="col-auto px-2 mx-auto w_960">
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane active" id="Popular">
                      {showSkeleton && <TimelineSkeleton />}
                      {!data && !showSkeleton && (
                        <div className="text-center pt-5">
                          <div className="h3 text-muted">
                            The shared link is not valid anymore!
                          </div>
                          <Link className="App-link" href="/">
                            go back to home page
                          </Link>
                        </div>
                      )}
                      {data && !showSkeleton && (
                        <div key="data._id">
                          <ModelCard
                            setActiveState={setActiveState}
                            price={data.price}
                            currency={data.currency || {}}
                            profileLogo={data.profilePic}
                            profileLogoText={data.firstName?.[0] + data.lastName?.[0]}
                            onlineStatus={data.postedAt}
                            postImage={data.postData}
                            postType={data.postType}
                            likeCount={data.likeCount}
                            commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                            postDesc={data.description}
                            postId={data.postId}
                            userId={data.userId}
                            isLiked={data.isLike}
                            totalTipReceived={data.totalTipReceived}
                            isVisible={data.isVisible || 0}
                            taggedUsers={data.taggedUsers}
                            isFollowed={data.isFollowed || 0}
                            followUnfollowEvent={props.followUnfollowEvent}
                            deletePostEvent={props.deletePostEvent}
                            subscribedEvent={props.subscribedEvent}
                            alt={`${data.firstName} ${data.lastName}`}
                            username={data.username || data?.userName}
                            isBookmarked={data.isBookmarked}
                            profileName={data.firstName}
                            isSharedPost={true}
                            commnntId={query.commentId}
                            post={data}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <DesktopFooter />
          </div>
        </div>
      ) : (
        profileData.email ? 
        (
          <div className="d-flex flex-row justify-content-between w-100">
                <div style={{ width: '19.62%', minWidth: '15rem', borderRight: '1.5px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100'>
                  <DvSidebar fullbar {...props} />
            </div>
            <div className="px-3" style={{ width: '50.8%' }}>
            <TimelineStories
                      setActiveState={props.setActiveState}
                      handleRefresh={refreshPage}
                    />
            <div className="tab-pane active mt-2">
            {showSkeleton && <TimelineSkeleton />}
            {!data && !showSkeleton && (
              <div className="text-center pt-5">
                <div className="h3 text-muted">
                  The shared link is not valid anymore!
                </div>
                <Link className="App-link" href="/">
                  go back to home page
                </Link>
              </div>
            )}
            {data && !showSkeleton && (
              <div key="data._id">
                <ModelCard
                  setActiveState={setActiveState}
                  price={data.price}
                  currency={data.currency || {}}
                  profileLogo={data.profilePic}
                          profileLogoText={data.firstName?.[0] + data.lastName?.[0]}
                  onlineStatus={data.postedAt}
                  postImage={data.postData}
                  postType={data.postType}
                  likeCount={data.totalLike}
                  commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                  postDesc={data.description}
                  postId={data.postId}
                  userId={data.userId}
                  isLiked={data.isLike}
                  totalTipReceived={data.totalTipReceived}
                  isVisible={data.isVisible || 0}
                  taggedUsers={data.taggedUsers}
                  isFollowed={data.isFollowed || 0}
                  followUnfollowEvent={props.followUnfollowEvent}
                  deletePostEvent={props.deletePostEvent}
                  subscribedEvent={props.subscribedEvent}
                  alt={`${data.firstName} ${data.lastName}`}
                  username={data.username || data?.userName}
                  isBookmarked={data.isBookmarked}
                  profileName={data.username}
                  isSharedPost={true}
                  commnntId={query.commentId}
                  post={data}
                />
              </div>
            )}
          </div>
            </div>
                <div className="dv__freaturedCreatorsWidth sticky-top vh-100" style={{ width: '29.45%', minWidth: '20rem', borderLeft: '1px solid var(--l_border)', overflowY: 'auto' }}>
            <DvFeaturedCreators setActiveState={props.setActiveState} />
          </div>
          </div>
        ) 
        :
        (
        <div className="">
          {/* <MarkatePlaceHeader setActiveState={setActiveState} /> */}
          <GuestHeader />

          <div className="websiteContainer pt-3">
            <div className="dv__postWidth" style={{ margin: "auto" }}>
              <div className="text-center">
                <PageLoader />
              </div>

              <div className="tab-pane active mt-2">
                {showSkeleton && <TimelineSkeleton />}
                {!data && !showSkeleton && (
                  <div className="text-center pt-5">
                    <div className="h3 text-muted">
                      The shared link is not valid anymore!
                    </div>
                    <Link className="App-link" href="/">
                      go back to home page
                    </Link>
                  </div>
                )}
                {data && !showSkeleton && (
                  <div key="data._id">
                    <ModelCard
                      setActiveState={setActiveState}
                      price={data.price}
                      currency={data.currency || {}}
                      profileLogo={data.profilePic}
                            profileLogoText={data.firstName?.[0] + data.lastName?.[0]}
                      onlineStatus={data.postedAt}
                      postImage={data.postData}
                      postType={data.postType}
                      likeCount={data.totalLike}
                      commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                      postDesc={data.description}
                      postId={data.postId}
                      userId={data.userId}
                      isLiked={data.isLike}
                      totalTipReceived={data.totalTipReceived}
                      isVisible={data.isVisible || 0}
                      taggedUsers={data.taggedUsers}
                      isFollowed={data.isFollowed || 0}
                      followUnfollowEvent={props.followUnfollowEvent}
                      deletePostEvent={props.deletePostEvent}
                      subscribedEvent={props.subscribedEvent}
                      alt={`${data.firstName} ${data.lastName}`}
                      username={data.username || data?.userName}
                      isBookmarked={data.isBookmarked}
                      profileName={data.username}
                      isSharedPost={true}
                      post={data}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <GuestFooter />
          </div>
        </div> 
        )            
      )}
    </>
  );
};

Index.getInitialProps = async ({ Component, ctx }) => {
  const { query = {}, req, res } = ctx;
  const postId = query.slug[0];
  const referId = query.slug[1];
  
  let response = {};
  let token = getCookiees("token", req);
  try {
    if (!token) {
      const guestData = await guestLogin();
      token = guestData.token;
    }

    if (postId) {
      response = await getSharedPost(postId, referId, decodeURI(token));
    }
  } catch (e) {
    console.error("Error in getInitialProps", e);
  }
  return { query: query, postData: response?.data?.result[0] || {} };
};

export default Index;
