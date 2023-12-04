import React, { useState, useEffect } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import { getCookie } from "../../lib/session";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";
import { close_drawer, open_drawer, startLoader, stopLoader } from "../../lib/global";
import { getShoutoutReviewList } from "../../services/shoutout";
import useLang from "../../hooks/language";
import RatingComp from "../dialog/rateCreaterShoutout/ratingComponent";
import {
  backArrow,
  HUMBERGER_ICON,
  reviewShuotoutIcon,
  shoutout_review_placeholder,
} from "../../lib/config";
import {
  formatDate,
  getDayDifference,
} from "../../lib/date-operation/date-operation";
import Wrapper from "../../hoc/Wrapper";
import Icon from "../../components/image/icon";
import Header from "../../components/header/header";
import { getProfile } from "../../services/profile";
import useProfileData from "../../hooks/useProfileData";
import { isAgency } from "../../lib/config/creds";

const ReviewTab = (props) => {
  const { avgRating, reviewCount, isCreatorSelf = true } = props;
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [shoutoutReview, setShoutoutReview] = useState([]);
  const [creatorProfile, setCreatorProfile] = useState({});
  const ChangeTheme = useSelector((state) => state?.commonUtility?.changeThemeUtility);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const auth = getCookie("auth");
  const [profileData] = useProfileData();

  const handleCreatorProfile = async () => {
    try {
      const token = getCookie("token");
      const uid = isCreatorSelf ? (isAgency() ? selectedCreatorId : profileData?._id) : props.userId;
      const response = await getProfile(uid, token, getCookie('selectedCreatorId'));
      setCreatorProfile(response?.data?.data)
    } catch (e) {
      console.error("Error in handleCreatorProfile", e)
    }
  }


  useEffect(() => {
    handleShoutoutReview();
    handleCreatorProfile();
  }, []);

  const handleShoutoutReview = async () => {
    startLoader();
    try {
      const payload = {
        limit: 20,
        offset: 0,
        userId: props?.userId || (isAgency() ? selectedCreatorId : getCookie("uid")),
      };
      const res = await getShoutoutReviewList(payload);
      const data = res?.data?.data;
      setShoutoutReview([...data]);
      stopLoader();
    } catch (e) {
      stopLoader();
      console.error("Error in handleShoutoutReview", e);
    }
  };

  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      {
        paperClass: "backNavMenu",
        setActiveState: props.setActiveState,
        changeTheme: ChangeTheme,
      },
      "right"
    );
  };

  const handleGuestNavigationMenu = () => {
    open_drawer("GuestSideNavMenu",
      { paperClass: "backNavMenu", setActiveState: props.setActiveState },
      "right"
    );
  };

  const hasDecimal = (number) => {
    return number % 1 !== 0;
  }

  const roundToHalf = (number) => {
    if (hasDecimal(number)) {
      let newNum = Math.floor(number)
      // console.log(newNum,"floorValue")
      return newNum + 0.5
    }
    else {
      return number
    }
  }

  return (
    <Wrapper>
      {mobileView && isCreatorSelf ? (
        <Wrapper>
          <div className="overflow-auto h-100">
            <div
              className="position-sticky w-100"
              style={{ zIndex: "99", top: "0", background: theme.background }}
            >
              <div className="d-flex align-items-center py-3 col-auto col-12">
                <Icon
                  icon={`${backArrow}#left_back_arrow`}
                  color={theme.text}
                  width={24}
                  height={30}
                  onClick={() => {
                    close_drawer("reviewShoutout");
                    Router.push("/");
                  }}
                />
                <p className="text-center fntSz22 appTextColor m-0 col pl-0 font-weight-700">
                  {lang.myReview}
                </p>
                <Icon
                  icon={`${HUMBERGER_ICON}#humberger_menu`}
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
              {shoutoutReview.length > 0 && <>
                <div className="col-12 mt-2 justify-content-center">
                  {creatorProfile?.avgUserRating && <RatingComp
                    value={
                      hasDecimal(creatorProfile?.avgUserRating)
                        ? roundToHalf(creatorProfile?.avgUserRating)
                        : creatorProfile?.avgUserRating
                    }
                    isReviewTab={true}
                    isOtherProfilePage={Router.router.pathname == "/[username]"}
                    ratingCountDisplay={false}
                    fontSize="28px"
                    isCreatorSelf={isCreatorSelf}
                    isCreatorMobile={true}
                    className="justify-content-left"
                  />}
                </div>
                <div className="d-flex align-items-center justify-content-left pl-4">
                  <p className="m-0 fntSz22 appTextColor font-weight-700">
                    {creatorProfile?.avgUserRating?.toFixed(2)}
                  </p>
                  <p className="m-0 pl-2 fntSz18 appTextColor font-weight-600">●</p>
                  <p className="m-0 pl-2 fntSz22 appTextColor font-weight-700">
                    {creatorProfile?.userRatingCount || 0}{" "}
                    <span className="font-weight-500 appTextColor">
                      {lang.ratings}
                    </span>
                  </p>
                </div>
                <div className="mt-4"></div></>}

            </div>
            <div className="px-2" style={{ overflow: "hidden" }}>
              {shoutoutReview.length > 0 ?
                shoutoutReview.map((item) => (
                  <>
                    <div
                      className={`col-12 d-flex px-2 align-items-center ${isCreatorSelf ? "mt-3 py-3" : "py-3"
                        } mb-3 ratingContainer`}
                    >
                      <div className="col-4 p-0 d-flex flex-column">
                        <div className="mb-2">
                          <p className="m-0 nameLabelCss">
                            {item.fullName[0].toUpperCase()}
                          </p>
                        </div>
                        <div
                          className={`${isCreatorSelf ? "fntSz13 fntWeight600" : ""
                            } appTextColor`}
                        >
                          {item.fullName}
                        </div>
                        <div
                          className={`${isCreatorSelf ? "fntSz12 fntWeight400" : ""
                            } appTextColor`}
                        >
                          {getDayDifference(item?.ratedTs) == 0
                            ? lang.today
                            : `${getDayDifference(item?.ratedTs)} ${lang.daysAgo}`}
                        </div>
                      </div>
                      <div className="col-8 d-flex flex-column p-1">
                        <div className="d-flex flex-row">
                          <RatingComp
                            value={
                              hasDecimal(item.rating)
                                ? roundToHalf(item.rating)
                                : item.rating
                            }
                            isReviewTab={true}
                            isOtherProfilePage={
                              Router.router.pathname == "/[username]"
                            }
                            isCreatorSelf={isCreatorSelf}
                            className="pt-1"
                            showDots={true}
                          />
                          {isCreatorSelf && (
                            <div
                              className="d-flex ml-4"
                            // style={{ height: "72px" }}
                            >
                              <div className={`reviewLabel ${mobileView ? "px-1" : "px-3"} d-flex align-items-center`}>
                                <Icon
                                  icon={`${reviewShuotoutIcon}#reviewShuotoutIcon`}
                                  width={18}
                                  height={18}
                                  unit="px"
                                  alt="shoutout label"
                                  viewBox="0 1 13.689 10.725"
                                />
                                <p className="m-0 pl-1 fntSz12">{item.orderType === "VIDEO_CALL" ? lang.videoCall : lang.shoutoutLabel}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {isCreatorSelf && (
                          <div className="text-muted fntSz12 font-weight-400 pt-2">
                            {lang.shoutoutId} {item?.virtualOrderId}
                          </div>
                        )}
                        <div
                          className={`${isCreatorSelf ? "pt-2 fntSz14 text-break" : ""
                            } appTextColor`}
                        >
                          {item.review}
                        </div>
                      </div>

                    </div>
                  </>
                )) : (

                  <div
                    className={`w-100 vh-100 d-flex justify-content-center align-items-center`}
                  >
                    <Icon
                      icon={`${shoutout_review_placeholder}#reviePlaceholder`}
                      color={theme.text}
                      width={140}
                      height={80}
                      alt="No shoutouts reviews to display"
                      class="m-0"
                      viewBox="0 0 70.208 58.496"
                    />
                    <h5 className="mt-3 appTextColor">{lang.noReview}</h5>
                  </div>
                )}
            </div>
          </div>
        </Wrapper>
      ) : (
        <>
          {/* {shoutoutReview.length > 0 && !isCreatorSelf && (
            <h3 className={`appTextColor ${mobileView ? "px-2 py-0 m-0 fntSz18 review_margin" : "review_margin"}`}
              style={{ background: mobileView ? theme.sectionBackground : "" }}
            >
              {lang.reviews}
            </h3>
          )} */}
          {/* {isCreatorSelf && (
            <h3
              className={`appTextColor ${mobileView ? "px-2 fntSz18" : "pt-4 px-3 font-weight-700 fntSz20"
                }`}
            >
              {lang.myReview}
            </h3>
          )} */}
          {!isCreatorSelf && !mobileView && (
            <div className="mt-3 d-flex flex-column mb-3" style={{ paddingBottom: "10px", borderBottom: "3px solid var(--l_input_bg)" }}>
              {props?.profile?.avgUserRating && <RatingComp
                value={
                  hasDecimal(props?.profile?.avgUserRating)
                    ? roundToHalf(props?.profile?.avgUserRating)
                    : props?.profile?.avgUserRating
                }
                isReviewTab={true}
                isOtherProfilePage={Router.router.pathname == "/[username]"}
                ratingCountDisplay={false}
                fontSize="50px"
                isCreatorSelf={isCreatorSelf}
                  starSize={'2.2rem'}
              />}
              <div className="d-flex align-items-center">
                <div className="d-flex m-0">
                    <p className="m-0 font-weight-700 fntSz20">
                    {props?.profile?.avgUserRating?.toFixed(2)}
                  </p>
                  <span className="font-weight-700 fntSz9 mx-2 my-auto">●</span>
                    <p className="m-0 font-weight-700 fntSz20">
                    <span className="font-weight-500 mr-1">{shoutoutReview?.length || 0}</span>
                    {lang.reviews}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isCreatorSelf && shoutoutReview.length > 0 && (
            <div className="pt-2 d-flex px-3 flex-column">
              {creatorProfile?.avgUserRating && <RatingComp
                value={
                  hasDecimal(creatorProfile?.avgUserRating)
                    ? roundToHalf(creatorProfile?.avgUserRating)
                    : creatorProfile?.avgUserRating
                }
                isReviewTab={true}
                isOtherProfilePage={Router.router.pathname == "/[username]"}
                ratingCountDisplay={false}
                fontSize="30px"
                isCreatorSelf={isCreatorSelf}
                starSize={"2.5rem"}
              />}
              <div className="d-flex align-items-center">
                <div className="d-flex m-0">
                  <p className="m-0 font-weight-500">
                    {creatorProfile?.avgUserRating?.toFixed(2)}
                  </p>
                  <span className="font-weight-700 fntSz14 mx-2">●</span>
                  <p className="m-0">
                    <span className="font-weight-700 mr-1">{creatorProfile?.userRatingCount || 0}</span>
                    {lang.reviews}
                  </p>
                </div>
                {/* <div className="col-auto px-1 d-flex m-0">●</div> */}
                {/* <div>
                  <div className="d-flex m-0">
                    <p className="m-0 font-weight-700">
                      {creatorProfile?.userRatingCount?.toFixed(0) || 0}
                    </p>
                    <p className="m-0 pl-1">{lang.ratings}</p>
                  </div>
                </div> */}
              </div>
            </div>
          )}
          {mobileView && <Header back={props.onClose} title={"Reivew"}></Header>}
          {mobileView && shoutoutReview.length > 0 && (
            <div className={`px-2 ${!mobileView ? "pt-4" : `${Router.router.pathname !== "/[username]" && "pt80"} mb-2`} pb-3`}
            >
              {creatorProfile?.avgUserRating && <RatingComp
                value={
                  hasDecimal(creatorProfile?.avgUserRating)
                    ? roundToHalf(creatorProfile?.avgUserRating)
                    : creatorProfile?.avgUserRating
                }
                isReviewTab={true}
                isOtherProfilePage={Router.router.pathname == "/[username]"}
                ratingCountDisplay={false}
                  starSize={'2rem'}
              />}
              <div className="d-flex px-1">
                <p className="m-0 fntSz17 fntWeight600 text-app">
                  {avgRating?.toFixed(2) || creatorProfile?.avgUserRating?.toFixed(2) || "0.00"}
                </p>
                  <div className="col-auto px-2 d-flex m-0 text-app">●</div>
                <p className="m-0 fntSz17 fntWeight600 text-app">
                  {reviewCount ||
                    (shoutoutReview.length > 0 && shoutoutReview.length) ||
                    0}{" "}
                  <span className="fntSz15">{lang.ratings}</span>
                </p>
              </div>
            </div>
          )}
          <div className={`${mobileView ? "px-2 pb-2" : "px-sm-3 px-md-0"} ${isCreatorSelf ? "px-lg-3" : "pl-0"}`}>
            {shoutoutReview.length > 0 ? (
              shoutoutReview.map((item, index) => (
                <div
                  className={`col-12 d-flex  setAlign ${isCreatorSelf ? "mt-3 py-3" : ""
                    } mb-3 ratingContainer px-0`}
                >

                  <div className="ProfileDetail">

                    <div className="">
                      <p className="m-0 nameLabelCss">
                        {item.fullName[0].toUpperCase()}
                      </p>
                    </div>
                    <div className="nameAndDate">
                      <div className="d-flex flex-column px-1">

                        <div
                          className={`${isCreatorSelf ? "fntSz16 fntWeight600" : ""
                            } appTextColor`}
                        >
                          {item.fullName}
                        </div>
                        <div
                          className={`${isCreatorSelf ? "fntSz12 fntWeight400" : ""
                            } appTextColor fntSz12 greyColor`}
                        >
                          {getDayDifference(item?.ratedTs) == 0
                            ? lang.today
                            : `${getDayDifference(item?.ratedTs)} ${lang.daysAgo}`}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className=" d-flex flex-column px-1">
                    <div>
                      <RatingComp
                        value={
                          hasDecimal(item.rating)
                            ? roundToHalf(item.rating)
                            : item.rating
                        }
                        isReviewTab={true}
                        isOtherProfilePage={
                          Router.router.pathname == "/[username]"
                        }
                        isCreatorSelf={isCreatorSelf}
                        showDots={true}
                        managePaddingDv={true}
                      />

                    </div>
                    {isCreatorSelf && (
                      <div className="appTextColor fntSz12 font-weight-400">
                        {lang.shoutoutId} {item?.virtualOrderId}
                      </div>
                    )}
                    <div
                      className={`${isCreatorSelf ? "pt-2 fntSz14" : ""
                        } appTextColor`}
                    >
                      {item.review}
                    </div>
                  </div>
                  {isCreatorSelf && (
                    <div
                      className="d-flex col-auto px-1"
                    // style={{ height: "72px" }}
                    >
                      <div className={`reviewLabel ${mobileView ? "px-2" : "px-3"} d-flex align-items-center`}>
                        <Icon
                          icon={`${reviewShuotoutIcon}#reviewShuotoutIcon`}
                          width={18}
                          height={18}
                          unit="px"
                          alt="shoutout label"
                          viewBox="0 1 13.689 10.725"
                        />
                        <p className="m-0 pl-1 fntSz12">{item.orderType === "VIDEO_CALL" ? lang.videoCall : lang.shoutoutLabel}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>
                {mobileView && Router.router.pathname !== "/[username]" && <Icon
                  icon={`${backArrow}#left_back_arrow`}
                  color={theme.text}
                  width={24}
                  height={30}
                  class="pl-3 pt-3"
                  onClick={() => {
                    close_drawer("reviewShoutout");
                    Router.push("/");
                  }}
                />}
                <div
                  className={`w-100 ${mobileView ? "my-5" : "pt-5 mt-5"
                    } text-center`}
                >

                  <Icon
                    icon={`${shoutout_review_placeholder}#reviePlaceholder`}
                    color={theme.text}
                    width={140}
                    height={80}
                    alt="No shoutouts reviews to display"
                    class="m-0"
                    viewBox="0 0 70.208 58.496"
                  />
                  <h5 className="mt-3 appTextColor">{lang.noReview}</h5>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .ratingContainer { 
          border-radius: 0px;
          border-bottom: 1px solid var(--l_input_bg);

        }
        .nameLabelCss {
          width: ${mobileView ? "29px" : "44px"};
          height: ${!mobileView && "44px"};
          background: ${theme.appColor};
          border-radius: 50%;
          display: flex;
          justify-content: center;
          font-size: ${mobileView ? "19px" : "15px"};
          color: #fff;
          align-items: center;
        }
        .reviewLabel {
          background: ${theme.background};
          color: ${theme.appColor};
          height: 29px;
          border-radius: 9px;
        }
        .setAlign{
          flex-direction: column;
          gap: 10px;
          padding-bottom: 10px;
        }
        .ProfileDetail{
          display: flex;
          align-items: center;
          gap:5px;
        }
        .reviewTag{
          height: 30px;
          background: var(--l_base_light);
          border-radius: 30px;
          color: ${theme.appColor}
        }
        .pt80{
        padding-top: 80px !important
        }
        .review_margin{
          margin:${mobileView ? (`${!props.isSticky ? "85px 0px 0px 0px !important" : ""}`) : "10px 0px 0px 0px !important;"}
        }

        @media (min-width: 700px) and (max-width: 991.98px){
          .reviewLabel {
            left: -1rem;
            position: relative;
          }
        }
        
      `}</style>
    </Wrapper>
  );
};

export default ReviewTab;
