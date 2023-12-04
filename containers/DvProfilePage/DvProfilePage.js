import React, { useEffect, useState } from "react";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import Image from "../../components/image/image";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import * as env from "../../lib/config";
import { getCookie } from "../../lib/session";
import HighlightedStories from "../highlight-stories/highlight-list";
import FanFollowersList from "../profile/followers-list";
import ProfileNavigationTab from "../profile/profile-navigation-tab";
import ProfilePostGallery from "../profile/profile-post-gallery";
import Route from "next/router";
import { getRandomColor, handleContextMenu } from "../../lib/helper";
import { Avatar } from "@material-ui/core";
import isMobile from "../../hooks/isMobile";
import Icon from "../../components/image/icon";
import { useTheme } from "react-jss";
import { close_dialog, open_dialog } from "../../lib/global";
import StickyHeader from "../../components/sticky-header/StickyHeader";
import dynamic from "next/dynamic";
import OwnProfileStoryPage from "./ProfileStoryView";
import Button from "../../components/button/button";
import { BOMB_LOGO } from "../../lib/config/logo";
import FilterOption from "../../components/filterOption/filterOption";
import { facebook_social_white_disble_, instagram_social_white_disble_, onlyfans_social_white_disble_, twitter_social_white_disble_, youtube_social_white_disble_ } from "../../lib/config/social";
import { useSelector } from "react-redux";
import { isAgency } from "../../lib/config/creds";
const ShowMore = dynamic(() => import("../../components/show-more-text/ShowMoreText"), { ssr: false });

const DvProfilePage = (props) => {
  const theme = useTheme();
  const [profile] = useProfileData();
  const [auth] = useState(getCookie("auth"));
  const userType = getCookie("userType");
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [socialLnkArr, setSocialLinkArr] = useState([]);
  const [reduxSocialLinks, setReduxSocialLinks] = useState(profile?.socialMediaLink);
  const [isSticky, setIsSticky] = useState(false);
  const [postCount, setPostCount] = useState({});
  const [selectedValue, setSelectedValue] = useState(0);

  useEffect(() => {
    handleDefaultAvatar();
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
    !mobileView && getSocialLinkIcon();
    return () => {
      close_dialog("PostSlider")
    }
  }, []);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const getSocialLinkIcon = () => {
    let dummylinksArr = [];
    dummylinksArr[0] = { label: "instagram", logo: reduxSocialLinks?.instagram ? env.instagram_social : theme?.type === "dark" ? env.instagram_social_disble : instagram_social_white_disble_, link: reduxSocialLinks?.instagram || "" };
    dummylinksArr[1] = { label: "facebook", logo: reduxSocialLinks?.facebook ? env.facebook_social : theme?.type === "dark" ? env.facebook_social_disble : facebook_social_white_disble_, link: reduxSocialLinks?.facebook || "" };
    dummylinksArr[2] = { label: "twitter", logo: reduxSocialLinks?.twitter ? env.twitter_social : theme?.type === "dark" ? env.twitter_social_disble : twitter_social_white_disble_, link: reduxSocialLinks?.twitter || "" };
    dummylinksArr[3] = { label: "youtube", logo: reduxSocialLinks?.youtube ? env.youtube_social : theme?.type === "dark" ? env.youtube_social_disble : youtube_social_white_disble_, link: reduxSocialLinks?.youtube || "" };
    dummylinksArr[4] = { label: "tiktok", logo: reduxSocialLinks?.tiktok ? env.onlyfans_social : theme?.type === "dark" ? env.onlyfans_social_disble : onlyfans_social_white_disble_, link: reduxSocialLinks?.tiktok || "" };
    dummylinksArr[5] = { label: "snapchat", logo: reduxSocialLinks?.snapchat ? env.snapchat_social : theme?.type === "dark" ? env.snapchat_social_disble : env.snapchat_social_white_disble, link: reduxSocialLinks?.snapchat || "" };
    setSocialLinkArr([...dummylinksArr]);
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

  const handleDefaultAvatar = () => {
    if (auth && profile && !profile.profilePic) {
      var firstName = profile && profile.firstName ? profile.firstName.toString() : "";
      var lastName = profile && profile.lastName ? profile.lastName.toString() : "";
      var intials = firstName.charAt(0) + lastName.charAt(0);
      var profileImage = document.getElementById("profileImage");
      profileImage && profileImage.textContent
        ? ""
        : profileImage?.append(intials);
      // profileImage?.style?.backgroundColor = getRandomColor();
    }
  };

  return (
    <Wrapper>
      <div id="profile_page_cont" className="vh-100 overflow-auto d-flex px-3" style={{ overflowX: 'hidden !important' }}>
        <div className="col-12 px-0">
          <div onContextMenu={handleContextMenu} className="callout-none row m-0 profilePic position-relative specific_section_bg borderStroke"
            style={{ borderRadius: '0px 0px 1rem 1rem' }}>
            <StickyHeader stickyHandler={(flag) => setIsSticky(flag)} />
            {profile && profile.bannerImage ? (
              <FigureCloudinayImage
                publicId={profile.bannerImage || env.BANNER_PLACEHOLDER_IMAGE}
                crop="mpad"
                style={{
                  aspectRatio: "1/0.33",
                  width: "100%",
                  marginTop: "0",
                  objectFit: "cover",
                  // borderRadius: "10px",
                  backgroundPosition: "center",
                  height: "calc(40vh + 90px)",
                  borderRadius: '0px 0px 1rem 1rem'
                }}
                alt={`${profile.firstName} ${profile.lastName} - ${profile.country}`}
              />
            ) : (
              <div
                style={{
                  marginTop: "0",
                  width: "100%",
                  backgroundImage: `url(${env.BANNER_PLACEHOLDER_IMAGE_COVER})`,
                  backgroundColor: "#000",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "52vh",
                  borderRadius: '0px 0px 1rem 1rem'
                }}
              />
            )}
            <div className="col-12 position-relative" style={{ padding: '0px 2rem 1rem' }}>
              <div className="">
                <OwnProfileStoryPage
                  profilePic={profile.profilePic}
                />
              </div>
              <div className="d-flex justify-content-end position-absolute" style={{ top: '1em', right: "1em", gap: "0.6em", zIndex: '999' }}>
                {/* {profile?.userTypeCode !== 1 && <div>
                  <Button
                    type="button"
                    fclassname="background_none w-500 borderStroke rounded-pill py-1 d-flex align-items-center"
                    btnSpanClass="gradient_text"
                    leftIcon={{ src: BOMB_LOGO, id: "bombLogo" }}
                    iconWidth={34}
                    iconHeight={32}
                    children={"Add About Me"}
                    onClick={() => { }}
                  />
                </div>} */}
                <div>
                  <Button
                    type="button"
                    fclassname="btnGradient_bg w-400 rounded-pill d-flex py-2"
                    btnSpanClass="text-white"
                    children={lang.editProfile}
                    leftIcon={{ src: env.EDIT_PROFILE_ICON, id: "edit_prfile" }}
                    iconColor="#fff"
                    iconClass="text-app mr-2 border-bottom"
                    onClick={() => { Route.push(`/profile/edit`) }}
                  />
                </div>
              </div>

              <div className="row mx-0">
                <div className="col-3 pl-0">
                  <div className={`row m-0 d-flex align-items-center justify-content-between ${userType == 2 ? "adjustTopMargin" : "mt-1"}`}>
                    <div className={`col-6 pl-0 d-flex align-items-center dv__profileName mt-2`}>
                      <h4 className="mb-0"> {profile.userName || profile.username}</h4>
                      {userType == 1 ? (
                        ""
                      ) : (
                        <Image
                          src={env.Creator_Icon}
                          className="mx-2"
                          width={22}
                          height={22}
                        />
                      )}
                    </div>
                  </div>

                  <div className={`d-flex`}>
                    <div className="fntSz16 light_app_text mb-2">
                      @{profile.username || profile.userName}
                    </div>

                  </div>
                  <FanFollowersList
                    followersCount={profile.totalFollower}
                    followingCount={profile.totalFollowing}
                    postCount={profile.postCount}
                    showPosts={userType != 1}
                    showFollowers={(userType || profile?.userTypeCode) != 1}
                    showFollowings={true}
                    id={profile._id}
                    // bio={profile.bio}
                    showDots={true}
                  />
                </div>
                {profile.userTypeCode == 2 && <div className="col-9 d-flex align-items-end mb-2">
                  <div className="text-left strong_app_text" style={{ maxHeight: '72px', overflowY: 'auto' }}>
                    {profile.bio && <ShowMore
                      // width={bioWidth}
                      text={profile.bio}
                      className={
                        mobileView ? "" : "dv__count"
                      }
                    />}
                  </div>
                </div>}
              </div>
              <div className="row mx-0">
                <div className="col-3 pl-0">
                  {profile.userTypeCode == 2 && !mobileView &&
                    <div className="d-flex flex-row align-items-center">
                      {socialLnkArr.length > 0 &&
                        socialLnkArr.map((link, index) => (
                          <>
                            {link?.link && <Image
                              src={link.logo}
                              style={{ height: "2.5rem", width: "2.5rem" }}
                              className="pr-2 cursor-pointer"
                              onClick={() => link?.link && window.open("https://" + link?.link.replace("https://", ""), '_blank')}
                            />}
                          </>
                        ))}
                    </div>}
                </div>
                <div className="col-9" style={{ maxWidth: '61vw' }}>
                  {profile.userTypeCode == 2 && (
                    <HighlightedStories
                      setActiveState={props.setActiveStateStories}
                    ></HighlightedStories>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="row m-0 profilePic"
            style={{
              position: "relative",
            }}
          >

            <div className="w-100" style={{ position: "sticky", top: "0px", zIndex: "3" }}>

              <div className={`flex-column card_bg pb-2 ${!isSticky ? "d-none" : "d-flex"}`}>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <div className="d-flex flex-row align-items-center">
                    <div>
                      <OwnProfileStoryPage
                        profilePic={profile.profilePic}
                        isStickyHeader={true}
                      />
                    </div>
                    <div className="">
                      <div className="d-flex align-items-center mb-1">
                        <h1 className="fntSz18 txt-roboto mb-0 cursorPtr"
                          style={{ color: theme?.text }}
                          onClick={() => scrollToView("oth_pro_cont")}
                        >
                          {<>{profile?.userName || profile?.username}</>
                          }
                        </h1>
                        <Image
                          src={env.Creator_Icon}
                          className="pointer mx-2"
                          width={20}
                          height={20}
                        />
                      </div>
                      <h2 className="fntSz13 txt-roboto bck3 mb-0 fntlightGrey">
                        <span>@{profile.username}</span>
                      </h2>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="button"
                      fclassname="btnGradient_bg w-400 rounded-pill d-flex py-2"
                      btnSpanClass="text-white"
                      children={lang.editProfile}
                      leftIcon={{ src: env.EDIT_PROFILE_ICON, id: "edit_prfile" }}
                      iconColor="#fff"
                      iconClass="text-app mr-2 border-bottom"
                      onClick={() => { Route.push(`/profile/edit`) }}
                    />
                  </div>
                </div>
                <ProfileNavigationTab
                  setActiveState={props.setActiveStateStories}
                  isSticky={props.isSticky}
                  tabType={props.tabType}
                  userType={profile?.userTypeCode}
                  count={{ postCount: profile.postCount, shoutoutCount: profile.shoutoutCount, exclusivePostCount: profile.exclusivePostCount, recordedStreamCount: profile.recordedStreamCount, taggedCount: profile.taggedCount, reviewCount: profile.reviewCount, lockedPostCount: profile.lockedPostCount }}
                  isOtherProfilePage={false}

                />
              </div>
            </div>
            {!isSticky && <ProfileNavigationTab
              setActiveState={props.setActiveStateStories}
              isSticky={props.isSticky}
              tabType={props.tabType}
              userType={profile?.userTypeCode}
              count={{ postCount: profile.postCount, shoutoutCount: profile.shoutoutCount, exclusivePostCount: profile.exclusivePostCount, recordedStreamCount: profile.recordedStreamCount, taggedCount: profile.taggedCount, reviewCount: profile.reviewCount, lockedPostCount: profile.lockedPostCount }}
              isOtherProfilePage={false}

            />}

            {(props.activeNavigationTab == 'grid_post' || props.activeNavigationTab == 'video_post' || props.activeNavigationTab == 'image_post' || props.activeNavigationTab == 'text_post' || props.activeNavigationTab == "scheduled_post") &&
              <div className="d-flex w-100 subPlanCss pt-2 pb-1 justify-content-between align-items-center px-1"
              >
                <div className="d-flex gap_8 scroll">
                  {postTypeList?.map((item, index) => {
                    return (
                      <div key={index}>
                        <Button
                          type="button"
                          fclassname={`${(props?.activeNavigationTab == item?.label || props?.activeNavigationTab == item?.navigationTab) ? "btnGradient_bg" : "background_none borderStroke"} rounded-pill py-2`}
                          onClick={() => props?.setActiveStateStories(item?.navigationTab)}
                          children={`${item?.label} (${postCount?.[item?.count] || 0})`}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="pr-2">
                  <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedValue(value)} />
                </div>
              </div>}

            <div className="w-100">
              <ProfilePostGallery
                userId={isAgency() ? selectedCreatorId : profile._id}
                streamUserId={profile.isometrikUserId}
                activeNavigationTab={props.activeNavigationTab}
                homePageref={props.homePageref}
                adjustLockPostText={true}
                selectedValue={selectedValue}
                isOtherProfilePage={false}
                allPostCount={(postCount) => setPostCount(postCount)}
                otherPostSlider={true}
                setActiveNavigationTab={props.setActiveNavigationTab}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        :global(#home-page) {
          overflow-y: auto;
        }
        .editBtn{
          display: flex;
          padding: 5px 10px;
          border-radius: 23px;
          text-align: center;
          gap: 5px;
          align-items: center;
          height: 29px;
        }
        :global(.mv_edit_profile_icon_top_sec){
          right:40px
        }


  :global(.text-post-container){
    border-radius: 4px !important;
  }

  .ProfilePostGalleryDiv{
    margin-left: -8px;
  }

        .activaLabel{
          background: var(--l_base);
          color: #fff;
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 13px;
          text-align: center;
          margin-top: 2px;
          font-weight:700;
          border: 1px solid var(--l_base);
      }
      .paddingTop10{
        padding-top:10px !important;
      }

      .deactivaLabel{
        background: none;
        color:var(--l_app_text);
        border-radius: 3px;
        padding: 1px 6px;
        font-size: 13px;
        text-align: center;
        margin-top: 2px;
        border: 1px solid #5B5C7B;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
            font-weight:600;
    }
       .scroll{
        overflow-x:scroll;
       }
       .scroll::-webkit-scrollbar {
        display: none !important;
      }
      .adjustTopMargin{
        margin-top: -12px !important;
      }
      .marginTop-17{
        margin-top: -17px !important;
      }
      :global(.highlightedStoryText){
        display:none !important;
      }
      :global(.dv__bg_light_color_profile){
        background:none !important;
      }
      :global(.postNavTab){
        padding: 9px 15px !important;
      }
      :global(.dv__sticky){
        position:revert !important;
        z-index:0 !important;
        padding-left:0 !important;
      }
      :global(.activaLabel){
        font-weight: 500 !important;
        background: var(--l_base) !important;
        color: #ffffff !important;
      }
      :global(.deactivaLabel){
      color:var(--l_text_app) !important;
      }
      .gap{
        gap:10px;
      }

      :global(.text-post-container){
        border-radius:4px solid !important;
      }

      :global(.adjustThemeColor){
        background:${theme.type == "light" ? "var(--l_app_bg);" : "var(--theme)"}
      }
      :global(.adjustGridViewOwnProfile>div){
        margin-left: -20px;
      }
      .managePadding{
        padding-bottom:7px !important;
        padding-top: 0 !important;
      }
      :global(.manageBioWidth::-webkit-scrollbar ){ 
        display: none !important;  /* Safari and Chrome */
    }
      :global(.manageBioWidth){
        max-height: 77px;
      overflow-y: scroll;
      }
      
      `}</style>
    </Wrapper>
  );
};
export default DvProfilePage;
