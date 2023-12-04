import React, { useState, useEffect } from "react";
import Route from "next/router";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";

import {
  backNavMenu,
  handleCurrencySymbol,
  isIOSDevice,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import * as env from "../../lib/config";
import find from "lodash/find";
import moment from "moment";
import { getBillingPlans, getSubscribedPlanData } from "../../services/billing";
import useProfileData from "../../hooks/useProfileData";
import { getReasons } from "../../services/auth";
import CustomDataLoader from "../loader/custom-data-loading";
import { getCookie } from "../../lib/session";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const CustomLink = dynamic(() => import("../Link/Link"), { ssr: false });
const Pagination = dynamic(() => import("../../hoc/divPagination"), {
  ssr: false,
});
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), {
  ssr: false,
});
export default function BillingAndPlans(props) {
  const [lang] = useLang();
  const [profile] = useProfileData();
  const [subscribed, setSubcription] = useState(profile.subscribedUser);
  const [selectedFilter, setFilterSelected] = useState({
    value: 1,
    label: lang.allOrders,
    name: "billingPlans",
  });
  const [billingData, setBillingData] = useState([]);
  const [planDetails, setPlanDetails] = useState({});
  const [isIos, setIsIos] = useState(false);
  const userType = getCookie("userType");
  const theme = useTheme();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [Loader, setLoader] = useState(false);

  useEffect(() => {
    subscribed ? handleGetSubscribedPlan() : "";
    handleGetBillingPlans(selectedFilter.value, 0, 10, false);
  }, []);
  useEffect(() => {
    setIsIos(isIOSDevice())
  }, [])
  const handleGetSubscribedPlan = async () => {
    let payload = {};
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    try {
      let response = await getSubscribedPlanData();
      setPlanDetails(response && response.data && response.data.data);
    } catch (e) {
      Toast(e.response.message, "error");
    }
  };

  useEffect(() => {
    handleGetBillingPlans(selectedFilter.value, 0, 10, false);
    setBillingData([]);
  }, [selectedFilter]);

  const handleGetBillingPlans = async (
    billingType = selectedFilter.value,
    offset = 0,
    limit = 5,
    loader = false
  ) => {
    setLoader(1);
    !loader && startLoader();
    return new Promise(async (res, rej) => {
      const payload = {
        billingType: billingType,
        offset: offset * limit,
        limit,
      }
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }
      try {
        let response = await getBillingPlans(payload);
        // console.log("dwjkod", response);
        stopLoader();
        setLoader(0);
        let oldPlans = [];

        if (offset != 0) {
          oldPlans = [...billingData];
        }

        if (response.status == 200) {
          setBillingData([
            ...oldPlans,
            ...(response && response.data && response.data.data),
          ]);
        } else {
          return rej();
        }
        res();
      } catch (e) {
        stopLoader();
        setLoader(0);
        Toast(e.response.data.message, "error");
        setBillingData([]);
      }
    });
  };

  const getPlans = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await handleGetBillingPlans(selectedFilter.value, page, 10, true);
        res();
      } catch (e) {
        rej();
      }
    });
  };

  const filters =[
      { value: 1, label: lang.allOrders, name: "billingPlans" },
      { value: 2, label: lang.subscriptions, name: "billingPlans" },
      { value: 3, label: lang.vipChats, name: "billingPlans" },
      { value: 4, label: lang.postPurchases, name: "billingPlans" },
      { value: 5, label: lang.tips, name: "billingPlans" },
    ];

  const handlePlanDesc = (data) => {
    switch (data.orderType) {
      case "POST_PURCHASE":
        return `${lang.postFrom} @${data.opponentUserName}`;
      case "VIP_PLAN":
        return `${lang.vipChatWith} @${data.opponentUserName}`;
      case "SUBSCRIPTIONS":
        return `${data.productName} with @${data.opponentUserName}`;
      case "TIP":
        return `${lang.tipSentTo} @${data.opponentUserName}`;
      case "LOCKED_POST":
        return `${lang.purchasedFrom} @${data.opponentUserName}`;
      case "STREAM_PURCHASE":
        return `Stream from @${data.opponentUserName}`;
      default:
        break;
    }
  };

  const handleOrderType = (type) => {
    switch (type) {
      case "POST_PURCHASE":
        return lang.postPurchased;
      case "VIP_PLAN":
        return lang.vipChat;
      case "SUBSCRIPTIONS":
        return lang.subscription;
      case "TIP":
        return lang.tip;
      case "VIRTUAL_ORDER":
        return lang.virtualOrder;
      case "LOCKED_POST":
        return lang.uploadLockedPost;
      case "STREAM_PURCHASE":
        return "Stream Purchased";
      case "WALLET_RECHARGED":
        return lang.walletRechargeTxt;
      case "VIDEO_SHOUTOUT":
        return lang.shoutOutRequest
      default:
        return type;
    }
  };

  const handlePlanImg = (type) => {
    switch (type) {
      case "VIP_PLAN":
        return env.Vip_Plan;
      case "SUBSCRIPTIONS":
        return env.Subscription_Plan;
      case "TIP":
        return env.Tip_Plan;
      case "WALLET_RECHARGED":
        return env.Tip_Plan;
      case "VIDEO_SHOUTOUT":
        return env.Subscription_Plan;
      case "VIDEO_CALL":
        return env.Subscription_Plan;  
      default:
        break;
    }
  };

  // no use of this function
  const GetDeactivateReasons = async () => {
    startLoader();
    try {
      let reasonType = 4; // 4 -> cancel subscription
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        stopLoader();
        let arr = response && response.data && response.data.data;
        open_drawer(
          "cancelSubscription",
          {
            reasons: arr,
            validTill: moment(planDetails && planDetails.planEndTime).format(
              "MMM DD, YYYY"
            ),
          },
          "right"
        );
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  // console.log("hdwud", billingData);
  return (
    <Wrapper>
      {billingData?.length && (
        <Pagination
          key={selectedFilter.value}
          id="billingPlans"
          items={billingData}
          getItems={getPlans}
        />
      )}
      <div className="bg-dark-custom">
        <Header
          title={lang.billingHistory}
          back={() => {
            backNavMenu(props);
          }}
        />
        <>
          <div className="col-12 mb-3" style={{ paddingTop: "70px" }}>
            <div className="row justify-content-end">
              {/* <div className="col-auto">
                <span
                  className={`${theme.type == "light"
                    ? "billing__history__title__static"
                    : "billing__history__title__static_dark"
                    }`}
                >
                  {lang.billingHistory}
                </span>
              </div> */}
              <div className="col-auto">
                <span
                  className="all__order__dropdown"
                  onClick={() =>
                    open_drawer("radioSelectore", {
                      title: lang.billingHistory,
                      value: selectedFilter.value,
                      data: filters,
                      onSelect: (type) => {
                        setFilterSelected(
                          find(filters, { value: parseInt(type) })
                        );
                      },
                    }, "bottom"
                    )
                  }
                >
                  {selectedFilter.label}
                  <Img
                    src={env.Down_Arrow_Blue}
                    style={{
                      width: "7px",
                      transform: "rotate(90deg)",
                      margin: "0 5px",
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
          <div
            className={`col-12 mb-5 overflow-auto `} style={{ height: isIos ? "75vh" : "85vh" }}
            id="billingPlans"
          >
            {billingData?.length ? (
              billingData?.map((data, index) => (
                <CustomLink
                  href={data.invoiceUrl ? data.invoiceUrl : ""}
                  key={index}
                  target="_blank"
                >
                  <label className="bill__options__item">
                    <div className="d-flex align-items-center">
                      <div className="callout-none" onContextMenu={handleContextMenu}>
                        {(data.orderType == "POST_PURCHASE" && data.postData.url) ||
                          (data.orderType == "TIP" && (data.url || data.postData.thumbnail || data.postData.url)) ||
                          (data.orderType == "LOCKED_POST" && data.postData.url) || (data.orderType == "VIRTUAL_ORDER" && (data.orderThumbnailUrl || data?.opponentProfilePic ))
                          || (data.orderType == "STREAM_PURCHASE" && !!data.opponentProfilePic)
                          ? (
                            <FigureCloudinayImage
                              publicId={data.orderType == "VIRTUAL_ORDER" ? (data?.orderThumbnailUrl || data?.opponentProfilePic) : (data.url || data.postData?.thumbnail || data.postData?.url)}
                              postType={1}
                              style={{
                                width: "19.466vw",
                                height: "19.466vw",
                                borderRadius: "8px",
                                marginRight: "2.666vw",
                                objectFit: "cover",
                                objectPosition: "top",
                                padding: "0",
                              }}
                              tileLockIcon={data.orderType == "TIP" ? "true" : ""}
                              billingScreen={true}
                              lockIcon={false}
                            />
                          ) : data?.postData?.text ? (
                            <Tooltip disableFocusListener title={data?.postData?.text}>
                              <div className="d-flex justify-content-center align-items-center"
                                style={{
                                  width: "19.466vw",
                                  height: "19.466vw",
                                  borderRadius: "8px",
                                  marginRight: "2.666vw",
                                  background: data?.postData?.bgColorCode,
                                  color: data?.postData?.colorCode,
                                  fontFamily: data?.postData?.font,
                                  padding: "4px 5px"
                                }}>
                                {data?.postData?.text.length > 25 ? data?.postData?.text.slice(0, 20) + "..." : data?.postData?.text}
                              </div>
                            </Tooltip>
                          ) : (
                            <Img
                              src={handlePlanImg(data.orderType)}
                              style={{
                                width: "19.466vw",
                                height: "19.466vw",
                                borderRadius: "8px",
                                marginRight: "2.666vw",
                              }}
                            />
                          )}
                      </div>
                      <div>
                        <div className="form-row">
                          <div className="col-auto">
                            <span
                              className={`${theme.type == "light"
                                ? "billing__history__title__static"
                                : "billing__history__title__static_dark"
                                }`}
                            >
                              {handleCurrencySymbol(
                                data.currency == null || data.currency == '$' ? "USD" : data.currency
                              )}{" "}
                              {data.amount}
                            </span>
                          </div>
                          <div className="col-auto">
                            <span className="dot__custom" />
                          </div>
                          <div className="col-auto">
                            <span className="subscription__type">
                              {handleOrderType(data.orderType)}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`${theme.type == "light"
                            ? "subsciption__type__title"
                            : "subsciption__type__title_dark"
                            } m-0`}
                        >
                          {handlePlanDesc(data)}
                        </p>
                        <span
                          className={`${theme.type == "light"
                            ? "subsciption__type__title"
                            : "subsciption__type__title_dark"
                            }`}
                        >
                        {moment(data?.orderTs).format("dddd MMM DD, YYYY, hh:mm a")}
                        </span>
                      </div>
                    </div>
                    <Img
                      src={env.Down_Arrow_Blue}
                      className="right_chevron"
                      alt="down_arrow"
                    />
                  </label>
                </CustomLink>
              ))
            ) : !Loader || billingData?.length ? (
              <div className="no-users pt-5 d-flex justify-content-center align-items-center w-700">
                <div className="text-center">
                  <Img
                    key="empty-placeholder"
                    className="text"
                    src={env.No_Billing}
                  />
                  <div className="my-3">{lang.noDataFound}</div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {Loader ? (
              <div className="text-center">
                <CustomDataLoader type="normal" isLoading={Loader} />
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      </div>
      <style jsx>
        {`
          :global(.right_chevron) {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            width: 7px;
          }
        `}
      </style>
    </Wrapper>
  );
}
