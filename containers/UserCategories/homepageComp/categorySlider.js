import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useLang from "../../../hooks/language";
import UserCategorySlider from "../userCategorySlider";
import CustomSlider from "../../../components/slider/slider";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import Image from "../../../components/image/image";
import { left_slick_arrow_dark, right_slick_arrow_dark } from "../../../lib/config/homepage";
import isTablet from "../../../hooks/isTablet";
const HorizonatalPagination = dynamic(
  () => import("../../../components/pagination/horizonatalPagination"),
  { ssr: false }
);
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});
const CustomDataLoader = dynamic(
  () => import("../../../components/loader/custom-data-loading"),
  { ssr: false }
);

const CategorySlider = (props) => {
  const { categories, isSkalaton, id, label, type } = props;
  const [lang] = useLang();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const theme = useTheme();
  const [count, setCount] = useState(0);


  useEffect(() => {
    if (count > 1) {
      pageEventHandler();
    }
  }, [count]);

  const settings = {
    slidesToShow: mobileView ? 6.2 : tabletView ? 6.2 : 6.2,
    dots: false,
    lazyLoad: true,
    initialSlide: 0,
    infinite: false,
    autoplay: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    afterChange: (current) => setCount(current),
    prevArrow: 
      <Image
        src={left_slick_arrow_dark}
        className="logoImg"
        alt="leftArrow"
      />,
    nextArrow: 
      <Image
        src={right_slick_arrow_dark}
        className="logoImg"
        alt="rightArrow"
      />
  };

  const pageEventHandler = async (e) => {
    // pagination will be here
    setIsLoading(false);
  };

  // directly get users as per selected option
  const getUsersCategory = (categoery, event) => {
    mobileView ? router.push(`/homepage/user_categories?caterory_label=${categoery.categoryTitle}&&id=${categoery?.categoryId}&&type=CategorySection&&isFromCategorySection=${true}`) : router.push(`/homepage/user_categories?caterory_label=${categoery.categoryTitle}&&id=${categoery?.categoryId}&&type=CategorySection`)
  };

  return (
    <React.Fragment>
      {!mobileView ? (
        <div className="col-12 p-0 pb-5">
          {categories && categories.length > 0 && (
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mv_subHeader mb-3 mt-3">{lang.categories}</h6>
              <p
                className="mb-3 mt-3 position-absolute fntSz16 font-weight-600 appTextColor cursorPtr"
                onClick={() => Router.push(`/homepage/category_list?caterory_label=${props.label}&&id=0&&type=${type}`)}
                // style={{ top: "3%", right: "7%"}}
                style={{ top: "3%", right: `${tabletView ? "8%" : "7%"}`}}
              >
                {lang.viewAll}
              </p>
            </div>
          )}

          <div className="col-12 p-0 userCatGlobal">
            {isSkalaton ? (
              <div className="row">
                {[...new Array(6)].map((item, index) => (
                  <div key={index} className={`${mobileView ? "col-6" : "col-2"} p-2`}>
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
              <CustomSlider settings={settings} className="categoryAspectRatio">
                {categories &&
                  categories.length > 0 &&
                  categories.map((data, index) => {
                    return (
                      <UserCategorySlider
                        key={index}
                        id={data._id}
                        setActiveState={props.setActiveState}
                        imageUrl={data.webUrl}
                        title={data.categoryTitle}
                        onClickHandler={(e) => getUsersCategory(data, e)}
                      />
                    );
                  })}
              </CustomSlider>
            )}
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-3">
          {categories && categories.length > 0 && (
            <div className="d-flex align-items-center justify-content-between">
              <p className="mv_subHeaderMobile fntSz24 mb-3 mt-3">{lang.categories}</p>
              <p
                className="mb-3 mt-3 app-link cursorPtr"
                onClick={() => Router.push(`/homepage/category_list?caterory_label=${props.label}&&id=0&&type=${type}`)}
              >
                {lang.viewAll}
              </p>
            </div>
          )}
          <div
            className="nav sliUL categorySliderCss"
            id="feat_category_list"
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            {isSkalaton ? (
              <>
                  {[...new Array(6)].map((skalaton, index) => (
                  <Skeleton
                    variant="rect"
                    width={133}
                    key={index}
                    height={155}
                    className="mx-2 feat_skelt bg-color"
                  />
                ))}
              </>
            ) : (
              <>
                {categories &&
                  categories.length > 0 &&
                  categories.map((data, index) => {
                    return (
                      <UserCategorySlider
                        key={index}
                        id={data._id}
                        setActiveState={props.setActiveState}
                        title={data.categoryTitle}
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
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -26% !important;
          left: 94% !important;
        }
        :global(.userCatGlobal .slick-next) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -26% !important;
          right: 20px !important;
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
          font-size: 25px;
        }
        :global(.userCatGlobal .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
          font-size: 25px;
        }
        :global(.categoryAspectRatio .slick-list){
          aspect-ratio: 633/62;
        }
        :global(.categoryAspectRatio .slick-track) {
          height: 100%;
        }
        :global(.categoryAspectRatio .slick-slide > div) {
          height: 100%;
        }
        .categorySliderCss{
          aspect-ratio: ${props?.aspectRatio.width}/${props?.aspectRatio.height};
        }
        .mv_subHeaderMobile{
          font-family: "Roboto", sans-serif !important;
        }
        @media (min-width: 700px) and (max-width: 991.98px){
          :global(.userCatGlobal .slick-next) {
            top: -40%!important;
            right: 0!important;;
          }
          :global(.userCatGlobal .slick-prev) {
            top: -40%!important;
            left: 93%!important;
          }
        }
      `}</style>
    </React.Fragment>
  );
};
export default CategorySlider;
