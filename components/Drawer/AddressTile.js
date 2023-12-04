import dynamic from "next/dynamic";
import React, { useState } from "react";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
const RadioButton = dynamic(() => import("../formControl/radioButton"), {
  ssr: false,
});
import Wrapper from "../../hoc/Wrapper";
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
import { useTheme } from "react-jss";

const Icon = dynamic(() => import("../image/icon"), { ssr: false });

export default function AddressTile(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const theme = useTheme();

  const {
    radio = false,
    addressData,
    openConfirmModel,
    handleSetDefaultAddress,
    handleEditAddress,
    onChange,
    key,
  } = props;

  return (
    <Wrapper>
      <div className={mobileView ? "col-12" : "col-lg-6"}>
        <div
          key={key || addressData._id}
          className={
            mobileView
              ? `mb-3 ${radio ? "radio-cards" : "CardSec"}`
              : `dv__CardSec w-100 mb-4 cursorPtr d-flex flex-column justify-content-between`
          }
          onClick={props.radio ? () => onChange(addressData._id) : () => { }}
        >
          <div className="row m-0 align-items-center">
            <div className={mobileView ? "col-10 p-0" : "col-12 p-0"}>
              <p
                className={
                  mobileView
                    ? "text-capitalize m-0 fntSz13 cardNum"
                    : `text-capitalize m-0 dv__fnt14 cardNum ${theme.type == "light" ? "dv__black_color" : "dv__white_color"} txt-roman`
                }
                style={{ maxHeight: `${!mobileView && "15vh"}`, overflowY: `${!mobileView && "auto"}`, wordBreak: "break-word" }}
              >
                {addressData.address + ", " + addressData.city + ", " + addressData.state + ", " + addressData.zipCode + ", " + addressData.country || addressData.note}
              </p>
              {/* {mobileView && (
                <p className="m-0 mt-3 fntSz13">{addressData.zipCode}</p>
              )} */}
            </div>
            {radio && (
              <div className="ml-auto col-1 card-radio">
                <RadioButton
                  name={props.name || "address"}
                  lable=""
                  checked={props.selectAddress == addressData._id}
                />
              </div>
            )}
          </div>
          {!radio && (
            <div className="row m-0 mt-2 align-items-center justify-content-between dv__cardFooter">
              {addressData.isDefault ? (
                <div className="col-9 p-0">
                  <p
                    className={
                      mobileView
                        ? "m-0 fntSz13 dv_base_color"
                        : "m-0 dv__fnt11 dv_base_color"
                    }
                  >
                    {lang.default}
                  </p>
                </div>
              ) : (
                <div className="col-5 p-0">
                  <button
                    type="button"
                    className={
                      mobileView
                        ? "btn btn-default greyborderBtn"
                        : "btn btn-default dv__blueborderBtn w-auto"
                    }
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={() => handleSetDefaultAddress(addressData)}
                  >
                    {lang.makedefault}
                  </button>
                </div>
              )}
              <div className={`${mobileView ? "row" : ""} col-3 d-flex align-items-center justify-content-between`}>
                <div className="row m-0">
                  <div
                    className="col-6 pl-0 pr-2 text-right"
                    onClick={() => handleEditAddress(addressData)}
                  >
                    <Icon
                      icon={`${env.EDIT_SVG}#edit_icon`}
                      color="var(--l_base)"
                      size={15}
                      unit="px"
                      viewBox="0 0 16.256 16.256"
                    />
                  </div>
                  <div
                    className="col-6 pr-0 pl-2 text-right"
                    onClick={() => openConfirmModel(addressData)}
                  >
                    <Icon
                      icon={`${env.DELETE_SVG}#delete_icon_b`}
                      color="var(--l_base)"
                      size={15}
                      unit="px"
                      viewBox="0 0 17 18"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .dv__CardSec {
            border: 0.5px solid #c1c1c1;
            border-radius: 10px;
            padding: 11px;
            position: relative;
            max-height: 12.248vw;
          }
          .dv__cardFooter {
            // Commented By Bhavleen on 7th May
            // position: absolute;
            bottom: 10px;
            width: 100%;
          }
          .radio-cards {
            border-radius: 10px;
            padding: 11px;
            box-shadow: 0px 0px 4pt 0px #0000002e;
            color: ${theme.l_app_text};
          }
          .cardNum{
            width: 100%;
            // max-width: 175px;
          }
        `}
      </style>
    </Wrapper>
  );
}
