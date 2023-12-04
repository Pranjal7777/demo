import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useLang from "../../hooks/language";
import Wrapper from "../../hoc/Wrapper";
import { useTheme } from "react-jss";
import Slider from "react-slick"
import { getFeaturedCreatorsHook, getNewestCreatorsHook, getOnlineCreatorsHook } from "../../hooks/dashboardDataHooks";
import { getFeaturedCreatorsAction, getNewestCreatorsAction, getOnlineCreatorsAction } from "../../redux/actions/dashboard/dashboardAction";
import { Arrow_Left2 } from "../../lib/config/homepage"
import FeatureList from "../../components/timeline-control/feature-list";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Icon from "../../components/image/icon";
import { useRouter } from "next/router";

function NextArrow(props) {
  const { className, style, onClick, theme } = props;
  return (
    <div className="custom-arrow custom_next_arrow" onClick={onClick}>
      <Icon
        icon={Arrow_Left2 + "#arrowleft2"}
        color={theme.type === "light" ? "#cfcfcf" : "#f4cffe"}
        width={16}
        height={16}
        style={{ padding: '8px', lineHeight: "0px", transform: "rotateY(180deg)" }}
        viewBox="0 0 16 16"
      />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick, theme } = props;
  return (
    <div className="custom-arrow custom_prev_arrow" onClick={onClick}>
      <Icon
        icon={Arrow_Left2 + "#arrowleft2"}
        color={theme.type === "light" ? "#cfcfcf" : "#f4cffe"}
        width={16}
        height={16}
        style={{ padding: '8px', lineHeight: "0px" }}
        viewBox="0 0 16 16"
      />
    </div>
  );
}

function DvFeaturedCreators(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const dispatch = useDispatch();
  const router = useRouter();
  // const [featureCreatorList, setFeatureCreatorList] = useState([]);
  const [featuredCreatorState] = getFeaturedCreatorsHook();
  const [newestCreatorState] = getNewestCreatorsHook();
  const [onlineCreatorState] = getOnlineCreatorsHook();
  // const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setResponse] = useState(false);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    nextArrow: <NextArrow theme={theme} />,
    prevArrow: <PrevArrow theme={theme} />,
    afterChange: (current) => setCount(current),
    slickNext: () => console.log("NEXT SLIDE")
  };

  useEffect(() => {
    if (!featuredCreatorState.data?.length || featuredCreatorState.searchTxt) {
      getFeaturedCreatorsList(featuredCreatorState.page)
    };
    if (!newestCreatorState.data?.length || newestCreatorState.searchTxt) {
      getNewestCreatorsList(newestCreatorState.page)
    };
    if (!onlineCreatorState.data?.length || onlineCreatorState.searchTxt) {
      getOnlineCreatorsList(onlineCreatorState.page)
    };
  }, []);


  useEffect(() => {
    if (count > 1) {
      pageEventHandler();
    }
  }, [count]);

  const getFeaturedCreatorsList = (pageCount) => {
    dispatch(getFeaturedCreatorsAction({
      countryName: "INDIA",
      limit: 10,
      skip: pageCount * 10,
      // callBackFn: stopLoader,
      isAPICall: true
    }));
  };

  const getNewestCreatorsList = (pageCount) => {
    dispatch(getNewestCreatorsAction({
      // countryName: "INDIA",
      limit: 10,
      skip: pageCount * 10,
      // callBackFn: stopLoader,
      isAPICall: true
    }));
  };

  const getOnlineCreatorsList = (pageCount) => {
    dispatch(getOnlineCreatorsAction({
      // countryName: "INDIA",
      limit: 10,
      skip: pageCount * 10,
      // callBackFn: stopLoader,
      isAPICall: true
    }));
  };

  useEffect(() => {
    if (featuredCreatorState.data.length) {
      setIsLoading(false);
    }
    if (newestCreatorState.data.length) {
      setIsLoading(false);
    }
    setTimeout(() => {
      setResponse(true);
    }, 2000);
  }, [featuredCreatorState, newestCreatorState])

  const pageEventHandler = async (e) => {
    getFeaturedCreatorsList(featuredCreatorState.page + 1);
    getNewestCreatorsList(newestCreatorState.page + 1);
    getOnlineCreatorsList(onlineCreatorState.page + 1);
  };

  return (
    <Wrapper>
      <div className="row my-3 mx-0 scroll-hide">
        <div className="col-auto mx-auto w-100 pr-0">
          <div className="mb-3 featured_slider_section pt-2">
            {!isLoading ?
              <div>
                {featuredCreatorState?.data?.length ? <div className="d-flex align-items-center justify-content-between pr-2 mb-1">
                  <h5 className="dv__fc__heading">{lang.featureCreators}</h5>
                  {!isLoading ? <div
                    className="text-right ml-auto pointer f_view_all"
                    onClick={() => router.push('/feature-creator?featuredcreator=true')}
                  >
                    <a>{lang.viewAll}</a>
                  </div> : ""}
                </div> : ""}
                <Slider {...settings}>
                  {featuredCreatorState.data.map((data, index) => {
                    return (
                      <FeatureList
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data.userId}
                        bannerImage={data.bannerImage}
                        profilePic={data.profilePic}
                        fullName={data.fullName}
                        username={data.username}
                      />
                    );
                  })}
                </Slider>
                {newestCreatorState?.data?.length ? <div className="d-flex align-items-center justify-content-between pr-2 mt-3 mb-1">
                  <h5 className="dv__fc__heading">{lang.newestCreator}</h5>
                  {!isLoading ? <div
                    className="text-right ml-auto pointer f_view_all"
                    onClick={() => router.push('/feature-creator?herocreator=true')}
                  >
                    <a>{lang.viewAll}</a>
                  </div> : ""}
                </div> : ""}
                <Slider {...settings}>
                  {newestCreatorState?.data?.map((data, index) => {
                    return (
                      <FeatureList
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data.userId}
                        bannerImage={data.bannerImage}
                        profilePic={data.profilePic}
                        fullName={data.fullName}
                        username={data.username}
                      />
                    );
                  })}
                </Slider>
                {onlineCreatorState?.data?.length ? <div className="d-flex align-items-center justify-content-between pr-2 mt-3 mb-1">
                  <h5 className="dv__fc__heading">{lang.onlineCreator}</h5>
                  {!isLoading ? <div
                    className="text-right ml-auto pointer f_view_all"
                    onClick={() => router.push('/feature-creator?onlinecreator=ture')}
                  >
                    <a>{lang.viewAll}</a>
                  </div> : ""}
                </div> : ""}
                <Slider {...settings}>
                  {onlineCreatorState?.data?.map((data, index) => {
                    return (
                      <FeatureList
                        key={index}
                        id={index}
                        setActiveState={props.setActiveState}
                        userId={data.userId}
                        bannerImage={data.bannerImage}
                        profilePic={data.profilePic}
                        fullName={data.fullName}
                        username={data.username}
                      />
                    );
                  })}
                </Slider>
              </div>

              : <div className="d-flex align-items-center justify-content-center vh-100 position-static profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={!apiResponse} size={60} />
              </div>}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .section {
            background: ${theme.l_base};
            margin: 5px;
          }

          :global(.featured_slider_section .slick-prev) {
            width: 1.467vw !important;
            cursor: pointer !important;
            top: -1.2rem !important;
            left: initial !important;
            right: 7rem !important;
          }
          :global(.featured_slider_section .slick-next) {
            width: 1.467vw !important;
            cursor: pointer !important;
            top: -1.2rem !important;
            right: 5rem;
          }
          :global(.slick-dots li) {
            position: relative;
            display: inline-block;
            width: 16px;
            height: 20px;
            margin: 0;
            padding: 0;
            cursor: pointer;
          }
          :global(.slick-dots li.slick-active button:before) {
            opacity: 0.75;
            color: var(--l_base);
          }
          :global(.slick-dots li button:before) {
            font-family: "slick";
            font-size: 10px;
            line-height: 20px;
            position: absolute;
            top: 0;
            left: 0;
            width: 16px;
            height: 20px;
            content: "•";
            text-align: center;
            opacity: 100%;
            color: var(--l_slick_dot_color);
            -webkit-font-smoothing: antialiased;
          }

          :global(.slick-dots){
              position: absolute;
              bottom: -25px;
              display: block;
              width: 80%;
              padding: 0;
              margin: 0;
              list-style: none;
              text-align: center;
              left: 26px;
          }
          :global(.slick-slide){
            width: 133px;
            // margin: 5px;
          }

          .f_view_all {
            width: fit-content;
            z-index: 9;
            margin-bottom: 0.5rem;
          }
          .f_view_all a{
            color: var(--l_strong_app_text) !important;
          }
          :global(.custom_prev_arrow) {
            background: var(--l_app_bg2);
            position: absolute;
            top: -2.5rem;
            right: 7.5rem;
            border-radius: 100px;
            cursor: pointer;
          }
          :global(.custom_next_arrow) {
            background: var(--l_app_bg2);
            position: absolute;
            top: -2.5rem;
            right: 5rem;
            border-radius: 100px;
            cursor: pointer;
          }
        `}
      </style>
    </Wrapper>
  );
}
export default DvFeaturedCreators;
