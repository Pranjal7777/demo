import dynamic from "next/dynamic";
import React from "react";

const ModelCard = dynamic(() => import("../../components/timeline-control/timeline-card"), { ssr: false });
const TimelineSkeleton = dynamic(() => import("../../components/timeline-control/timeline-card-skeleton"));
import isMobile from "../../hooks/isMobile";
import usePostsObserver from "../../hooks/usePostsObserver";

export default function LatestModels(props) {
	const { posts = [] } = props;
	const[mobileView] = isMobile();
	usePostsObserver(posts)

	if (props && props.tab == "POPULAR") {
		return <div className="tab-pane fade" id="Latest"></div>;
	}


	return (
		<div id="Latest">
			{posts.map((data, index) => {
				// if (data.skeleton) return <TimelineSkeleton key={index} />;
				if (!data.postData || !data.postData.length) return <React.Fragment key={index}></React.Fragment>;
				else return (
					<div key={data.postId} id={data.postId}>
						<ModelCard
							shoutoutPrice={data?.shoutoutPrice?.price}
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
							isEnable={data?.shoutoutPrice?.isEnable}
							likeCount={data.totalLike}
							commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
							postDesc={data.description}
							postId={data.postId}
							userId={data.userId}
							isLiked={data.isLike}
							totalTipReceived={data.totalTipReceived}
							// isVisible={data.postType == 1 && !data.isVisible ? 0 : 1}
							isVisible={data.isVisible || 0}
							taggedUsers={data.taggedUsers}
							isFollowed={1} // this always be 1 beause we are showing post of followed users
							deletePostEvent={props.deletePostEvent}
							subscribedEvent={props.subscribedEvent}
							alt={`${data.firstName} ${data.lastName}`}
							username={data.username || data.userName}
							latestPage={true}
							isHashtagPost={data.isHashtagPost}
							hashtagName={data.hashtagName}
							setHomePageData={props.setHomePageData}
							homepageData={posts}
							post={data}
						/>
					</div>
				);
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

