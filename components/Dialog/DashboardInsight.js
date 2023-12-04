import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import useLang from "../../hooks/language";
import { startLoader, stopLoader } from "../../lib/global";
import { InsightTypeObject, CreatorInsightTypeObject } from "../../lib/helper"
import { getCookie, getCookiees } from "../../lib/session";
import { getInsights } from "../../services/insight";
const DashboardPage = dynamic(() => import("../../containers/dashboard/dashboard"), { ssr: false });
import Wrapper from "../../hoc/Wrapper"

const option = [
  {
    label: "Week",
    value: "1",
  },
  {
    label: "Month",
    value: "2",
  },
  {
    label: "Year",
    value: "3",
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

const DashboardInsight = (props) => {
  // console.log(props, "<")
  const [lang] = useLang();
  const {
    activeCat,
    chartsData,
    countryData,
    clicks,
    query,
    activeType,
  } = props;
  const [activeData, setActiveData] = useState([]);
  const [selectionRange, setSelectRange] = useState(
    useState(dataList[props.f])
  );
  const auth = getCookie("auth");

  useEffect(() => {
    let activeData = clicks && clicks.filter(
      (click) => click.title == activeCat.replace(/\s*\(.*?\)\s*/g, "")
    );
    setActiveData(activeData);
  }, [activeCat]);

  const filterSelect = (value) => {
    // console.log('filterSelect');

    setSelectRange(value);
    changeCategory({ f: value.value });
  };

  const changeCategory = ({ f, t, ct }) => {
    let fq = f || props.query.f;
    let tq = t || props.query.t;
    let ctq = ct || "5";
    let query = {
      pid: props.query.pid,
      f: fq,
      t: tq,
    };
    let appendString = `${props.query && props.query.pid}?f=${fq}&t=${tq}`;
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
        `/dashboard/${appendString}`
      );
    } catch (e) {
      console.error("change category", e);
    }
  };

  // const { tab = "timeline" } = query;
  // const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
  const [refreshPage, setRefreshPage] = useState(0);
  const homePageref = useRef(null);

  const handleRefresh = () => {
    // console.log('filterSelect');

    return new Promise(async (resolve) => {
      await setRefreshPage((prev) => prev + 1);
      setTimeout(resolve, 1);
    });
  };

  return (
    <Wrapper>
      <div className="py-3 px-5">
        <div className="text-center pb-3">
          <h5 className="txt-black dv__fnt34">
            {lang.insight}
          </h5>
        </div>
        <button
          type="button"
          className="close dv_modal_close"
          data-dismiss="modal"
          onClick={() => props.onClose}>
          {lang.btnX}
        </button>

        <div>
          <DashboardPage
            clicks={clicks}
            changeCategory={changeCategory}
            filterSelect={filterSelect}
            selectionRange={selectionRange}
            option={option}
            activeCat={activeCat}
            chartsData={chartsData}
            countryData={countryData}
            query={query}
            activeData={activeData}
          />
        </div>
      </div>
    </Wrapper>
  );
};

DashboardInsight.getInitialProps = async ({ ctx, addressData }) => {
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let chartsData = [];
  let countryData = [];
  let apiCalls = [];
  let clicks = [];
  let filter = ctx.query.f;
  let trigger = ctx.query.t;
  let countryType = ctx.query.ct;
  let assetsId = ctx.query.pid;
  let activeType = 1;
  let activeCat = 1;
  try {
    let payload = {
      assetId: assetsId,
      filter: filter,
      trigger: trigger,
    };

    let contryInfo = {
      assetId: ctx.query.pid,
      filter: countryType,
      trigger: trigger,
    };
    let clickPayload = {
      assetId: ctx.query.pid,
      filter: 4,
      trigger: trigger,
    };

    if (!ctx.query.pid) {
      const createrId = getCookiees("uid", ctx.req);
      payload["creatorId"] = createrId;
      contryInfo["creatorId"] = createrId;
      clickPayload["creatorId"] = createrId;
    }

    apiCalls.push(getInsights(payload, token)); // asset info grids data
    apiCalls.push(getInsights(contryInfo, token)); // table data by country

    // countryData = data1.data.data;
    if (ctx.query.ct) {
      // let data2 = await getInsights(clickPayload, token, addressData);
      apiCalls.push(getInsights(clickPayload, token, addressData)); // graph data by country
    }
  } catch (e) {
  }

  try {
    startLoader();
    let data = await Promise.all(apiCalls);

    stopLoader();
    chartsData = data[0].data.data;
    countryData = data[1].data.data;
    if (typeof data[2] != "undefined") {
      clicks = data[2].data.data.map((items, index) => {
        let typeIndex = !ctx.query.pid
          ? CreatorInsightTypeObject[items.title || "Views"]
          : InsightTypeObject[items.title || "Views"];
        if (typeIndex == ctx.query.t) {
          activeCat =
            items.title == "Tips" || items.title == "Post Sales" || items.title == "Subscription Earning"
              ? `${items.title} (Amount in ${items.currency})`
              : items.title;
          activeType = items.type;
        }

        return {
          ...items,
          type: typeIndex,
        };
      });
    }
  } catch (e) {
    stopLoader();
  }

  return {
    query: ctx.query,
    chartsData: chartsData,
    countryData: countryData,
    activeCat: activeCat || "Clicks",
    clicks: clicks,
    activeType: activeType,
  };
};

export default DashboardInsight;
