import React, { useEffect, useState } from "react";
import isMobile from "../hooks/isMobile";
import {
  close_dialog,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
  signOut,
} from "../lib/global";
import * as config from "../lib/config";
import useLang from "../hooks/language";
import {
  getSubscriptionPlansApi,
  purchaseSubcriptionApi,
} from "../services/subscriptions";
import usePg from "../hooks/usePag";
import { useDispatch } from "react-redux";
import { getAddress } from "../redux/actions/address";
import Route from "next/router";
import { SubscriptionPlanSkeleton, SubscriptionPlanBenefitSkeleton } from "../components/skeletonui/subscription-plan-skeleton";
import dynamic from "next/dynamic";
const Subscriptions = dynamic(() => import("../components/Drawer/Subscriptions"), { ssr: false })
const FigureImage = dynamic(() => import("../components/image/figure-image"), { ssr: false })
const Img = dynamic(() => import("../components/ui/Img/Img"), { ssr: false })
const RadioButton = dynamic(() => import("../components/formControl/radioButton"), { ssr: false })
import { useTheme } from "react-jss";
const Button = dynamic(() => import("../components/button/button"), { ssr: false })

const subscriptions = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [pg] = usePg();
  const [planData, setPlanData] = useState([]);
  const [planCount, setPlanCount] = useState(0);
  const [descriptionList, setPlanDescriptionList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    getAllPlans();
  }, []);

  const getAllPlans = () => {
    const list = {
      limit: 10,
      offset: page * 10,
    };
    getSubscriptionPlansApi(list)
      .then((res) => {
        if (res && res.data && res.data.data) {
          if (!page) {
            const sugestedPlan = res.data.data.planData.find(
              (item) => item.additionalInfoTag
            );
            handleSelectPlan(sugestedPlan || res.data.data.planData[0] || {});
            setPlanData(res.data.data.planData);
          } else {
            setPlanData((prev) => [...prev, ...res.data.data.planData]);
            if (!selectedPlan) {
              const sugestedPlan = res.data.data.planData.find(
                (item) => item.additionalInfoTag
              );
              handleSelectPlan(sugestedPlan);
            }
          }
        } else {
          console.error("Subscription plans error", res);
        }
        setPageLoading(false);
        setPage((p) => p + 1);
      })
      .catch((error) => {
        console.error("error", error);
        setPageLoading(false);
      });
  };

  const handleSelectPlan = (data = {}) => {
    // console.log('data', data)
    let desclist = [];
    if (data.description) {
      desclist = data.description.split(",");
    }
    if (desclist.length > 4) {
      setShowMore(true);
    }
    setPlanDescriptionList(desclist);
    setSelectedPlan(data);
  };

  const handleGetAddress = () => {
    dispatch(getAddress({ loader: true }));
  };
  const handleBack = async () => {
    await signOut(false);
    window.location = "/login";
  };

  const handlePurchasePlan = (paymentMethod, addressId, promocode) => {
    startLoader();
    close_dialog();
    const requestPayload = {
      planId: selectedPlan._id,
      promoCode: promocode,
      pgLinkId: typeof pg[0] != "undefined" ? pg[0]._id : "",
      paymentMethod: paymentMethod,
      addressId: addressId,
      planType: selectedPlan.type,
    };
    if (!promocode) delete requestPayload.promoCode;

    purchaseSubcriptionApi(requestPayload)
      .then(async (res) => {
        stopLoader();
        if (res && res.data) {
          dispatch({ type: "UPDATE_SUBSCRIPTION_STATUS", payload: true });
          open_dialog("successfullDialog", {
            title: "Subscription purchased successfully!",
            desc: res.data.message,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
            closeAll: true,
          });
          Route.push("/");
        }
      })
      .catch((err) => {
        stopLoader();
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          Toast(err.response.data.message, "error");
        }
      });
  };

  const handleSubmit = () => {
    if (selectedPlan.type === "FREE") {
      return handlePurchasePlan();
    }
    handleGetAddress(),
      open_dialog(
        "Address",
        {
          title: lang.selectBillingAddress,
          onClose: () => {
            close_dialog();
          },
          getAddress: handleGetAddress,
          radio: true,
          checkout: handlePurchasePlan,
          checkoutProps: {
            showPromocode: true,
            showAmout: true,
            amount: (selectedPlan && selectedPlan.amount) || 19.99,
            currency:
              (selectedPlan &&
                selectedPlan.currency &&
                selectedPlan.currency.symbol) ||
              "$",
            promocode: "",
            subscriptionPlanId: selectedPlan._id,
          },
        },
        "right"
      );
  };

  if (mobileView) {
    return <Subscriptions />;
  } else {
    return (
      <React.Fragment>
        <div>
          <div className="dv_wrap">
            <div className="col-12">
              <div className="row">
                <div className="container">
                  <div className="row col-md-12 px-0 m-0 vh-100 align-items-center justify-content-between py-3">
                    {/* <div className="col-md-4 p-0 m-0 dv_sub_formFir">
                      <FigureImage
                        fclassname="mb-0"
                        src={config.desktopiphone}
                        alt="iphone"
                        width="100%"
                      />
                    </div> */}
                    <div className="col-md-8 m-0 dv_sub_formSec p-3">
                      <div className="col">
                        <div className="row d-flex align-items-end">
                          <div className="col-auto pr-0">
                            <Img
                              src={config.Subscription_Star}
                              style={{ width: "22px" }}
                              alt="star"
                            />
                          </div>
                          <div className="col">
                            <h6 className="subscription_head mb-0">
                              {"SUBSCRIPTIONS"}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <Img
                        src={config.LOGOUT}
                        className="closeIcon"
                        onClick={() => handleBack()}
                      ></Img>
                      <div className="col my-3">
                        <h2 className="DV_subscription_title mb-0">
                          {lang.getFreelySubscription}
                        </h2>
                      </div>

                      <div className="col-12 mb-4">
                        {pageLoading ? (
                          <SubscriptionPlanBenefitSkeleton />
                        ) : null}
                        {!pageLoading ? (
                          <ul className="nav subscriptionUL col-12 row p-0 m-0">
                            {showMore &&
                              descriptionList.slice(0, 4).map((item, i) => {
                                if (!item || !item.length) return <></>;
                                return (
                                  <li
                                    key={i}
                                    className="nav-item mb-2 col-md-6"
                                  >
                                    {item}
                                    {i == 3 ? (
                                      <span
                                        onClick={() => setShowMore(false)}
                                        className="more__baseClr"
                                      >
                                        ...more
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </li>
                                );
                              })}
                            {!showMore &&
                              descriptionList.map((item, i) => {
                                if (!item || !item.length) return <></>;
                                return (
                                  <li
                                    key={i}
                                    className="nav-item mb-2 col-md-6"
                                  >
                                    {item}
                                    {i > 3 &&
                                      i == descriptionList.length - 1 ? (
                                      <span
                                        onClick={() => setShowMore(true)}
                                        className="more__baseClr"
                                      >
                                        ...less
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        ) : null}
                      </div>

                      <div className="col-12 row m-0 justify-content-center">
                        {pageLoading ? <SubscriptionPlanSkeleton /> : null}
                        {!pageLoading
                          ? planData.map((item, i) => {
                            return (
                              <label
                                key={i}
                                onClick={() => handleSelectPlan(item)}
                                style={{
                                  backgroundColor: item.boxColor || "#fff",
                                  color: item.textColor || "#000",
                                }}
                                className="DV__subscriptionRadio col-lg-5 mx-1"
                              >
                                {(item.currency && item.currency.symbol) ||
                                  ""}
                                {item.amount
                                  ? item.amount.toFixed(2)
                                  : "FREE"}
                                {item.discountText && (
                                  <span className="subscription__offer">
                                    {item.discountText}
                                  </span>
                                )}
                                {/* <input checked={'checked'} type="radio" name="radio"></input>
                                  <span className="checkmark"></span> */}
                                {/* <div className="ml-auto col card-radio"> */}
                                <RadioButton
                                  name={""}
                                  lable=""
                                  labelClass="subscriptionPlans"
                                  checked={
                                    selectedPlan &&
                                      item._id == selectedPlan._id
                                      ? true
                                      : false
                                  }
                                ></RadioButton>
                                {/* </div> */}
                                <div className="form-row">
                                  <div className="col-auto">
                                    <span className="subsciption__type__title">
                                      {item.name}
                                    </span>
                                  </div>
                                  {item.additionalInfoTag ? (
                                    <>
                                      <div className="col-auto">
                                        <span className="dot__custom__dark"></span>{" "}
                                        <span className="lemonYellow__title">
                                          {item.additionalInfoText}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </label>
                            );
                          })
                          : null}
                      </div>

                      <div className="col-12">
                        {selectedPlan ? (
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            cssStyles={theme.blueButton}
                            id="crtr_profile"
                          >
                            {lang.subscribeFor} &thinsp;
                            {(selectedPlan.currency &&
                              selectedPlan.currency.symbol) ||
                              ""}
                            {selectedPlan.amount ? (
                              <>{selectedPlan.amount.toFixed(2)}</>
                            ) : (
                              "FREE ( One Month )"
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled
                            cssStyles={theme.blueButton}
                            id="crtr_profile"
                          >
                            Select a Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style jsx>
            {`
              :global(.closeIcon) {
                width: 23px;
                position: absolute;
                top: 5px;
                right: 0;
                cursor: pointer;
              }
              .subscription_head {
                letter-spacing: -0.48px;
                text-transform: capitalize;
                color: #ffffff;
                font-size: 20px;
              }
              .DV_subscription_title {
                letter-spacing: 0.61px;
                font-family: "Roboto", sans-serif !important;
                font-size: 34px;
              }
              :global(.MuiDrawer-paper) {
                width: 100% !important;
                max-width: 100% !important;
                color: inherit;
              }
              :global(.MuiDrawer-paper > div) {
                width: 100% !important;
                max-width: 100% !important;
              }
              .subscriptionUL li::before {
                content: "";
                background-image: url(${config.Selective_BP_Blue});
                height: 15px;
                width: 15px;
                position: absolute;
                background-repeat: no-repeat;
                background-size: contain;
                left: 0px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1;
              }
              .subscriptionUL li {
                height: fit-content;
              }
              .subscriptionSec {
                height: 100vh;
                overflow: auto;
              }
              .dv_sub_formFir {
                // width: 40%
              }
              .dv_sub_formSec {
                // width: 60%;
              }
              #crtr_profile {
                max-width: 450px;
                margin: auto;
              }
            `}
          </style>
        </div>
      </React.Fragment>
    );
  }
  return <React.Fragment></React.Fragment>;
};

export default subscriptions;
