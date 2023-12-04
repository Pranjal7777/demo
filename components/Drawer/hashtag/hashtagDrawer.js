import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useTheme } from "react-jss";

import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { authenticate, open_dialog, open_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import ModelSearchBar from "../../../containers/timeline/search-bar";
import Img from "../../ui/Img/Img";
import * as env from "../../../lib/config";
import { getHashtagsAPIForExplore, getPopularHashtagsAPI } from "../../../services/hashtag";
import { getBanner } from "../../../services/user_category";
import PaginationIndicator from "../../pagination/paginationIndicator";
import ImageSlider from '../../../components/hastag/image-slider';
import FigureCloudinayImage from "../../cloudinayImage/cloudinaryImage";
import { getCookie, getCookiees } from "../../../lib/session";
import CustomDataLoader from "../../loader/custom-data-loading";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { getBannerImgs } from "../../../redux/actions";

// Icons
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import isTablet from "../../../hooks/isTablet";
import { getPostById, getSharedPost } from "../../../services/assets";
import { getComments } from "../../../services/comments";
import Icon from "../../image/icon";

import { otherProfileData } from "../../../redux/actions/otherProfileData";
import DvFeaturedCreators from "../../../containers/DvHomePage/DvFeaturedCreators";
import DvHashtagSearch from '../../../components/Drawer/hashtag/DvHashtagSearch';
import { handleContextMenu } from "../../../lib/helper";

const HashtagDrawer = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const uid = getCookie("uid");
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const [searchValue, setSearchValue] = useState("");
  const [hashtagList, setHashtagList] = useState([]);
  const [page, setPage] = useState(0);
  const [bannerList, setBannerList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [aspectWidth, setAspectWidth] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [apiResponse, setResponse] = useState(false);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const BANNER_IMGS = useSelector((state) => state?.desktopData?.hashtagPage?.bannerImgs);

  const ChangeTheme = useSelector((state) => state?.commonUtility?.changeThemeUtility);
  const auth = getCookie("auth");

  useEffect(() => {
    if (searchValue) {
      searchResult();
    } else {
      getPopularHashtag(0);
    }

    if (!BANNER_IMGS.length)
      getBannerImage();

    setAspectWidth(window.innerWidth - 70);
  }, [searchValue]);

  const handleHastagProfile = (name) => {
    let hashtagName = name.replace('#', '');
    Router.push(`explore/${hashtagName}`)
  }


  const hashtagPostClick = async (data, index, post, upperIndex, currentPost) => {
    let hashtag = data?.name;
    hashtag = hashtag.slice(1);
    if (mobileView) {
      Router.push(`/explore/hashtag?h=${hashtag}&id=${index}`)
    } else {  
      const payload = {
        hashtag,
        size: 4,
        page: 1
      }
      const res = await getHashtagsAPIForExplore(payload);
      if (res.status == 200) {
        const result = res.data.result
        dispatch(otherProfileData([...result]))
        open_dialog("PostSlider", {
          profileLogo: result[currentPost].profilePic,
          price: result[currentPost].price,
          currency: result[currentPost].currency || {},
          postImage: result[currentPost].postData,
          postType: result[currentPost].postType,
          isBookmarked: result[currentPost].isBookmarked,
          profileName: result[currentPost].firstName,
          onlineStatus: result[currentPost].scheduledTimestamp || result[currentPost].postedAt,
          likeCount: result[currentPost].likeCount,
          commentCount: result[currentPost].commentCount,
          postDesc: result[currentPost].description,
          postId: result[currentPost].postId,
          userId: result[currentPost].userId,
          isLiked: result[currentPost].isLike,
          username: result[currentPost].username || post.userName,
          totalTipReceived: post.totalTipReceived, // not available
          // followUnfollowEvent:props.followUnfollowEvent,
          isVisible: result[currentPost].isVisible || 0,
          taggedUsers: result[currentPost].taggedUsers,
          isFollow: result[currentPost].isFollow || 0,
          allData: result,
          postToShow: currentPost,
          isHashtagPost: true,
          adjustWidth: true,
        })
      }

    }
  }

  const searchResult = async () => {
    // try {
    //   startLoader();

    //   const payload = {
    //     offset: 0,
    //     limit: 10,
    //     hashtagName: searchValue
    //   };

    //   // API Call
    //   const res = await getHashtagAPI(payload);

    //   if (res.status == 200) {
    //     // setPage(pageCount);
    //     // if (!pageCount) {
    //     setHashtagList(res.data.data)
    //     // } else {
    //     // setHashtagList((prev) => [...prev, ...res.data.data])
    //     // }
    //   }
    //   stopLoader();

    // } catch (err) {
    //   console.error("ERROR IN searchResult >", err);
    //   Toast(err?.response?.data?.message || lang.errorMsg, "error");
    //   stopLoader();
    // }
  };

  const getPopularHashtag = async (pageCount) => {
    try {
      setShowLoader(true);
      const payload = {
        limit: 5,
        set: pageCount * 5,
        mobileView: mobileView
      }

      if (totalCount !== hashtagList?.length) {
        // API Calling
        const res = await getPopularHashtagsAPI(payload);

        if (res.status == 200) {
          if (!pageCount) {
            setHashtagList(res?.data?.result);
            setTotalCount(res?.data?.recordsTotal);
          } else {
            setHashtagList((prev) => [...prev, ...res?.data?.result]);
          }
          setPage(pageCount);
        }
      }
      setShowLoader(false);
      setTimeout(() => {
        setResponse(true);
      }, 1000);

    } catch (err) {
      setShowLoader(false);
      setTimeout(() => {
        setResponse(true);
      }, 1000);
      console.error("ERROR IN getPopularHashtag", err);
      Toast(err?.response?.data?.message, "error");
    }
  }

  const getBannerImage = async () => {
    try {
      // startLoader();
      let res = await getBanner();
      if (res.status == 200) {
        dispatch(getBannerImgs(res?.data?.data));
      }
      // stopLoader();
      setTimeout(() => {
        setResponse(true);
      }, 1000);

    } catch (err) {
      // stopLoader();
      setTimeout(() => {
        setResponse(true);
      }, 1000);
      console.error("ERROR IN getBannerImage", err);
      Toast(err?.response?.data?.message, "error");
    }
  }

  const coverImg = () => {
    return mobileView
      ? <>
        <div className="col-12">
          <div className="form-row scrollbar-hidden pb-2"
            style={{ flexWrap: "nowrap", overflow: "auto hidden" }}
          >
            {BANNER_IMGS?.map((img) => (
              <div className="col-11"
                style={{ aspectRatio: "300/140" }}
                key={img._id} onClick={() => bannerClickHandler(img)}>
                <Img
                  src={s3ImageLinkGen(S3_IMG_LINK, img.appImage, 100, null, '27vh')}
                  alt="Cover Image"
                  style={{ objectFit: "cover", borderRadius: "5px" }}
                  width="100%"
                  height="100%"
                />
              </div>
            ))}
          </div>
        </div>
      </>
      : <ImageSlider
        S3_IMG_LINK={S3_IMG_LINK}
        title='hashtag'
        bannerList={BANNER_IMGS}
        bannerClickHandler={bannerClickHandler}
      />
  }

  const bannerClickHandler = (img) => {
    startLoader();
    if (img?.linkedWith === "USER") {
      Router.push(`/${img?.user[0]?.username}`);
    } else if (img?.linkedWith === "LINK") {
      window.open(img?.linkedValue, '_blank');
    } else if (img?.linkedWith === "POST") {
      Router.push(`/post/${img?.linkedValue}`);
    } else {
      console.warn("Place your Condition Here");
    }
    stopLoader();
  }

  const drawerRedirection = (data) => {
    mobileView
      ? open_drawer("HashtagFollow", {
        hashtag: data,
        S3_IMG_LINK,
        paperClass: "card_bg"
      }, "right")
      : handleHastagProfile(data);
  }

  const MainTile = () => {
    return (
      <>
        {hashtagList.map((data, index) => (
          <div key={index}
            className="d-flex flex-column justify-content-center"
          >
            {mobileView
              ? <>
                <div
                  className="py-1 row m-0 bg_color w-100"
                  onClick={() => {
                    authenticate().then(() => {
                      drawerRedirection(data);
                    });
                  }}
                >
                  <div className="col-2">
                    <Avatar className="hashtags">#</Avatar>
                  </div>
                  <div className="col-8 px-2 py-1 m-0">
                    <p className="m-0 bold fntSz14">{data.name}</p>
                    <p className="m-0 fntSz10">{`${data?.noOfPost || 0} ${data?.noOfPost > 1 ? lang.posts : lang.post}`}</p>
                  </div>
                  <div className="col-2 text-center m-auto m-0 p-0">
                    <ArrowForwardIosIcon style={{ color: 'var(--l_base)', fontSize: '13px' }} />
                  </div>
                </div>
                <div className="col-12 px-1">
                  <div className="form-row m-0 callout-none" onContextMenu={handleContextMenu}>
                    {data?.posts?.map((img) => (
                      <div className="col-4 pr-1 pl-0" key={img?.postId} onClick={() => hashtagPostClick(data, img?.postId, img)}>
                        <FigureCloudinayImage
                          publicId={`${img?.postData[0]?.type === 1 ? img?.postData[0]?.url : img?.postData[0]?.thumbnail}`}
                          className='w-100 object-fit-cover cursorPtr'
                          style={{ height: "20vh", objectFit: "cover" }}
                          transformWidth={250}
                          isVisible={img?.isVisible}
                          uid={uid}
                          userId={img?.userId}
                        // src={`${IMAGE_LINK}${img?.postData[0]?.type === 1 ? img?.postData[0]?.url : img?.postData[0]?.thumbnail}`}
                        // height={props.height}
                        // ratio={props.ratio}
                        // handlePurchasePost={handlePurchasePost}
                        // handleSubscribeDrawer={handleSubscribeDrawer}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
              : <div className='my-3 d-flex justify-content-center'>
                <div className="w-100">
                  <div className='hastag__container'>
                    <div className='hastag__details w-100 d-flex justify-content-between align-items-center mb-3'>
                      <div className='d-flex align-items-center' onClick={() => drawerRedirection(data.name)}>
                        <Avatar className="hashtags mr-2">#</Avatar>
                        <div className='dv_appTxtClr_web d-flex flex-column cursorPtr'>
                          <h4 className='m-0 p-0 fntWeight800 dv_appTxtClr_web'>{data.name}</h4>
                          <span className='fntWeight700 dv_appTxtClr_web'>{`${data?.noOfPost} ${data?.noOfPost > 1 ? lang.posts : lang.post}`}</span>
                        </div>
                      </div>
                      <div>
                        <p onClick={() => drawerRedirection(data.name)} className='fntClrTheme fntWeight600 m-0 p-0 cursorPtr'>{lang.viewAll}</p>
                      </div>
                    </div>
                    <div className='hastag__images mt-4'>
                      <div className='row callout-none' onContextMenu={handleContextMenu}>
                        {data?.posts?.map((img, currentPost) => (
                          currentPost < 3 && <div className='col-4 hashtag_img px-2' style={{maxHeight: '250px'}} key={img?.postId} onClick={() => hashtagPostClick(data, img?.postId, img, index, currentPost)}>
                            <FigureCloudinayImage
                              publicId={`${img?.postData[0]?.type === 1 ? img?.postData[0]?.url : img?.postData[0]?.thumbnail}`}
                              className='w-100 cursorPtr object-fit-cover'
                              style={{ minHeight: "250px" }}
                              transformWidth={250}
                              isVisible={img?.isVisible}
                              uid={uid}
                              userId={img?.userId}
                            // height={props.height}
                            // onClick={() => openViewDrawer(img)}
                            // ratio={props.ratio}
                            // handlePurchasePost={handlePurchasePost}
                            // handleSubscribeDrawer={handleSubscribeDrawer}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        ))}
        {showLoader && (
          <div className="d-flex justify-content-center align-items-center mb-3">
            <CustomDataLoader type="normal" isLoading={showLoader} />
          </div>
        )}
      </>
    )
  }

  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      {
        paperClass: "backNavMenu",
        setActiveState: props?.setActiveState,
        changeTheme: ChangeTheme,
      },
      "right"
    );
  };

  const handleGuestNavigationMenu = () => {
    open_drawer("GuestSideNavMenu",
      { paperClass: "backNavMenu", setActiveState: props?.setActiveState },
      "right"
    );
  };

  return (
    <>
      {mobileView
        ? <div style={{ overflowY: "scroll", height: "100vh", overflowX: "hidden" }} id="hashtagScrollEvent" className="card_bg">
          <div className="mb-5 pb-3">
            <div className="row position-sticky card_bg" style={{ top: 0, zIndex: "1" }}>
              <div className="col-11">
                <ModelSearchBar hashtag={true} />
              </div>
              <div className="col-1" style={{ position: "relative", right: "30px", top: "27px" }}>
                <Icon
                  icon={`${env.HUMBERGER_ICON}#humberger_menu`}
                  color={theme.type === "light" ? theme.markatePlaceLabelColor : theme.text}
                  width={24}
                  height={22}
                  class="mr-3"
                  alt="humnerger_menu"
                  onClick={() => {
                    auth
                      ? handleNavigationMenu()
                      : handleGuestNavigationMenu();
                  }}
                  viewBox="0 0 22.003 14.669"
                />
              </div>

            </div>
            {coverImg()}
            {MainTile()}
          </div>
        </div>
        : (!showLoader ? <div id="hashtagScrollEvent" style={{overflowY: "auto" }} className="d-flex justify-content-between vh-100 w-100">
          <div className="w-100 px-3">
            <div className="mt-3 mb-5 position-relative">
              <DvHashtagSearch theme={theme} lang={lang} exploreHastagePage width={'69%'} height={'calc(100vh - 4rem)'} />
            </div>
            <div className="w-100">
              {coverImg()}
              {MainTile()}
            </div>
          </div>
        </div> : <div className="d-flex align-items-center justify-content-center vh-100 position-static profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={!apiResponse} size={60} />
              </div>)
      }

      {!!hashtagList.length && <PaginationIndicator
        id="hashtagScrollEvent"
        totalData={hashtagList}
        totalCount={totalCount}
        pageEventHandler={(val) => {
          if (showLoader) return;
          if (!val) return;
          getPopularHashtag(page + 1);
        }}
      />
      }

      <style jsx>{`
        :global(.MuiAvatar-colorDefault, .hashtags) {
          font-size: ${mobileView ? "x-large" : "xx-large"};
          background-color: ${theme.palette.l_base};
          color: #fff;
          font-weight: 500;
          height: ${mobileView ? "40px" : "50px"};
          width: ${mobileView ? "40px" : "50px"};
        }
      `}</style>
    </>
  );
};

export default HashtagDrawer;
