import React, { useState } from "react";
import Router from "next/router";
import CustomSlider from "../../components/slider/slider";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import {
  live_user1,
  live_user2,
  live_user3,
  live_user4,
  live_user5,
  live_user6,
  live_user7,
  live_user8,
  live_user9,
  live_user10,
  live_user11,
  tagIcon,
  user_category_time,
} from "../../lib/config";
import { useTheme } from "react-jss";
import { Skeleton } from "@material-ui/lab";
import HorizonatalPagination from "../../components/pagination/horizonatalPagination";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Icon from "../../components/image/icon";

const AllCategoryUser = (props) => {
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [skeleton, setSkeleton] = useState(false);
  const [lang] = useLang();
  const [liveMoment, setLiveMoment] = useState([
    live_user1,
    live_user2,
    live_user3,
    live_user4,
    live_user5,
    live_user6,
    live_user7,
    live_user8,
    live_user9,
    live_user10,
    live_user11,
  ]);
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
  };
  return (
    <Wrapper>
      {!mobileView ? (
        <div className="col-12 px-0 pb-2 pt-3">
          <div className="d-flex justify-content-between">
            <h6 className="mv_subHeader mb-3 mt-3">{props.label}</h6>
            <p
              className="mb-3 mt-3 app-link pr-5 cursorPtr"
              onClick={() =>
                Router.push(
                  `/user_category/user_avilabel_categories?caterory_label=${props.label}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
          <div className="globalSlickArrow px-2">
            <CustomSlider settings={settings} className="m-0">
              {liveMoment.map((mom, index) => (
                <>
                  <div
                    key={index}
                    className={`cursorPtr ${
                      mobileView
                        ? "position-relative mx-2"
                        : "position-relative  img-zoom-hover px-2 webStyleCss"
                    }`}
                  >
                    <img
                      src={mom}
                      height="209px"
                      width="100%"
                      alt="live video"
                    />
                  </div>
                  {props.isVideoCallComp ? (
                    <>
                      <p className="mb-0 px-2 fntSz16">talk to snick about..</p>
                      <p className="mb-0 px-2 fntSz14 sublineCss">
                        Symonnie Harrison
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-0 px-2 fntSz16">Joe Montana</p>
                      <p className="mb-0 px-2 fntSz14 sublineCss">
                        NFL Hall of Fame - Londen
                      </p>
                    </>
                  )}
                  <div className="d-flex px-2 pt-2 justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="fntSz14 d-flex align-items-center">
                        <Icon
                          icon={`${tagIcon}#tagIconId`}
                          size={12}
                          color={theme.text}
                          class="pr-1"
                          viewBox="0 0 14.693 14.57"
                        />
                        <span>$50</span>
                      </div>
                      {props.isVideoCallComp && (
                        <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 pl-2">
                          <img
                            src={user_category_time}
                            height="12px"
                            className="pr-1"
                          />
                          <span>5 mins</span>
                        </div>
                      )}
                    </div>
                    <div className="fntSz14 bookBtnStyle cursorPtr">
                      {lang.book}
                    </div>
                  </div>
                </>
              ))}
            </CustomSlider>
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-2">
          <div className="d-flex justify-content-between">
            <h6 className="mv_subHeader mb-3 mt-3">{props.label}</h6>
            <p
              className="mb-3 mt-3 app-link cursorPtr"
              onClick={() =>
                Router.push(
                  `/user_category/user_avilabel_categories?caterory_label=${props.label}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
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
                {liveMoment.map((liveMom) => (
                  <div className="mx-2 position-relative">
                    <img src={liveMom} height="155px" width="133px" />
                    {props.isVideoCallComp ? (
                      <>
                        <p className="mb-0 px-0 pt-1 fntSz16">
                          talk to snick about..
                        </p>
                        <p className="mb-0 px-0 fntSz14 sublineCss">
                          Symonnie Harrison
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-0 px-0 pt-1 fntSz16">Joe Montana</p>
                        <p className="mb-0 px-0 fntSz14 sublineCss">
                          NFL Hall of Fame - Londen
                        </p>
                      </>
                    )}
                    <div className="d-flex px-0 align-items-center pt-2 justify-content-between">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div className="fntSz14 d-flex align-items-center">
                          <Icon
                            icon={`${tagIcon}#tagIconId`}
                            size={12}
                            color={theme.text}
                            class="pr-1"
                            viewBox="0 0 14.693 14.57"
                          />
                          <span>$50</span>
                        </div>
                        {props.isVideoCallComp && (
                          <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 pl-2">
                            <img
                              src={user_category_time}
                              height="12px"
                              className="pr-1"
                            />
                            <span>5 mins</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* <HorizonatalPagination
                  pageEventHandler={!isLoading && pageEventHandler}
                  id={`${
                    props.isFeatured ? "feat_creator_list" : "feat_popular_list"
                  }`}
                ></HorizonatalPagination> */}
              </>
            )}
            {/* <div className="feat_loader mx-2">
              {isLoading && (
                <CustomDataLoader loading={true}></CustomDataLoader>
              )}
            </div> */}
          </div>
        </div>
      )}
      <style jsx>{`
        .sublineCss {
          color: #adaeb5;
        }
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

        :global(.globalSlickArrow .slick-prev) {
          width: 14px !important;
          cursor: pointer;
          top: -9% !important;
          left: 98% !important;
        }

        :global(.globalSlickArrow .slick-next) {
          width: 14px !important;
          cursor: pointer;
          top: -9% !important;
          right: -18px !important;
        }

        :global(.globalSlickArrow .slick-track) {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin: 0;
        }

        :global(.globalSlickArrow .slick-prev:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }

        :global(.globalSlickArrow .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }
      `}</style>
    </Wrapper>
  );
};

export default AllCategoryUser;
