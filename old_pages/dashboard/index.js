import React from 'react'
import DashboardContainer from '../../containers/dashboard/DashboardContainer';
import isMobile from '../../hooks/isMobile';
import { getEndTimestamp, getStartTimestamp } from '../../lib/helper';
import { getCookiees } from '../../lib/session';
import DvHomeLayout from '../../containers/DvHomeLayout';

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

const Dashboard = (props) => {
  const [mobileView] = isMobile();

  return mobileView ? <DashboardContainer {...props} /> : (
    <DvHomeLayout
      activeLink="myDashboard"
      pageLink="/dashboard"
      withMore
      {...props}
    />
  )
}

Dashboard.getInitialProps = async ({ ctx, addressData }) => {
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let chartsData = [];
  let countryData = [];
  let apiCalls = [];
  let clicks = [];
  let filter = ctx.query.f;
  let trigger = ctx.query.t;
  let countryType = ctx.query.ct;
  let assetsId = ctx.query.pid;
  let currentTotalValue = "";
  let activeCat = 1;
  let start = `${await getStartTimestamp(filter)}`;
  let end = `${await getEndTimestamp(filter)}`;
  let creatorIdForClient = getCookiees("uid", ctx.req);
  let addressDataForClient = addressData;

  try {
    let payload = {
      assetId: assetsId,
      filter: filter,
      trigger: trigger,
      start,
      end,
    };

    let contryInfo = {
      assetId: ctx.query.pid,
      filter: countryType,
      trigger: trigger,
      start,
      end,
    };

    let clickPayload = {
      assetId: ctx.query.pid,
      filter: 4,
      trigger: trigger,
      start,
      end,
    };

    if (!ctx.query.pid) {
      const createrId = getCookiees("uid", ctx.req);
      payload["creatorId"] = createrId;
      contryInfo["creatorId"] = createrId;
      clickPayload["creatorId"] = createrId;
    }

    // apiCalls.push(getInsights(payload, token)); // asset info grids data
    // apiCalls.push(getInsights(contryInfo, token)); // table data by country

    // countryData = ;
    // chartsData = data.data.data;

    // let data1 = await getInsights(contryInfo, token, addressData);
    // countryData = data1.data.data;
    if (ctx.query.ct) {
      // let data2 = await getInsights(clickPayload, token, addressData);
      // apiCalls.push(getInsights(clickPayload, token, addressData)); // graph data by country
    }
  } catch (e) {
    console.log("insight error", e);
  }

  // try {
  //   // startLoader();
  //   // let data = await Promise.all(apiCalls);
  //   console.log("kha", data)

  //   // console.log("fjis-->", data[0], data[1], data[2]);

  //   // stopLoader();
  //   chartsData = data[0].data.data;
  //   // currentTotalValue = data[0].data.totalValue ? data[0].data.totalValue : "";
  //   countryData = data[1].data.data;
  //   if (typeof data[2] != "undefined") {
  //     clicks = data[2].data.data.map((items) => {
  //       // let typeIndex = index + 1;
  //       // typeIndex = index + 1 == 5 ? 4 : typeIndex;
  //       // typeIndex = index + 1 == 4 ? 5 : typeIndex;

  //       let typeIndex = !ctx.query.pid
  //         ? CreatorInsightTypeObject[items.title || "Views"]
  //         : InsightTypeObject[items.title || "Views"];

  //       if (typeIndex == ctx.query.t) {
  //         activeCat =
  //           items.title == "Tips" ||
  //             items.title == "Post Sales" ||
  //             items.title == "Subscription Earning"
  //             ? `${items.title} (Amount in ${items.currency})`
  //             : items.title;
  //         // items.value =
  //         //   currentTotalValue !== "" ? currentTotalValue : items.value;
  //       }

  //       return {
  //         ...items,
  //         type: typeIndex,
  //       };
  //     });
  //   }
  // } catch (e) {
  //   stopLoader();
  //   // console.log("sadjdd", e);
  //   console.error("ERROR IN initial Page", e);
  // }

  return {
    query: ctx.query,
    chartsData: chartsData,
    countryData: countryData,
    activeCat: activeCat || "Clicks",
    clicks: clicks,
    pathname: ctx.pathname,
    start: start,
    end: end,
    token: token,
    assetsId: assetsId,
    creatorIdForClient: creatorIdForClient,
    addressDataForClient: addressDataForClient
  };
};

export default Dashboard;
