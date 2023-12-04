import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useLang from "../../hooks/language";
import usePg from "../../hooks/usePag";
import useReduxData from "../../hooks/useReduxState";
import {
  CHECK,
  LOGOUT,
  Selective_BP_Blue,
  Subscription_Star,
} from "../../lib/config";
import {
  close_drawer,
  drawerToast,
  open_drawer,
  signOut,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getAddress } from "../../redux/actions/address";
import { getSubscriptionPlansApi, purchaseSubcriptionApi } from "../../services/subscriptions";
import Route from 'next/router';
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper"
const Img = dynamic(()=>import("../ui/Img/Img"),{ssr:false});
const RadioButton = dynamic(()=>import("../formControl/radioButton"),{ssr:false});
const PaginationIndicator = dynamic(()=>import("../pagination/paginationIndicator"),{ssr:false});
const CustomDataLoader = dynamic(()=>import("../loader/custom-data-loading"),{ssr:false});
const Drawer = dynamic(()=>import("./Drawer"),{ssr:false});
const VerifyAcc = dynamic(()=>import("./VerifyAcc"),{ssr:false});
const Button = dynamic(()=>import("../button/button"),{ssr:false});
import { useTheme } from "react-jss";

export default function Subscriptions(props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);

  const [lang] = useLang();
  const [pg] = usePg();
  const [planData, setPlanData] = useState([]);
  const [planCount, setPlanCount] = useState(0);
  const [descriptionList, setPlanDescriptionList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

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
            setPlanData([...res.data.data.planData]);
          } else {
            setPlanData((prev) => [...prev, ...res.data.data.planData]);
            if (!selectedPlan) {
              const sugestedPlan = res.data.data.planData.find(
                (item) => item.additionalInfoTag
              );
              handleSelectPlan(sugestedPlan);
            }
          }
          setTotalCount(res.data.data.totalCount);
        }
        setPageLoading(false);
        setPage((p) => p + 1);
      })
      .catch((error) => {
        console.error("error", error);
        setPageLoading(false);
      });
  };

  const handleCloseDrawer = () => {
    // router.back();
  };

  const handleGetAddress = () => {
    dispatch(getAddress({ loader: true }));
  };

  const handleBack = async () => {
    // props.handleCloseDrawer && props.handleCloseDrawer();
    // props.onClose && props.onClose();
    await signOut(false);
    window.location = "/login";
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

  const handleSubmit = () => {
    if (selectedPlan.type === "FREE") {
      return handlePurchasePlan();
    }
    handleGetAddress(),
      open_drawer(
        "Address",
        {
          title: lang.selectBillingAddress,
          onClose: handleCloseDrawer,
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

  const handlePurchasePlan = (
    paymentMethod = "",
    addressId = "",
    promocode = ""
  ) => {
    startLoader();
    const requestPayload = {
      planId: selectedPlan._id,
      promoCode: promocode,
      pgLinkId: typeof pg[0] != "undefined" ? pg[0]._id : "",
      paymentMethod: paymentMethod,
      addressId: addressId,
      planType: selectedPlan.type, //remove and add creatorId
    };
    if (!promocode) delete requestPayload.promoCode;

    purchaseSubcriptionApi(requestPayload)
      .then((res) => {
        stopLoader();
        if (res && res.data) {
          close_drawer();
          dispatch({ type: "UPDATE_SUBSCRIPTION_STATUS", payload: true });
          Route.push("/");
          setTimeout(() => {
            open_drawer(
              "drawerToaster",
              {
                icon: CHECK,
                title: lang.subscriptionPurchased,
                desc: res.data.message,
                closeIconVisible: false,
                titleClass: "max-full",
                autoClose: true,
                handleClose: () => {
                  close_drawer();
                },
              },
              "bottom"
            );
          }, 500);
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
          if (err.response.status === 409) {
            close_drawer();
            Route.push("/");
          }
          Toast(err.response.data.message, "error");
        }
      });
  };

  useEffect(() => {
    if (pageLoading) {
      getAllPlans(page + 1);
    }
  }, [pageLoading]);

  return (
    <Wrapper>
      <div
        id="subsc_wrapper"
        className="bg-dark-custom subscriptionSec position-relative py-3"
      >
        <PaginationIndicator
          id="subsc_wrapper"
          pageEventHandler={async () => {
            if (!pageLoading && page && planData.length < totalCount) {
              setPageLoading(true);
            }
          }}
        />
        <div className="mb-5">
          <div className="col-12 mb-4 pb-2">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col-auto pr-0">
                    <Img
                      src={Subscription_Star}
                      style={{ width: "22px" }}
                      alt="star"
                    />
                  </div>
                  <div className="col">
                    <h6 className="subscription_title mb-0">
                      {lang.getFreelySubscription}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Img
                  src={LOGOUT}
                  onClick={() => handleBack()}
                  width="20"
                  alt="close"
                />
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <ul className="nav flex-column subscriptionUL">
              {showMore &&
                descriptionList.slice(0, 4).map((item, i) => {
                  if (!item || !item.length) return <></>;
                  return (
                    <li key={i} className="nav-item mb-2">
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
                    <li key={i} className="nav-item mb-2">
                      {item}
                      {i > 3 && i == descriptionList.length - 1 ? (
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
          </div>

          <div className="col-12">
            {planData.map((item, i) => {
              return (
                <label
                  key={i}
                  onClick={() => handleSelectPlan(item)}
                  style={{
                    backgroundColor: item.boxColor || "#ffd1d108",
                    color: item.textColor || "#fff",
                  }}
                  className="subscriptionRadio"
                >
                  {(item.currency && item.currency.symbol) || ""}
                  {item.amount ? item.amount.toFixed(2) : "FREE"}
                  {item.discountText && (
                    <span className="subscription__offer">
                      {item.discountText}
                    </span>
                  )}
                  <RadioButton
                    name={""}
                    lable=""
                    checked={
                      selectedPlan && item._id == selectedPlan._id
                        ? true
                        : false
                    }
                  />
                  <div className="form-row">
                    <div className="col-auto">
                      <span className="subsciption__type__title">
                        {item.name}
                      </span>
                    </div>
                    {item.additionalInfoTag ? (
                      <>
                        <div className="col-auto">
                          <span className="dot__custom"></span>
                        </div>
                        <div className="col-auto">
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
            })}
          </div>

          <div className="btnPosBtm">
            {selectedPlan ? (
              <Button
                type="button"
                onClick={handleSubmit}
                cssStyles={theme.blueButton}
                id="crtr_profile"
              >
                {lang.subscribeFor} &thinsp;
                {(selectedPlan.currency && selectedPlan.currency.symbol) || ""}
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
          <div className="text-center">
            <CustomDataLoader type="normal" isLoading={pageLoading} />
          </div>
        </div>
      </div>
      <Drawer open={toggleDrawer} anchor="bottom">
        <VerifyAcc heading={lang.cancelHeading} msg={lang.cancelMsg} />
      </Drawer>
      <style jsx>
        {`
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
            background-image: url(${Selective_BP_Blue});
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
          .subscriptionSec {
            height: 100vh;
            overflow: auto;
          }
        `}
      </style>
    </Wrapper>
  );
}
