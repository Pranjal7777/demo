import React, { useEffect, useRef, useState } from "react";
import Pagination from "../../hoc/divPagination";
import useDetectHeaderHight from "../../hooks/detectHeader-hight";
import { stopLoader } from "../../lib/global";
import Header from "../header/header";
import PageLoader from "../loader/page-loader";
import ModelCard from "../timeline-control/timeline-card";
import isMobile from "../../hooks/isMobile";
import DvHeader from "../../containers/DvHeader/DvHeader";
import HashtagPage from "../../containers/sub-pages/hashtagPage";
import Icon from "../image/icon";
import { backArrow } from "../../lib/config";
import { useTheme } from "react-jss";
import { useRouter } from "next/router";
import MarkatePlaceHeader from "../../containers/markatePlaceHeader/markatePlaceHeader";
import PaginationIndicator from "../pagination/paginationIndicator";
import { updateHashtag } from "../../redux/actions/auth";
import { useDispatch } from "react-redux";

const ExplorePostView = (props) => {
  const [mobileView] = isMobile()
  const theme = useTheme()
  const Router = useRouter()
  const [videoAnalytics, setVideoAnalytics] = useState([]);
  const [activeNavigationTab, setActiveNavigationTab] = useState('hashtag');
  const { onClose, posts, selectedId, laoder, loading, setPage, setLoading, callApi, hashTagPage } = props;
  const renderCount = useRef(0)
  const dispatch = useDispatch()

  useEffect(() => {
    setActiveNavigationTab('hashtag')
  }, []);

  useDetectHeaderHight("exploreHeader", "exploreView");

  useEffect(() => {
    const selectedPost = document.getElementById(props.selectedPost);
    selectedPost && selectedPost.scrollIntoView();
    stopLoader();
  }, [props.selectedPost, posts.length]);

  const handleUpdateHashTag = (postId) => {
    dispatch(updateHashtag({
      postId,
      isVisible: 1
    }))
  }
  return (
    <>
      <div>
        {mobileView
          ? <Header id="exploreHeader" back={onClose} title={props.title} />
          : <MarkatePlaceHeader
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            {...props}
          />
        }
      </div>
      <div className={`data vh-100 vw-100 overflow-auto text-app ${mobileView ? "" : "px-2"}`} id="exploreView" >
        <div className="data px-2" style={{ paddingTop: `${mobileView ? "30px" : '85px'}`, width: `${mobileView ? "" : "48vw"}`, margin: `${mobileView ? '' : '0 auto'}` }}>
          {!mobileView && <div>
            <Icon
              icon={`${backArrow}#left_back_arrow`}
              color={theme.type == "light" ? "#000" : "#fff"}
              width={25}
              height={25}
              onClick={() => Router.back()}
              alt="backArrow"
              class="hashtag_back_arrow cursorPtr"
            />
          </div>
          }
          {posts?.map((data, index) => {
            if (!data.postData || !data.postData.length) return;
            return (
              <div id={data.postId} key={index}>
                <ModelCard
                  setVideoAnalytics={(data) => {
                    setVideoAnalytics((prev) => [...prev, data]);
                  }}
                  setActiveState={props.setActiveState}
                  price={data.price}
                  currency={data.currency || {}}
                  profileLogo={data.profilePic}
                  postImage={data.postData}
                  postType={data.postType}
                  isBookmarked={data.isBookmarked}
                  profileName={data.firstName}
                  onlineStatus={data.postedAt}
                  likeCount={data.totalLike}
                  commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                  postDesc={data.description}
                  postId={data.postId}
                  userId={data.userId}
                  isLiked={data.isLike}
                  username={data.username || data.userName}
                  totalTipReceived={data.totalTipReceived} // not available
                  followUnfollowEvent={props.followUnfollowEvent}
                  isVisible={data.isVisible || 0}
                  taggedUsers={data.taggedUsers}
                  isFollowed={data.isFollowed || 0}
                  subscribedEvent={() => handleUpdateHashTag(data.postId)}
                  isHashTag
                  post={data}
                />
              </div>
            );
          })}

          {/* {laoder && (
            <div className="py-3 d-flex justify-content-center">
              <PageLoader start={true} />
            </div>
          )} */}

          <PaginationIndicator
            id="exploreView"
            pageEventHandler={(val) => {
              renderCount.current++
              if (!loading && renderCount.current > 1 && callApi) {
                setPage(prev => hashTagPage ? hashTagPage + 1 : prev + 1)
                setLoading(true)
              }
            }}
          />
        </div>
      </div>
    </>
  );
};
export default ExplorePostView;
