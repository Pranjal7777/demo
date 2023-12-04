import find from "lodash/find";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import CustomLink from "../../components/Link/Link";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import FilterBox from "../../components/select/select";
import Img from "../../components/ui/Img/Img";
import Pagination from "../../hoc/divPagination";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import {
  No_Billing,
  Right_Chevron_Base,
  Subscription_Plan,
  Tip_Plan,
  Vip_Plan,
} from "../../lib/config";
import {
  handleCurrencySymbol,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getCookie } from "../../lib/session";
import { getBillingPlans, getSubscribedPlanData } from "../../services/billing";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import { handleContextMenu } from "../../lib/helper";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), {
  ssr: false,
});
const DVBillingPlans = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [profile] = useProfileData();
  const [subscribed, setSubcription] = useState(profile.subscribedUser);
  const [billingData, setBillingData] = useState([]);
  const [planDetails, setPlanDetails] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [selectedFilter, setFilterSelected] = useState({
    value: 1,
    label: lang.allOrders,
    name: "billingPlans",
  });
  const [Loader, setLoader] = useState(false);

  const filters = [
    { value: 1, label: lang.allOrders, name: "billingPlans" },
    { value: 2, label: lang.subscriptions, name: "billingPlans" },
    { value: 3, label: lang.vipChats, name: "billingPlans" },
    { value: 4, label: lang.postPurchases, name: "billingPlans" },
    { value: 5, label: lang.tips, name: "billingPlans" },
  ]
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    subscribed ? handleGetSubscribedPlan() : "";
  }, []);

  const handleGetSubscribedPlan = async () => {
    let payload = {};
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    try {
      let response = await getSubscribedPlanData(payload);
      setPlanDetails((response && response.data && response.data.data) || {});
    } catch (e) {
      Toast(e.response.message, "error");
    }
  };

  useEffect(() => {
    setPageCount(0);
    setBillingData([]);
    handleGetBillingPlans(selectedFilter.value, 0, 10);
    setBillingData([]);
  }, [selectedFilter]);

  const handleGetBillingPlans = async (billingType = selectedFilter.value, offset = 0, limit = 10) => {
    setLoader(true);
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
      if (response.status == 200 && response.data.data) {
        setHasMore(true)
        setPageCount(pageCount + 1)
        if (offset) {
          setBillingData((prev) => [...prev, ...response.data.data]);
        } else {
          setBillingData(response.data.data);
        }
      } else {
        setHasMore(false)
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
      setHasMore(false)
      if (e && e.response && e.response.data) {
        Toast(e.response.data.message, "error");
      }
    }
  };

  const handlePlanImg = (type) => {
    switch (type) {
      case "VIP_PLAN":
        return Vip_Plan;
      case "SUBSCRIPTIONS":
        return Subscription_Plan;
      case "TIP":
        return Tip_Plan;
      case "WALLET_RECHARGED":
        return Tip_Plan;
      case "VIDEO_SHOUTOUT":
        return Subscription_Plan;
      case "VIDEO_CALL":
        return Subscription_Plan;  
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
      default:
        return type;
    }
  };

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

  return (
    <Wrapper>
      <div className="dv_plans_cont px-2">
        <h5 className="content_heading px-1 m-0 position-sticky sectionHeading " style={{ top: '-16px', zIndex: '99' }}>
          {lang.billingHistory}
        </h5>
        <div className="col-12 p-0">
          <div className="filter_options">
            <FilterBox
              options={filters}
              value={selectedFilter}
              filterSelect={(event) =>
                setFilterSelected(
                  find(filters, { value: parseInt(event.value) })
                )
              }
              apptheme={theme}
            />
          </div>

          <PaginationIndicator
            id={"page_more_side_bar"}
            key={selectedFilter.value}
            totalData={billingData}
            pageEventHandler={() => {
              if (!Loader && hasMore) {
                handleGetBillingPlans(selectedFilter.value, pageCount, 10);
              }
            }}
          />
          <div
            className="col-12 px-0"
            id="billingPlans"
            style={{
              marginTop: "20px",
              // overflowY: "scroll",
              // height: `${userType == 1 ? "29.282vw" : "36.603vw"}`,
              // height: "calc(100vh - 5.7rem)",
            }}
          >
            {billingData && billingData.length ? (
              billingData.map((data, index) => (
                <CustomLink
                  key={index}
                  target="_blank"
                  href={data.invoiceUrl ? data.invoiceUrl : ""}
                >
                  <label key={index} className="dv_bill__options__item">
                    <div className="d-flex align-items-center">
                      <div className="col-1 pl-0 callout-none" onContextMenu={handleContextMenu}>
                        {(data.orderType == "POST_PURCHASE" && data.postData.url) ||
                          (data.orderType == "TIP" && (data.url || data.postData.thumbnail || data.postData.url)) ||
                          (data.orderType == "LOCKED_POST" && data.postData.url) || (data.orderType == "VIRTUAL_ORDER" && (data.orderThumbnailUrl || data?.opponentProfilePic))
                          || (data.orderType == "STREAM_PURCHASE" && !!data.opponentProfilePic)
                          ? <FigureCloudinayImage
                            publicId={data.orderType == "VIRTUAL_ORDER" ? (data?.orderThumbnailUrl || data?.opponentProfilePic) : (data.url || data.postData?.thumbnail || data.postData?.url)}
                            postType={1}
                            style={{
                              width: "4.536vw",
                              height: "4.536vw",
                              borderRadius: "8px",
                              // marginRight: "2.666vw",
                              objectFit: "cover",
                              objectPosition: "top",
                              padding: "0",
                            }}
                            alt="icon"
                            tileLockIcon={data.orderType == "TIP" ? "true" : ""}
                            lockLeft="32%"
                            billingScreen={true}
                            lockIcon={false}
                          />
                          : data?.postData?.text
                            ? <Tooltip disableFocusListener title={data?.postData?.text}>
                              <div className="d-flex justify-content-center align-items-center"
                                style={{
                                  width: "4.536vw",
                                  height: "4.536vw",
                                  borderRadius: "8px",
                                  // marginRight: "2.666vw",
                                  background: data?.postData?.bgColorCode,
                                  color: data?.postData?.colorCode,
                                  fontFamily: data?.postData?.font,
                                  padding: "4px 5px"
                                }}>
                                {data?.postData?.text.length > 25 ? data?.postData?.text.slice(0, 20) + "..." : data?.postData?.text}
                              </div>
                            </Tooltip>
                            : <Img
                              src={handlePlanImg(data.orderType)}
                              style={{
                                width: "4.536vw",
                                height: "4.536vw",
                                borderRadius: "8px",
                                // marginRight: "2.666vw",
                              }}
                            />
                        }
                      </div>
                      <div className="col-11 pr-0 row mx-0">
                        <div className="col-2 ">
                          <div className="titleTag">{lang.price}</div>
                          <span className="text-nowrap d-flex flex-row align-items-center">
                            {/* {handleCurrencySymbol(
                              data.currency == null || data.currency === '$' ? "USD" : data.currency
                            )}{" "} */}
                            <Icon
                              icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                              size={18}
                              class="mr-1"
                              alt="follow icon"
                              viewBox="0 0 18 18"
                            />&nbsp;
                            {data.amount || "0.00"}
                          </span>
                        </div>
                        <div className="col-3 pl-0">
                          <div className="titleTag">{lang.category}</div>
                          <span className="">
                            {handleOrderType(data.orderType)}
                          </span>
                        </div>
                        <div className="col-3">
                          {data.opponentUserName !== profile?.username ? <>
                            <div className="titleTag">{lang.creatorName}</div>
                            <p className=" m-0">
                              @{data.opponentUserName}
                            </p></> : ""}
                        </div>
                        <div className="col-3 px-0">
                          <div className="titleTag">{lang.dateTime}</div>
                          <span className="">
                            {moment(data?.orderTs).format(
                              "MMM DD, YYYY, hh:mm a"
                            )}
                          </span>
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-end pl-0">
                          <Icon
                            icon={Right_Chevron_Base + "#right_arrow"}
                            // class="dv__right_chevron"
                            // color='var(--l_base)'
                            width={12}
                            height={12}
                            viewBox='0 0 12 12'

                          />
                        </div>
                      </div>
                    </div>
                  </label>
                </CustomLink>
              ))
            ) : Loader ? (
              ""
            ) : (
              <div className="no-users h-100 d-flex justify-content-center align-items-center w-700 text-color-gray">
                <div className="text-center">
                  <Img
                    key="empty-placeholder"
                    className="text"
                    src={No_Billing}
                  />
                  <div className="dv_appTxtClr my-3">{lang.noDataFound}</div>
                </div>
              </div>
            )}
            {Loader ? (
              <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={true} size={60} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
            overflow-y: unset;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
          :global(.dv__right_chevron) {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 0.585vw;
            height: 0.909vw;
          }
          .filter_options {
            position: sticky;
            top: -11px !important;
            z-index: 999;
            width: 200px;
            margin-left: auto;
            margin-top: -43px;
          }
          .titleTag{
            color: #836B8A;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default DVBillingPlans;
