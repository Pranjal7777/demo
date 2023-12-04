import React, { useEffect, useState } from "react";
import useDetectHeaderHight from "../../hooks/detectHeader-hight";
import { backNavMenu, startLoader, stopLoader } from "../../lib/global";
import { getCookie, getCookiees } from "../../lib/session";
import { getInsights } from "../../services/insight";
import Header from "../header/header";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import Wrapper from "../../hoc/Wrapper";

const CityDrawer = (props) => {
  const [insight, setInsite] = useState(null);
  const creatorId = getCookie("uid");
  const [mobileView] = isMobile();
  const [lang] = useLang();


  useEffect(() => {
    let clickPayload = {
      assetId: props.pid,
      filter: 6,
      trigger: props.trigger,
      countryName: props.countryName,
      start: props.start,
      end: props.end,
      creatorId,
    };

    const token = getCookiees("token");

    startLoader();
    getInsights(clickPayload, token)
      .then((data) => {
        stopLoader();
        setInsite(data.data.data);
      })
      .catch((e) => {
        stopLoader();
        console.error(e)
      });
  }, []);

  useDetectHeaderHight("countryDrawerHeader", "countryDrawerBody");

  return (
    <Wrapper>
      {mobileView ? (
        <div className="country-drawer h-100 drawerBgCss text-app">
          <Header
            title={`${props.countryName.charAt(0).toUpperCase()}${props.countryName.slice(1)}`}
            subtitle={`(${props.category})`}
            back={() => {
              backNavMenu(props);
            }}
            id="countryDrawerHeader"
          />
          <div className="city-list col-12 bg-dark-custom" id="countryDrawerBody">
            {insight &&
              [...insight].map((ins, index) => {
                return (
                  <div
                    key={index}
                    className="row align-items-center justify-content-between"
                    style={{
                      padding: "10px",
                      borderBottom: "1px dotted #b5b5b5",
                    }}
                  >
                    <div className="col-auto">
                      <span className="fntSz14 txt-capitalize">{ins.title}</span>
                    </div>
                    <div className="col-auto">
                      <span className="fntSz14">
                        {props.trigger == 3 || props.trigger == 6 || props.trigger == 8 ? "$" : ""}
                        {props.count}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="py-3 px-5">
          <div className="text-center">
            <h5 className="txt-black dv__fnt30 text-capitalize">{decodeURIComponent(props.countryName)}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>

          <div className="text-center">
            <p className="text-muted">{props.category}</p>
          </div>

          <div className="mt-3">
            {insight?.length > 0 && insight.map((ins, index) => {
              return (
                <div key={index} className="row align-items-center justify-content-between pb-3 mb-3" style={{ borderBottom: "1px dashed gray" }}>
                  <div className="col-auto">
                    <span className="fntSz14 txt-capitalize">{decodeURIComponent(ins.title)}</span>
                  </div>
                  <div className="col-auto">
                    <span className="fntSz14">
                      {props.trigger == 3 || props.trigger == 6 || props.trigger == 8 ? "$" : ""}
                      {ins.value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </Wrapper>
  );
};

export default CityDrawer;
