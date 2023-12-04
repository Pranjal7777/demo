import dynamic from "next/dynamic";
import React, { useState } from "react";
import isMobile from "../../hooks/isMobile";
import { getCookie } from "../../lib/session";
const PageLoader = dynamic(() => import("../../components/loader/page-loader"));
import Placeholder from "./placeholder";
import Allotherpost from "./Allotherpost";
import { useRouter } from "next/router";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
const MobileGridView = dynamic(() => import("../../components/mobileGridView/MobileGridView"));
const MobilePostView = dynamic(() => import("../../components/mobileGridView/MobilePostView"));
const Model = dynamic(() => import("../../components/model/model"));

export default function AllPost(props) {
  const { post, isOtherProfile, isMoreMenu, postLoader = false } = props;
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [widthRatio, setWidthRatio] = React.useState();
  const [mobile] = isMobile();
  const userId = isAgency() ? selectedCreatorId : getCookie("uid");
  const router = useRouter();

  React.useEffect(() => {
    if (window.innerWidth) {
      setWidthRatio(Math.round((window.innerWidth - 50) / 3));
    } else {
      setWidthRatio(600);
    }
  });
  return (
    <>
      <div id="home" className={`tab-pane active row d-flex mx-0 mt-2 mb-0`}>

        {post && post.length > 0 ? (
          post.map((data, index) => {
            if (mobile) {
              return (
                <MobileGridView
                  price={data.price}
                  currency={data.currency || {}}
                  key={index}
                  deletePostEvent={props.deletePostEvent}
                  reloadItems={props.reloadItems}
                  profileLogo={data.profilePic}
                  profileName={data.firstName}
                  onlineStatus={data.postedAt}
                  postImage={data.postData}
                  coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined}
                  postType={data.postType}
                  likeCount={data.likeCount}
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
                  isVisible={data.isVisible || 0}
                  taggedUsers={data.taggedUsers}
                  taggedUserIds={data.taggedUserIds}
                  isBookmarked={data.isBookmarked}
                  fullName={`${data.firstName} ${data.lastName}`}
                  isNSFW={data.isNSFW}
                  nsfwData={data.nsfwData}
                  status={data.status}
                  isScheduled={props.isScheduled}
                  scheduledTimestamp={data.scheduledTimestamp}
                  creationTs={data.scheduledTimestamp || data.creationTs}
                  setPage={props?.setPage}
                  isOtherProfile={isOtherProfile !== undefined ? isOtherProfile : userId !== data.userId}
                  isMoreMenu={isMoreMenu}
                  isAllPosts
                  currentIndex={index}
                  isFollowed={props.isFollowed}
                  allPost={post}
                  page={props.page}
                  setNeedApiCall={props.setNeedApiCall}
                  getPersonalAssets={props.getPersonalAssets}
                  size={props.size}
                  otherPostSlider={false}
                  setId={props.setId}
                  handleDialog={props.handleDialog}
                  isAddBoxShadow={props.isAddBoxShadow}
                  mediaType={data.mediaType}
                  showPriceOnGrid={true}
                  setActiveNavigationTab={props.setActiveNavigationTab}
                // {...props}
                />
              );
            } else if (!mobile) {
              return (
                <>
                  <Allotherpost
                    price={data.price}
                    coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined}
                    currency={data.currency || {}}
                    key={index}
                    deletePostEvent={props.deletePostEvent}
                    reloadItems={props.reloadItems}
                    profileLogo={data.profilePic}
                    profileName={data.firstName}
                    onlineStatus={data.postedAt}
                    postImage={data.postData}
                    postType={data.postType}
                    likeCount={data.totalLike}
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
                    isVisible={data.isVisible || 0}
                    taggedUsers={data.taggedUsers}
                    taggedUserIds={data.taggedUserIds}
                    isBookmarked={data.isBookmarked}
                    fullName={`${data.firstName} ${data.lastName}`}
                    isNSFW={data.isNSFW}
                    nsfwData={data.nsfwData}
                    status={data.status}
                    isScheduled={props.isScheduled}
                    scheduledTimestamp={data.scheduledTimestamp}
                    creationTs={data.scheduledTimestamp || data.creationTs}
                    setPage={props?.setPage}
                    isOtherProfile={isOtherProfile !== undefined ? isOtherProfile : userId !== data.userId}
                    isMoreMenu={isMoreMenu}
                    isAllPosts
                    currentIndex={index}
                    isFollowed={data.isFollowed}
                    allPost={post}
                    page={props.page}
                    setNeedApiCall={props.setNeedApiCall}
                    getPersonalAssets={props.getPersonalAssets}
                    size={props.size}
                    otherPostSlider={props.otherPostSlider}
                    activeNavigationTab={props.activeNavigationTab}
                    setProfile={props.setProfile}
                    profile={props.profile}
                    setassets={props.setassets}
                    isAddBoxShadow={props.isAddBoxShadow}
                    postToShow={index}
                    showPriceOnGrid={true}
                    setActiveNavigationTab={props.setActiveNavigationTab}
                  // {...props}
                  />

                </>
              );
            }

            else {
              return <span key={index}></span>;
            }
          })
        ) : mobile ? (
          !postLoader && <Placeholder />
        ) : (
          <div className="font-weight-bold text-center w-100">
            {!postLoader && <Placeholder />}
          </div>
        )}
        {mobile && (
          <Model
            open={props.isModelOpen}
            className={"full_screen_dialog vw-100"}
            // closeIcon={true}
            // keepMounted={true}
            fullScreen={true}
          >
            <MobilePostView
              onClose={() => props.handleDialog(false)}
              selectedPost={props.selectId}
              posts={post}
              id="search-page"
              title={props.title}
              isScheduled={props.isScheduled}
              setActiveNavigationTab={props.setActiveNavigationTab}
              handleDialog={props.handleDialog}
            />
          </Model>)}
        <style jsx>{`
      .border_box{
        border:1px solid var(--l_grey_border) ;
      }
      .gap_box{
        gap: 3vw ;
      }
      :global(.manageChild>div){
       margin:${!mobile && '1px !important'};
      }
      
      
      `}</style>
      </div>
      {post && post.length ? <PageLoader /> : <></>}

    </>

  );
}
