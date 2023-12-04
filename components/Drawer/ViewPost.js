import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { startLoader, stopLoader } from "../../lib/global";
import { getPostById } from "../../services/assets";
import Wrapper from "../../hoc/Wrapper"
const Header = dynamic(() => import("../header/header"), { ssr: false });
const ProfileTimeline = dynamic(() => import("../profileTimeline/profileTimelineCard"), { ssr: false });
const TimelineSkeleton = dynamic(() => import("../timeline-control/timeline-card-skeleton"), { ssr: false });

export default function ViewPost(props) {
  const { postId, onClose } = props;
  const [postData, setPostData] = useState(null);
  const [mobileView] = isMobile();
  const [lang] = useLang();

  useEffect(() => {
    startLoader();
    getPostById(postId)
      .then((res) => {
        // console.log("ndwud", res);
        let response = res;
        if (response.status == 200) {
          setPostData(
            res &&
            res.data &&
            res.data.result &&
            res.data.result.length > 0 &&
            res.data.result[0]
          );
        }
        stopLoader();
      })
      .catch((err) => {
        console.error(err);
        setPostData(null);
        stopLoader();
      });
  }, []);

  return (
    <Wrapper>
      <div className="col-12">
        {mobileView ? (
          <Header
            title={lang.postDtl}
            back={() => {
              onClose();
            }}
          />
        ) : (
          <>
            <h5 className="content_heading text-center px-1 py-3 m-0">
              {lang.postDtl}
            </h5>
            <button
              type="button"
              className="close dv_modal_close"
              data-dismiss="modal"
              onClick={() => props.updateScreen()}
            >
              {lang.btnX}
            </button>
          </>
        )}
        <div style={mobileView ? { paddingTop: "70px" } : {}}>
          {postData ? (
            <ProfileTimeline
              viewPostPage={true}
              price={postData.price}
              coverImage={postData.previewData ? postData.previewData[0]?.url : undefined }
              currency={postData.currency || {}}
              deletePostEvent={props.deletePostEvent}
              reloadItems={props.reloadItems}
              profileLogo={postData.profilePic}
              profileName={postData.firstName}
              onlineStatus={postData.postedAt}
              postImage={postData.postData}
              postType={postData.postType}
              likeCount={postData.totalLike}
              isLiked={postData.isLike}
              commentCount={postData.commentCount}
              postDesc={postData.description}
              postId={postData.postId}
              userId={postData.userId}
              userName={postData.userName || postData.username}
              currencySymbol={
                postData.currency && postData.currency.symbol
                  ? postData.currency.symbol
                  : "$"
              }
              totalTipReceived={postData.totalTipReceived}
              isVisible={postData.isVisible || 0}
              taggedUsers={postData.taggedUsers}
              isBookmarked={postData.isBookmarked}
              post={postData}
              {...props}
            />
          ) : (
            <TimelineSkeleton itemCount={[1]} />
          )}
        </div>
      </div>
    </Wrapper>
  );
}
