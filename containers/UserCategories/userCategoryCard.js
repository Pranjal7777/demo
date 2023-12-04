import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Img from "../../components/ui/Img/Img";
import useLang from "../../hooks/language";
import { authenticate, startLoader, stopLoader } from "../../lib/global";
import { getCookie } from "../../lib/session";
import { getFeatureCreator } from "../../services/auth";
import { getPopularModals } from "../../services/user_category";
import { getCategories } from "../../services/user_category";
import UserCategorySlider from "./userCategorySlider";
import * as config from "../../lib/config";
import CustomSlider from "../../components/slider/slider";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";

const FeatureList = dynamic(
  () => import("../../components/timeline-control/feature-list"),
  { ssr: false }
);
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

const UserCategoryCardList = (props) => {
  const { handleRefresh } = props;
  const [lang] = useLang();
  const [page, setPage] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const uid = getCookie("uid");
  const router = useRouter();
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [count, setCount] = useState(0);

  useEffect(() => {
    startLoader();
    getUserCategories(0);
  }, []);

  useEffect(() => {
    if (count > 1) {
      pageEventHandler();
    }
  }, [count]);

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

  const getUserCategories = (pageCount) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
    };
    getCategories(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setCategoryList(res.data.data);
          } else {
            setCategoryList((prev) => [...prev, ...res.data.data]);
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
    getUserCategories(page + 1);
  };

  // directly get users as per selected option
  const getUsersCategory = (categoey, event) => {
      router.push(
        `/user_category/category_type/${categoey._id}?modal_type=${categoey.title}`
      );
  };

  return (
    <React.Fragment>
      {!mobileView ? (
        <div className="col-12 p-0 pb-4">
          {categoryList && categoryList.length > 0 && (
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mv_subHeader mb-3 mt-3">{lang.categories}</h6>
              <p
                className="mb-3 mt-3 app-link pr-5 cursorPtr"
                onClick={() =>
                    Router.push("/user_category/category_type")
                }
              >
                {lang.viewAll}
              </p>
            </div>
          )}

          <div className="col-12 p-0 userCatGlobal">
            {skeleton ? (
              <div className="row">
                {[...new Array(6)].map((item, index) => (
                  <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={115}
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
                {categoryList &&
                  categoryList.length > 0 &&
                  categoryList.map((data, index) => {
                    return (
                      <UserCategorySlider
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data._id}
                        categoryBanner={data.icon}
                        imageUrl={data.webUrl}
                        profilePic={data.icon}
                        title={data.title}
                        onClickHandler={(e) => getUsersCategory(data, e)}
                      />
                    );
                  })}
              </CustomSlider>
            )}
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-2">
          {categoryList && categoryList.length > 0 && (
            <div className="d-flex justify-content-between">
              <h6 className="mv_subHeader mb-3 mt-3">{lang.categories}</h6>
              <p
                className="mb-3 mt-3 app-link cursorPtr"
                onClick={() =>
                  Router.push("/user_category/category_type")
                }
              >
                {lang.viewAll}
              </p>
            </div>
          )}
          <div
            className="nav sliUL"
            id="feat_category_list"
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            {skeleton ? (
              <>
                {[...new Array(6)].map((skalaton) => (
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
                {categoryList &&
                  categoryList.length > 0 &&
                  categoryList.map((data, index) => {
                    return (
                      <UserCategorySlider
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data._id}
                        categoryBanner={data.icon}
                        profilePic={data.icon}
                        title={data.title}
                        imageUrl={data.appUrl}
                        onClickHandler={(e) => getUsersCategory(data, e)}
                      />
                    );
                  })}
                <HorizonatalPagination
                  pageEventHandler={!isLoading && pageEventHandler}
                  id="feat_category_list"
                ></HorizonatalPagination>
              </>
            )}
            <div className="mx-2">
              {isLoading && (
                <CustomDataLoader loading={true}></CustomDataLoader>
              )}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .feat_skelt {
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

        :global(.userCatGlobal .slick-prev) {
          width: 14px !important;
          cursor: pointer;
          top: -21% !important;
          left: 97% !important;
        }

        :global(.userCatGlobal .slick-next) {
          width: 14px !important;
          cursor: pointer;
          top: -21% !important;
          right: 3px;
        }

        :global(.userCatGlobal .slick-track) {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin: 0;
        }

        :global(.userCatGlobal .slick-prev:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }

        :global(.userCatGlobal .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }
      `}</style>
    </React.Fragment>
  );
};
export default UserCategoryCardList;
