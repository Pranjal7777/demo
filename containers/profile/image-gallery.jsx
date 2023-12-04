import React from "react";
import PageLoader from "../../components/loader/page-loader";
import ProfileTimeline from "../../components/profileTimeline/profileTimelineCard";
import Placeholder from "./placeholder";
import isMobile from "../../hooks/isMobile"

export default function ImageGallery(props) {
  const [widthRatio, setWidthRatio] = React.useState();
  const [imgPost, setImagePost] = React.useState();
  const [mobile] = isMobile();

  React.useEffect(() => {
    if (window.innerWidth) {
      setWidthRatio(Math.round((window.innerWidth - 50) / 3));
    } else {
      setWidthRatio(600);
    }
    let imgPost =
      props &&
      props.post &&
      props.post.length &&
      props.post.filter((data) => {
        return data.postData.length && data.postData[0].type == 1;
      });

    setImagePost(imgPost);
  }, [props]);

  return (
    <div className="mb-3">
      {imgPost && imgPost.length > 0 ? (
        imgPost.map((data, index) => {
          if (!data.postData || !data.postData.length) {
            return <span key={index}></span>;
          }
          return (
            <ProfileTimeline
              price={data.price}
              coverImage={data.previewData ? data.previewData[0]?.thumbnail || data.previewData[0]?.url : undefined }
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
              isBookmarked={data.isBookmarked}
              fullName={`${data.firstName} ${data.lastName}`}
              post={data}
              {...props}
            />
          );
        })
      ) : (
        mobile ? (
          <Placeholder pageName="imageProfile" />
        ) : (
          <div className="text-dark font-weight-bold text-center rounded py-5">
            <Placeholder
              pageName="imageProfile"
            />
          </div>
        )
      )}
      <div className="text-center dot_load">
        {imgPost && imgPost.length ? <PageLoader /> : <></>}
      </div>
    </div>
  );
}
