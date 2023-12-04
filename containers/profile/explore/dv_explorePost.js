import React, { useState, useEffect } from "react";
import Img from "../../../components/ui/Img/Img";
import Wrapper from "../../../hoc/Wrapper";
import { MOBILE_NAV_BACK2 } from "../../../lib/config";
import DVExploreModelCard from "./dv_exploreCard";
import Icon from "../../../components/image/icon";
import { useTheme } from "react-jss";

export default function DvExplorePost(props) {
  const theme = useTheme();

  const [innterArrayIndex, setInnerIndex] = useState(props.innterArrayIndex);
  const [currentIndex, setCurrentIndex] = useState(props.index);
  const [data, setData] = useState(
    props.posts && props.posts.length > 0
      ? props.posts[currentIndex]
      : []
  );

  useEffect(() => {
    if (props.posts && props.posts.length > 0) {
      setData(props.posts[currentIndex]);
    }
  }, [currentIndex]);

  
  useEffect(()=>{
    setData(props.posts && props.posts.length > 0
      ? props.posts[currentIndex]
      : [])
  }, [props.posts])

  const handlePrevPost = () => {
    if (innterArrayIndex === 0 && currentIndex === 0) {
      setInnerIndex(props.posts.length - 1);
      setCurrentIndex(2);
    } else if (currentIndex === 0) {
      setInnerIndex((prevState) => prevState - 1);
      setCurrentIndex(2);
    } else {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const handleNextPost = () => {
    if (innterArrayIndex === props.posts.length - 1 && currentIndex === 2) {
      props && props.getItems(props.page);
      setTimeout(() => {
        handleAddPost();
      }, 1500);
    } else {
      handleAddPost();
    }
  };

  const handleAddPost = () => {
    // console.log("fndi", props.posts);
    if (currentIndex === 2) {
      setInnerIndex((prevState) => prevState + 1);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  return (
    <Wrapper>
      <div>
        <Icon
            icon={`${MOBILE_NAV_BACK2}#left_back_arrow`}
            color={theme?.text}
            onClick={() => handlePrevPost()}
            height={20}
            width={20}
            class="backIcon"
          />
        <DVExploreModelCard
          post={data}
          price={data && data.price || 10}
          currency={data && data.currency || "$"}
          key={data.postId}
          // deletePostEvent={props.deletePostEvent}
          profileLogo={data?.profilePic}
          profileName={data?.firstName}
          onlineStatus={data?.postedAt}
          postImage={data?.postData}
          postType={data?.postType}
          likeCount={data?.totalLike}
          isLiked={data?.isLike}
          commentCount={data?.commentCount}
          postDesc={data?.description}
          postId={data?.postId}
          userId={data?.userId}
          totalTipReceived={data?.totalTipReceived}
          isVisible={data?.isVisible}
          taggedUsers={data?.taggedUsers}
          isBookmarked={data?.isBookmarked}
          username={data?.username || data?.userName}
          setVideoAnalytics={(data) => {
            // setVideoAnalytics(prev=>[...prev, data])
          }}
          subscribedEvent={props?.subscribedEvent}
          setActiveState={props.setActiveState}
          isFollowed={data.isFollowed || 0}
          followUnfollowEvent={props.followUnfollowEvent}
        />
         {currentIndex < props?.posts.length - 1 && <Icon
              icon={`${MOBILE_NAV_BACK2}#left_back_arrow`}
              color={theme?.text}
              onClick={() => handleNextPost()}
              height={20}
              width={20}
              class="nextIcon"
            />}
      </div>

      <style jsx>
        {`
          :global(.mu-dialog > div > div) {
            overflow-y: visible !important;
          }
          :global(.mu-dialog) {
            margin: 11px !important;
          }
          :global(.backIcon) {
            position: absolute;
            top: 50%;
            left: -40px;
            z-index: 1;
            width: 20px;
            cursor: pointer;
          }
          :global(.nextIcon) {
            position: absolute;
            top: 50%;
            right: -40px;
            z-index: 1;
            width: 20px;
            transform: rotate(180deg);
            cursor: pointer;
          }
        `}
      </style>
    </Wrapper>
  );
}
