import React, { useEffect, useRef, useState } from "react";
import useDetectHeaderHight from "../../hooks/detectHeader-hight";
import { stopLoader } from "../../lib/global/loader";
import Header from "../header/header";
import ProfileTimeline from "../../components/profileTimeline/profileTimelineCard";
import isMobile from "../../hooks/isMobile";
import Icon from "../image/icon";

import { useTheme } from "react-jss";
import { useRouter } from "next/router";
import PaginationIndicator from "../pagination/paginationIndicator";
import { updateHashtag } from "../../redux/actions/auth";
import { useDispatch } from "react-redux";
import { backArrow } from "../../lib/config/homepage";
import useLang from "../../hooks/language";
import usePostsObserver from "../../hooks/usePostsObserver";

const MobilePostView = (props) => {
    const [mobileView] = isMobile()
    const theme = useTheme()
    const [lang] = useLang();
    const Router = useRouter()
    const { onClose, posts, selectedId, laoder, loading, setPage, setLoading, callApi, hashTagPage } = props;
    const renderCount = useRef(0)
    const dispatch = useDispatch()

    useDetectHeaderHight("exploreHeader", "exploreView");
    usePostsObserver(posts || [])
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
                <Header id="exploreHeader" back={onClose} title={props.title} />
            </div>
            <div className={`data vh-100 vw-100 overflow-auto text-app ${!mobileView && "px-2"}`} id="exploreView">
                <div className={`data ${mobileView ? 'px-0' : 'px-2'}`} style={{ paddingTop: `${mobileView ? "0px" : '85px'}`, width: `${mobileView ? "" : "48vw"}`, margin: `${mobileView ? '' : '0 auto'}` }}>
                    {posts?.map((data, index) => {
                        if (!data.postData || !data.postData.length) return;
                        return (
                            <div id={data.postId} key={index} className="position-relative">
                                <ProfileTimeline
                                    setVideoAnalytics={(data) => {
                                        setVideoAnalytics((prev) => [...prev, data]);
                                    }}
                                    setActiveState={props.setActiveState}
                                    price={data.price}

                                    currency={data.currency || {}}
                                    profileLogo={data.profilePic}
                                    postImage={data.postData}
                                    postType={data.postType}
                                    coverImage={data.previewData ? data.previewData[0]?.url : undefined}
                                    isBookmarked={
                                        typeof data.isBookmarked != "undefined"
                                            ? data.isBookmarked
                                            : true}
                                    profileName={data.firstName}
                                    onlineStatus={data.postedAt}
                                    likeCount={data.likeCount || data.totalLike}
                                    commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                                    postDesc={data.description}
                                    postId={data.postId}
                                    userId={data.userId}
                                    likedPost={props.likedPost}
                                    isLiked={props.likedPost || data.isLike}
                                    userName={data.username || data.userName}
                                    totalTipReceived={data.totalTipReceived} // not available
                                    followUnfollowEvent={props.followUnfollowEvent}
                                    isVisible={data.isVisible || 0}
                                    taggedUsers={data.taggedUsers}
                                    isFollowed={data.isFollowed || 0}
                                    subscribedEvent={props.subscribedEvent || (() => handleUpdateHashTag(data.postId))}
                                    isLockedPost={props.isLockedPost}
                                    isScheduled={props.isScheduled}
                                    creationTs={data.creationTs}
                                    isHashTag
                                    isEnable={data.isEnable}
                                    shoutoutPrice={data.shoutoutPrice}
                                    setActiveNavigationTab={props.setActiveNavigationTab}
                                    handleDialog={props.handleDialog}
                                    updateLikedPost={props.updateLikedPost}
                                    post={data}
                                    taggedUserIds={data.taggedUserIds}
                                />
                            </div>
                        );
                    })}
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
                <style jsx>{`
                :global(.manageScheduleTimeProfileCard){
                    top:5.5rem !important;
                    bottom:0 !important;
                }
                :global(.manageAtiveBtnProfileCard){
                    bottom: 7rem !important;
                    left: 50% !important;
                    transform: translate(-50%, 0px) !important;
                    width: 50vw !important;
                    border-radius: 30px !important;
                    overflow: hidden !important;
                }
                `}</style>
            </div>
        </>
    );
};
export default MobilePostView;
