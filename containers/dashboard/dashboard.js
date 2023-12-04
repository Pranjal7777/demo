import React, { useState, useEffect } from "react";
import DashboardChart from "./dashboard-chart";
import Select from "../../components/select/select";
import { ANALYTICS_PLACEHOLDER_SVG, Chevron_Right } from "../../lib/config";
import { open_dialog, open_drawer } from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { getInsights } from "../../services/insight";
import { getCookie, getCookiees } from "../../lib/session";
import Loader from "../../components/loader/loader";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import { Paper } from "@material-ui/core";
import dynamic from "next/dynamic";
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), {
  ssr: false,
});
export default function DashboardPage(props) {
  const {
    clicks,
    changeCategory,
    filterSelect,
    selectionRange,
    option,
    activeCat,
    chartsData,
    countryData,
    query,
    activeData,
    creatorDashboard,
  } = props;

  const [mobileView] = isMobile();
  const theme = useTheme();
  const [lang] = useLang();
  const creatorId = getCookie("uid");
  const [ctrDropdown, openCountryDropdown] = useState(false);
  const [selectedCountry, setCountry] = useState("");
  const [insight, setInsite] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    openCountryDropdown(false);
    setLoader(false);
    setInsite(null);
  }, [props.query.t]);

  const handleCityList = (selectedCountry) => {
    if (ctrDropdown == true && selectedCountry.apiCall) {
      openCountryDropdown(false);
    } else {
      setCountry(selectedCountry.title);
      setInsite(null);
      let clickPayload = {
        assetId: props.query.pid,
        filter: 6, // for city clicks
        trigger: props.query.t,
        countryName: selectedCountry.title,
        start: props.start,
        end: props.end,
      };
      if (creatorDashboard) {
        clickPayload[`creatorId`] = creatorId;
      }
      const token = getCookiees("token");
      setLoader(true);
      getInsights(clickPayload, token)
        .then((data) => {
          setLoader(false);
          countryData?.map((country) => {
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

  const openCityDrawer = (country) => {
    mobileView
      ? open_drawer("cityDrawer", {
        title: country.title,
        category: props.activeCat,
        pid: props.query.pid,
        trigger: props.query.t,
        countryName: country.title,
        start: props.start,
        end: props.end,
        count: country.value,
      }, "right")
      : open_dialog("cityDrawer", {
        title: country.title,
        category: props.activeCat,
        pid: props.query.pid,
        trigger: props.query.t,
        countryName: country.title,
        start: props.start,
        end: props.end,
      })
  }

  return (
    <div className="py-3">
      {mobileView ? (
        <>
          <div className="col-12">
            <div
              className="form-row dashboard-scroll"
              style={{
                flexWrap: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              {clicks &&
                clicks.map((click, index) => {
                  let type = click.type;
                  return (
                    <div
                      key={index}
                      className="col-4"
                    >
                    <Tooltip disableFocusListener title={click.title} enterTouchDelay={10}>
                      <div
                        onClick={() => {
                          changeCategory({
                            t: type,
                          });
                        }}
                        className={`bg__dark__grey ${parseInt(query.t) == type ? "active" : ""} mb-3`}
                      >
                        <p className="dashboard__type__dyna mb-0">
                          {click.type == 3 || click.type == 6 || click.type == 8
                            ? click.currency
                            : ""}
                          {click.value}
                        </p>
                        <p
                          className="dashboard__type mb-0 text-truncate">
                          {click.title}
                        </p>
                      </div>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row justify-content-between">
              <div className="col-auto">
                <span className="dashboard__title__static">
                  {lang.timeFrame}
                </span>
              </div>

              <div className="col-auto">
                <span className="all__order__dropdown">
                  <Select
                    filterSelect={filterSelect}
                    value={selectionRange}
                    apptheme={theme}
                    options={option}
                    className={"tfdrpdn_slct"}
                    classNamePrefix={
                      mobileView ? "select__optn" : "dv__select__optn"
                    }
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            {activeData && activeData[0]?.value > 0 ? (
              <DashboardChart yLable={activeCat} chartsData={chartsData} />
            ) : (
              <div className="text-center mt-5">
                <Icon
                  icon={`${ANALYTICS_PLACEHOLDER_SVG}#analytics`}
                  color={theme.type == "light" ? "black" : "white"}
                  alt="No Data in Insights Placeholder SVG Image"
                  width={mobileView ? 35 : 10}
                  height={mobileView ? 35 : 10}
                  unit={mobileView ? "vw" : "vw"}
                />
              </div>
            )}
          </div>
          <div className={`col-12 ${creatorDashboard ? "pb-5" : ""} dashboard__table__list`}>
            {countryData && countryData.length > 0 && (
              <div className="row align-items-center justify-content-between mb-3 pb-2 dashboard__table__list__border__bottom">
                <div className="col-auto">
                  <span className="dashboard__title__static">
                    {lang.country}
                  </span>
                </div>
                <div className="col-auto">
                  <span className="dashboard__title__static">
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
                      className={"row align-items-center justify-content-between cursorPtr mb-3"}
                      onClick={() => openCityDrawer(country)}
                    >
                      <div className="col-auto">
                        <span className="fntSz14 txt-capitalize">
                        {decodeURIComponent(country.title)}
                        </span>
                      </div>
                      <div className="col-auto">
                        <p className="fntSz14 m-0 d-flex align-items-center">
                          <span className="mr-2">
                            {country.value % 1 != 0
                              ? country.value.toFixed(2)
                              : country.value}
                          </span>
                          {loader && selectedCountry == country.title ? (
                            <Loader size={12} />
                          ) : (
                            <Icon
                              icon={`${Chevron_Right}#chevron_right`}
                              color={theme.appColor}
                              size={9}
                              viewBox="0 0 6.378 10.328"
                              style={
                                ctrDropdown && selectedCountry == country.title
                                  ? {
                                    transform: "rotate(90deg)",
                                  }
                                  : {}
                              }
                            />
                          )}
                        </p>
                      </div>
                    </div>
                    {ctrDropdown && selectedCountry == country.title ? (
                      <div
                        className="city-list col-12 bg-dark-custom"
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
                                  <span className="fntSz14">
                                    {ins.title}
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <span className="fntSz14">
                                    {ins.value}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : ""}
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div className="pb-5 mb-5">
          <div className="col-12 pl-0">
            <div className="row align-items-center">
              <div className="col-7">
                <h5 className="txt-black dv__fnt26 dv_appTxtClr px-1 pb-3 m-0 txt-capitalize">
                  {lang.dashboard}
                </h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap ">
                {clicks &&
                  clicks.map((click, index) => {
                    let type = click.type;
                    return (
                      <div
                        key={index}
                        className={`cursorPtr col-3 mt-2 ${click.title === "Subscription Earning" ? "order-9 col-4" : ""}`}
                      >
                        <div
                          onClick={() => {
                            changeCategory({
                              t: type,
                            });
                          }}
                          className={`bg__dark__grey py-3 d-flex align-items-center justify-content-center text-center bold ${parseInt(query.t) == type ? "active" : ""}`}
                        >
                          <span className="txt-roman dv__fnt14">
                            {click.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="col-12 mt-5">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                <h2 className="txt-black dv__fnt26 dv_appTxtClr px-1 pb-3 m-0 txt-capitalize">{activeCat}</h2>
                <div className="col-auto">
                <span className="all__order__dropdown">
                  <Select
                    filterSelect={filterSelect}
                    value={selectionRange}
                    options={option}
                    className={"w-100 tfdrpdn_slct"}
                    apptheme={theme}
                    classNamePrefix="dv__select__optn"
                    />
                </span>
              </div>
              </div>
                <div style={{ height: "450px" }}>
                  <div className="row h-100">
                    <div className="col-10 mb-3">
                      {activeData && activeData[0]?.value > 0 ? (
                        <div className="col-12">
                          <DashboardChart yLable={activeCat} chartsData={chartsData} />
                        </div>
                      ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                          <Icon
                            icon={`${ANALYTICS_PLACEHOLDER_SVG}#analytics`}
                            color={theme.type == "light" ? "black" : "white"}
                            alt="No Data in Insights Placeholder SVG Image"
                            width={mobileView ? 35 : 10}
                            height={mobileView ? 35 : 10}
                            unit={mobileView ? "vw" : "vw"}
                          />
                        </div>
                      )}
                    </div>
                    {activeData && activeData[0]?.value > 0 ? (
                      <div className="col-12">
                        <Paper elevation={5} className="h-100">
                          <div className="col-12 p-3 dashboard__table__list">
                            {countryData && countryData.length > 0 && (
                              <div className="row align-items-center justify-content-between mb-3 pb-2 dashboard__table__list__border__bottom">
                                <div className="col-auto">
                                  <span className="dv__fnt16 text-black txt-heavy txt-capitalize dt__text">
                                    {lang.country}
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <span className="dv__fnt16 text-black txt-heavy txt-capitalize dt__text">
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
                                      className="row align-items-center justify-content-between cursorPtr mb-2"
                                      onClick={() => openCityDrawer(country)}
                                    >
                                      <div className="col-auto">
                                        <span className="dv__fnt18 text-black txt-roman txt-capitalize dt__text">
                                          {decodeURIComponent(country.title)}
                                        </span>
                                      </div>
                                      <div className="col-auto">
                                        <p className="dv__fnt18 m-0 dv_appTxtClr txt-roman d-flex align-items-center dt__text">
                                          <span className="mr-2">
                                            {country.value % 1 != 0
                                              ? country.value.toFixed(2)
                                              : country.value}
                                          </span>
                                          {loader && selectedCountry == country.title ? (
                                            <Loader size={12} />
                                          ) : (
                                            <Icon
                                              icon={`${Chevron_Right}#chevron_right`}
                                              color={theme.appColor}
                                              size={9}
                                              viewBox="0 0 6.378 10.328"
                                              style={
                                                ctrDropdown && selectedCountry == country.title
                                                  ? {
                                                    transform: "rotate(90deg)",
                                                  }
                                                  : {}
                                              }
                                            />
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    {ctrDropdown && selectedCountry == country.title ? (
                                      <div
                                        className="city-list col-12 bg-dark-custom"
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
                                                  <span className="dv__fnt16 dv_appTxtClr txt-roman txt-capitalize">
                                                    {ins.title}
                                                  </span>
                                                </div>
                                                <div className="col-auto">
                                                  <span className="dv__fnt16 dv_appTxtClr txt-roman">
                                                    {ins.value}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ) : ""}
                                  </div>
                                );
                              })}
                          </div>
                        </Paper>
                      </div>
                    ) : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <div className={mobileView ? "col-12 mb-3" : activeData && activeData[0]?.value == 0 ? "col-12 mb-3" : "col-8 mb-3"}> */}
      {/* {activeData && activeData?.length == 0 && activeData[0]?.value == 0 ? (
            <div className="text-center mt-5">
              <Image src={ANALYTICS_PLACEHOLDER_SVG} alt="No Data in Insights Placeholder SVG Image" />
            </div>
          ) : (
            <DashboardChart yLable={activeCat} chartsData={chartsData} />
          )} */}
          <style jsx>
          {`
            :global(.dashboard__table__list) {
              background-color: var(--l_profileCard_bgColor);
              height: 100%;
            }
            :global(.dt__text){
              color: var(--l_app_text) !important;
            }
          `}
          </style>
    </div>
  );
}
