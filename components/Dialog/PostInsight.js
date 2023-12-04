import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import { open_dialog, startLoader, stopLoader } from "../../lib/global";
import { InsightTypeObject, CreatorInsightTypeObject, getStartTimestamp, getEndTimestamp } from "../../lib/helper"
import { getCookiees } from "../../lib/session";
import { getInsights } from "../../services/insight";
import { ANALYTICS_PLACEHOLDER_SVG, Down_Arrow_Blue } from "../../lib/config";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("../../components/select/select"), { ssr: false });
const DashboardChart = dynamic(() => import("../../containers/dashboard/dashboard-chart"), { ssr: false });
const Loader = dynamic(() => import("../loader/loader"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
import { useTheme } from "react-jss";
import Image from "../image/image.jsx"

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

const PostInsight = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [chartsData, setChartsData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [activeCat, setActiveCat] = useState([]);
  const [clicks, setClicks] = useState([])
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [filter, setFilter] = useState(null)
  const [trigger, setTrigger] = useState(null)

  const [activeData, setActiveData] = useState([]);
  const [selectionRange, setSelectRange] = useState(
    useState(dataList[props.f])
  );
  const [ctrDropdown, openCountryDropdown] = useState(false);
  const [selectedCountry, setCountry] = useState("");
  const [insight, setInsite] = useState(null);
  const [loader, setLoader] = useState(false);
  let creatorDashboard = !props.postId ? true : false;

  const filterSelect = (value) => {
    setSelectRange(value);
    changeCategory({ f: value.value });
    setFilter(value.value)
  };

  const changeCategory = ({ f, t, ct }) => {
    let fp = f || props.f;
    setFilter(fp)
    let tp = t || props.t;
    setTrigger(tp)
    let ctp = ct || props.ct;

    try {
      open_dialog("POST_INSIGHT", {
        postId: props.postId,
        f: fp,
        t: tp,
        ct: ctp,
      })
    } catch (e) {
      console.error("change category", e);
    }
  };

  useEffect(() => {
    openCountryDropdown(false);
    setLoader(false);
    setInsite(null);
  }, [props.t])

  const handleCityList = (selectedCountry) => {
    if (ctrDropdown == true && selectedCountry.apiCall) {
      openCountryDropdown(false);
    } else {
      setCountry(selectedCountry.title);
      setInsite(null);
      let clickPayload = {
        assetId: props.postId,
        filter: 6, // for city clicks
        trigger: props.t,
        countryName: selectedCountry.title,
        start,
        end,
      };
      if (creatorDashboard) {
        clickPayload[`creatorId`] = creatorId;
      }
      const token = getCookiees("token");
      setLoader(true);
      getInsights(clickPayload, token)
        .then((data) => {
          setLoader(false);
          countryData &&
            countryData.map((country) => {
              country.title == selectedCountry.title
                ? (country[`apiCall`] = true)
                : (country[`apiCall`] = false);
            });
          setInsite(data.data.data);
        })
        .catch((e) => {
          setLoader(false);
        });
      openCountryDropdown(true);
    }
  };

  useEffect(() => {
    const getData = async () => {
      let chartsData = [];
      let countryData = [];
      let apiCalls = [];
      let clicks = [];
      let activeCat = 1;
      let filter = filter || props.f;
      let trigger = trigger || props.t;
      let countryType = props.ct;
      let assetId = props.postId;
      let start = await getStartTimestamp(filter)
      let end = await getEndTimestamp(filter)

      try {
        let payload = {
          assetId,
          filter,
          trigger,
          start,
          end,
        };

        let contryInfo = {
          assetId,
          filter: countryType,
          trigger,
          start,
          end,
        };

        let clickPayload = {
          assetId,
          filter: 4,
          trigger,
          start,
          end,
        };

        // Asset info grids data
        apiCalls.push(getInsights(payload));

        // Table data by country
        apiCalls.push(getInsights(contryInfo));

        if (props.ct) {
          // Graph data by country
          apiCalls.push(getInsights(clickPayload));
        }
      } catch (e) {
        console.error("insight error", e);
      }

      try {
        startLoader();
        let data = await Promise.all(apiCalls);

        stopLoader();
        chartsData = data && data[0].data.data;
        countryData = data && data[1].data.data;

        if (typeof data[2] != "undefined") {
          clicks = data[2].data.data.map((items) => {
            let typeIndex = !props.postId
              ? CreatorInsightTypeObject[items.title || "Views"]
              : InsightTypeObject[items.title || "Views"];

            if (typeIndex == props.t) {
              activeCat =
                items.title == "Tips" || items.title == "Post Sales" || items.title == "Subscription Earning"
                  ? `${items.title} (Amount in ${items.currency})`
                  : items.title
            }
            return {
              ...items,
              type: typeIndex,
            };
          })
        }
      } catch (e) {
        stopLoader();
        console.error("Error in Insight =>", e);
      }

      setChartsData(chartsData);
      setCountryData(countryData);
      setActiveCat(activeCat || "Clicks")
      setClicks(clicks)
      setStart(start)
      setEnd(end)
    }

    getData();
  }, [filter, trigger])

  // useEffect(() => {
  //   let activeDat =
  //     clicks &&
  //     clicks.filter(
  //       (click) => click.title == activeCat?.replace(/\s*\(.*?\)\s*/g, "")
  //     );
  //   setActiveData(activeDat);
  // }, [chartsData]);

  return (
    <div className="py-3 px-2">
      <div className="text-center pb-3">
        <h5 className="txt-black dv__fnt34">
          {lang.insight}
        </h5>
      </div>
      <button
        type="button"
        className="close dv_modal_close"
        data-dismiss="modal"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>

      <>
        <div className="col-12">
          <div className="form-row mb-3">
            {clicks &&
              clicks.map((click, index) => {
                let type = click.type;
                return (
                  <div
                    key={index}
                    className="col-2 cursorPtr">
                    <div
                      onClick={() => {
                        changeCategory({
                          t: type,
                        });
                      }}
                      className={`bg__light__grey ${parseInt(props.t) == type ? "active" : ""
                        }`}
                    >
                      <p
                        className={`dv__fnt18 txt-heavy m-0 ${parseInt(props.t) == type ? "text-app" : "text-dark"}`}>
                        {click.type == 3 || click.type == 6 || click.type == 8
                          ? click.currency
                          : ""}
                        {click.value}
                      </p>
                      <span
                        className={`txt-roman dv__fnt14 ${parseInt(props.t) == type ? "text-app" : "text-dark"}`}>
                        {click.title}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="row justify-content-between">
            <div className="col-auto">
              <span
                className="txt-heavy dv__fnt16 txt-capitalize">
                {lang.timeFrame}
              </span>
            </div>
            <div className="col-auto">
              <span className="all__order__dropdown">
                <Select
                  filterSelect={filterSelect}
                  apptheme={theme}
                  value={selectionRange}
                  options={option}
                  className="w-100 tfdrpdn_slct"
                  classNamePrefix="dv__select__optn" />
              </span>
            </div>
          </div>
        </div>

        <div className={!countryData?.length ? "mb-2 col-12" : "mb-2 col-8"}>
          {countryData?.length <= 0 ?
            (
              <div className="text-center my-5">
                <Image src={ANALYTICS_PLACEHOLDER_SVG} alt="No Data in Insights Placeholder SVG Image" />
              </div>
            ) : (
              <DashboardChart
                yLable={activeCat}
                chartsData={chartsData}
                dialog={true}
              />
            )}
        </div>

        <div className="col-12 dashboard__table__list">
          {countryData && countryData.length > 0 && (
            <div className="row align-items-center justify-content-between mb-3 pb-2 dashboard__table__list__border__bottom">
              <div className="col-auto">
                <span
                  className="dv__fnt16 txt-heavy txt-capitalize"
                >
                  {lang.country}
                </span>
              </div>
              <div className="col-auto">
                <span
                  className="dv__fnt16 txt-heavy txt-capitalize"
                >
                  {activeCat}
                </span>
              </div>
            </div>
          )}

          {countryData &&
            countryData.length > 0 &&
            countryData.map((country, index) => {
              return (
                <div key={index}>
                  <div
                    className="row align-items-center justify-content-between mb-3 cursorPtr"
                    onClick={() => handleCityList(country)}
                  >
                    <div className="col-auto">
                      <span
                        className="dv__fnt18  txt-roman txt-capitalize">
                        {decodeURIComponent(country.title)}
                      </span>
                    </div>
                    <div className="col-auto">
                      <span
                        className="dv__fnt18  txt-roman">
                        {country.value}{" "}
                        {loader && selectedCountry == country.title ? (
                          <Loader size={12} />
                        ) : (
                          <Img
                            src={Down_Arrow_Blue}
                            style={
                              ctrDropdown && selectedCountry == country.title
                                ? {
                                  width: "6px",
                                  margin: "0 5px",
                                  transform: "rotate(90deg)",
                                }
                                : {
                                  width: "6px",
                                  margin: "0 5px",
                                }
                            }
                            alt="arrow"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  {ctrDropdown && selectedCountry == country.title ? (
                    <div
                      className="city-list col-12"
                      id="countryDrawerBody"
                    >
                      {insight &&
                        insight.length > 0 &&
                        [...insight].map((ins, index) => {
                          return (
                            <div
                              key={index}
                              className="row align-items-center justify-content-between mb-3"
                            >
                              <div className="col-auto">
                                <span
                                  className="dv__fnt16 txt-roman txt-capitalize ">
                                  {ins.title}
                                </span>
                              </div>
                              <div className="col-auto">
                                <span
                                  className="dv__fnt16  txt-roman">
                                  {ins.value}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
        </div>
      </>
    </div >
  );
};

export default PostInsight;
