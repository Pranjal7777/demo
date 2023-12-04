import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, getCookiees } from "../../lib/session";
import { guestLogin } from "../../lib/global/guestLogin";
import { follow, unfollow, getProfile, getUserId, getFollowCount } from "../../services/profile";
import CustomHead from "../../components/html/head";
import { useTheme } from "react-jss";
import usePg from "../../hooks/usePag";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import isTablet from "../../hooks/isTablet";
import useReduxData from "../../hooks/useReduxState";
import useProfileData from "../../hooks/useProfileData";
import { getAddress } from "../../redux/actions";
import { UPDATE_PROFILE_FOLLOWING } from "../../redux/actions/auth";
import { getSelectedPlans, purchaseSubcriptionApi } from "../../services/subscriptions";
import { getReasons } from "../../services/auth";
import {
  close_dialog,
  close_drawer,
  close_progress,
  drawerToast,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global/loader";
import { authenticate, sendMail } from "../../lib/global/routeAuth";
import { scrollToView } from "../../lib/global/scrollToView";
import { isAgency } from "../../lib/config/creds";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import { BANNER_PLACEHOLDER_IMAGE } from "../../lib/config/placeholder";
import { Creator_Icon, NAV_CHAT_ICON, SEND_POST_ICON, STAR_ICON_OTHERPROFIE } from "../../lib/config/homepage";
import { facebook_social, facebook_social_disble, facebook_social_white_disble_, instagram_social, instagram_social_disble, instagram_social_white_disble_, onlyfans_social, onlyfans_social_disble, onlyfans_social_white_disble_, twitter_social, twitter_social_disble, twitter_social_white_disble_, youtube_social, youtube_social_disble, youtube_social_white_disble_ } from "../../lib/config/social";
import { backArrow, DV_CHAT_ICON, PROFILE_ICON_OUTLINE, PROFILE_SHARE_ICON_OUTLINE, SHARE_ICON } from "../../lib/config/profile";
import Icon from "../../components/image/icon";
import Button from "../../components/button/button";
import StickyHeader from "../../components/sticky-header/StickyHeader"
import HighlightedStories from "../../containers/highlight-stories/highlight-list";
import ProfileNavigationTab from "../../containers/profile/profile-navigation-tab"
import ProfilePostGallery from "../../containers/profile/profile-post-gallery"
import dayjs from "dayjs";
import FanFollowersList from "../../containers/profile/followers-list";
import Head from "next/head";
import { Tooltip } from "@material-ui/core";
import DvSidebar from "../../containers/DvSidebar/DvSidebar";
import { isShoutoutEnabled } from "../../services/shoutout";
import { updateProfileOfDataAction } from "../../redux/actions/dashboard/dashboardAction";
import Image from "../../components/image/image";
import OtherProfileStories from "../../containers/DvProfilePage/otherProfileStory";
import { snapchat_social_white_disble } from "../../lib/config";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import { snapchat_social, snapchat_social_disble } from "../../lib/config";
import FilterOption from "../../components/filterOption/filterOption";
import { authenticateUserForPayment } from "../../lib/global";
import { useChatFunctions } from "../../hooks/useChatFunctions";
import Error from "../_error";
const ShowMore = dynamic(() => import("../../components/show-more-text/ShowMoreText"), { ssr: false });
const MoreVertIcon = dynamic(() => import("@material-ui/icons/MoreVert"), { ssr: false });
const CircularProgress = dynamic(() => import("@material-ui/core/CircularProgress"), { ssr: false });

/**
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */
export default function ProfilePage(props) {
  if (!props.id) return "";
  const theme = useTheme();
  const dispatch = useDispatch();
  const [lang] = useLang();
  const auth = getCookie("auth");
  const router = useRouter();
  const { query = {}, profileInfo = {}, otherProfileId, userToken } = props;
  const [currProfile] = useProfileData();
  const [profile, setProfile] = useState(profileInfo);
  const [activeNavigationTab, setActiveNavigationTab] = useState(query?.tabType || "grid_post");
  const [isSticky, setIsSticky] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const Pageref = useRef(null);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [subSribePlan, setSubscribePlan] = useState([]);
  const splan = React.createRef({});
  const [pg] = usePg();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const [isRequestVideocall, setIsRequestVideocall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLnkArr, setSocialLinkArr] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [reduxSocialLinks, setReduxSocialLinks] = useState(profile?.socialMediaLink);
  const [postCount, setPostCount] = useState({});
  const [selectedValue, setSelectedValue] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const { handleChat } = useChatFunctions()

  // Social Media Icons
  const socialLinks = profileInfo.socialMediaLink;
  const allSocialMedia = ["facebook", "instagram", "twitter", "youtube", "Other"];

  const style = { right: `${tabletView ? '4vw' : "0vw"}`, width: "25vw", top: "225px", position: "sticky", height: "fit-content", marginTop: "-58px", padding: "inherit" }

  useEffect(() => {
    close_progress();
    // setProfile();
    close_drawer();
    close_dialog();
  }, [props]);

  useEffect(async () => {
    !profile.isSubscribed && auth && handleGetPlans();

    getSocialLinkIcon();
  }, []);

  useEffect(() => {
    return () => {
      close_dialog("PostSlider")
    }
  }, [])

  useEffect(async () => {
    if (profileInfo) {
      try {
        let followCount = await getFollowCount(profileInfo?._id, decodeURIComponent(getCookie('token')), getCookie("userType") == "3" ? true : false);
        debugger
        setProfile(prev => {
          return {
            ...prev,
            ...followCount.data.data
          }
        })
      } catch(e) {
        console.log("follow count errror", e)
      }
      
    }

  }, [profileInfo])

  useEffect(async () => {
    setSubscribePlan([])
    !profile.isSubscribed && auth && handleGetPlans();
    getSocialLinkIcon();
  }, [props.id]);

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
    //   navigationTab: "text_post"
    //   count: "textCount",
    // },
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

  const subscriptionPlanDurationText = (plan) => {
    let subsText = "";
    if (plan.duration) {
      subsText += String(plan?.duration) + " ";
    }
    if (["MONTHLY", "MONTH"].includes(plan.durationType)) {
      subsText += "Month(s)"
    } else if (["DAYS", "DAY"].includes(plan.durationType)) {
      subsText += "Day(s)"
    }
    return subsText;
  }


  useEffect(() => {
    if (mobileView) return
    const importPostSlider = () => import( /* webpackChunkName: "PostSlider" */ "../../components/image-slider2/PostSlider")
    const container = document.getElementById("profile_page_cont")
    if (container) {
      container.addEventListener("scroll", importPostSlider, { once: true })
      return () => container.removeEventListener("scroll", importPostSlider, { once: true })
    }
  }, [])

  useEffect(() => {
    setProfile(profileInfo);
  }, [profileInfo]);

  const handleCloseDrawer = () => {
    router.back();
  };

  const ratings = profile?.avgUserRating?.toFixed(2)
  const handleNavigationMenu = () => {
    open_drawer("SideNavMenu", {
      paperClass: "backNavMenu",
      setActiveState: "timeline",
      noBorderRadius: true
    },
      "right"
    );
  };

  const followUnfollowHandler = (subscribeCheck) => {
    const payload = {
      followingId: profile._id,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    if (profile.isFollow) {
      setFollowLoading(true)
      unfollow(payload)
        .then((res) => {
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
          setFollowLoading(false)
          setProfile(profileIns);
          dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing - 1));
          dispatch(updateProfileOfDataAction({ userId: profile._id, data: { isFollowed: 0 } }))
        })
        .catch((error) => {
          setFollowLoading(false)
          console.error(error);
          Toast(
            error.response
              ? error.response.data.message
              : "Failed to follow this creator",
            "warning"
          );
        });
    } else {
      setFollowLoading(true)
      follow(payload)
        .then((res) => {
          Toast(
            `You are now following ${profile.firstName + " " + profile.lastName
            }`,
            "success"
          );
          const profileIns = { ...profile };
          profileIns.isFollow = true;
          profileIns.followerCount = profileIns.followerCount + 1;
          setFollowLoading(false)
          setProfile(profileIns);
          dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
          dispatch(updateProfileOfDataAction({ userId: profile._id, data: { isFollowed: 1 } }))
        })
        .catch((error) => {
          setFollowLoading(false)
          console.error(error);
          Toast(
            error.response
              ? error.response.data.message
              : "Failed to follow this creator",
            "warning"
          );
        });
    }

    if (subscribeCheck) {
      router.reload();
    }
  };

  const handleBookVideoCall = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath)
        .then(() => {
          const propsToUsevideoCallRequest = {
            heading: lang.VideoCallRequest,
            creatorId: profile._id,
            creatorName: profile.firstName + " " + profile.lastName,
            creatorProfilePic: profile.profilePic,
            videoCallPrice: profile.videoCallPrice
          };
          if (mobileView) open_drawer('videoCallRequest', propsToUsevideoCallRequest, 'right');
          else open_dialog('videoCallRequest', propsToUsevideoCallRequest);
        });
    })
  };

  const handleReportUser = () => {
    mobileView
      ? open_drawer("REPORT_POST", {
        drawerData: { reportedId: props.id, reportType: 2 },
        back: () => close_drawer(),
      },
        "bottom"
      )
      : open_dialog("REPORT_POST", {
        drawerData: { reportedId: props.id, reportType: 2 },
        back: () => close_dialog(),
      });
  };

  const handleSubscribeDrawer = () => {
    mobileView
      ? open_drawer("CreatorPlanSubscription", {
        back: () => close_drawer(),
        creatorId: profile._id,
        creatorName: profile.username,
        followUnfollowHandler,
      },
        "bottom"
      )
      : open_dialog("CreatorPlanSubscription", {
        back: () => close_dialog(),
        creatorId: profile._id,
        creatorName: profile.username,
        followUnfollowHandler,
      });
  };

  const handleSelectionPlan = (plan) => {
    startLoader();
    splan.current = plan;
    handlePaymentScreen(plan);
  };

  const handlePaymentScreen = (plan) => {
    let subscriptionTitle = subscriptionPlanDurationText(plan)
    handleGetAddress(),
      mobileView
        ? reduxData.defaultCard
          ? open_drawer("purchseConfirmDialog", {
            title: `Subscribe to ${profile.username}`,
            checkout: buyPlan,
            alert: lang.alertSubscribeNote,
            planName: subscriptionTitle,
            description: plan.description,
            price: plan?.amount,
            isSubscription: true,
          },
            "bottom"
          )
          : open_drawer(
            "Address",
            {
              title: `Subscribe to ${profile.username}`,
              getAddress: handleGetAddress,
              checkout: buyPlan,
              radio: true,
              planName: subscriptionTitle,
              description: plan.description,
              price: plan?.amount,
              subscriptionPlanId: plan?._id,
              isApplyPromo: true,
              applyOn: "SUBSCRIPTION",
              creatorId: profile._id,
            },
            "right"
          )
        : reduxData.defaultCard
          ? open_dialog("purchaseConfirm", {
            title: `Subscribe to ${profile.username}`,
            checkout: buyPlan,
            planName: subscriptionTitle,
            closeAll: true,
            description: plan.description,
            alert: lang.alertSubscribeNote,
            price: plan?.amount,
            isSubscription: true,
          })
          : open_dialog("checkout", {
            title: `Subscribe to ${profile.username}`,
            onClose: props.onClose,
            getAddress: handleGetAddress,
            checkout: buyPlan,
            planName: subscriptionTitle,
            description: plan.description,
            radio: true,
            price: plan?.amount,
            subscriptionPlanId: plan?._id,
            isApplyPromo: true,
            applyOn: "SUBSCRIPTION",
            creatorId: profile._id,
          });
  };

  const handleGetAddress = async () => {
    dispatch(getAddress({ loader: true }));
  };

  const buyPlan = async (paymentMethod, addressId, promoCode) => {
    startLoader();
    try {
      const payload = {
        planId: splan?.current?._id,
        creatorId: profile._id,
        paymentMethod: paymentMethod,
        pgLinkId: typeof pg[0] != "undefined" ? pg[0]._id : "",
      };
      // if (promoCode) {
      //   payload["promoCode"] = promoCode;
      // }
      if (addressId) {
        payload["addressId"] = addressId
      }

      const res = await purchaseSubcriptionApi(payload);
      stopLoader();

      if (res && res.data) {
        const profileResponse = await getProfile(otherProfileId, userToken, getCookie('selectedCreatorId'));
        setProfile(prev => (prev, profileResponse?.data?.data))
        Toast(lang.subscriptionPurchased, "success");
        close_dialog();
        close_drawer("purchseConfirmDialog");
        close_drawer("Address");
        close_drawer("checkout");
        router.reload();
        props?.onClose();

      }
    } catch (err) {
      stopLoader();
      if (err?.response?.data?.message) {
        if (err.response.status === 409) {
          close_dialog();
          close_drawer("purchseConfirmDialog");
          close_drawer("Address");
          close_drawer("checkout");
          props?.onClose();
        }
        Toast(err.response.data.message, "error");
      }
    }
  };

  const handleDurationType = (type) => {
    switch (type) {
      case "DAYS":
        return "days";
      case "MONTHLY":
        return "months";
    }
  };

  const handleGetPlans = async () => {
    startLoader();
    try {
      let response = await getSelectedPlans(props?.id);
      if (response.status == 200) {
        stopLoader();
        setSubscribePlan(response?.data?.data);
      } else if (response.status == 204) {
        stopLoader();
      } else {
        stopLoader();
        Toast(lang.errorMsg, "error");
      }
    } catch (e) {
      stopLoader();
      Toast(e?.response?.data?.message, "error");
    }
  };

  const GetCancelReasons = async () => {
    startLoader();
    try {
      let reasonType = 4; // 4 -> cancel subscription
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        stopLoader();
        let arr = response && response.data && response.data.data;
        mobileView
          ? open_drawer(
            "cancelSubscription",
            {
              reasons: arr,
              validTill: dayjs(
                profile?.subscriptionData?.planEndTime
              ).format("MMM DD, YYYY"),
              subscriptionId: profile?.subscriptionData?._id,
            },
            "bottom"
          )
          : open_dialog("cancelSubscription", {
            reasons: arr,
            validTill: dayjs(profile?.subscriptionData?.planEndTime).format(
              "MMM DD, YYYY"
            ),
            subscriptionId: profile?.subscriptionData?._id,
            closeAll: true,
            isFromOtherProfilePage: true
          });
      }
    } catch (e) {
      console.error("ERROR IN GetCancelReasons >", e);
      stopLoader();
      Toast(
        e?.response?.data?.message || "Error In GetDeactivateReasons",
        "error"
      );
    }
  };

  const handleShareItem = () => {
    mobileView
      ? open_drawer(
        "SHARE_ITEMS",
        {
          sharedUserId: profile._id,
          shareType: "profile",
          username: profile.username,
          back: () => close_drawer(),
        },
        "bottom"
      )
      : open_dialog("SHARE_ITEMS", {
        sharedUserId: profile._id,
        shareType: "profile",
        username: profile.username,
        back: () => close_dialog("SHARE_ITEMS"),
      });
  };

  const handleVideoCall = () => {
    setIsRequestVideocall(false);
  }

  const isShoutoutEnabledApi = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && isShoutoutEnabled(profile._id).then((res) => {
        handleShoutOut()
      }).catch((error) => {
        if (error.response.status == "408") {
          return drawerToast({
            closing_time: 70000,
            // title: lang.shoutoutPlaceholder,
            desc: error.response.data.message,
            closeIconVisible: true,
            isPromo: true,
            button: {
              text: lang.contactUs,
              onClick: () => {
                sendMail();
              },
            },
            titleClass: "max-full",
            autoClose: true,
            isMobile: mobileView ? true : false,
          });
        }
      })
    })
  }

  const handleShoutOut = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then((res) => {
      mobileView ? authenticate(router.asPath).then(() => {
        open_drawer(
          "Shoutout",
          {
            handleCloseDrawer: handleCloseDrawer,
            profile: profile,
          },
          "right"
        )
      }) : authenticate(router.asPath).then(() => {
        open_dialog("open_desktop_shoutout", {
          otherprofile: profile,
        })
      });
      setIsRequestVideocall(true);
    })
  }

  const manageSocialLogo = (media, isEnable) => {
    switch (media) {
      case "facebook":
        return isEnable ? facebook_social : facebook_social_disble;
      case "instagram":
        return isEnable ? instagram_social : instagram_social_disble;
      case "twitter":
        return isEnable ? twitter_social : twitter_social_disble;
      case "youtube":
        return isEnable ? youtube_social : youtube_social_disble;
      case "tiktok":
        return isEnable ? onlyfans_social : onlyfans_social_disble;
      case "snapchat":
        return isEnable ? snapchat_social : snapchat_social_disble;
    }
  }

  const getSocialLinkIcon = () => {
    let dummyLinksArr = [];

    allSocialMedia.map((socialMedia, id) => {
      if (Object.keys(socialLinks).includes(socialMedia)) {
        let enabledLogo = manageSocialLogo(socialMedia, true);

        dummyLinksArr.push({
          id,
          label: socialMedia,
          link: socialLinks[socialMedia],
          logo: enabledLogo,
        });
      } else {
        let disabledLogo = manageSocialLogo(socialMedia, false);

        dummyLinksArr.push({
          id,
          label: socialMedia,
          link: "",
          logo: disabledLogo,
        });
      }
    })

    setSocialLinkArr(dummyLinksArr);
  };


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const getSocialLink = () => {
    let linksArray = [];
    linksArray[0] = { label: "instagram", logo: socialLinks?.instagram ? instagram_social : theme?.type === "dark" ? instagram_social_disble : instagram_social_white_disble_, link: reduxSocialLinks?.instagram || "" };
    linksArray[1] = { label: "facebook", logo: socialLinks?.facebook ? facebook_social : theme?.type === "dark" ? facebook_social_disble : facebook_social_white_disble_, link: reduxSocialLinks?.facebook || "" };
    linksArray[2] = { label: "twitter", logo: socialLinks?.twitter ? twitter_social : theme?.type === "dark" ? twitter_social_disble : twitter_social_white_disble_, link: reduxSocialLinks?.twitter || "" };
    linksArray[3] = { label: "youtube", logo: socialLinks?.youtube ? youtube_social : theme?.type === "dark" ? youtube_social_disble : youtube_social_white_disble_, link: reduxSocialLinks?.youtube || "" };
    linksArray[4] = { label: "tiktok", logo: socialLinks?.tiktok ? onlyfans_social : theme?.type === "dark" ? onlyfans_social_disble : onlyfans_social_white_disble_, link: reduxSocialLinks?.tiktok || "" };
    linksArray[5] = { label: "snapchat", logo: socialLinks?.snapchat ? snapchat_social : theme?.type === "dark" ? snapchat_social_disble : snapchat_social_white_disble, link: reduxSocialLinks?.snapchat || "" };
    return linksArray;
  }

  const profileBanner = profile.bannerImage && s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, mobileView ? 150 : 300)
  if ((profile && profile?.userTypeCode != 2) || !profileInfo) {
    return <Error />
  }

  return (
    <>
      <Script src="https://player.live-video.net/1.18.0/amazon-ivs-player.min.js" strategy="afterInteractive" />
      <div id="oth_pro_cont">
        <CustomHead
          ogTitle={profile && profile.firstName + " " + profile.lastName}
          ogImage={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic)}
          description={profile ? profile.bio : ''}
          pageTitle={profile ? profile.firstName + " " + profile.lastName : ''}
          userName={profile ? profile?.username || profile?.userName : ''}
        />
        {!!profileBanner && <Head>
          <link
            rel="preload"
            href={profileBanner}
            as="image"
          />
        </Head>}

        {mobileView
          ? <div
            id="profile_page_cont"
            ref={Pageref}
            className="drawerBgCss vh-100"
            style={{ overflowX: "hidden" }}
          >
            <StickyHeader stickyHandler={(flag) => setIsSticky(flag)} />
            <div
              className={`prof_back_head ${isSticky && "sticky_header pt-3"}`}
            >
              <div
                className={"d-flex w-100 align-items-center"}
              >
                <Icon
                  height={26}
                  class="prof_back_icon px-3"
                  width={26}
                  color={!isSticky ? "#fff" : theme.type == "light" ? "#000" : "#fff"}
                  alt="back arrow icon"
                  onClick={() => router.back()}
                  icon={`${backArrow}#left_back_arrow`}
                />
                {isSticky && (
                  <h5
                    onClick={() => scrollToView("oth_pro_cont")}
                    className="dv_appTxtClr pb-2"
                  >
                    <>{profile.username && "@" + profile.username}</>
                  </h5>
                )}

                {isSticky &&
                  <Icon
                    class="ml-auto prof_menu_icon px-2"
                    onClick={() =>
                      authenticate(router.asPath).then(() => {
                        handleChat({ userId: profile?._id, userName: profile?.userName || profile?.username });
                      })
                    }
                    icon={`${NAV_CHAT_ICON}#chat`}
                    size={32}
                    unit={"px"}
                    viewBox="0 0 25 25.794"
                    color={
                      !isSticky ? "#fff" : theme.type == "light" ? "#000" : "#fff"
                    }
                    alt="profile chat icon"
                  />
                }
                <Icon
                  height={37}
                  width={37}
                  color={
                    !isSticky ? "#fff" : theme.type == "light" ? "#000" : "#fff"
                  }
                  alt="profile share icon"
                  onClick={() => {
                    handleShareItem();

                  }
                  }
                  class={`${isSticky ? 'pr-1' : 'ml-auto pr-1'} prof_menu_icon pl-2`}
                  icon={`${SEND_POST_ICON}#share_post`}
                  viewBox="0 0 52 52"
                />
                <MoreVertIcon
                  className={"pointer mr-2 mb-3"}
                  style={{
                    fontSize: "32px",
                    color: !isSticky
                      ? "#fff"
                      : theme.type == "light"
                        ? "#000"
                        : "#fff",
                  }}
                  onClick={() =>
                    authenticate(router.asPath).then(() => {
                      handleReportUser();
                    })
                  }
                />
              </div>
            </div>
            <div
              className={`col-12`}
            >
              <div
                className={`row mv_pro_banner`}
                style={{
                  backgroundImage: `url(${!profile.bannerImage
                    ? BANNER_PLACEHOLDER_IMAGE
                    : profileBanner
                    })`, aspectRatio: "1/0.33",
                  height: "100%"
                }
                }
              >
                <div
                  className={`mv_pro_banner_overlay`}
                ></div>
              </div>
              <div
                className={"col-auto p-0 d-flex"}
                style={{ marginTop: "-44px", height: "90px" }}
              >
                <OtherProfileStories
                  profile={profile}
                />

                {!isLoading &&
                  <div className="col-6 ml-auto d-flex p-0 align-items-end justify-content-end gap_8">
                    {/* <div>
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
                    </div> */}
                    <div
                      type="button"
                      className="d-flex"
                      onClick={() => {
                        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                          !isAgency() && authenticate(router.asPath).then(() => {
                            open_drawer("SentTip", {
                              creatorId: profile._id,
                              creatorName: props.profileName || props.profileInfo.username,
                              trigger: 3,
                              page: "creatorProfile",
                              updateTip: (tipCount) =>
                                updateTipHandler && updateTipHandler(tipCount),
                            }, 'bottom');
                          })
                        })
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <Icon
                          icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                          size={40}
                          class=" pointer"
                          alt="follow icon"
                          viewBox="0 0 88 88"
                        />
                      </div>
                    </div>
                    <div className="">
                      <Button
                        type="button"
                        onClick={() => {
                          authenticate(router.asPath).then(() => {
                            handleChat({ userId: profile?._id, userName: profile?.userName || profile?.username });
                          });
                        }}
                        leftIcon={{ src: NAV_CHAT_ICON, id: "chat" }}
                        iconWidth={24}
                        iconHeight={24}
                        iconClass="mr-1"
                        iconViewBox="0 0 24 24"
                        fclassname="btnGradient_bg d-flex align-items-center rounded-pill borderStroke py-2"
                        children={lang.Chat}
                      />
                    </div>
                  </div>}
              </div>
              <div
                className="col-auto p-0 pb-2"
              >
                <div className="d-flex align-items-center">
                  <h1 className="fntSz18 txt-roboto mb-1">
                    {profile?.userName || profile?.username
                    }
                  </h1>
                  <Image
                    src={Creator_Icon}
                    className="pointer mb-2 mx-2"
                    width={20}
                    height={20}
                  />
                </div>

                <h2 className="d-flex fntSz14 align-items-center mb-0 light_app_text">
                  {
                    <span>@{profile.username}</span>
                  }
                  <div className="d-flex cursorPtr align-items-center">
                    <Icon
                      icon={`${STAR_ICON_OTHERPROFIE}#Path_3684`}
                      size={15}
                      class="pointer d-flex align-items-center ml-2 mb-1"
                      viewBox="0 0 13.815 13.138"
                    />
                    <span className="cursorPtr fntSz14 ml-1 pb-1">{ratings || "0.00"}
                      <span style={{}} className="position-relative fntSz16 mx-1">.</span>
                      {profile?.userRatingCount || 0} {lang.reviews}</span>
                  </div>
                </h2>
              </div>
            </div>

            {!isLoading &&
              <FanFollowersList
                followersCount={profile.totalFollower}
                followingCount={profile.totalFollowing}
                postCount={profile.postCount}
                showPosts={profile.userTypeCode == 1 ? false : true}
                // showFollowers={profile.userTypeCode == 1 ? false : true}
                otherProfile={router?.pathname == "/[username]" ? true : false}
                showFollowers={true}
                showFollowings={true}
                // showFollowings={profile.userTypeCode == 1 ? true : false}
                id={profile._id}
                others={true}
                isFollow={profile.isFollow}
                bio={mobileView && profile.bio}
                className="other_profile"
                categoryData={profile?.categoryData}
              />}

            {<div>
              <div className="row m-0 d-flex align-items-center justify-content-center mt-2">
                <div className="col-12 px-4 mx-auto">

                  {/* Subscribe Button */}
                  {profile?.subscriptionData?.status == "CANCELLED"
                    ? <Button
                      type="button"
                      fclassname="my-3 btnGradient_bg rounded-pill borderStrokeClr"
                      children={`${lang.planEndMsg} ${dayjs(profile?.subscriptionData?.planEndTime).format(
                        "MMM DD, YYYY, hh:mm a"
                      )}`}
                    />
                    : profile?.subscriptionData?.planCount <= 0
                      ? ""
                      : <Button
                        type="button"

                        fclassname={`mb-3 mt-0 rounded-pill borderStrokeClr ${!profile.isSubscribed ? "btnGradient_bg" : "background_none"}`}
                        btnSpanClass={!profile.isSubscribed ? "" : "gradient_text w-500"}
                        onClick={() => {
                          authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                            !profile.isSubscribed ?
                              authenticate(router.asPath).then(() => {
                                handleSubscribeDrawer();
                              }) : authenticate(router.asPath).then(() => {
                                GetCancelReasons();
                              })
                          })
                        }
                        }
                        children={!profile.isSubscribed ? lang.subscribe : lang.unSubscribe}
                      />
                  }

                  {/* Follow / UnFollow Button */}
                  <div>
                    <Button
                      type="button"
                      fclassname={`my-3 rounded-pill borderStrokeClr ${profile.isFollow ? "background_none" : "btnGradient_bg"}`}
                      btnSpanClass={profile.isFollow ? "gradient_text w-500" : ""}
                      onClick={() => {
                        authenticate(router.asPath).then(() => {
                          followUnfollowHandler();
                        });
                      }}
                      children={profile.isFollow ? lang.following : lang.follow}
                      isLoading={followLoading}
                    />
                  </div>

                  {/* Shoutout Button and Video Call Button */}
                  <div className="col-12 p-0">
                    <div className="subPlanCss">
                      {/* Shoutout Button */}
                      {profile?.shoutoutPrice?.isEnable
                        ? <Button
                          type="button"
                          fclassname="my-3 btnGradient_bg rounded-pill borderStroke"
                          onClick={() => {
                            authenticate(router.asPath).then(() => {
                              isShoutoutEnabledApi()
                            })
                          }}
                        >
                          {`${lang.requestAShoutout}`}
                          {/* <span className="pl-1 font-weight-bold d-flex flex-row">{`${profile?.shoutoutPrice?.price}`}
                            <Icon
                              icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                              size={18}
                              class="ml-1"
                              alt="follow icon"
                              viewBox="0 0 18 18"
                            />
                          </span> */}
                        </Button>
                        : ""
                      }

                      {/* Video Call Button */}
                      {!!profile?.videoCallPrice?.price && <div>
                        <Button
                          fclassname="my-3 fntSz18 background_none rounded-pill borderStrokeClr"
                          btnSpanClass="gradient_text w-500"
                          onClick={handleBookVideoCall}
                        >
                          {`${lang.requestShoutoutVideo}`}
                          {/* <span className="px-1 font-weight-bold d-flex flex-row">{`${profile?.videoCallPrice?.price}`}
                            <Icon
                              icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                              size={18}
                              class="ml-1"
                              alt="follow icon"
                              viewBox="0 0 18 18"
                            />
                          </span>
                          {`/ ${profile?.videoCallPrice?.duration}`} */}
                        </Button>
                      </div>
                      }
                    </div>
                  </div>

                  {/* Social Media Links */}
                  {!!getSocialLink()?.length && <div className="d-flex align-items-center">
                    {getSocialLink().map((linkObj) => (
                      <>
                        {linkObj.link && <Image
                          key={linkObj.id}
                          src={linkObj.logo}
                          height="52"
                          width="52"
                          className={`px-1 ${linkObj.link ? "cursorPtr" : ""}`}
                          onClick={() => linkObj.link && window.open(`${linkObj?.link}`, '_blank')}
                          alt={`Social Media Icon of ${linkObj.label}`}
                        />}
                      </>
                    ))}
                  </div>
                  }

                </div>
              </div>

              {!isLoading &&
                <HighlightedStories
                  setActiveState={(props) => {
                    scrollToView("scroll_to_top");
                    setActiveNavigationTab(props);
                  }}
                  otherProfile={profile}
                />
              }
            </div>
            }

            {!isLoading &&
              <ProfileNavigationTab
                setActiveState={(props) => {
                  if (props === "review_tab" && !getCookie("auth")) return authenticate(router.asPath)
                  scrollToView("scroll_to_top");
                  setActiveNavigationTab(props);
                }}
                tabType={activeNavigationTab}
                isSticky={isSticky}
                userType={profile.userTypeCode}
                key={profile.userTypeCode}
                otherProfile={router?.pathname == "/[username]" ? true : false}
                isOtherProfilePage={router?.pathname == "/[username]" ? true : false}
                count={{ postCount: profile.postCount, shoutoutCount: profile.shoutoutCount, exclusivePostCount: profile.exclusivePostCount, recordedStreamCount: profile.recordedStreamCount, taggedCount: profile.taggedCount, reviewCount: profile.reviewCount }}
              />}

            {
              isSticky && (router?.pathname == "/[username]" ? true : false)
                ?
                (<div className="shoutout_btn_sticky d-flex flex-row flex-nowrap gap_8 card_bg p-2">
                  {profile?.shoutoutPrice?.price &&
                    <Button
                      fclassname="borderStrokeClr rounded-pill background_none w-100"
                      btnSpanClass="d-flex flex-row flex-nowrap text-nowrap gradient_text"
                      onClick={() => {
                        mobileView ? authenticate(router.asPath).then(() => {
                          open_drawer(
                            "Shoutout",
                            {
                              handleCloseDrawer: handleCloseDrawer,
                              profile: profile,
                            },
                            "right"
                          )
                        }) : authenticate(router.asPath).then(() => {
                          open_dialog("open_desktop_shoutout", {
                            otherprofile: profile,
                          })
                        });
                      }}>
                      {lang.shoutoutLabel}
                      {" "}
                      {profile?.shoutoutPrice?.price}
                      <Icon
                        icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                        size={18}
                        class="ml-1"
                        alt="follow icon"
                        viewBox="0 0 18 18"
                      />
                    </Button>}

                  {profile?.videoCallPrice?.price &&
                    <Button
                      type="button"
                      fclassname="btnGradient_bg rounded-pill p-2 w-100"
                      btnSpanClass="d-flex flex-row flex-nowrap text-nowrap"
                      onClick={handleBookVideoCall}
                    >
                      {lang.videoCall}
                      {" "}
                      {profile?.videoCallPrice?.price}
                      <Icon
                        icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                        size={18}
                        class="ml-1"
                        alt="follow icon"
                        viewBox="0 0 18 18"
                      />
                    </Button>}
                </div>)
                : ""
            }
            {(activeNavigationTab == 'grid_post' || activeNavigationTab == 'video_post' || activeNavigationTab == 'image_post' || activeNavigationTab == 'text_post' || activeNavigationTab == 'scheduled_post') &&
              <div className="d-flex col-12 pt-3 justify-content-between align-items-center" >
                <div className="d-flex gap_8 scroll-hide overflowX-auto">
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
                  <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} />
                </div>
              </div>}

            {!isLoading &&
              <ProfilePostGallery
                isSticky={isSticky}
                allPostCount={(postCount) => setPostCount(postCount)}
                activeNavigationTab={activeNavigationTab}
                userId={props.id}
                key={props.id}
                otherProfile={router?.pathname == "/[username]" ? true : false}
                homePageref={Pageref}
                avgRating={profile?.avgUserRating}
                reviewCount={profile?.userRatingCount}
                streamUserId={profile.isometrikUserId}
                otherPostSlider={true}
              />}
          </div>
          :

          <div
            id="profile_page_cont"
            ref={Pageref}
            className="vh-100 overflow-auto d-flex"
          >
            {/* <MarkatePlaceHeader
              setActiveState={props.setActiveState}
              {...props}
            /> */}
            <div style={{ width: '8%', minWidth: '6.3rem', maxWidth: '7rem', borderRight: '1.5px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100 specific_section_bg'>
              <DvSidebar />
            </div>
            <div className="d-flex justify-content-between m-auto" style={{ width: `${tabletView ? '90vw' : '89%'}` }}>
              <div className="col-12 px-0">
                <div
                  className={`col-12 websiteContainer position-relative other_profile px-0 pb-2 specific_section_bg borderStroke`}
                  style={{ borderRadius: '0px 0px 1rem 1rem', maxHeight: 'fit-content' }}
                >
                  {/* <div className="col-12 d-flex align-items-center py-2 px-0" style={{ position: "absolute", top: "27px", zIndex: "1" }}>
                    <div className="col-auto">
                      <div style={{ width: '115px', zIndex: "2" }} onClick={() => router.back()}>
                        <button
                          type="button"
                          className="px-2 position-relative otherProfileFollow blurBtn "
                        >
                          <div className="d-flex align-items-center">
                            <Icon
                              icon={`${PROFILE_BACK_ICON}#_Icons_Arrow_Left`}
                              size={12}
                              class="pr-2 pointer marginL pb-1"
                              alt="follow icon"
                              viewBox="0 0 40 40"
                              color="rgba(255,255,255,1)"

                            />
                            <span className="" style={{ fontWeight: "400" }}>
                              {btnLoading && (
                                <CircularProgress
                                  size={16}
                                  className="mr-2"
                                  style={{ position: "absolute", left: profile.isFollow ? "56px" : "40px", top: "12px" }}
                                />
                              )}
                              Back
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="col px-0">
                    </div>
                  </div> */}
                  <div
                    className={`row mv_pro_banner`}
                    style={{
                      backgroundImage: `linear-gradient(to top, #0000, #000000),url(${!profile.bannerImage
                        ? BANNER_PLACEHOLDER_IMAGE
                        : profileBanner
                        })`,
                      height: "calc(40vh + 90px)",
                      margin: "0px",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: '0px 0px 1rem 1rem'
                    }}
                  >
                    <div
                    ></div>
                    {!isLoading && <div
                      className={`d-flex p-0 align-items-center justify-content-center adjustGap`}
                      style={{ position: "absolute", right: "30px", top: "24px" }}
                    >
                      <div style={{ width: '115px', zIndex: "2" }}>
                        <button
                          type="button"
                          className="px-2 mt-3 position-relative otherProfileFollow blurBtn "
                          onClick={() => {
                            handleShareItem();
                          }
                          }
                        >
                          <div className="d-flex align-items-center">
                            <Icon
                              icon={`${PROFILE_SHARE_ICON_OUTLINE}#Group_55713`}
                              width={18}
                              height={20}
                              class="pr-1 pointer mb-1"
                              alt="follow icon"
                              viewBox="0 0 18 20"
                              color="rgba(255,255,255,1)"

                            />
                            <span className="" style={{ fontWeight: "400" }}>
                              {btnLoading && (
                                <CircularProgress
                                  size={16}
                                  className="mr-2"
                                  style={{ position: "absolute", left: profile.isFollow ? "56px" : "40px", top: "12px" }}
                                />
                              )}
                              Share
                            </span>
                          </div>
                        </button>
                      </div>


                      <div className="pointer pointer" style={{ width: '115px', zIndex: "2" }} onClick={() =>
                        authenticate(router.asPath).then(() => {
                          handleReportUser();
                        })
                      }>
                        <button
                          type="button"
                          className="px-2 mt-3 position-relative otherProfileFollow blurBtn paddingAdjustForInfo"
                        >
                          <div className="d-flex align-items-center">
                            <Icon
                              icon={`${DV_CHAT_ICON}#info`}
                              size={14}
                              class="pr-1 pointer adjustSvg mr-0 "
                              alt="follow icon"
                              viewBox="0 0 40 40"
                              color="white"

                            />
                            <span className="" style={{ fontWeight: "400" }}>
                              {btnLoading && (
                                <CircularProgress
                                  size={16}
                                  className="mr-2"
                                  style={{ position: "absolute", left: profile.isFollow ? "56px" : "40px", top: "12px" }}
                                />
                              )}
                              Report
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>}

                  </div>
                  <div
                    className={`col d-flex p-0 justify-content-between `}
                    style={{ height: "0.6rem" }}
                  >
                    {
                      (
                        <div className="position-relative" style={{ top: "-5rem", left: "8%", transform: "translate(-50%, -50%)" }}>
                          <OtherProfileStories
                            profile={profile}
                          />
                        </div >
                      )
                    }

                  </div >
                  {!isLoading && <div
                    className={`d-flex px-4 align-items-center justify-content-end adjustGap`}
                    style={{ position: 'inherit', zIndex: '9' }}
                  >
                    <div >
                      <Button
                        type="button"
                        fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                        leftIcon={{ src: PROFILE_ICON_OUTLINE, id: "Icon_feather-user-plus" }}
                        iconWidth={20}
                        iconHeight={20}
                        iconClass="mr-2"
                        iconViewBox="0 0 20 20"
                        onClick={() => {
                          authenticate(router.asPath).then(() => {
                            followUnfollowHandler();
                          });
                        }}
                        children={profile.isFollow ? lang.following : lang.follow}
                        isLoading={followLoading}
                      />
                    </div>

                    {/* sendTip Btn start*/}

                    <div>
                      <Button
                        type="button"
                        fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                        leftIcon={{ src: BOMBSCOIN_LOGO, id: "bombscoin" }}
                        iconWidth={18}
                        iconHeight={18}
                        iconClass="mr-2"
                        iconViewBox="0 0 20 20"
                        disabled={isAgency()}
                        onClick={() => {
                          authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                            !isAgency() && authenticate(router.asPath).then(() => {
                              open_dialog("sendTip", {
                                creatorId: profile._id,
                                creatorName: props.profileName,
                                trigger: 3,
                                page: "creatorProfile",
                                updateTip: (tipCount) =>
                                  updateTipHandler && updateTipHandler(tipCount),
                              });
                            })
                          })
                        }}
                        children={lang.sendTip}
                      />
                    </div>

                    <div>
                      <Button
                        type="button"
                        fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                        leftIcon={{ src: NAV_CHAT_ICON, id: "chat" }}
                        iconWidth={24}
                        iconHeight={24}
                        iconClass="mr-1"
                        iconViewBox="0 0 24 24"
                        onClick={() => {
                          authenticate(router.asPath).then(() => {
                            handleChat({ userId: profile?._id, userName: profile?.userName || profile?.username });
                          });
                        }}
                        children={lang.chatText}
                      />
                    </div>

                  </div>}
                  <div className="row mx-0 px-2" style={{ marginTop: '-1.5rem' }}>
                    <div
                      className={
                        mobileView
                          ? "col-auto p-0 pb-2"
                          : "websiteContainer pl-4 other_profile col-3"
                      }
                    >
                      <div className="d-flex align-items-center justify-content-start pt-2" style={{ gap: "7px" }}>
                        <h1 className="fntSz25 font-weight-600 txt-roboto mb-0">
                          {
                            (
                              <>
                                {profile?.userName || profile?.username}
                              </>
                            )
                          }
                        </h1>
                        <Image
                          src={Creator_Icon}
                          className="pointer diamond_icon_styling"
                          width={22}
                          height={22}
                        />
                      </div>
                      <div className="d-flex align-items-start  justify-content-center flex-column">
                        <h2 className="txt-roboto bck3 mb-0 fntlightGrey pt-2 fntSz17">
                          {(
                            <>
                              @{profile.username}
                            </>
                          )
                          }
                        </h2>
                        {/* <div className="px-1 d-flex align-items-center bck3" style={{ marginTop: '-10px', paddingTop: "10px" }}>.</div> */}
                        <div className="d-flex cursorPtr align-items-baseline bck3" style={{ paddingTop: "4px" }}
                          onClick={() => setActiveNavigationTab('review_tab')}
                        >
                          <Icon
                            icon={`${STAR_ICON_OTHERPROFIE}#Path_3684`}
                            size={15}
                            class="pointer d-flex align-items-center adjustPadding"
                            viewBox="0 0 13.815 13.138"
                          />
                          <span className="cursorPtr fntSz17 ml-1">{ratings || "0.00"}

                          </span>
                          <span className="position-relative mx-1 bck3 fntSz28">.</span>
                          <span className="fntSz17">{profile?.userRatingCount || 0} {lang.reviews}</span>
                        </div>
                      </div>
                    </div>
                    {profile.userTypeCode == 2 && <div className="col-9 d-flex align-items-end fntSz13 mb-2">
                      <div className="text-left " style={{ fontSize: '1vw', maxHeight: '4rem', overflowY: 'auto' }}>
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
                  <div className="row mx-0 px-2">
                    <div className="d-flex flex-column justify-content-start align-items-start pl-4 col-3">
                      <div className="listDiv pt-1 pl-1 mb-2">
                        {!isLoading &&
                          <FanFollowersList
                            followersCount={profile.totalFollower}
                            followingCount={profile.totalFollowing}
                            postCount={profile.postCount}
                            // showPosts={profile.userTypeCode == 1 ? false : true}
                            // showFollowers={profile.userTypeCode == 1 ? false : true}
                            otherProfile={router?.pathname == "/[username]" ? true : false}
                            showFollowers={true}
                            showFollowings={true}
                            // showFollowings={profile.userTypeCode == 1 ? true : false}
                            id={profile._id}
                            others={true}
                            isFollow={profile.isFollow}
                            bio={mobileView && profile.bio}
                            className="other_profile"
                          />}
                      </div>
                      <div>
                        {getSocialLink().map((linkObj) => (
                          <>
                            {linkObj.link && <Tooltip title={linkObj.label}>
                              <img
                                key={linkObj.id}
                                src={linkObj.logo}
                                height="40"
                                width="40"
                                className={`pr-2 ${linkObj.link ? "cursorPtr" : ""}`}
                                onClick={() => linkObj.link && window.open(`${linkObj?.link}`, '_blank')}
                                alt={`Social Media Icon of ${linkObj.label}`}
                              />
                            </Tooltip>}
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 col-9">
                      {!isLoading && <div className={"other_profile col-10 paddinglr0 "}  >
                        <HighlightedStories
                          setActiveState={(props) => {
                            scrollToView("scroll_to_top");
                            setActiveNavigationTab(props);
                          }}
                          otherProfile={profile}
                        />
                      </div>}
                    </div>
                  </div>
                </div >

                <StickyHeader stickyHandler={(flag) => setIsSticky(flag)} />
                <div className="pb-3 pt-1 card_bg" style={{ position: "sticky", top: "0px", zIndex: "3" }}>
                  {isSticky &&
                    <div
                      className="d-flex flex-column"
                    >
                      <div className="d-flex flex-row align-items-center">
                        <div className="pl-0">
                          <OtherProfileStories
                            profile={profile}
                            isStickyHeader={true}
                          />
                        </div>
                        <div className="col pr-0">
                          <div className="d-flex align-items-center mt-1">
                            <h1 className="fntSz18 txt-roboto mb-0 cursorPtr"
                              style={{ color: theme?.text }}
                              onClick={() => scrollToView("oth_pro_cont")}
                            >
                              {<>{profile?.userName || profile?.username}</>
                              }
                            </h1>
                            <Image
                              src={Creator_Icon}
                              className="pointer mx-2 mb-2"
                              width={20}
                              height={20}
                            />
                          </div>
                          <div className="d-flex align-items-center position-relative">
                            <h2 className="fntSz13 txt-roboto bck3 mb-0 fntlightGrey">
                              {(
                                <>
                                  <span>@{profile.username}</span>
                                </>
                              )
                              }
                              <span style={{ bottom: "0.2rem" }} className="position-relative mx-1">.</span>
                            </h2>
                            {" "}

                            <div className="d-flex align-items-center"
                              onClick={() => setActiveNavigationTab('review_tab')}
                            >
                              <Icon
                                icon={`${STAR_ICON_OTHERPROFIE}#Path_3684`}
                                size={15}
                                class="pointer d-flex align-items-center"
                                viewBox="0 0 13.815 13.138"
                              />
                              <span className="cursorPtr fntSz14 ml-1 bck3">{ratings || "0.00"}
                                <span style={{ bottom: "0.25rem" }} className="position-relative mx-1">.</span>
                                {profile?.userRatingCount || 0} {lang.reviews}</span>
                            </div>
                          </div>
                        </div>

                        {!isLoading && <div className="col-auto d-flex align-items-center pl-0"
                          style={{ height: "59px", gap: "20px" }}
                        >
                          <div >
                            <Button
                              type="button"
                              fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                              leftIcon={{ src: PROFILE_ICON_OUTLINE, id: "Icon_feather-user-plus" }}
                              iconWidth={20}
                              iconHeight={20}
                              iconClass="mr-2"
                              iconViewBox="0 0 20 20"
                              onClick={() => {
                                authenticate(router.asPath).then(() => {
                                  followUnfollowHandler();
                                });
                              }}
                              children={profile.isFollow ? lang.following : lang.follow}
                              isLoading={followLoading}
                            />
                          </div>

                          {/* sendTip Btn start*/}

                          <div>
                            <Button
                              type="button"
                              fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                              leftIcon={{ src: BOMBSCOIN_LOGO, id: "bombscoin" }}
                              iconWidth={18}
                              iconHeight={18}
                              iconClass="mr-2"
                              iconViewBox="0 0 20 20"
                              disabled={isAgency()}
                              onClick={() => {
                                authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                                  !isAgency() && authenticate(router.asPath).then(() => {
                                    open_dialog("sendTip", {
                                      creatorId: profile._id,
                                      creatorName: props.profileName,
                                      trigger: 3,
                                      page: "creatorProfile",
                                      updateTip: (tipCount) =>
                                        updateTipHandler && updateTipHandler(tipCount),
                                    });
                                  })
                                })
                              }}
                              children={lang.sendTip}
                            />
                          </div>

                          <div>
                            <Button
                              type="button"
                              fclassname="d-flex flex-row btnGradient_bg rounded-pill py-2"
                              leftIcon={{ src: NAV_CHAT_ICON, id: "chat" }}
                              iconWidth={24}
                              iconHeight={24}
                              iconClass="mr-1"
                              iconViewBox="0 0 24 24"
                              onClick={() => {
                                authenticate(router.asPath).then(() => {
                                  handleChat({ userId: profile?._id, userName: profile?.userName || profile?.username })
                                });
                              }}
                              children={lang.chatText}
                            />
                          </div>
                          <div className="d-flex flex-row gap_8">
                            <div className="borderStroke rounded-pill d-flex align-items-center justify-content-center" style={{ height: "32px", width: "32px" }}>
                              <Icon
                                icon={`${PROFILE_SHARE_ICON_OUTLINE}#Group_55713`}
                                width={22}
                                height={22}
                                class="cursorPtr"
                                alt="follow icon"
                                viewBox="0 0 20 22"
                                color="var(--l_app_text)"
                                onClick={() => {
                                  handleShareItem();
                                }
                                }
                              />
                            </div>
                            <div className="borderStroke rounded-pill d-flex align-items-center justify-content-center" style={{ height: "32px", width: "32px" }}>
                              <Icon
                                icon={`${DV_CHAT_ICON}#info`}
                                size={18}
                                class="cursorPtr"
                                alt="follow icon"
                                viewBox="0 0 18 18"
                                color="var(--l_app_text)"
                                onClick={() =>
                                  authenticate(router.asPath).then(() => {
                                    handleReportUser();
                                  })
                                }
                              />
                            </div>
                          </div>

                        </div>}
                      </div>
                      <ProfileNavigationTab
                        setActiveState={(props) => {
                          if (props === "review_tab" && !getCookie("auth")) return authenticate(router.asPath)
                          scrollToView("scroll_to_top");
                          setActiveNavigationTab(props);
                        }}
                        tabType={activeNavigationTab}
                        isSticky={isSticky}
                        userType={profile.userTypeCode}
                        key={profile.userTypeCode}
                        otherProfile={router?.pathname == "/[username]" ? true : false}
                        isOtherProfilePage={router?.pathname == "/[username]" ? true : false}
                        count={{ postCount: profile.postCount, shoutoutCount: profile.shoutoutCount, exclusivePostCount: profile.exclusivePostCount, recordedStreamCount: profile.recordedStreamCount, taggedCount: profile.taggedCount, reviewCount: profile.reviewCount }}
                      />
                    </div>}
                </div>
                <div className="col-12 mx-0 px-0">
                  <div className="col-12 mx-0 px-0">
                    {!isLoading && !isSticky && <div>
                      <ProfileNavigationTab
                        setActiveState={(props) => {
                          if (props === "review_tab" && !getCookie("auth")) return authenticate(router.asPath)
                          scrollToView("scroll_to_top");
                          setActiveNavigationTab(props);
                        }}
                        tabType={activeNavigationTab}
                        isSticky={isSticky}
                        userType={profile.userTypeCode}
                        key={profile.userTypeCode}
                        otherProfile={router?.pathname == "/[username]" ? true : false}
                        isOtherProfilePage={router?.pathname == "/[username]" ? true : false}
                        count={{ postCount: profile.postCount, shoutoutCount: profile.shoutoutCount, exclusivePostCount: profile.exclusivePostCount, recordedStreamCount: profile.recordedStreamCount, taggedCount: profile.taggedCount, reviewCount: profile.reviewCount }}
                      />
                    </div>}
                    {!isLoading && (activeNavigationTab == 'grid_post' || activeNavigationTab == 'video_post' || activeNavigationTab == 'image_post' || activeNavigationTab == "text_post")
                      && <div className="d-flex justify-content-between align-items-center col-9 mt-3 ml-auto px-4"
                      >
                        <div className="d-flex justify-content-start gap_8">
                          {postTypeList?.map((item, index) => {
                            return (
                              <div key={index}>
                                <Button
                                  type="button"
                                  fclassname={`${(activeNavigationTab == item?.label || activeNavigationTab == item?.navigationTab) ? "btnGradient_bg" : "background_none borderStroke"} rounded-pill py-2`}
                                  onClick={() => setActiveNavigationTab(item?.navigationTab)}
                                  children={`${item?.label} (${postCount?.[item?.count] || 0})`}
                                />
                              </div>
                            )
                          })}
                        </div>
                        <div className="pb-3 pr-1 otherProfile_Filter">
                          <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedValue(value)} />
                        </div>
                      </div>}
                    <div className="d-flex">
                      <div className="col-3 pl-1 stickyInfoDiv borderRight" style={(activeNavigationTab === "grid_post" || activeNavigationTab === 'video_post' || activeNavigationTab === 'image_post' || activeNavigationTab === 'text_post') ? { marginTop: "-55px", position: "sticky", top: "27vh", height: "71vh", overflowY: "scroll" } : { marginTop: "15px", position: "sticky", top: "39vh", height: "60vh", overflowY: "scroll" }} >

                        {(!!profile?.videoCallPrice?.price || !!profile?.shoutoutPrice?.isEnable) &&
                          <div className="tyryu stickySide pt-3">
                            <div className="w-100" onChange={handleChange()}>
                              <h6>{lang.virtualRequests} </h6>
                              {!!profile?.videoCallPrice?.price &&
                                <Button
                                  fclassname="cursorPtr btnGradient_bg rounded-pill py-2"
                                  btnSpanClass="d-flex flex-row justify-content-between align-items-center"
                                  onClick={handleBookVideoCall}
                                >
                                  <div className="">
                                    {lang.requestShoutoutVideo}
                                  </div>
                                  <div className="d-flex flex-row">
                                    {profile?.videoCallPrice?.price}
                                    <Icon
                                      icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                      size={18}
                                      class="ml-1"
                                      alt="follow icon"
                                      viewBox="0 0 18 18"
                                    />
                                  </div>
                                </Button>
                              }
                              {!!profile?.shoutoutPrice?.isEnable
                                &&
                                <Button
                                  fclassname="cursorPtr btnGradient_bg rounded-pill py-2 mt-2"
                                  btnSpanClass="d-flex flex-row justify-content-between align-items-center"
                                  onClick={handleShoutOut}
                                >
                                  <div className="">
                                    {lang.requestAShoutout}
                                  </div>
                                  <div className="d-flex flex-row">
                                    {profile?.shoutoutPrice?.price}
                                    <Icon
                                      icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                      size={18}
                                      class="ml-1"
                                      alt="follow icon"
                                      viewBox="0 0 18 18"
                                    />
                                  </div>
                                </Button>
                              }
                            </div>


                            {/* {profile?.videoCallPrice?.price || profile?.shoutoutPrice?.price ? <DvOtherProfileAbout
                            handleChange={handleChange}
                            lang={lang}
                            isLoading={isLoading}
                            profile={profile}
                            router={router}
                            handleBookVideoCall={handleBookVideoCall}
                            isRequestVideocall={isRequestVideocall}
                            handleShoutOut={isShoutoutEnabledApi}
                            socialLnkArr={socialLnkArr}
                            getSocialLink={getSocialLink}
                            theme={theme}
                            mobileView={mobileView}
                          />
                            : ""

                          } */}
                          </div>}

                        {(profile.isSubscribed || profile?.subscriptionData?.planEndTime || profile?.subscriptionData?.status) &&
                          <div
                            className="pt-3"
                          >

                            {profile?.subscriptionData?.status == "CANCELLED"
                              ? <>
                                <h6>{lang.ongoingSubscription}</h6>
                                <Button
                                  type="button"
                                  fclassname="btnGradient_bg rounded-pill py-2"
                                >
                                  {`${lang.planEndMsg} ${dayjs(profile?.subscriptionData?.planEndTime).format(
                                    "MMM DD, YYYY, hh:mm a"
                                  )}`}
                                </Button>
                              </>
                              : profile?.subscriptionData?.planCount <= 0
                                ? ""
                                :
                                <>
                                  {profile.isSubscribed && <h6>{lang.cancelSubscription}</h6>}

                                  <Button
                                    type="button"
                                    cssStyles={
                                      !profile.isSubscribed
                                        ? theme.blueButton
                                        : theme.blueBorderButton
                                    }
                                    fclassname={`rounded-pill py-2 ${!profile.isSubscribed ? "btnGradient_bg" : "background_none borderStrokeClr"}`}
                                    onClick={
                                      !profile.isSubscribed
                                        ? () => {
                                          authenticate(router.asPath).then(() => {
                                            handleSubscribeDrawer();
                                          });
                                        }
                                        : () => {
                                          authenticate(router.asPath).then(() => {
                                            GetCancelReasons();
                                          });
                                        }
                                    }
                                  >
                                    {!profile.isSubscribed ? lang.subscribe : lang.unSubscribe}
                                  </Button>
                                </>
                            }
                          </div>}


                        {!profile.isSubscribed && subSribePlan.length > 0 &&
                          <div className="pt-3">
                            <h6>{lang.subsPlans}</h6>
                            {subSribePlan?.map((plan, index) => (
                              <Button
                                fclassname="cursorPtr py-2 btnGradient_bg rounded-pill mb-2 overflow-hidden"
                                btnSpanClass="d-flex flex-row justify-content-between align-items-center text-nowrap"
                                onClick={() => {
                                  authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                                    !isAgency() && handleSelectionPlan(plan)
                                  })
                                }}
                              >
                                <div>
                                  {`${lang.subscribeFor} ${subscriptionPlanDurationText(plan)}`}
                                </div>
                                <div className="d-flex flex-row ml-1">
                                  ${plan.amount}
                                </div>
                              </Button>
                            ))}
                          </div>}

                        {/* Social Media Icons */}
                        <div>
                          {profile?.categoryData.length &&
                            <div className="pt-3">
                              <h6>{lang.categories}</h6>
                              <div className="d-flex flex-wrap mt-2 mb-1 gap_8">
                                {profile?.categoryData.map((category) => {
                                  return <p className="mb-0 borderStroke rounded-pill strong_app_text px-3 py-1 w-500 pointer">{category.title}</p>
                                })}
                              </div>
                            </div>}
                        </div>



                      </div>
                      <div className="col-9 mx-auto pl-3">
                        {!isLoading && <ProfilePostGallery
                          isSticky={isSticky}
                          allPostCount={(postCount) => setPostCount(postCount)}
                          activeNavigationTab={activeNavigationTab}
                          selectedValue={selectedValue}
                          userId={props.id}
                          key={props.id}
                          otherProfile={router?.pathname == "/[username]" ? true : false}
                          homePageref={Pageref}
                          streamUserId={profile.isometrikUserId}
                          size={50}
                          otherPostSlider={true}
                          setProfile={setProfile}
                          profile={profile}
                        />}
                      </div>
                    </div>
                  </div>
                </div>
              </div >

            </div >
          </div >}

      </div >

      <style jsx>{`
        :global(.prof_menu_icon) {
          margin-top: -16px !important;
        }
        :global(.prof_back_icon) {
          margin-top: -23px !important;
        }
        :global(.websiteContainer adjustWidth){
          width:100% !important;
        }
        :global(.padding_profile){
         padding-top:1rem!important;
        }
        .mv_pro_banner_overlay {
          background: #0000003d;
          height: 100%;
          width: 100%;
          border-radius: ${mobileView ? "0px" : '10px'};
        }
        .adjustGap{
          gap:1vw;
        }
        .manageAccordionBox{
          padding: 15px 0px;
          margin-top: 15px;
          border:none !important;
        }
        .stickyInfoDiv::-webkit-scrollbar { 
          display: none !important;  /* Safari and Chrome */
      }
        .activaLabel{
            background: ${theme.appColor};
            color: #fff;
            border-radius: 3px;
            padding: 1px 6px;
            font-size: 13px;
            text-align: center;
            border: 1px solid ${theme.appColor};
            font-weight:700;
        }
        .deactivaLabel{
            background: ${theme.drawerBackground};
            color:var(--l_app_text);
            border-radius: 3px;
            padding: 1px 6px;
            font-size: 13px;
            text-align: center;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
            font-weight:600;
        }
        .subPlanCss{
          box-shadow: ${theme.type == "light" ? `0px 2px 4px ${theme.palette.l_boxshadow1}` : `none`} ;
          border-radius: 7px;
          background-color: var(--l_profileCard_bgColor);
        }
        .subCssPlan{
          box-shadow: ${theme.type == "light" ? `0px 2px 4px ${theme.palette.l_boxshadow1}` : `none`} ;
          border-radius: 7px;
          background-color: #121212;
        }
        .boxShadowPlan{
          box-shadow: ${theme.type == "light" ? `rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px !important;` : `none`} ;
         
        }
        :global(.diamond_icon_styling) {
            // display: inline-block;
            // position: absolute;
            // top: 55px;
            // right: 2px;
        }
        .pb10{
          padding-bottom:10px !important;
        }
        .stickySide{
          // position:sticky;
          // top:157px;
        }
        :global(.requestShoutout) {
            height: "3.5rem";
            padding: 10px 10px;
            border-radius: 5px;
            line-height: 1.5;
        }
        :global(.MuiDivider-middle){
            margin-left: 1px;
            margin-right: 1px;
            background-color: ${theme.palette.l_light_grey};
        }
        .background {
            background: ${theme.appColor};
            border: 1px solid ${theme.appColor};
            color: ${theme.type == "light" ? theme.labelbg : "theme.labelbg"};
        }
        .shoutout_btn_sticky{
          position: fixed;
          width:100%;
          z-index: 100;
          bottom:0;
       }
       :global(.MuiPaper-elevation1){
        box-shadow:none !important;
       }
       :global(.MuiAccordionSummary-content.Mui-expanded){
        margin:0 !important;
       }
       :global(.MuiTypography-body1){
        width:100% !important;
       }
       :global(.MuiAccordionDetails-root){
        padding-left:16px !important;
        padding-right:16px !important;
       }
       :global(.MuiAccordionSummary-content){
        margin:5px 0px !important;
       }

       .shoutout_btn{
         border:1px solid var(--l_base);
         background-color: ${theme.type == "light" ? "#fff" : "#000"};
       }
       :global(.websiteContainer.other_profile){
       text-align: center !important;
       }
       :global(.dv__btm_nav_creator){
        bottom:${isSticky && mobileView && "90px"}
        z-index: 9999;
    }
    .border_box{
      border:1px solid var(--l_grey_border) ;
    }
    .adjustPadding{
      padding-top: 4px;
    }


    :global(.MuiAccordionSummary-expandIcon){
      position:absolute !important;
      top: 0px;
      left: 20vw;
      // bottom:${(expanded && !profile?.shoutoutPrice?.price || expanded && !profile?.videoCallPrice?.price) ? "-157px !important" : expanded ? "-137px !important" : "-15px !important"}
    }

    :global(.centerList > div > div){
      justify-content:start;
    }
    :global(.listDiv .manageBioWidth::-webkit-scrollbar ){ 
      display: none !important;  /* Safari and Chrome */
  }
    :global(.listDiv .manageBioWidth){
      width:60%;
      margin:auto;
      max-height: 77px;
    overflow-y: scroll;
    }


    .blurBtn{
      border-radius: 25px;
      border: none;
      background: rgba(0, 0, 0, 0.4);
      color:#fff;
      font-weight:500;
      display:flex;
      justify-content:center;
    }
    :global(.adjustSvg){
      width: 23px;
      height: 23px;
      margin-right: 5px;
    }
    :global(.postNavTab){
      padding: 9px 15px !important;
    }
    .margin18{
      margin-top: 18px !important
    }

    .paddingRight{
      padding-right:15px !important;
    }
    :global(.borderR30){
      border-radius:30px !important;
    }
    :global(.marginL){
      margin-left: -7px !important;
    }
    :global(.paddingAdjustForInfo){
      padding: 8px 0px !important;
    }
    :global(.adjustRadiusForBlur>div>div>div){
     border-radius:4px !important;
    }
    .padding3{
      padding: 0px 15px;
    }
    :global(.adjustLockPostText > div >div >span){
      font-size:0.7rem !important;
      background: transparent !important;
      color: white !important;
    }
    .categoryBtn{
      border: 1px solid #667491;
      padding: 5px 10px;
      border-radius: 20px;
      color: #667491;
    }
    .manageHighlight{
      margin-left: 100px !important;
    }
    .unsubscribe_category{
      background: #1E1C22;
      padding: 15px 10px;
      border-radius: 12px;
    }
      `}</style>
    </>
  );
}

// export async function getServerSideProps(ctx) {
ProfilePage.getInitialProps = async ({ Component, ctx, userToken }) => {
  const { query = {}, req, res } = ctx;
  if (!query.username || query.username === 'undefined') return { query };
  let token = userToken || getCookiees("token", req);
  const userCred = decodeURI(getCookiees("otherProfile", req))
  const selectedCreatorId = getCookiees("selectedCreatorId", req)
  const userName = userCred?.split("$$")[0]
  const userId = userCred?.split("$$")[1]
  const userType = getCookiees("userType", req);
  let id;
  if (userName == query.username) {
    id = userId;
  }
  else {
    if (!token && token == null) {
      const guestData = await guestLogin();
      token = guestData.token;
    } else {
      token = decodeURI(token);
    }
    let usernameId;
    try {
      usernameId = await getUserId(query.username, token);
    } catch (error) {
      console.log(error);
      return { query };
    }
    id = usernameId?.data?.data?.userId;
  }
  if (!id) return { query };
  const response = await getProfile(id, decodeURIComponent(token), selectedCreatorId);
  return {
    query: query,
    id: id,
    profileInfo: { ...response.data.data } || {},
    userToken: decodeURIComponent(token),
    otherProfileId: userId || id
  }
}