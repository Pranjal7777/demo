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
import { useDispatch, useSelector } from "react-redux";
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
import { defaultCurrency, SUBSCRIPTION_PLACEHOLDER_SVG } from "../../../lib/config";
import Img from "../../ui/Img/Img";
import { isAgency } from "../../../lib/config/creds";
import { CLOSE_ICON_WHITE } from "../../../lib/config/logo";
import Icon from "../../image/icon";

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
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  // const [selectedPlan, setSelectedPlan] = useState(null);
  const splan = React.createRef({});
  useEffect(() => {
    handleGetPlans();
  }, []);

  const handleGetPlans = async () => {
    startLoader();
    const userId = isAgency() ? selectedCreatorId : props?.creatorId;
    try {
      let response = await getSelectedPlans(userId);
      if (response.status == 200) {
        stopLoader();
        setPlans(response?.data?.data);
        setNOPlan(false);
      } else if (response.status == 204) {
        stopLoader();
        setNOPlan(true);
      } else {
        stopLoader();
        Toast(lang.errorMsg, "error");
      }
    } catch (e) {
      stopLoader();
      Toast(e?.response?.data?.message, "error");
      console.error("ERROR IN handleGetPlans", e);
    }
  };

  const subscriptionPlanDurationText = (plan) => {
    let subsText = "";
    if (plan.duration) {
      subsText += String(plan?.duration) + " ";
    }
    if (["MONTHLY", "MONTH"].includes(plan.durationType)) {
      subsText += "Month"
    } else if (["DAYS", "DAY"].includes(plan.durationType)) {
      subsText += "Day"
    }
    return subsText;
  }

  const handleSelectionPlan = (plan) => {
    startLoader();
    // setSelectedPlan(plan);
    splan.current = plan;
    handlePaymentScreen(plan);
  };

  const handlePaymentScreen = (plan) => {
    let subscriptionTitle = subscriptionPlanDurationText(plan)
    handleGetAddress(),
      mobileView
        ? reduxData.defaultCard
          ? open_drawer("purchseConfirmDialog", {
            title: `Subscribe to ${props.creatorName}`,
            checkout: buyPlan,
            alert: lang.alertSubscribeNote,
            planName: subscriptionTitle,
            description: plan.description,
            isSubscription: true,
            price: plan?.amount,
          },
            "bottom"
          )
          : open_drawer("checkout", {
            title: `${lang.confirmPlanBuy} to ${props.creatorName}'s subscription plan "${plan.subscriptionTitle}" for $${plan?.amount}?`,
            getAddress: handleGetAddress,
            checkout: buyPlan,
            radio: true,
            price: plan?.amount,
            subscriptionPlanId: plan?._id,
            isApplyPromo: true,
            applyOn: "SUBSCRIPTION",
            creatorId: props.creatorId,
          },
            "right"
          )
        : reduxData.defaultCard
          ? open_dialog("purchaseConfirm", {
            title: `Subscribe to ${props.creatorName}`,
            checkout: buyPlan,
            alert: lang.alertSubscribeNote,
            planName: subscriptionTitle,
            description: plan.description,
            price: plan?.amount,
            isSubscription: true,
            closeAll: true,
            subscriptionPlanId: plan?._id,
            isApplyPromo: true,
            applyOn: "SUBSCRIPTION",
            creatorId: props.creatorId,
          })
          : open_dialog("checkout", {
            title: `${lang.confirmPlanBuy} to ${props.creatorName}'s subscription plan "${plan.subscriptionTitle}" for $${plan?.amount}?`,
            onClose: props.onClose,
            getAddress: handleGetAddress,
            checkout: buyPlan,
            radio: true,
            price: plan?.amount,
            subscriptionPlanId: plan?._id,
            isApplyPromo: true,
            applyOn: "SUBSCRIPTION",
            creatorId: props.creatorId,
          });
  };

  const handleGetAddress = async () => {
    await dispatch(getAddress({ loader: true }));
  };

  const buyPlan = async (paymentMethod, addressId) => {
    try {
      const payload = {
        planId: splan?.current?._id,
        creatorId: props.creatorId,
        paymentMethod: paymentMethod,
        pgLinkId: typeof pg[0] != "undefined" ? pg[0]._id : "",
      };
      if (addressId) {
        payload["addressId"] = addressId;
      }

      const res = await purchaseSubcriptionApi(payload);

      if (res && res.data) {
        // console.log("dwudh", res.data);
        Toast(lang.subscriptionPurchased, "success");
        close_dialog();
        close_drawer("purchseConfirmDialog");
        close_drawer("Address");
        close_drawer("checkout");
        props.onClose && props.onClose();
        // props.followUnfollowHandler && props.followUnfollowHandler();
        router.pathname == "/[username]"
          ? router.reload()
          : props.subscribedEvent(props.creatorId);
      }
    } catch (err) {
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
              <div>
                <Button
                  fclassname={`rounded-pill py-2 btnGradient_bg`}
                  btnSpanClass="d-flex flex-row justify-content-between align-items-center text-nowrap"
                  onClick={() => {
                    handleSelectionPlan(plan);
                  }}
                >
                  <div>
                    {`${lang.subscribeFor} ${subscriptionPlanDurationText(plan)}`}
                  </div>
                  <div>
                    ${plan.amount}
                  </div>
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
        noPlan ? (
          <div className="modal-content pt-3" >
            <button
              type="button"
              className="close dv_modal_close"
              data-dismiss="modal"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>
            <div className="text-center py-4">
              <Img
                src={SUBSCRIPTION_PLACEHOLDER_SVG}
                alt="Bank Desktop Icon"
                width="100"
                className="mb-4"
              />
              <p
                className={`${theme.type === "light" ? "text-black" : "text-white"
                  } bold ml-2 fntSz16`}
              >
                {lang.creatorHasNoPlan}
              </p>
            </div>
          </div >
        ) : (
          <div className="modal-content pt-2 pb-4">
            <div className="text-right px-3 pt-3">
              <Icon
                icon={CLOSE_ICON_WHITE + "#close-white"}
                color={"var(--l_app_text)"}
                width="20"
                alt="close"
                onClick={() => props.onClose()}
                viewBox="0 0 20 20"
              />
            </div>
            <h5 className="text-center text-app w-600">
              {lang.selectSubsPlan}
            </h5>
            <div className="col-12 w-330 mx-auto">{SubscribePlans()}</div>
          </div>
        )

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
              <Img
                src={SUBSCRIPTION_PLACEHOLDER_SVG}
                alt="Bank Desktop Icon"
                width="100"
                className="mb-4"
              />
              <p className="text-black bold ml-2 fntSz18">
                {lang.creatorHasNoPlan}
              </p>
            </div>
          ) : (
            <div className="p-5">
              <div className="text-center">
                <h5 className="txt-black dv__fnt30">{lang.selectSubsPlan}</h5>
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
          )}

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
