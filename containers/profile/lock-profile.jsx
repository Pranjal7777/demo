import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { getCookie } from "../../lib/session";
import Placeholder from "./placeholder";
import ProfileTimeline from "../../components/profileTimeline/profileTimelineCard";
const PageLoader = dynamic(() => import("../../components/loader/page-loader"));
import isMobile from "../../hooks/isMobile"
import Allotherpost from "./Allotherpost";
import { UpdateModelCardPostSubject } from "../../lib/rxSubject";
import { useRouter } from "next/router";
import Button from "../../components/button/button";
import useLang from "../../hooks/language";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import FilterOption from "../../components/filterOption/filterOption";
const MobileGridView = dynamic(() => import("../../components/mobileGridView/MobileGridView"));
const MobilePostView = dynamic(() => import("../../components/mobileGridView/MobilePostView"));
const Model = dynamic(() => import("../../components/model/model"));

export default function LockProfile(props) {
  const { setSelectedSorting = () => { return } } = props;
  const userId = getCookie("uid");
  const [widthRatio, setWidthRatio] = React.useState();
  const [mobile] = isMobile()
  const [lang] = useLang();
  const router = useRouter();
  const [post, setPost] = useState(props.post)
  const [newKey, setNewKey] = useState(999999)
  const [activeNavigationTab, setActiveNavigationTab] = useState("all_post")
  const selectedCreatorId = useSelector((state) => state?.selectedCreator.creatorId);


  useEffect(() => {
    setPost(props.post)
  }, [props.post])

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
    var id = UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setPost((prev) => {
        let postInst = prev.map((item) => {
          if (item.postId === postId) {
            return {
              ...item,
              isVisible: 1
            };
          } else {
            return item;
          }
        });
        return postInst;
      });
      setNewKey(+postId)

    });
    return () => id.unsubscribe()
  }, []);

  React.useEffect(() => {
    props.setActiveExclusiveTab("all_post");
    if (window.innerWidth) {
      setWidthRatio(Math.round((window.innerWidth - 70) / 3));
    } else {
      setWidthRatio(300);
    }
  }, []);
  return (
    <div id="menu3" className={`tab-pane active row mx-0 d-flex`}>
      <div className="d-flex col-12 px-3 pl-md-0 pb-2 pt-0 pt-sm-2 justify-content-between align-items-center" >
        <div className="scroll gap_8 d-flex">
          {postTypeList?.map((item, index) => {
            return (
              <div key={index}>
                <Button
                  type="button"
                  fclassname={`${(activeNavigationTab == item?.label || activeNavigationTab == item?.navigationTab) ? "btnGradient_bg" : "background_none borderStroke"} rounded-pill py-2 text-nowrap`}
                  onClick={() => { setActiveNavigationTab(item?.navigationTab), props.setActiveExclusiveTab(item?.navigationTab) }}
                  children={`${item?.label} (${props.postCount?.[item?.count] || 0})`}
                />
              </div>
            )
          })}
        </div>
        <div>
          <FilterOption leftFilterShow={mobile ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedSorting(value)} />
        </div>
      </div>
      {post && post.length > 0 ? (
        post.map((data, index) => {

          if (mobile) {
            if (data.postData.length) {
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
                  isOtherProfile={router?.asPath === "/profile" ? false : true}
                  isVisible={props.isLockedPost ? 1 : data.isVisible}
                  taggedUsers={data.taggedUsers}
                  isBookmarked={data.isBookmarked}
                  fullName={`${data.firstName} ${data.lastName}`}
                  {...props}
                />
              );
            } else {
              return <span key={index}></span>;
            }
          }
          else if (!mobile) {
            console.log("dataaaaaaaaaa", data)
            return (

              <Allotherpost
                currentIndex={index}
                coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined}
                // isFollowed={props.isFollowed}
                allPost={props.post}
                page={props.page}
                // setNeedApiCall={props.setNeedApiCall}
                // getPersonalAssets={props.getPersonalAssets}
                // size={props.size}
                // otherPostSlider={props.otherPostSlider}
                showLock={props.isOtherProfilePage}
                price={data.price}
                currency={data.currency || {}}
                key={index + newKey}
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
                isVisible={props.isLockedPost ? 1 : data.isVisible}
                taggedUsers={data.taggedUsers}
                isOtherProfile={router?.asPath === "/profile" ? false : true}
                isBookmarked={data.isBookmarked}
                fullName={`${data.firstName} ${data.lastName}`}
                isLockedPost={props.isLockedPost}
                showPriceOnGrid={true}
                {...props}

              />

            )
          }



        })
      ) : (
        mobile ? (
          props.otherProfile ? (props.activeNavigationTab == "lock_post" ? <Placeholder otherProfile={props.otherProfile} pageName="exclusive-post" /> : "") : (props.activeNavigationTab == "exclusive_post" ? <Placeholder pageName="exclusive-post" /> : <Placeholder pageName="purchased-post" />)
        ) : (
          <div className="text-dark font-weight-bold text-center rounded py-5 w-100">
            {props.otherProfile ? (props.activeNavigationTab === "exclusive_post" ? <Placeholder otherProfile={props.otherProfile} pageName="exclusive-post" /> : "") : (props.activeNavigationTab == "exclusive_post" ? <Placeholder pageName="exclusive-post" /> : <Placeholder pageName="purchased-post" />)}
          </div>
        )
      )}
      <div className="text-center w-100">
        {post && post.length ? <PageLoader /> : <></>}
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
            posts={post}
            id="search-page"
            title={props.title}
            isLockedPost={props.isLockedPost}
          />
        </Model>)}
      <style jsx>{`
      :global(.manageChild>div){
        margin:${!mobile && '1px !important'};
      }
      `}
      </style>
    </div>
  );
}