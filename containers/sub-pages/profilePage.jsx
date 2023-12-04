import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Route, { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-jss";

import * as config from "../../lib/config";
import { getProfile } from "../../services/auth";
import { getCookie, removeCookie, setCookie } from "../../lib/session";
import {
  authenticate,
  close_drawer,
  close_progress,
  close_sticy_bottom_snackbar,
  getTransformedImageUrl,
  open_drawer,
  scrollToView,
  sticky_bottom_snackbar,
  Toast,
} from "../../lib/global";
import useLang from "../../hooks/language";
import { getChatNotificationCount, setProfile, updateReduxProfile } from "../../redux/actions";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import { getFollowCount } from "../../services/profile";
import useProfileData from "../../hooks/useProfileData";

const FigureImage = dynamic(
  () => import("../../components/image/figure-image"),
  { ssr: false }
);
const StickyHeader = dynamic(
  () => import("../../components/sticky-header/StickyHeader"),
  { ssr: false }
);
const Image = dynamic(() => import("../../components/image/image"), {
  ssr: false,
});
const HighlightedStories = dynamic(
  () => import("../highlight-stories/highlight-list"),
  { ssr: false }
);
const DvMyAccountLayout = dynamic(
  () => import("../DvMyAccountLayout/DvMyAccountLayout"),
  { ssr: false }
);
const Img = dynamic(() => import("../../components/ui/Img/Img"), {
  ssr: false,
});
const FanFollowersList = dynamic(() => import("../profile/followers-list"), {
  ssr: false,
});
const ProfileNavigationTab = dynamic(
  () => import("../profile/profile-navigation-tab"),
  { ssr: false }
);
const ProfilePostGallery = dynamic(
  () => import("../profile/profile-post-gallery"),
  { ssr: false }
);

import Icon from "../../components/image/icon";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import isTablet from "../../hooks/isTablet";
import DvHomeLayout from "../DvHomeLayout";
import { isAgency } from "../../lib/config/creds";
import OwnProfileStoryPage from "../DvProfilePage/ProfileStoryView";
import Button from "../../components/button/button";
import { BOMB_LOGO } from "../../lib/config/logo";
import FilterOption from "../../components/filterOption/filterOption";
import { postUpadteSubject } from "../../lib/rxSubject";

const tabType = {
  photos: "image_post",
  videos: "video_post",
  excusive: "lock_post",
  collections: "collection_post",
  favorite: "liked_post",
  "purchase-posts": "purchased_post",
  posts: "grid_post",
};
export default function ProfilePage(props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state?.profileData);
  const [lang] = useLang();
  const router = useRouter();
  const userType = getCookie("userType");
  const { query = {} } = props;
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const Pageref = useRef(null);
  const [postCount, setPostCount] = useState({});
  const [selectedValue, setSelectedValue] = useState(0)
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const { slug = "", type = profile.userTypeCode == 1 ? "favorite" : "posts" } =
    query;

  const [auth] = useState(getCookie("auth"));
  const [isSticky, setIsSticky] = useState(false);

  const [activeNavigationTab, setActiveNavigationTab] = useState(
    tabType[type] || "grid_post"
  );

  const [reduxSocialLinks, setReduxSocialLinks] = useState(profile?.socialMediaLink);
  const [socialLnkArr, setSocialLinkArr] = useState([]);

  useEffect(() => {
    setActiveNavigationTab(tabType[type] || "grid_post");
  }, [type]);
  // console.log(
  //   "dffsf",
  //   tabType[type],
  //   type,
  //   activeNavigationTab
  // );
  useEffect(() => {
    close_progress();
    const uid = isAgency() ? selectedCreatorId : getCookie("uid");
    const token = getCookie("token");
    let profileRes;
    let followCountRes;
    if (uid && (profile.statusCode == 5 || profile.statusCode == 6)) {
      getProfile(uid, token, getCookie('selectedCreatorId')).then((res) => {
        if (res && res.data && res.data.data) {
          if (res.data.data.statusCode == 5 || res.data.data.statusCode == 6) {
            setCookie("nonVarifiedProfile", true);
            sticky_bottom_snackbar({
              message:
                "Your profile is inactive. We are verifying your identity.",
              type: "warning",
            });
          }
          if (res.data.data.statusCode == 1 && getCookie("nonVarifiedProfile")) {
            removeCookie("nonVarifiedProfile");
            close_sticy_bottom_snackbar();
            Toast("Congratulation! Your profile is active.", "success");
          }
          getFollowCount(uid, token, isAgency()).then((result) => {
            dispatch(
              setProfile({
                ...result.data.data,
                ...res.data.data,
              })
            );
          });
          const profileresponse = { ...res.data.data }
          dispatch(updateReduxProfile({ ...profile, ...profileresponse }));
          setCookie("profileData", JSON.stringify({ ...profile, ...profileresponse }))
          setCookie("categoryData", JSON.stringify([...profileresponse.categoryData]))
        }
      });
      mobileView && getSocialLinkIcon()
      close_drawer();
    }

  }, [selectedCreatorId, profile]);


  const getSocialLinkIcon = () => {
    let dummylinksArr = [];
    dummylinksArr[0] = { label: "instagram", logo: reduxSocialLinks?.instagram ? config.instagram_social : config.instagram_social_disble, link: reduxSocialLinks?.instagram || "" };
    dummylinksArr[1] = { label: "facebook", logo: reduxSocialLinks?.facebook ? config.facebook_social : config.facebook_social_disble, link: reduxSocialLinks?.facebook || "" };
    dummylinksArr[2] = { label: "twitter", logo: reduxSocialLinks?.twitter ? config.twitter_social : config.twitter_social_disble, link: reduxSocialLinks?.twitter || "" };
    dummylinksArr[3] = { label: "youtube", logo: reduxSocialLinks?.youtube ? config.youtube_social : config.youtube_social_disble, link: reduxSocialLinks?.youtube || "" };
    dummylinksArr[4] = { label: "tiktok", logo: reduxSocialLinks?.tiktok ? config.onlyfans_social : config.onlyfans_social_disble, link: reduxSocialLinks?.tiktok || "" };
    dummylinksArr[5] = { label: "snapchat", logo: reduxSocialLinks?.snapchat ? config.snapchat_social : config.snapchat_social_disble, link: reduxSocialLinks?.snapchat || "" };
    setSocialLinkArr([...dummylinksArr]);
    // console.log("456",dummylinksArr)
  }

  const postTypeList = [
    {
      label: lang.allPosts,
      navigationTab: "grid_post",
      count: "totalCount",
    },
    {
      label: lang.photos,
      navigationTab: "image_post",
      count: "photosCount",
    },
    {
      label: lang.videos,
      navigationTab: "video_post",
      count: "videosCount",
    },
    // {
    //   label: lang.textPosts,
    //   navigationTab: "text_post",
    //   count: "textCount",
    // },
    {
      label: lang.scheduled,
      navigationTab: "scheduled_post",
      count: "scheduledPostCount",
    },
  ]

  const filterList = [
    {
      title: "NEWEST",
      tab: "newest",
      value: 0,
    },
    {
      title: "OLDEST",
      tab: "oldest",
      value: 1,
    }
  ]

  const handleNavigationMenu = () => {
    open_drawer("SideNavMenu", {
      paperClass: "backNavMenu",
      setActiveState: "timeline",
      noBorderRadius: true,
      ...props,
    },
      "right"
    );
  };

  const handleShareItem = () => {
    open_drawer("SHARE_ITEMS", {
      sharedUserId: profile._id,
      shareType: "profile",
      username: profile.username,
      back: () => close_drawer(),
    },
      "bottom"
    );
  };

  const SubComponent = () => {
    switch (slug) {
      default:
        return (
          <div>
            {/* {tabletView && 'test'} */}

            {!mobileView ? (
              <DvHomeLayout
                setActiveState={props.setActiveState}
                pageLink="/profile"
                activeLink="profile"
                setActiveStateStories={(props) => {
                  scrollToView("scroll_to_top");
                  setActiveNavigationTab(props);
                }}
                isSmallbar
                isSticky={isSticky}
                tabType={activeNavigationTab}
                activeNavigationTab={activeNavigationTab}
                homePageref={props.homePageref}
                setActiveNavigationTab={setActiveNavigationTab}
                {...props}
              />
            ) : (
              <Wrapper>
                {/* <div className="wrap" /> */}
                <div
                  id="profile_page_cont"
                  ref={Pageref}
                  className="wrap-scr bg-dark-custom"
                >
                  <div className="col-12">
                    <StickyHeader
                      stickyHandler={(flag) => {
                        // console.log("intersecting", flag);
                        setIsSticky(flag);
                      }}
                    ></StickyHeader>

                    <div
                      className="row mv_pro_banner"
                      style={{
                        backgroundImage: `url(${profile.bannerImage
                          ? s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, '40vw')
                          : config.BANNER_PLACEHOLDER_IMAGE
                          })`, aspectRatio: "1/0.33",
                        height: "100%"
                      }}
                    >
                      <div className="mv_pro_banner_overlay">
                        <div
                          className={`prof_back_head pt-1 ${isSticky ? "sticky_header pt-2" : "non_sticky"
                            }`}
                        >
                          <IconButton className="prof_back_icon px-3">
                            <Icon
                              height={26}
                              width={26}
                              color={!isSticky ? "#fff" : theme.type == "light" ? "#000" : "#fff"}
                              alt="back arrow icon"
                              onClick={() => router.push("/")}
                              icon={`${config.backArrow}#left_back_arrow`}
                            />
                          </IconButton>
                          {isSticky && <h5
                            onClick={() => scrollToView("profile_page_cont")}
                            className="dv_appTxtClr p-3 text-truncate"
                          >
                            {profile.username && "@" + profile.username}
                          </h5>
                          }
                          {profile.userTypeCode == 2 && (
                            <IconButton className="ml-auto prof_menu_icon">
                              <Icon
                                height={24}
                                width={24}
                                color={
                                  !isSticky
                                    ? "#fff"
                                    : theme.type == "light"
                                      ? "#000"
                                      : "#fff"
                                }
                                alt="profile share icon"
                                onClick={() =>
                                {
                                    handleShareItem();
                                }
                                }
                                icon={`${config.SHARE_ICON}#share_icon`}
                              />
                            </IconButton>
                          )}
                          {/* <IconButton
                            className={`prof_menu_icon mr-2 ${profile.userTypeCode == 1 ? "ml-auto" : ""
                              }`}
                          >
                            <Icon
                              width={24}
                              height={22}
                              color={
                                !isSticky
                                  ? "#fff"
                                  : theme.type == "light"
                                    ? "#000"
                                    : "#fff"
                              }
                              alt="hamburger menu icon"
                              onClick={() => {
                                authenticate().then(() => {
                                  handleNavigationMenu();
                                });
                              }}
                              viewBox="0 0 22.003 14.669"
                              icon={`${config.HUMBERGER_ICON}#humberger_menu`}
                            />
                          </IconButton> */}
                        </div>
                      </div>
                      {/* <div className="container position-relative">
                    <div className="dv_pro_details">
                      <div className="form-row align-items-center">
                        <div className="col-auto">
                          <FigureCloudinayImage
                            publicId={profile.profilePic}
                            width={70}
                            ratio={1}
                            className="mv_profile_logo"
                          />
                        </div>
                        <div className="col">
                          <div className="fntSz18 txt-roman">
                            {profile.firstName + " -- " + profile.lastName}
                          </div>
                          <div className="fntSz12 txt-roman  bck3">
                            <span>{profile.username}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                    </div>
                    <div
                      className="col-auto p-0 d-flex justify-content-between align-items-end"
                      style={{
                        marginTop: "-30px",
                        height: "90px",
                      }}
                    >
                      <OwnProfileStoryPage
                        profilePic={profile.profilePic}
                      />
                      <div className="d-flex justify-content-end mb-2" style={{ gap: "0.6em" }}>
                        {/* {profile?.userTypeCode !== 1 && <div>
                          <Button
                            type="button"
                            fclassname="w-500 rounded-pill p-1"
                            btnSpanClass="gradient_text"
                            leftIcon={{ src: BOMB_LOGO, id: "bombLogo" }}
                            iconWidth={34}
                            iconHeight={32}
                            style={{ background: "linear-gradient(96.81deg, rgba(255, 113, 164, 0.2) 0%, rgba(211, 59, 254, 0.2) 100%)" }}
                            onClick={() => { }}
                            children={""}
                          />
                        </div>} */}
                        <div>
                          <Button
                            type="button"
                            fclassname="btnGradient_bg w-400 rounded-pill d-flex py-2"
                            leftIcon={{ src: config.EDIT_PROFILE_ICON, id: "edit_prfile" }}
                            iconColor="#fff"
                            iconClass="text-app mr-2 border-bottom"
                            onClick={() => { Route.push(`/profile/edit`) }}
                            children={lang.edit}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-auto p-0 pb-2">
                      <div className="fntSz18 d-flex align-items-center txt-roman">
                        <div>
                          {profile?.userName || profile?.username}
                        </div>
                        {userType == 1 ? (
                          ""
                        ) : (
                          <Image
                            src={config.Creator_Icon}
                            className="mx-2"
                            width={18}
                            height={18}
                          />
                        )}
                      </div>
                      <div className="fntSz12 light_app_text">
                        <span>@{profile.username}</span>
                      </div>
                    </div>
                  </div>

                  <FanFollowersList
                    followersCount={profile.totalFollower}
                    followingCount={profile.totalFollowing}
                    postCount={profile.postCount}
                    showPosts={profile.userTypeCode !== 1 || userType != 1}
                    showFollowers={profile.userTypeCode !== 1 || userType != 1}
                    showFollowings={true}
                    id={profile._id}
                    bio={profile.bio}
                    otherProfile={router?.pathname == "/profile" ? false : true}
                  />

                  {profile.userTypeCode == 2 && mobileView &&
                    <div className="d-flex flex-row px-3">
                      {socialLnkArr.length > 0 &&
                        socialLnkArr.map((link, index) => (
                          <>
                            {link?.link && <Image
                              src={link.logo}
                              height="44"
                              width="44"
                              className="pr-2"
                              onClick={() => link?.link && window.open("https://" + link?.link.replace("https://", ""), '_blank')}
                            />}
                          </>
                        ))}
                    </div>
                  }


                  {profile.userTypeCode == 2 && (
                    <HighlightedStories
                      setActiveState={(props) => {
                        scrollToView("scroll_to_top");
                        setActiveNavigationTab(props);
                      }}
                    ></HighlightedStories>
                  )}

                  <ProfileNavigationTab
                    setActiveState={(props) => {
                      scrollToView("scroll_to_top");
                      setActiveNavigationTab(props);
                    }}
                    isSticky={isSticky}
                    tabType={activeNavigationTab}
                    otherProfile={router?.pathname == "/profile" ? false : true}
                  />

                  {(activeNavigationTab == 'grid_post' || activeNavigationTab == 'video_post' || activeNavigationTab == 'image_post' || activeNavigationTab == 'text_post' || activeNavigationTab == 'scheduled_post') &&
                    <div className="d-flex col-12 pt-3 justify-content-between align-items-center" >
                      <div className="d-flex gap_8 scroll">
                        {postTypeList?.map((item, index) => {
                          return (
                            <div key={index}>
                              <Button
                                type="button"
                                fclassname={`${(activeNavigationTab == item?.label || activeNavigationTab == item?.navigationTab) ? "btnGradient_bg" : "background_none borderStroke"} rounded-pill py-2 text-nowrap`}
                                onClick={() => setActiveNavigationTab(item?.navigationTab)}
                                children={`${item?.label} (${postCount?.[item?.count] || 0})`}
                              />
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedValue(value)} />
                      </div>
                    </div>}

                  <ProfilePostGallery
                    userId={isAgency() ? selectedCreatorId : profile._id}
                    streamUserId={profile.isometrikUserId}
                    activeNavigationTab={activeNavigationTab}
                    selectedValue={selectedValue}
                    homePageref={props.Pageref}
                    allPostCount={(postCount) => setPostCount(postCount)}
                    otherProfile={router?.pathname == "/profile" ? false : true}
                    setActiveNavigationTab={setActiveNavigationTab}
                  />
                  {/* <ProfilePostGallery userId={profile._id} /> */}
                </div>
                {/* <button
              className="col-12 btn btn-default inactiveNotification activeNotification"
              id="inactiveNotification"
            >
              Congratulations ! Your profile is active.
            </button> */}
              </Wrapper>
            )}


            <style jsx>{`
              .non_sticky{
                height: 57px !important;
              }
              :global(.prof_menu_icon) {
                margin-top: -16px !important;
              }
              :global(.prof_back_icon) {
                margin-top: -16px !important;
              }
              .mv_pro_banner_overlay{
                background: #0000003d;
                height: 100%;
                width: 100%;
              }
              .prof_menu_icon{
                margin-top: -10px;
              }
              .activaLabel{
                background: ${theme.appColor};
                color: #fff;
                border-radius: 3px;
                padding: 1px 6px;
                font-size: 13px;
                text-align: center;
                border: 1px solid ${theme.appColor};
                min-width: fit-content;
              }
              .deactivaLabel{
                background: ${theme.drawerBackground};
                color:#a3adb6;
                border-radius: 3px;
                padding: 1px 6px;
                font-size: 13px;
                text-align: center;
                border: 1px solid #a3adb6;
                min-width: fit-content;
              }
              .scroll{
                overflow-x:scroll;
               }
               .scroll::-webkit-scrollbar {
                display: none !important;
              }
              .subPlanCss{
                box-shadow:   ${theme.type == "light" ? `0px 2px 4px ${theme.palette.l_boxshadow2}` : `none`} ;
                border: ${theme.type == "light" ? `1px solid ${theme.palette.l_boxshadow2}` : `none`} ;
                border-radius: 0;
                background: var(--l_profileCard_bgColor) !important;
              } 
              .mv_proflie_gallery{
                background-color: var(--l_profileCard_bgColor) !important;
              }
            `}</style>
          </div>
        );
    }
  };
  return SubComponent();
}
