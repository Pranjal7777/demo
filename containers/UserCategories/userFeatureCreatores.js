import dynamic from "next/dynamic";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import { startLoader, stopLoader, authenticate } from "../../lib/global";
import { getCookie } from "../../lib/session";
import { getFeatureCreator } from "../../services/auth";
import {  getPopularModals } from "../../services/user_category";
import UserCategoryCard from "./userCategoryList";
import isMobile from "../../hooks/isMobile";
import CustomSlider from "../../components/slider/slider";
import { useTheme } from "react-jss";

const HorizonatalPagination = dynamic(
  () => import("../../components/pagination/horizonatalPagination"),
  { ssr: false }
);
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});
const CustomDataLoader = dynamic(
  () => import("../../components/loader/custom-data-loading"),
  { ssr: false }
);

const UserFeatureCreatores = (props) => {
  const [lang] = useLang();
  const [page, setPage] = useState(0);
  const [featureCreatorList, setFeatureCreatorList] = useState([]);
  const [popularCreatorList, setPopularCreatorList] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const uid = getCookie("uid");
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [count, setCount] = useState(0);

  useEffect(() => {
    startLoader();
    props.isFeatured ? getFeaturedCreatorsList(0) : getPopularUserModals(0);
  }, []);

  const settings = {
    slidesToShow: 6.2,
    dots: false,
    lazyLoad: true,
    initialSlide: 0,
    infinite: false,
    autoplay: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    afterChange: (current) => setCount(current),
  };

  useEffect(() => {
    if (count > 1) {
      pageEventHandler();
    }
  }, [count]);

  const getPopularUserModals = (pageCount) => {
    const list = {
      userId: uid,
      limit: 10,
      skip: pageCount * 10,
    };

    getPopularModals(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setPopularCreatorList(res.data.data);
          } else {
            setPopularCreatorList((prev) => [...prev, ...res.data.data]);
          }
        }
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setIsLoading(false);
      })
      .catch(async (err) => {
        stopLoader();
        setSkeleton(false);
        setIsLoading(false);
        console.error(err);
      });
  };

  const getFeaturedCreatorsList = (pageCount = 0) => {
    const list = {
      country: "INDIA",
      limit: 10,
      offset: pageCount * 10,
    };
    getFeatureCreator(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setFeatureCreatorList(res.data.data);
          } else {
            setFeatureCreatorList((prev) => [...prev, ...res.data.data]);
          }
        }
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setIsLoading(false);
      })
      .catch(async (err) => {
        stopLoader();
        setSkeleton(false);
        setIsLoading(false);
        console.error(err);
      });
  };

  const pageEventHandler = async (e) => {
    setIsLoading(true);
    props.isFeatured
      ? getFeaturedCreatorsList(page + 1)
      : getPopularUserModals(page + 1);
  };

  return (
    <React.Fragment>
      {!mobileView ? (
        <div className="col-12 p-0 pb-4">
          {((featureCreatorList && featureCreatorList.length > 0) ||
            (popularCreatorList && popularCreatorList.length > 0)) && (
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mv_subHeader mb-3 mt-3">
                {props.isFeatured ? lang.featured : lang.popular}
              </h6>
              <p
                className="mb-3 mt-3 app-link pr-5 cursorPtr"
                onClick={() =>
                    props.isFeatured
                      ? Router.push("/user_category/featured-creators")
                      : Router.push("/user_category/popular-creators")
                }
              >
                {lang.viewAll}
              </p>
            </div>
          )}
          <div className="col-12 globalTrack">
            {skeleton ? (
              <div className="row">
                {[...new Array(6)].map((item, index) => (
                  <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={209}
                      className="imgStyle"
                      style={{
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <CustomSlider settings={settings} className="m-0">
                {props.isFeatured
                  ? featureCreatorList &&
                    featureCreatorList.length > 0 &&
                    featureCreatorList.map((data, index) => (
                      <UserCategoryCard
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data.userId || data.user_id}
                        bannerImage={data.bannerImage || data.profilePic}
                        profilePic={data.profilePic}
                        fullName={data.fullName || data.lastName}
                        username={data.username}
                      />
                    ))
                  : popularCreatorList &&
                    popularCreatorList.length > 0 &&
                    popularCreatorList.map((data, index) => {
                      return (
                        <UserCategoryCard
                          key={index}
                          id={index}
                          setActiveState={props.setActiveState}
                          userId={data.user_id}
                          bannerImage={data.profilePic}
                          profilePic={data.profilePic}
                          fullName={`${data.firstName} ${data.lastName}`}
                          username={`${data.firstName} ${data.lastName}`}
                        />
                      );
                    })}
              </CustomSlider>
            )}
          </div>
          <div className="mx-2">
            {isLoading && <CustomDataLoader loading={true}></CustomDataLoader>}
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-2">
          {((featureCreatorList && featureCreatorList.length > 0) ||
            (popularCreatorList && popularCreatorList.length > 0)) && (
            <div className="d-flex justify-content-between">
              <h6 className="mv_subHeader mb-3 mt-3">
                {props.isFeatured ? lang.featured : lang.popular}
              </h6>
              <p
                className="mb-3 mt-3 app-link cursorPtr"
                onClick={() =>
                    props.isFeatured
                      ? Router.push("/user_category/featured-creators")
                      : Router.push("/user_category/popular-creators")
                }
              >
                {lang.viewAll}
              </p>
            </div>
          )}
          <div
            className="nav sliUL"
            id={`${
              props.isFeatured ? "feat_creator_list" : "feat_popular_list"
            }`}
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            {skeleton ? (
              <>
                {[...new Array(3)].map((skalaton) => (
                  <Skeleton
                    variant="rect"
                    width={133}
                    height={155}
                    className="mx-2 feat_skelt bg-color"
                  />
                ))}
              </>
            ) : (
              <>
                {props.isFeatured
                  ? featureCreatorList &&
                    featureCreatorList.map((data, index) => {
                      return (
                        <UserCategoryCard
                          key={index}
                          id={index}
                          setActiveState={props.setActiveState}
                          userId={data.userId || data.user_id}
                          bannerImage={data.bannerImage || data.profilePic}
                          profilePic={data.profilePic ||data.bannerImage}
                          fullName={data.fullName || data.lastName}
                          username={data.username}
                        />
                      );
                    })
                  : popularCreatorList &&
                    popularCreatorList.length > 0 &&
                    popularCreatorList.map((data, index) => {
                      return (
                        <UserCategoryCard
                          key={index}
                          id={index}
                          setActiveState={props.setActiveState}
                          userId={data.user_id}
                          bannerImage={data.bannerImage || data.profilePic}
                          profilePic={data.profilePic ||data.bannerImage}
                          fullName={`${data.firstName} ${data.lastName}`}
                          username={`${data.firstName} ${data.lastName}`}
                        />
                      );
                    })}
                <HorizonatalPagination
                  pageEventHandler={!isLoading && pageEventHandler}
                  id={`${
                    props.isFeatured ? "feat_creator_list" : "feat_popular_list"
                  }`}
                ></HorizonatalPagination>
              </>
            )}
            <div className="feat_loader mx-2">
              {isLoading && (
                <CustomDataLoader loading={true}></CustomDataLoader>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.sliUL .feat_skelt) {
          min-width: 133px;
          border-radius: 8px;
        }

        .feat_loader {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(90deg);
        }

        :global(.MuiSkeleton-root, .bg-color) {
          background-color: #00000094 !important;
        }

        :global(.globalTrack .slick-prev) {
          width: 14px !important;
          cursor: pointer;
          top: -8% !important;
          left: 98% !important;
        }

        :global(.globalTrack .slick-next) {
          width: 14px !important;
          cursor: pointer;
          top: -8% !important;
          right: -18px;
        }

        :global(.globalTrack .slick-track) {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin: 0;
        }

        :global(.globalTrack .slick-prev:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }

        :global(.globalTrack .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }
      `}</style>
    </React.Fragment>
  );
};
export default UserFeatureCreatores;
