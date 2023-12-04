import React, { useState, useEffect } from "react";
import Route, { useRouter } from "next/router";

import FanFollowersList from "../../../containers/profile/followers-list";
import ProfileNavigationTab from "../../../containers/profile/profile-navigation-tab";
import ProfilePostGallery from "../../../containers/profile/profile-post-gallery";
import FigureImage from "../../../components/image/figure-image";

import {
  follow,
  unfollow,
  getAssets,
  getProfile,
  getFollowCount,
} from "../../../services/profile";
import { getGroupChat, createGroup } from "../../../services/chat";
import { chatList } from "../../../lib/chat";
import { getCookie, getCookiees, setCookie } from "../../../lib/session";
import * as config from "../../../lib/config";
import {
  authenticate,
  close_dialog,
  close_drawer,
  close_progress,
  goBack,
  guestLogin,
  open_dialog,
  open_drawer,
  scrollToView,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import useLang from "../../../hooks/language";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StickyHeader from "../../../components/sticky-header/StickyHeader";
import CustomHead from "../../../components/html/head";
import TimelineHeader from "../../../containers/timeline/timeline-header";
import Link from "next/link";
import HighlightedStories from "../../../containers/highlight-stories/highlight-list";
import { Avatar, CircularProgress } from "@material-ui/core";
import isMobile from "../../../hooks/isMobile";
import DvHeader from "../../../containers/DvHeader/DvHeader";
import Img from "../../../components/ui/Img/Img";
import OtherProfileHeader from "../../../containers/DvHeader/OtherProfileHeader";

import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PROFILE_FOLLOWING } from "../../../redux/actions/auth";
import useProfileData from "../../../hooks/useProfileData";
import useReduxData from "../../../hooks/useReduxState";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { isAgency } from "../../../lib/config/creds";
import { useChatFunctions } from "../../../hooks/useChatFunctions";
import { handleContextMenu } from "../../../lib/helper";

/**
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */

const Index = (props) => {
  const router = useRouter();
  const [lang] = useLang();
  const { query = {} } = router;
  const userId = query.slug[1];
  const [profile, setProfile] = useState(props.profile);
  const [activeNavigationTab, setActiveNavigationTab] = useState("grid_post");
  const [isSticky, setIsSticky] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [auth, setAuth] = useState(getCookie("token"));
  const [mobileView] = isMobile();
  const reduxData = useReduxData(["language"]);
  const { handleChat } = useChatFunctions()

  const dispatch = useDispatch();
  const [currProfile] = useProfileData();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    if (!auth) {
      setCookie("token", props.token);
      setCookie("language", "en");
      setAuth(props.token);
    }
    close_progress();
    setProfile(props.profile);
    close_drawer();
  }, [props]);

  const followUnfollowHandler = () => {
    const payload = {
      followingId: profile._id,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    if (profile.isFollow) {
      unfollow(payload)
        .then((res) => {
          setBtnLoading(false);
          Toast(
            `You are no more following ${profile.firstName + " " + profile.lastName
            }`,
            "info"
          );
          const profileIns = { ...profile };
          profileIns.isFollow = false;
          profileIns.followerCount = profileIns.followerCount
            ? profileIns.followerCount - 1
            : 0;
          setProfile(profileIns);
          dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing - 1));
        })
        .catch((error) => {
          setBtnLoading(false);
          console.error("ERROR IN followUnfollowHandler", error);
          Toast(
            error.response
              ? error.response.data.message
              : "Failed to follow this creator",
            "warning"
          );
        });
    } else {
      follow(payload)
        .then((res) => {
          setBtnLoading(false);
          Toast(
            `You are now following ${profile.firstName + " " + profile.lastName
            }`,
            "success"
          );
          const profileIns = { ...profile };

          profileIns.isFollow = true;
          profileIns.followerCount = profileIns.followerCount + 1;
          setProfile(profileIns);

          dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
        })
        .catch((error) => {
          console.error("ERROR IN followUnfollowHandler", error);
          setBtnLoading(false);
          Toast(
            error.response
              ? error.response.data.message
              : "Failed to follow this creator",
            "warning"
          );
        });
    }
  };

  const handleReportUser = () => {
    mobileView
      ? open_drawer(
        "REPORT_POST",
        {
          drawerData: { reportedId: query.slug[1], reportType: 2 },
          back: () => close_drawer(),
        },
        "bottom"
      )
      : open_dialog("REPORT_POST", {
        drawerData: { reportedId: query.slug[1], reportType: 2 },
        back: () => close_dialog(),
      });
  };



  const setActiveState = (path) => {
    Route.push(path);
  };

  if (!userId || (!isLoading && !profile)) {
    return (
      <div className="text-center pt-5">
        <div className="h3 text-muted">
          The shared link is not valid anymore!
        </div>
        <Link className="App-link" href="/">
          go back to home page
        </Link>
      </div>
    );
  }
  if (isLoading && !profile) {
    startLoader();
    return <div className="text-center h3 text-muted pt-5">Loading....</div>;
  }

  return (
    <React.StrictMode>
      <div id="oth_pro_cont">
        <CustomHead
          ogTitle={profile && profile.fullName}
          ogImage={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic)}
          description={`${profile && profile.fullName} ${profile.bio && `- ${profile.bio}`}`}
          altText={`${profile && profile.fullName} ${profile.bio && `- ${profile.bio}`}`}
          language={reduxData.language}
          pageTitle={profile && profile.fullName + profile.country ? profile.country : ''}
          url={`${config.WEB_LINK}/profile/${profile.username}/${profile._id}`}
          metaTags={[profile && profile.firstName + " " + profile.lastName, ...props.seoSettingData?.metaTags]}
        />

        <div id="profile_page_cont" className="wrap-scr drawerBgCss">
          {mobileView ? (
            <TimelineHeader
              className="dv_base_bg_dark_color"
              isSharedProfile={true}
              setActiveState={setActiveState}
            />
          ) : (
            <OtherProfileHeader
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
            />
          )}

          <StickyHeader stickyHandler={(flag) => setIsSticky(flag)} />

          <div
            className={`prof_back_head ${isSticky && "sticky_header pt-3"} ${mobileView ? "" : "col-12"
              }`}
            style={{
              left: "49.8%",
              top: "10vh",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className={
                mobileView ? "d-flex w-100" : "websiteContainer d-flex"
              }
            >
              <figure>
                {/* <a href="home_user.html"> */}
                <a className={mobileView ? "p-3" : "py-3 pr-3"}>
                  <Img
                    onClick={() => {
                      router.back();
                    }}
                    className="pointer"
                    src={config.backArrow}
                    width={26}
                    alt="backarrow"
                  />
                </a>
              </figure>
              {isSticky && (
                <h5
                  onClick={() => scrollToView("oth_pro_cont")}
                  className="dv_appTxtClr pb-2"
                >
                  {profile.username && "@" + profile.username}
                </h5>
              )}
            </div>
          </div>
          <div className="col-12">
            <div
              className="row mv_pro_banner py-2"
              style={
                mobileView
                  ? {
                    backgroundImage: `url(${!profile.bannerImage
                      ? config.BANNER_PLACEHOLDER_IMAGE
                      : s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, '40vw')
                      })`,
                  }
                  : {
                    backgroundImage: `url(${typeof profile.bannerImage === "undefined"
                      ? config.BANNER_PLACEHOLDER_IMAGE
                      : s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, '29vw')
                      })`,
                    height: "29.282vw",
                  }
              }
            ></div>
            <div
              className={
                `callout-none ${mobileView
                  ? "col-auto p-0 d-flex"
                  : "websiteContainer p-0 d-flex"}`
              }
              onContextMenu={handleContextMenu}
              style={{ marginTop: "-44px", height: "90px" }}
            >
              {profile.profilePic ? (
                <FigureCloudinayImage
                  publicId={profile.profilePic}
                  width={70}
                  ratio={1}
                  className="mv_profile_logo solid_circle_border"
                  alt={`${profile.fullName} - ${profile.country}`}
                />
              ) : (
                <Avatar
                  alt={`${profile.fullName} - ${profile.country}`}
                  className="mv_profile_logo solid_circle_border">
                  {profile && profile.firstName && profile.lastName && (
                    <span className="initials">
                      {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                    </span>
                  )}
                </Avatar>
              )}
              <div className="col-auto ml-auto d-flex p-0 align-items-end">
                <button
                  type="button"
                  onClick={() => {
                    authenticate().then(() => {
                      handleChat({ userId: profile?._id, userName: profile?.userName || profile?.username });
                    });
                  }}
                  className="btn btn-default dv_liveBtnProfile_big fntSz15 mr-2"
                >
                  {lang.Chat}
                </button>
                <button
                  type="button"
                  className="btn btn-default dv_liveBtnProfile_big followfollowing px-2 fntSz15 dv_liveBtnProfile_big_outline"
                  onClick={() => {
                    authenticate().then(() => {
                      setBtnLoading(true);
                      followUnfollowHandler();
                    });
                  }}
                >
                  {btnLoading && (
                    <CircularProgress
                      size={16}
                      className="mr-2"
                      style={{ marginBottom: "-3px" }}
                    />
                  )}
                  {profile.isFollow ? "following" : "follow"}
                </button>
              </div>
            </div>
            <div
              className={
                mobileView ? "col-auto p-0 pb-2" : "websiteContainer text-left p-0 pb-2"
              }
            >
              <h1 className="fntSz18 txt-roman mb-1">
                {profile?.userName || profile?.username}
              </h1>
              <h2 className="fntSz12 txt-roman bck3 mb-0">
                <span>@{profile.username}</span>
              </h2>
            </div>
          </div>

          <FanFollowersList
            followersCount={profile.totalFollower}
            followingCount={profile.totalFollowing}
            postCount={profile.postCount}
            showPosts={profile.userTypeCode == 1 ? false : true}
            showFollowers={profile.userTypeCode == 1 ? false : true}
            otherProfile={true}
            showFollowings={profile.userTypeCode == 1 ? true : false}
            id={profile._id}
            others={true}
            isFollow={profile.isFollow}
            bio={profile.bio}
          />
          <HighlightedStories
            setActiveState={(props) => {
              scrollToView("scroll_to_top");
              setActiveNavigationTab(props);
            }}
            otherProfile={profile}
          ></HighlightedStories>

          <ProfileNavigationTab
            setActiveState={(props) => {
              scrollToView("scroll_to_top");
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
            isSticky={isSticky}
            userType={profile.userTypeCode}
            key={profile.userTypeCode}
            sharedProfile={true}
            shareProfile={true}
          />

          <ProfilePostGallery
            streamUserId={profile.isometrikUserId}
            activeNavigationTab={activeNavigationTab}
            userId={query.slug[1]}
            key={query.slug[1]}
            otherProfile={mobileView ? false : true}
          />
        </div>
      </div>
    </React.StrictMode>
  );
};

Index.getInitialProps = async ({ Component, ctx }) => {
  const { query = {}, req, res } = ctx;
  const userId = query.slug[1];
  let response = {};
  let followCount = {};
  let token = getCookiees("token", req);
  const selectedCreatorId = getCookiees("selectedCreatorId", req)
  try {
    if (!token) {
      const guestData = await guestLogin();
      token = guestData.token;
    }

    if (userId) {
      response = await getProfile(userId, decodeURI(token), selectedCreatorId);
      followCount = await getFollowCount(userId, decodeURI(token), isAgency());
    }
  } catch (e) {
    console.error("TOKEN", e);
  }

  return {
    query: query,
    token: token,
    profile: { ...response.data.data, ...followCount.data.data } || {},
  };
};

export default Index;
