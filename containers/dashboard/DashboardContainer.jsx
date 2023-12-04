import React, { useEffect, useState, useRef } from "react";
import Route from "next/router";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import { startLoader, stopLoader } from "../../lib/global";
import { getCookie, getCookiees } from "../../lib/session";
import { getInsights } from "../../services/insight";
import useProfileData from "../../hooks/useProfileData";
import {
  InsightTypeObject,
  CreatorInsightTypeObject,
  getEndTimestamp,
  getStartTimestamp,
} from "../../lib/helper";
import { useRouter } from "next/router";
import MarkatePlaceHeader from "../markatePlaceHeader/markatePlaceHeader";

const TimelineStories = dynamic(
  () => import("../stories/TimelineStories"),
  { ssr: false }
);
const DashboardHeader = dynamic(
  () => import("./dashboard-header"),
  { ssr: false }
);
const DvHeader = dynamic(() => import("../DvHeader/DvHeader"), {
  ssr: false,
});
const DvFeaturedCreators = dynamic(
  () => import("../DvHomePage/DvFeaturedCreators"),
  { ssr: false }
);
const DashboardPage = dynamic(
  () => import("./dashboard"),
  { ssr: false }
);
const ModelBottomNavigation = dynamic(
  () => import("../timeline/bottom-navigation-model"),
  { ssr: false }
);

const option = [
  {
    label: "Year",
    value: "3",
  },
  {
    label: "Month",
    value: "2",
  },
  {
    label: "Week",
    value: "1",
  },
];

const dataList = {
  1: {
    label: "Week",
    value: "1",
  },
  2: {
    label: "Month",
    value: "2",
  },
  3: {
    label: "Year",
    value: "3",
  },
};

const DashboardContainer = (props) => {
  // const { activeCat, chartsData, countryData, clicks, query, start, end } =
  //   props;
  const [activeCat, setActiveCat] = useState(props?.activeCat);
  const [chartsData, setChartsDat] = useState(props?.chartsData);
  const [countryData, setCountryDatat] = useState(props?.countryData);
  const [clicks, setClicks] = useState(props?.clicks);
  const [query, setQuery] = useState(props?.query);
  const [start, setStart] = useState(props?.start);
  const [end, setEnd] = useState(props?.end);
  const [creatorIdForClient, setCreatorIdForClient] = useState(props?.creatorIdForClient);
  const [token, setToken] = useState(props?.token);
  const [assetsId, setAssetsId] = useState(props?.assetsId);
  const [addressDataForClient, setAddressDataForClient] = useState(props?.addressDataForClient || undefined);

  const [activeData, setActiveData] = useState([]);
  const [selectionRange, setSelectRange] = useState(
    useState(dataList[query.f])
  );
  const [mobileView] = isMobile();
  const auth = getCookie("auth");
  const [profile] = useProfileData();
  let currentfilter = props.query.f;
  const router = useRouter();
  const [isCategoryClick,setIsCategoryClick] = useState({
    f:"",
    t:"",
    ct:""
  })
  const {f,t,ct} = isCategoryClick


  useEffect(() => {
    handleAPICallFromClient(f,t,ct)
  },[f,t,ct])

  const handleAPICallFromClient = async (f,t,ct) => {
    startLoader();

    let chartsData = [];
    let countryData = [];
    let apiCalls = [];
    let clicks = [];
    let filter = f || router?.query.f;
    let trigger = t || router?.query.t;
    let countryType = ct || router?.query.ct;
    let assetsId = router?.query?.pid || undefined;
    let activeCat = 1;
    let start = `${await getStartTimestamp(filter)}`;
    let end = `${await getEndTimestamp(filter)}`;

    try {
      let payload = {
        assetId: assetsId,
        filter: filter,
        trigger: trigger,
        start,
        end,
      };

      let contryInfo = {
        assetId: assetsId,
        filter: countryType,
        trigger: trigger,
        start,
        end,
      };

      let clickPayload = {
        assetId: assetsId,
        filter: 4,
        trigger: trigger,
        start,
        end,
      };

      if (!router.query.pid) {
        const createrId = creatorIdForClient;
        payload["creatorId"] = createrId;
        contryInfo["creatorId"] = createrId;
        clickPayload["creatorId"] = createrId;
      }

      apiCalls.push(getInsights(payload, token)); // asset info grids data
      apiCalls.push(getInsights(contryInfo, token)); // table data by country
      if (router.query.ct) {
        apiCalls.push(getInsights(clickPayload, token, addressDataForClient)); // graph data by country
      }
    } catch (e) {
      // console.log("insight error", e);
    }

    try {
      let data = await Promise.all(apiCalls);

      chartsData = data[0]?.data?.data;
      countryData = data[1]?.data?.data;
      if (typeof data[2] != "undefined") {
        clicks = data[2].data.data.map((items) => {
          let typeIndex = !router.query.pid
            ? CreatorInsightTypeObject[items.title || "Views"]
            : InsightTypeObject[items.title || "Views"];

          if (typeIndex == (t || router.query.t)) {
            activeCat =
              items.title == "Tips" ||
                items.title == "Post Sales" ||
                items.title == "Subscription Earning"
                ? `${items.title} (Amount in ${items.currency})`
                : items.title;
          }

          return {
            ...items,
            type: typeIndex,
          };
        });
      }
    } catch (e) {
      stopLoader();
      console.error("ERROR IN initial Page", e);
    }
    let activeData = clicks?.filter(
      (click) => click.title == activeCat.replace(/\s*\(.*?\)\s*/g, "")
    );

    setActiveCat(activeCat || "Clicks");
    setChartsDat(chartsData);
    setCountryDatat(countryData);
    setClicks(clicks);
    setQuery({f:filter,t:trigger,c:countryType});
    setStart(start);
    setEnd(end);
    setCreatorIdForClient(creatorIdForClient);
    setToken(token);
    setAssetsId(assetsId);
    setActiveData(prev=>activeData);
    setAddressDataForClient(addressDataForClient);
    activeCat && stopLoader();
  }

  useEffect(() => {
    let activeData = clicks?.filter(
      (click) => click.title == activeCat.replace(/\s*\(.*?\)\s*/g, "")
    );
    setActiveData(activeData);
  }, [chartsData]);

  const filterSelect = (value) => {
    setSelectRange(value);
    // this.setState(
    //   (prevState) => {
    //     return {
    //       ...prevState,
    //       selectionRange: value,
    //     };
    //   },
    //   () => {
    changeCategory({ f: value.value });
    //   }
    // );
  };

  const changeCategory = ({ f, t, ct }) => {
    setIsCategoryClick({f,t,ct})

    let fq = f || props.query.f;
    let tq = t || props.query.t;
    let ctq = ct || "5";
    let query = {
      pid: props.query.pid,
      f: fq,
      t: tq,
    };
    let appendString = `${props.query && props.query.pid ? props.query.pid : ""
      }?f=${fq}&t=${tq}`;
    if (ctq) {
      query["ct"] = ctq;
      appendString = appendString + `&ct=5`;
    }
    try {
      
      Route.replace(
        {
          pathname: "/dashboard",
          query: query,
        },
        
        `/dashboard/${appendString}`,
        
        );
        
        
    } catch (e) {
      console.error("change category", e);
    }

    // const stateObject  = {...this.state};
    // stateObject.activeTab = index;
    // stateObject.chartsFilter.trigger =index

    // this.setState((prevState)=>{
    //   return {
    //     ...prevState,
    //     activeTab:index,
    //     chartsFilter:{
    //       ...prevState.chartsFilter,
    //       trigger:1
    //     }
    //   }
    // });
  };

  // const [s]
  // yLable={this.props.activeCat}
  // chartsData={this.props.chartsData}

  const tab = (props.pathname && props.pathname.replace("/", "")) || "timeline";
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
  const [refreshPage, setRefreshPage] = useState(0);
  const homePageref = useRef(null);

  const handleRefresh = () => {
    return new Promise(async (resolve) => {
      await setRefreshPage((prev) => prev + 1);
      setTimeout(resolve, 1);
    });
  };

  return (
        <>
        {mobileView ? (
            <Wrapper>
            <DashboardHeader
              creatorDashboard={!props.query.pid ? true : false}
              {...props}
              />
            <DashboardPage
              creatorDashboard={!props.query.pid ? true : false}
              clicks={clicks.length > 0 ? clicks : props?.clicks}
              changeCategory={changeCategory}
              filterSelect={filterSelect}
              selectionRange={selectionRange}
              option={option}
              activeCat={activeCat || props?.activeCat}
              chartsData={chartsData.length > 0 ? chartsData : props?.chartsData}
              countryData={countryData.length > 0 ? countryData : props?.countryData}
              query={query || props?.query}
              activeData={activeData || props?.activeData}
              start={start || props?.start}
              end={end || props?.end}
              />
            {!props.query.pid && profile.userTypeCode === 2 && mobileView && (
                <ModelBottomNavigation
                uploading={props.postingLoader}
                setActiveState={(props) => {
                    setActiveNavigationTab(props);
                }}
                tabType={activeNavigationTab}
                />
                )}
          </Wrapper>
        ) : (
              <DashboardPage
                creatorDashboard={!props.query.pid ? true : false}
                clicks={clicks.length > 0 ? clicks : props?.clicks}
                changeCategory={changeCategory}
                filterSelect={filterSelect}
                selectionRange={selectionRange}
                option={option}
                activeCat={activeCat || props?.activeCat}
                chartsData={chartsData.length > 0 ? chartsData : props?.chartsData}
                countryData={countryData.length > 0 ? countryData : props?.countryData}
                query={query || props?.query}
                activeData={activeData || props?.activeData}
                start={start || props?.start}
                end={end || props?.end}
                />
                )}
 
                </>
  );
};

export default DashboardContainer;