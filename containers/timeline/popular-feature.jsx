import React, { useEffect, useState } from "react";
import ModelCard from "../../components/timeline-control/timeline-card"
import isMobile from "../../hooks/isMobile";
import usePostsObserver from "../../hooks/usePostsObserver";
import FeatureCreators from "./featured-creators";
import useFeaturedApiHook from "./featuredApiHook";

let showLength = {
  top: 0,
  bottom: 8,
};
const currentIndex = {
  top: 0,
  bottom: 0,
};

export default function PopularModels(props) {
  const { posts = [], refreshPage } = props;
  const [mobileView] = isMobile();
  const [showRange, setShowRange] = useState({
    top: 0,
    bottom: 8,
  });

  const {
    skeleton,
    isLoading,
    initialApiCall,
    handleRefreshApiCall,
    pageEventHandler } = useFeaturedApiHook();

  usePostsObserver(posts)

  useEffect(() => {
    if (mobileView) {
      initialApiCall()
    }
  }, [])

  useEffect(() => {
    if (refreshPage) {
      handleRefreshApiCall()
    }
  }, [refreshPage])

  if (props && props.tab == "LATEST") {
    return <div className="tab-pane active" id="Popular"></div>;
  }

  const onScroll = () => {
    let currDivIndexBottom = document
      .elementFromPoint(window.innerWidth / 2, window.innerHeight - 50)
      .getAttribute("index");

    let currDivIndexTop = document
      .elementFromPoint(window.innerWidth / 2, 10)
      .getAttribute("index");

    currDivIndexBottom = parseInt(currDivIndexBottom);

    currDivIndexTop = parseInt(currDivIndexTop);

    // console.log("currDivIndexTop", currDivIndexBottom);
    if (
      currDivIndexTop < currentIndex.top &&
      currDivIndexTop < showLength.top + 2
    ) {
      // console.log("scroll", currDivIndexTop);
      setShowRange((p) => ({
        top: p.top - 4,
        bottom: p.bottom - 3,
      }));
      showLength = {
        top: showLength.top - 4,
        bottom: showLength.bottom - 3,
      };
    }
    console.log(currDivIndexBottom > currentIndex.bottom && currDivIndexBottom > showLength.bottom - 2, currDivIndexBottom, currentIndex.bottom, currDivIndexBottom, showLength.bottom - 2, "asijdijijij")
    if (currDivIndexBottom && currDivIndexBottom > currentIndex.bottom && currDivIndexBottom > showLength.bottom - 2) {
      console.log("scrollBotttttom", currDivIndexBottom)
      setShowRange((p) => ({
        top: p.top + 3,
        bottom: p.bottom + 4,
      }));
      showLength = {
        top: showLength.top + 3,
        bottom: showLength.bottom + 4,
      };
    }
    if (currDivIndexBottom) currentIndex.bottom = currDivIndexBottom;
    if (currDivIndexTop) currentIndex.top = currDivIndexTop;
  };

  useEffect(() => {
    const element = document.getElementById("home-page")
    element.addEventListener("scroll", onScroll);
    return () => element.removeEventListener("scrollY");
  }, []);
  console.log("showRange", showRange)


  return (
    <div id="Popular">
      {posts.map((data, index) => {
        // if (data.skeleton) return <TimelineSkeleton key={index} />;
        if (!data.postData || !data.postData.length) return <React.Fragment key={index}></React.Fragment>;
        if (index >= showRange.top && index < showRange.bottom) {
          return (
            <>
              <div key={data.postId} id={data.postId}>
                <ModelCard
                  currentIndex={index + 1}
                  shoutoutPrice={data?.shoutoutPrice}
                  setActiveState={props.setActiveState}
                  price={data.price}
                  currency={data.currency || {}}
                  profileLogo={data.profilePic}
                  isBookmarked={data.isBookmarked}
                  profileName={data.firstName}
                  profileLogoText={data.firstName[0] + data.lastName[0]}
                  onlineStatus={data.postedAt}
                  postImage={data.postData}
                  postType={data.postType}
                  likeCount={data.totalLike}
                  commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                  postDesc={data.description}
                  postId={data.postId}
                  userId={data.userId || data.userId_x}
                  isLiked={data.isLike}
                  isEnable={data.isEnable}
                  totalTipReceived={data.totalTipReceived}
                  isVisible={data.isVisible || 0}
                  taggedUsers={data.taggedUsers}
                  isFollowed={data.isFollowed || 0}
                  followUnfollowEvent={props.followUnfollowEvent}
                  deletePostEvent={props.deletePostEvent}
                  subscribedEvent={props.subscribedEvent}
                  alt={`${data.firstName} ${data.lastName}`}
                  username={data.username || data.userName}
                  visibleByDefault={index < 10}
                  setHomePageData={props.setHomePageData}
                  homepageData={posts}
                  post={data}
                />
              </div>
            </>
          );
        }
      })}
      <style jsx>{`
      :global(.profile_name){
        max-width:${mobileView && "42vw !important"}};
        padding-right:6px !important;
      }
      `}</style>
    </div>
  );
}
