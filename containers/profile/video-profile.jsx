import React from "react";
import ProfileTimeline from "../../components/profileTimeline/profileTimelineCard";
import Placeholder from "./placeholder";
import PageLoader from "../../components/loader/page-loader";
import isMobile from "../../hooks/isMobile";

export default function VideoProfile(props) {
  const [widthRatio, setWidthRatio] = React.useState();
  const [videoPost, setVideoPost] = React.useState();
  const { post } = props;
  const [mobile] = isMobile();

  React.useEffect(() => {
    if (window.innerWidth) {
      setWidthRatio(Math.round((window.innerWidth - 50) / 3));
    } else {
      setWidthRatio(300);
    }
    let videoPost =
      props.post &&
      props.post.length &&
      props.post.filter((data) => {
        return data.postData.length && data.postData[0].type == 2;
      });

    setVideoPost(videoPost);
  }, []);

  return (
    <div id="menu2">
      {post && post.length ? (
        post.map((data, index) => {
          if (!data.postData || !data.postData.length) {
            return <span key={index}></span>;
          }
          return (
            <ProfileTimeline
              price={data.price}
              coverImage={post.previewData ? post.previewData[0]?.thumbnail || post.previewData[0]?.url : undefined }
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
              totalTipReceived={data.totalTipReceived}
              isVisible={data.isVisible || 0}
              taggedUsers={data.taggedUsers}
              fullName={`${data.firstName} ${data.lastName}`}
              isBookmarked={data.isBookmarked}
              status={data.status}
              post={data}
              {...props}
            />
          );
        })
      ) : (
        mobile ? (
          <Placeholder pageName="videoProfile" />
        ) : (
          <div className="text-dark font-weight-bold text-center rounded py-5">
            <Placeholder
              pageName="videoProfile"
            />
          </div>
        )
      )}
      <div className="text-center">
        {post && post.length ? <PageLoader /> : <></>}
      </div>
    </div>
  );
}
