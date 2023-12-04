import React, { useEffect } from "react";
import moment from "moment";
import Image from "../image/image";
import { PRIMARY_COLOR, RED, color15, GREEN } from "../../lib/color";
import { Chevron_Right } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { formatDateInUTC } from "../../lib/date-operation/date-operation";
import { open_drawer } from "../../lib/global";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import { getCookie } from "../../lib/session";
import { defaultCurrency } from "../../lib/config/creds";

const TranjectionItems = (props) => {

  let {
    txnid,
    description,
    txntype,
    amount,
    currency,
    withdrawid,
    transactionid,
    status,
    withdrawal,
    txntypetext,
    trigger,
  } = props;
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const userTypeCode = getCookie("userType")

  if (transactionid) {
    // transactionid =
    //   "****" +
    //   transactionid.substring(transactionid.length - 6, transactionid.length);
    transactionid = `#${transactionid}`
  }

  if (withdrawid) {
    // withdrawid =
    //   "***" + withdrawid.substring(withdrawid.length - 6, withdrawid.length);
    withdrawid = `#${withdrawid}`
  }

  let getColors = () => {
    switch (trigger) {
      case "WALLET RECHARGE":
        return GREEN;
      case "WITHDRAW REQUEST":
        return RED;
      case "WITHDRAW":
        return GREEN;
      case "PRODUCT PURCHASE":
        return RED;
      case "PLAN PURCHASE":
        return RED;
      case "CREDIT PENDING AMOUNT":
        return theme?.appColor;
      case "DEBIT PENDING AMOUNT":
        return GREEN;
      case "TRANSFER":
        return RED;
      case "REFUND PENDING AMOUNT":
        return GREEN;
      case "CANCEL DEAL":
        return GREEN;
      default:
        return theme?.appColor;
    }
  };

  let withDrawalColor = () => {
    switch (status) {
      case "FAILED":
        return RED;
      case "REFUND PENDING AMOUNT":
        return CANCELLED;
      case "APPROVED":
        return GREEN;
      default:
        return theme?.appColor;
    }
  };

  return (
    <div className="tranjection-item cursorPtr tranjection-item-1 pt-3 pl-4 pb-1 position-relative">
      <div className="tranjection-bar">
        <div className="dot"></div>
      </div>
      <div
        className={mobileView
          ? "row m-0 position-relative fntSz15"
          : "row m-0 position-relative dv__fnt16 dv__black_color"
        }
      >
        <div className={mobileView ? "section-one col p-0" : "col-12 p-0"}>
          <div className="position-relative mb-0 dv_base_color ">
            <div>
              <p
                className={mobileView
                  ? "fntSz14 mb-0 "
                  : "fntSz14 mb-0 txt-roman "
                }
              >
                {transactionid || txnid || withdrawid || "#1234567890"}
              </p>
            </div>
          </div>
          <div className="text-app">
            <div>
              <p
                className={"mb-0"}
              >
                {description || "Withdrawal to Wingspan"}
              </p>
            </div>
            <div
              className={
                mobileView
                  ? ""
                  : "d-flex flex-row-reverse py-1 align-items-center justify-content-between"
              }
            >
              <div
                className={
                  mobileView
                    ? "fntlightGrey"
                    : "dv_Grey_var_14 txt-roman dv__fnt15"
                }
              >
                {withdrawal
                  ? moment(props.createdat).format("MMM DD YY, h:mm A")
                  : props?.description?.includes("renewed") ? formatDateInUTC(props.txntimestamp, "MMM DD YY, h:mm A") : moment(props.txntimestamp).format("MMM DD YY, h:mm A")
                }
              </div>
              <div
                className="d-flex flex-row align-items-end fntSz17"
              >
                {userTypeCode !== '1' ? (currency || "USD") : <Icon
                  icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                  size={18}
                  class="mr-1"
                  alt="follow icon"
                  viewBox="0 0 18 18"
                />}&nbsp;
                <span >{txntypetext === "DEBIT" ? "-" : ""}{defaultCurrency}{amount || 0.0}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={mobileView
            ? "section-two flex flex-column pr-0"
            : "section-two flex pr-0 position-absolute"
          }
          style={mobileView
            ? {}
            : {
              top: "0",
              right: "0",
            }
          }
        >
          <div className="text-color-primary h-100">
            {!props.withdrawal
              ? <div className="d-flex justify-content-center align-items-center">
                {mobileView
                  ? <div>
                    <Icon
                      icon={`${Chevron_Right}#right_chevron`}
                      color={theme.appColor}
                      size={9}
                      viewBox="0 0 6.378 10.328"
                    />
                  </div>
                  : <p className="mb-0 dv__fnt14 txt-roman dv__blue_var_1 mr-2">
                    {lang.details}
                  </p>
                }
              </div>
              : <div
                className={mobileView
                  ? "d-flex justify-content-between h-100 flex-column"
                  : "d-flex h-100 align-items-center flex-row-reverse"
                }
              >
                <div className="ml-auto">
                  <Icon
                    icon={`${Chevron_Right}#right_chevron`}
                    color={theme.appColor}
                    size={9}
                    viewBox="0 0 6.378 10.328"
                  />
                </div>
                <p
                  className={mobileView
                    ? "cursorPtr w-500  mb-0 ml-auto status-color txt-capitalize"
                    : "cursorPtr dv__blue_var_1 txt-roman m-0 txt-capitalize"
                  }
                // onClick={() => {
                //   // props.paymentViews && props.withDrawalDialog(props);
                // }}
                >
                  {status.toLowerCase()}
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <style jsx>{`
        .amount-ta {
          font-size: 0.75rem;
        }
        :global(.tranjection-item) {
          //   border-bottom: 1px solid ${color15};
        }
        :global(.tranjection-item-1) {
          border-bottom: ${mobileView ? "unset" : "1px solid #C4C4C4"};
        }
        :global(.tranjection-item-1:after) {
          content: "";
          background-color: ${mobileView ? color15 : "#C4C4C4"};
          width: 1px;
          height: 100%;
          position: absolute;
          left: 0px;
          top: 0px;
          top: 20px;
        }
        :global(.tranjection-item-1:last-child:after) {
          height: calc(100%) !important;
          // content: none !important;
        }

        .dot {
          height: 9px;
          width: 9.3px;
          border-radius: 500px;
          background-color: ${theme?.appColor};
        }

        .status-color {
          font-size: 0.75rem !important;
          color: ${props.withdrawal ? withDrawalColor() : getColors()};
        }
        .tranjection-bar {
          position: absolute;
          left: -3.8px;
          top: 20px;
          z-index: 1;
        }
        :global(.tranjection-item:first-child:before) {
          content: none !important;
        }
        // :global(.tranjection-item:last-child:after) {
        //   content: none !important;
        // }
      `}</style>
    </div>
  );
};

export default TranjectionItems;
