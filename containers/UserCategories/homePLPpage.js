import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import HorizonatalPagination from "../../components/pagination/horizonatalPagination";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import { getHomePageDataAction } from "../../redux/actions/dashboard/dashboardAction";
import ShoutoutFlowSection from "./shoutoutFlowSection/shoutoutFlowSection";
import UserBanner from "../../containers/UserCategories/userBanner"
import Skeleton from "@material-ui/lab/Skeleton"
import FeaturedMoment from "./featuredMoment"
import CategorySlider from "./homepageComp/categorySlider"
import ShoutoutProfileSlider from "./homepageComp/shoutoutProfileSlider"

const HomePLPpage = (props) => {
  const homepageData = useSelector(state => state.desktopData.homePageData.data);
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [isSkalaton, setIsSkalaton] = useState(!homepageData.length);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setpage] = useState(0);

  useEffect(() => {
    handleHomePageData();
  }, []);

  const handleHomePageData = async (page = 0) => {
    if (homepageData.length) return;
    setIsSkalaton(true);
    dispatch(getHomePageDataAction({ callBack: (_, success) => {
      if (success) {
        setIsSkalaton(false);
        props.displayFooter?.(true);
      } else {
        setIsSkalaton(false);
        props.displayFooter?.(false);
      }
    } }))
  };

  const handelPagination = (page) => {
    setpage(page);
    handleHomePageData(page);
  };

  const pageEventHandler = () => {
    setIsLoading(true);
  };

  const renderHomeData = (item) => {
    switch (item?.type) {
      case "SINGLE_IMAGE_BANNER":
        return (
          <UserBanner
            banners={item?.data}
            type={item?.type}
            key={item?._id}
            label={item?.title}
            isSkalaton={isSkalaton}
            id={item?._id}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
        );
      case "CATEGORY_SLIDER":
        return (
          <div className={`${mobileView ? "col-12" : "markatePlaceContainer"}`}>
          <CategorySlider
            categories={item?.data}
            type={item?.type}
            label={item?.title}
              key={item?._id}
            isSkalaton={isSkalaton}
            id={item?._id}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
          </div>
        );
      case "SHOUTOUT_PROFILE_SLIDER":
        return (
          <div className={`${mobileView ? "col-12" : "markatePlaceContainer"}`}>
          <ShoutoutProfileSlider
            data={item?.data}
            type={item?.type}
            label={item?.title}
            isSkalaton={isSkalaton}
              key={item?._id}
            id={item?._id}
            handelPagination={handelPagination}
            page={page}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
          </div>
        );
      case "VIDEO_CALL_PROFILE_SLIDER":
        return (
          <div className={`${mobileView ? "col-12" : "markatePlaceContainer"}`}>
          <ShoutoutProfileSlider
            data={item?.data}
            type={item?.type}
            label={item?.title}
            isSkalaton={isSkalaton}
              key={item?._id}
            id={item?._id}
            isVideoCallComp={true}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
          </div>
        );
      case "RECENTLY_VIEWED":
        return (
          <div className={`${mobileView ? "col-12" : "markatePlaceContainer"}`}>
          <ShoutoutProfileSlider
            data={item?.data}
            type={item?.type}
            label={item?.title}
              key={item?._id}
            isSkalaton={isSkalaton}
            id={item?._id}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
          </div>
        );
      case "SHOUTOUT_SLIDER":
        return (
          <div className={`${mobileView ? "col-12" : "markatePlaceContainer"}`}>
            <FeaturedMoment
            data={item?.data}
            type={item?.type}
            label={item?.title}
              key={item?._id}
            isSkalaton={isSkalaton}
            id={item?._id}
            aspectRatio={mobileView ? item?.appAspectRatio : item?.webAspectRatio}
            changeTheme={props?.changeTheme}
          />
            {!mobileView && <ShoutoutFlowSection />}
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <div className="nav sliUL" id="homepageData">
        <>
          {!isSkalaton ?
            homepageData.map((item) => renderHomeData(item)) :  
            <>
              <Skeleton
                variant="rect"
                width="100%"
                height={`${mobileView ? "460px" : "520px"}`}
                className="mx-2 feat_skelt bg-color imgStyle"
              />
              {[...new Array(4)].map((skalaton, index)=>(
                <>
                  {[...new Array(4)].map((item, index) => (
                    <div key={index} className={`${mobileView ? "col-6 pt-3" : "col-2 pt-3"} p-2`}>
                      <Skeleton
                        variant="rect"
                        width="100%"
                        height={mobileView ? 155 : 209}
                        className="imgStyle"
                        style={{
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))}
                </>
              ))}
            </>
          }
          <HorizonatalPagination
            pageEventHandler={!isLoading && pageEventHandler}
            id="homepageData"
          />
        </>
        <div className="feat_loader mx-2">
          {isLoading && <CustomDataLoader loading={true}></CustomDataLoader>}
        </div>
      </div>
    </Wrapper>
  );
};

export default HomePLPpage;
