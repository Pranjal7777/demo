import Header from "../../header/header";
import useLang from "../../../hooks/language";
import {
  close_drawer,
  drawerToast,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import { useState, useEffect } from "react";
import { getCookie} from "../../../lib/session";
import {
  selectSubscriptionPlanApi,
  updateSubscriptionPlanApi,
} from "../../../services/subscriptions";
import { useTheme } from "react-jss";
import { defaultCurrency } from "../../../lib/config"
import { useSelector } from "react-redux";
import { isAgency } from "../../../lib/config/creds";
import { ValidateTwoDecimalNumber } from "../../../lib/validation/validation";
import Button from "../../button/button";

const SubscriptionPlanSettings = (props) => {
  const theme = useTheme();
  const { plan, updateScreen, sharePercent } = props;
  const [lang] = useLang();
  const [amount, setAmount] = useState();
  const currency = getCookie("defaultCurrency");
  const [userAmt, setUserAmt] = useState(0.0);
  const [appAmt, setAppAmt] = useState(0.0);
  const [description, setDescription] = useState("");
  const [confirmBtn, setConfirmBtn] = useState(true);
  const minValueSubscription = useSelector((state) => state.appConfig.minValueSubscription);
  const maxValueSubscription = useSelector((state) => state.appConfig.maxValueSubscription);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);
    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  useEffect(() => {
    if (amount) {
      const amt = amount;
      const percent = sharePercent ? sharePercent : 20;
      const finalAmt = (percent / 100) * amt;
      setAppAmt(finalAmt);
      setUserAmt(amt - finalAmt);
    } else {
      setAppAmt(0.0);
      setUserAmt(0.0);
    }
    buttonValidation();
  }, [amount]);

  useEffect(() => {
    plan?.amount && setAmount(plan?.amount);
    plan?.description && setDescription(plan?.description);
    buttonValidation();
  }, []);

  useEffect(() => {
    buttonValidation();
  }, [description]);

  const buttonValidation = () => {
    if (amount && description && (amount >= minValueSubscription && amount <= maxValueSubscription)) {
      setConfirmBtn(false);
    } else {
      setConfirmBtn(true);
    }
  };

  const handleAddSubscription = async () => {
    try {
      startLoader();
      let formData = {
        subscriptionSettingId: plan._id,
        amount,
        description,
        currency: {
          currency_code: currency,
          symbol: "$",
        },
      };
      if (isAgency()) {
        formData["userId"] = selectedCreatorId;
      }
      await selectSubscriptionPlanApi(formData);
      drawerToast({
        title: lang.subsAdded,
        closeIconVisible: false,
        titleClass: "max-full",
        autoClose: true,
        isMobile: true,
      });

      setTimeout(() => {
        close_drawer();
      }, 2500);

      setTimeout(() => {
        open_drawer("SubscriptionSettings", {}, "right");
      }, 3000);

    } catch (err) {
      stopLoader();
      console.error("ERROR IN handleAddSubscription > ", err);
      Toast(err?.response?.data?.message, "error");
    }
  };

  const handleUpdateSubscription = async () => {
    try {
      startLoader();
      let formData = {
        subscriptionPlanId: plan._id,
        amount,
        description,
        currency: {
          currency_code: currency,
          symbol: "$",
        },
      };

      if (isAgency()) {
        formData["userId"] = selectedCreatorId
      }
      await updateSubscriptionPlanApi(formData);

      drawerToast({
        title: lang.subsUpdated,
        closeIconVisible: false,
        titleClass: "max-full",
        autoClose: true,
        isMobile: true,
      });

      setTimeout(() => {
        close_drawer();
      }, 2500);

      setTimeout(() => {
        open_drawer("SubscriptionSettings", {}, "right");
      }, 3000);

    } catch (err) {
      stopLoader();
      console.error("ERROR IN handleUpdateSubscription > ", err);
      Toast(err?.response?.data?.message, "error");
    }
  };

  const deleteDrawer = () => {
    open_drawer("DeleteSubPlanConfirm", {
      plan,
    },
      "bottom"
    );
  };

  const pushAmount = (value) => {
    const regex = ValidateTwoDecimalNumber(value);
    const decimalRegex = /^(?:\d*\.\d{0,2}|\d+)$/.test(value);
    if (regex || !value) {
      setAmount(value)
    } else if (decimalRegex) {
      setAmount(value)
    }
    else {
      return;
    }
  }

  return (
    <>
      <Header title={lang.editPlan} Data={lang.editPlan} back={props.onClose} />

      <div className="d-flex flex-column justify-content-between h-100 card_bg">

        <div style={{ marginTop: "70px" }} className="mx-3">

          <h6 className="my-2">
            {lang.plans}
          </h6>

          {/* Selected Plan */}
          <div className="my-2 p-3 d-flex flex-row align-items-center justify-content-between radius_8" style={{ backgroundColor: theme.dialogSectionBg }}>
            <div className="">
              <p className="m-0 bold">{plan?.subscriptionTitle}</p>
            </div>
            <div className="">
              <Button
                fclassname={`w-600 p-0 background_none`}
                btnSpanClass={updateScreen ? "text-danger" : "fntClrTheme"}
                onClick={!updateScreen ? props.onClose : deleteDrawer}
                children={!updateScreen ? lang.change : lang.delete}
              />
            </div>
          </div>

          {/* Subscription Amount Field */}
          <div className="mt-3">
            <div className="text-app mb-1">Subscription Amount</div>
            <div className="d-flex flex-row justify-content-between align-items-center borderStroke radius_8 card_bg px-3 py-2">
              <input
                type="text"
                placeholder="Subscription amount"
                autoFocus
                className="border-0 background_none text-app w-100"
                value={amount}
                onChange={(e) => {
                  pushAmount(e.target.value)
                }}
              />
              <div className=" d-flex align-items-center">
                <p className="m-0 fntSz14">{currency}</p>
              </div>
            </div>
            {(amount < minValueSubscription || amount > maxValueSubscription) &&
              <p className="text-danger fntSz12 my-2 w-500">{lang.lowestSubscriptionText} ${minValueSubscription} or {lang.maxSubscriptionText} ${maxValueSubscription}</p>
            }
          </div>

          {/* Subscription Plan Description */}
          <div className="mt-3">
            <div className="text-app mb-1">Description</div>
            <textarea
              type="text"
              rows="4"
              placeholder="Subscription Plan Description"
              className="card_bg radius_8 borderStroke w-100 px-3 py-2 text-app"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          {/* You will get Amount */}
          <div className="d-flex flex-row justify-content-between align-items-center p-2">
            <div>{lang.youWillGet}</div>
            <div>{defaultCurrency}{userAmt.toFixed(2)}</div>
          </div>

          {/* App Gets Amount */}
          <div className="d-flex flex-row justify-content-between align-items-center p-2">
            <div>{lang.appGets}</div>
            <div>{defaultCurrency}{appAmt.toFixed(2)}</div>
          </div>
        </div>

        {/* Confirm/Update Button */}
        <div className="m-3">
          <Button
            type="submit"
            fclassname="btnGradient_bg rounded-pill"
            disabled={confirmBtn}
            onClick={!updateScreen ? handleAddSubscription : handleUpdateSubscription}
            children={!updateScreen ? lang.confirm : lang.update}
          />
        </div>
      </div >

    </>
  );
};

export default SubscriptionPlanSettings;
