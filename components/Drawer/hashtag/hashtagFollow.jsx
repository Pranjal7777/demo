import { useState, useEffect } from "react";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import flattenDeep from "lodash/flattenDeep";

import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { goBack, open_dialog, Toast } from "../../../lib/global";
import * as env from "../../../lib/config";
import Header from "../../header/header";
import { followHashtagAPI, getHashtagsAPI } from "../../../services/hashtag";
import FigureCloudinayImage from "../../cloudinayImage/cloudinaryImage";
import { getCookie } from "../../../lib/session";
import PaginationIndicator from "../../pagination/paginationIndicator";
import Model from "../../model/model";
import ExplorePostView from "../../explore/explore-post-view";
import CustomDataLoader from "../../loader/custom-data-loading";
import { viewedHashtag } from "../../../redux/actions";
import Icon from "../../image/icon";
import { backArrow } from "../../../lib/config";
import TextPost from "../../TextPost/textPost";
import { useRef } from "react";
import DvSidebar from "../../../containers/DvSidebar/DvSidebar";
import DvFeaturedCreators from "../../../containers/DvHomePage/DvFeaturedCreators";
import isTablet from "../../../hooks/isTablet";
import Button from "../../button/button";
import Placeholder from "../../../containers/profile/placeholder";
import { handleContextMenu } from "../../../lib/helper";
import { authenticate } from "../../../lib/global/routeAuth";

const HashtagFollow = (props) => {
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const [lang] = useLang();
  const theme = useTheme();
  const uid = getCookie("uid");
  const router = useRouter();
  const dispatch = useDispatch();

  const [aspectWidth, setAspectWidth] = useState(null);
  const [page, setPage] = useState(1);

  const [followState, setFollowState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectId, setId] = useState("");
  const [isModelOpen, setModelOpen] = useState(false);
  let hashtagName = mobileView ? props?.hashtag?.name?.slice(1) || props.hashtag.replace("#", "") : router?.query?.hashtagId;
  const hashTagLists = useSelector((state) => state?.viewedHashtagPost?.hashtagList);
  const hashTagTotal = useSelector((state) => state?.viewedHashtagPost?.totalPost);

  const HASHTAG_NAME = useSelector((state) => state?.viewedHashtagPost?.hashtagName);
  const HASHTAG_LIST = HASHTAG_NAME === hashtagName ? hashTagLists : []
  const HASHTAG_TOTAL_POST = HASHTAG_NAME === hashtagName ? hashTagTotal : ""
  const hashTagPage = useSelector((state) => state?.viewedHashtagPost?.page);
  const openPostSlider = useRef(null)
  const isExplore = router?.query?.isexplore;


  const handleBack = () => {
    Router.back();
  }

  useEffect(() => {
    setAspectWidth(window.innerWidth - 70);
  }, []);

  useEffect(() => {
    getHashtagPosts(page);
  }, [props.hashtag.name, page]);

  var postId
  useEffect(() => {
    postId = router.query.hashtagId?.split("postid=")[1]
    let Post
    let id
    HASHTAG_LIST?.filter((currentPost, indexInFilter) => {
      if (currentPost.postId == postId) {
        id = indexInFilter;
        Post = currentPost
      }
    })
    Post && hashtagPostClick(postId, Post, id)
  }, [HASHTAG_LIST])

  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  const followUnfollowEvent = (id) => {
    let postInstance = HASHTAG_LIST;
    postInstance.map((item) => {
      item.userId == id ? (item["isFollowed"] = 1) : "";
    });
  };

  const hashtagPostClick = (id, post, index) => {
    openPostSlider.current = id
    let hashtag = props?.hashtag?.name || props.hashtag;
    hashtag = hashtag.slice(1);
    open_dialog("PostSlider", {
      profileLogo: post.profilePic,
      price: post.price,
      currency: post.currency || {},
      postImage: post.postData,
      postType: post.postType,
      isBookmarked: post.isBookmarked,
      profileName: post.firstName,
      onlineStatus: post.scheduledTimestamp || post.postedAt,
      likeCount: post.totalLike,
      commentCount: post.commentCount || post.commentCount_x || post.commentCount_y,
      postDesc: post.description,
      postId: id,
      userId: post.userId,
      isLiked: post.isLike,
      username: post.username || post.userName,
      totalTipReceived: post.totalTipReceived, // not available
      // followUnfollowEvent:props.followUnfollowEvent,
      isVisible: post.isVisible || 0,
      taggedUsers: post.taggedUsers,
      isFollow: post.isFollow || 0,
      allData: HASHTAG_LIST,
      postToShow: index,
      rediredcted: postId?.length ? true : false,
      isHashtagPost: true,
      adjustWidth: true,
    })

  }

  const getHashtagPosts = async (pageCount) => {
    setIsLoading(true);
    try {
      setPage(pageCount);

      let hashtag = mobileView ? props?.hashtag?.name || props.hashtag : router?.query?.hashtagId;

      if (mobileView) {
        hashtag = hashtag.slice(1);
      }

      const payload = {
        hashtag,
        page: pageCount,
      }

      if (HASHTAG_TOTAL_POST !== HASHTAG_LIST?.length || pageCount === 1) {
        // API Calling
        const res = await getHashtagsAPI(payload);

        if (res.status == 200) {
          if (pageCount === 1) {
            dispatch(viewedHashtag({
              hashtagList: res?.data?.result,
              totalPost: res?.data?.totalCount,
              hashtagName: hashtag,
              page: pageCount
            }));
            setFollowState(res?.data?.isHashtagFollow);
          } else {
            dispatch(viewedHashtag({
              hashtagList: [...HASHTAG_LIST, ...res?.data?.result],
              totalPost: res?.data?.totalCount,
              hashtagName: hashtag,
              page: pageCount
            }));
          }
        };
      };
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
      console.error("ERROR IN getHashtag", err);
      // Toast(err?.response?.data?.message, "error");
    }
  }

  const followHashtag = () => {
    authenticate(router.asPath).then(async () => {
      try {

        const payload = {
          hashTag: props?.hashtag?.name || props?.hashtag,
          trigger: followState ? "UNFOLLOW" : "FOLLOW"
        }
        // API Calling
        const res = await followHashtagAPI(payload);

        if (res.status === 200) {
          setFollowState(!followState);
        }
        Toast(res?.data?.message, "success")

      } catch (err) {
        console.error("ERROR IN followHashtag", err);
        Toast(err?.response?.data?.message, "error");
      }
    })
  }

  const hashtagTile = () => {
    return (
      <div className={`d-flex justify-content-between p-2 py-sm-3 px-sm-2`}>
        <div className="d-flex flex-row align-items-center">
          {!mobileView && <div className="d-flex align-items-center justify-content-center cursorPtr mr-3">
            <Icon
              icon={`${backArrow}#left_back_arrow`}
              color="var(--l_app_text)"
              width={20}
              height={25}
              onClick={() => !isExplore ? goBack() : goBackExplore()}
              alt="backArrow"
            />
          </div>}
          {/* <div className="gradient_bg rounded-pill fntSz30 d-flex align-items-center justify-content-center text-white"
            style={{ width: "52px", height: "52px", lineHeight: "0px" }}>
            #
          </div> */}
          <div className="pl-2">
            {!mobileView && <h4 className={`p-0 m-0 fntSz21`}>{props?.hashtag?.name}</h4>}
            {/* {`${HASHTAG_TOTAL_POST ? HASHTAG_TOTAL_POST : ""} ${HASHTAG_TOTAL_POST > 1 ? lang.posts : lang.post}`} */}
          </div>
        </div>
        {!mobileView && followBtnHandler()}
      </div>
    )
  }
  const followBtnHandler = () => {
    return (
      <div>
        <Button
          fixedBtnClass={followState === null ? "inactive" : !followState ? "active" : "inactive"}
          onClick={followHashtag}
          children={
            followState === null ?
              <CustomDataLoader
                type="ClipLoader"
                loading={true}
                size={20} />
              :
              followState ? lang.following : lang.follow
          }
        />
      </div>
    )
  }
  const ImgTile = () => {
    return (
      <>
        {!mobileView && HASHTAG_LIST.length > 0 && <h6 className='text-start w-400 pl-1'>{lang.topPosts}</h6>}
        <div className="row mb-0 mx-0 px-2 pb-5">
          {HASHTAG_LIST.length
            ? HASHTAG_LIST?.map((hashtag, index) => {
              return <div className="col-4 col-sm-3 p-1 callout-none" onContextMenu={handleContextMenu} key={hashtag?.postId}
                onClick={() => {
                  setId(hashtag.postId);
                  mobileView ? handleDialog(true) : hashtagPostClick(hashtag.postId, hashtag, index);
                }}>
                {hashtag?.postData[0]?.type !== 4 ? <FigureCloudinayImage
                  publicId={`${hashtag?.postData[0]?.type === 1 ? hashtag?.postData[0]?.url : hashtag?.postData[0]?.thumbnail}`}
                  className='cursorPtr object-fit-cover radius_8'
                  transformWidth={mobileView ? 148 : 205}
                  height={mobileView ? 108 : 165}
                  isVisible={hashtag?.isVisible}
                  uid={uid}
                  userId={hashtag?.userId}
                /> : <TextPost textPost={hashtag.postData}
                  isVisible={hashtag?.isVisible} />}
              </div>
            })
            :
            !isLoading ? <div className="w-100 d-flex justify-content-center align-items-center">
              <Placeholder
                pageName="imageProfile"
                label="No Post Added Yet!"
              />
            </div> : ""
          }
          {isLoading ? <div className="d-flex align-items-center justify-content-center vh-50 m-auto">
            <CustomDataLoader
              type="ClipLoader"
              loading={isLoading}
              size={60}
            />
          </div> : ""}
        </div>
        {
          !!HASHTAG_LIST.length && <PaginationIndicator
            id="scrollEvent"
            totalData={HASHTAG_LIST}
            totalCount={HASHTAG_TOTAL_POST}
            pageEventHandler={(val) => {
              setPage(prev => prev + 1)
            }}
          />
        }
      </>
    )
  }

  const goBackExplore = () => {
    router.replace(`/explore?hashtags=true`)
  }

  return (
    <Wrapper>
      {mobileView
        ? <>
          <Header
            title={props?.hashtag?.name || props?.hashtag}
            back={() => !isExplore ? goBack() : goBackExplore()}
            icon={env.backArrow}
            align={"text-left"}
            isExplore
            subtitle={`${HASHTAG_TOTAL_POST ? HASHTAG_TOTAL_POST : ""} ${HASHTAG_TOTAL_POST > 1 ? lang.posts : lang.post}`}
            right={followBtnHandler}
          />
          <div id="scrollEvent" className="w-100" style={{ paddingTop: "68px", height: "calc(var(--vhCustom, 1vh) * 100)" }}>
            {hashtagTile()}
            {ImgTile()}
          </div>
        </>
        :
        <div className='d-flex w-100 vh-100 overflowY-auto'>
          <div style={{ width: '20%', minWidth: '15.642rem', maxWidth: '26.6rem', borderRight: '1px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100'>
            <DvSidebar
              fullbar
            />
          </div>
          <div style={{ width: `${tabletView ? '90vw' : '49vw'}`, margin: '0px auto' }}>
            {hashtagTile()}
            <div
              id="scrollEvent"
              className="w-100 overflowY-auto"
              style={{ width: '80%', height: "calc(calc(var(--vhCustom, 1vh) * 100) - 73px)" }}> {/* Dont change this again */}
              <div>
                {ImgTile()}
              </div>
            </div>
          </div>
          <div className="dv__freaturedCreatorsWidth sticky-top vh-100 specific_section_bg" style={{ width: '30vw', minWidth: '30vw', borderLeft: '1px solid var(--l_border)', overflowY: 'auto' }}>
            <DvFeaturedCreators setActiveState={props.setActiveState} />
          </div>
        </div>
      }

      {mobileView && (
        <Model
          open={isModelOpen}
          className={"full_screen_dialog vw-100"}
          // closeIcon={true}
          keepMounted={true}
          fullScreen={true}
        >
          <ExplorePostView
            onClose={() => handleDialog(false)}
            selectedPost={selectId}
            posts={HASHTAG_LIST ? flattenDeep(HASHTAG_LIST) : []}
            id="search-page"
            title={props?.hashtag?.name || props?.hashtag}
            // loader={loader}
            // page={page}
            callApi={HASHTAG_LIST.length !== HASHTAG_TOTAL_POST}
            setPage={setPage}
            hashTagPage={hashTagPage}
            setLoading={setIsLoading}
            loading={isLoading}
            followUnfollowEvent={followUnfollowEvent}
          />
        </Model>
      )}
      <style jsx>{`
        .hastag__viewAll {
          font-weight: 600;
          color:${theme.appColor};
        }
        .mv_profile_logo_hastag {
          width: 133px !important;
          height: 133px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: var(--l_app_bg) !important;
        }
        .hastag_header_sticky {
          position: sticky;
          height: 12vh;
          top: 0px;
          z-index: 3;
        }
        .hastag__img {
          width: 100%;
          min-height: ${mobileView ? "" : '260px'};
          object-fit: cover;
        }
      `}</style>
    </Wrapper>
  )
}

export default HashtagFollow;
