import React, { useState, useEffect } from "react";
import {
  authenticate,
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { useDispatch } from "react-redux";
import {
  getSelectedPlans,
  purchaseSubcriptionApi,
} from "../../../services/subscriptions";
import { getAddress } from "../../../redux/actions/address";
import { getCookie } from "../../../lib/session";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("../../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import usePg from "../../../hooks/usePag";
import useReduxData from "../../../hooks/useReduxState";
import { useRouter } from "next/router";
import { SUBSCRIPTION_PLACEHOLDER_SVG } from "../../../lib/config";
import Img from "../../ui/Img/Img";

export default function CreatorPlanSubscription(props) {
  const theme = useTheme();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const [pg] = usePg();
  const dispatch = useDispatch();
  const router = useRouter();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [Plans, setPlans] = useState([]);
  const [noPlan, setNOPlan] = useState();


  // const [selectedPlan, setSelectedPlan] = useState(null);
  const splan = React.createRef({})
  useEffect(() => {
    handleGetPlans();
  }, []);

  const handleGetPlans = async () => {
    startLoader();
    try {
      let response = await getSelectedPlans(props?.creatorId);
      if (response.status == 200) {
        stopLoader();
        setPlans(response?.data?.data);
        setNOPlan(false)
      } else if (response.status == 204) {
        stopLoader();
        setNOPlan(true)
      } else {
        stopLoader();
        Toast(lang.errorMsg, "error");
      }
    } catch (e) {
      stopLoader();
      Toast(e?.response?.data?.message, "error");
      console.error("ERROR IN handleGetPlans", e)
    }
  };

  const handleDurationType = (type) => {
    switch (type) {
      case "DAYS":
        return "days";
      case "MONTHLY":
        return "months";
    }
  };

  const handleSelectionPlan = (plan) => {
    startLoader();
    // setSelectedPlan(plan);
    splan.current = plan
    handlePaymentScreen(plan);
  };

  const handlePaymentScreen = (plan) => {
    handleGetAddress(),
      mobileView
        ? reduxData.defaultAddress && reduxData.defaultCard
          ? open_drawer(
            "purchseConfirmDialog",
            {
              title: `${lang.confirmPlanBuy} to ${props.creatorName}'s subscription plan "${plan.subscriptionTitle}" for $${plan?.amount}?`,
              checkout: buyPlan,
              alert: `${lang.subscriptionNote} Subscription ${lang.subNoteCont}`,
              price: plan?.amount,
            },
            "bottom"
          )
          : open_drawer(
            "Address",
            {
              title: lang.selectBillingAddress,
              getAddress: handleGetAddress,
              checkout: buyPlan,
              radio: true,
              // onConfirm: (address) => {
              //   // setAddress(address);
              //   close_drawer("Address");
              // },
            },
            "right"
          )
        : reduxData.defaultAddress && reduxData.defaultCard
          ? open_dialog("purchaseConfirm", {
            title: `${lang.confirmPlanBuy} to ${props.creatorName}'s subscription plan "${plan.subscriptionTitle}" for $${plan?.amount}?`,
            checkout: buyPlan,
            closeAll: true,
            alert: `${lang.subscriptionNote} Subscription ${lang.subNoteCont}`,
            price: plan.amount,
          })
          : open_dialog("Address", {
            title: lang.selectBillingAddress,
            onClose: props.onClose,
            getAddress: handleGetAddress,
            checkout: buyPlan,
            radio: true,
          });
  };

  const handleGetAddress = async () => {
    await dispatch(getAddress({ loader: true }));
  };

  const buyPlan = async (paymentMethod, addressId) => {
    startLoader();
    try {
      const payload = {
        planId: splan?.current?._id,
        creatorId: props.creatorId,
        // promoCode: promocode,
        addressId: addressId,
        paymentMethod: paymentMethod,
        pgLinkId: typeof pg[0] != "undefined" ? pg[0]._id : "",
      };

      // if (!promocode) delete payload.promoCode;

      const res = await purchaseSubcriptionApi(payload);

      stopLoader();
      if (res && res.data) {
        Toast(lang.subscriptionPurchased, "success");
        close_dialog();
        close_drawer("purchseConfirmDialog");
        close_drawer("Address");
        close_drawer("checkout");
        props.onClose();
        router.pathname == "/otherProfile" ? router.reload() : props.subscribedEvent(props.creatorId);
      }
    } catch (err) {
      stopLoader();
      if (err?.response?.data?.message) {
        if (err.response.status === 409) {
          close_dialog();
          // Route.push('/')
          close_drawer("purchseConfirmDialog");
          close_drawer("Address");
          close_drawer("checkout");
          props.onClose();
        }
        Toast(err.response.data.message, "error");
      }
    }
  };

  const SubscribePlans = () => {
    return (
      <div className="pt-3 align-items-center justify-content-between">
        {Plans.map((plan, index) => {
          return (
            <div className="mb-3" key={index}>
              <p className="appTextColor mb-1 txt-heavy fntSz16">
                Subscription ${plan.amount} per {plan.duration}{" "}
                {handleDurationType(plan.durationType)}
              </p>
              <div>
                <Button
                  cssStyles={
                    mobileView
                      ? theme.blueBorderButton
                      : theme.dv_blueBorderButton
                  }
                  onClick={() => {
                    handleSelectionPlan(plan);
                  }}
                >
                  {lang.subscribeFor} ${plan.amount}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {mobileView ? (
        <div className="btmModal">
          <div className="modal-dialog">
            {noPlan ?
              (
                <div className="modal-content pt-3">
                  <button
                    type="button"
                    className="close dv_modal_close"
                    data-dismiss="modal"
                    onClick={() => props.onClose()}
                  >
                    {lang.btnX}
                  </button>
                  <div className="text-center py-4">
                    <Img src={SUBSCRIPTION_PLACEHOLDER_SVG} alt="Bank Desktop Icon" width="100" className="mb-4" />
                    <p className="text-black bold ml-2 fntSz16">{lang.creatorHasNoPlan}</p>
                  </div>
                </div>

              )
              :
              (
                <div className="modal-content pt-2 pb-4">
                  <h3 className="text-black bold ml-2 fntSz26">{lang.selectSubsPlan}</h3>
                  <div className="col-12 w-330 mx-auto">{SubscribePlans()}</div>
                </div>
              )}
          </div>
        </div>
      ) : (
        <>
          {noPlan ? (
            <div className="text-center p-4">
              <button
                type="button"
                className="close dv_modal_close"
                data-dismiss="modal"
                onClick={() => props.onClose()}
              >
                {lang.btnX}
              </button>
              <Img src={SUBSCRIPTION_PLACEHOLDER_SVG} alt="Bank Desktop Icon" width="100" className="mb-4" />
              <p className="text-black bold ml-2 fntSz18">{lang.creatorHasNoPlan}</p>
            </div>
          ) : (
            <div className="p-5">
              <div className="text-center">
                <h5 className="appTextColor dv__fnt30">{lang.selectSubsPlan}</h5>
              </div>
              <button
                type="button"
                className="close dv_modal_close"
                data-dismiss="modal"
                onClick={() => props.onClose()}
              >
                {lang.btnX}
              </button>

              {SubscribePlans()}
            </div>
          )
          }


          {/* <Button
            disabled={selectedPlan == null}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handlePaymentScreen();
            }}
            cssStyles={theme.blueButton}
            fclassname="mt-3"
          >
            {"Confirm & Pay"}
          </Button> */}
        </>
      )}
    </>
  );
}
