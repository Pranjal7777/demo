import { useTheme } from "react-jss";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../header/header";
import useLang from "../../../hooks/language";
import Img from "../../ui/Img/Img";
import * as env from "../../../lib/config";
import {
  drawerToast,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import isMobile from "../../../hooks/isMobile";
import {
  getAllPlans,
  getSelectedPlans,
  selectSubscriptionPlanApi,
  updateSubscriptionPlanApi,
} from "../../../services/subscriptions";
import { getCookie } from "../../../lib/session";
import Button from "../../button/button";
import Icon from "../../image/icon";
import {
  setSubscriptionPlan,
  updateSubPlanReduxProfile,
} from "../../../redux/actions/index";
import CustomDataLoader from "../../loader/custom-data-loading";
import useProfileData from "../../../hooks/useProfileData";
import { isAgency } from "../../../lib/config/creds";
import { NumberValidator, ValidateTwoDecimalNumber } from "../../../lib/validation/validation";
import { Arrow_Left2 } from "../../../lib/config/homepage";

const SubscriptionSettings = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSubsPlan, setActiveSubsPlan] = useState(null);
  const [plans, setPlans] = useState(null);
  const currency = getCookie("defaultCurrency");
  const [activatePlan, setActivatePlan] = useState(
    useSelector((state) => state.subscriptionPlan)
  );
  const [editPlan, setEditPlan] = useState(null);
  const [addPlanPanel, setAddPlanPanel] = useState(false);
  const [sharePercent, setSharePercent] = useState();
  const [userAmt, setUserAmt] = useState(0.0);
  const [appAmt, setAppAmt] = useState(0.0);
  const [totalPlans, setTotalPlans] = useState();
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [confirmBtn, setConfirmBtn] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const minSubscriptioValue = useSelector((state) => state.appConfig.minValueSubscription)
  const [amount, setAmount] = useState(minSubscriptioValue);
  const [profileData] = useProfileData();
  const maxValueSubscription = useSelector((state) => state.appConfig.maxValueSubscription)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    stopLoader();
    setShowLoader(true);
    getActivePlan();
    buttonValidation();
  }, []);
  useEffect(() => {
    setAmount(minSubscriptioValue);
  }, [])

  // useEffect(() => {
  //   setConfirmBtn(amount < lowestSubscribePrice)
  // }, [amount])


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
    buttonValidation();
  }, [description]);

  const buttonValidation = () => {
    if (amount && description && (amount >= minSubscriptioValue && amount <= maxValueSubscription)) {
      setConfirmBtn(false);
    } else {
      setConfirmBtn(true);
    }
  };

  const getActivePlan = async () => {
    try {
      let plan;
      // If Active Sub Plans is not in redux, then fetch from API
      mobileView ? startLoader() : "";
      const userId = isAgency() ? selectedCreatorId : getCookie("uid");

      // API CALLS
      plan = await getSelectedPlans(userId);

      if (plan?.status == 200) {
        const activeResPlan = plan?.data?.data;

        setActivatePlan(activeResPlan);
        setActiveSubsPlan(true);

        // Saving All Active Plans in Redux Store
        dispatch(setSubscriptionPlan(activeResPlan));

        dispatch(
          updateSubPlanReduxProfile({
            planCount: activeResPlan?.length,
          })
        );
      } else {
        const activeResPlan = plan?.data?.data;
        setActivatePlan(activeResPlan);
        setActiveSubsPlan(false);

        dispatch(setSubscriptionPlan(activeResPlan));

        dispatch(
          updateSubPlanReduxProfile({
            planCount: activeResPlan?.length || 0,
          })
        );
      }
      let payload = {};
      if (isAgency()) {
        payload["userId"] = selectedCreatorId
      }
      let res = await getAllPlans(payload);
      setTotalPlans(res?.data?.data?.subSetting?.length);

      {
        mobileView ? stopLoader() : "";
      }
      setShowLoader(false);
    } catch (err) {
      console.error("ERROR IN getActivePlan", err);
      Toast(err?.response?.data?.message, "error");
      {
        mobileView ? stopLoader() : "";
      }
      setShowLoader(false);
    }
  };

  const getAllPlan = async () => {
    try {
      setShowLoader(true);

      let payload = {};
      if (isAgency()) {
        payload["userId"] = selectedCreatorId
      }
      // API CALLS
      let res = await getAllPlans(payload);

      setPlans(res?.data?.data?.subSetting);
      setSharePercent(res?.data?.data?.subscriptionAppCommission);
      setActiveSubsPlan(false);

      // stopLoader()
      setShowLoader(false);
      mobileView &&
        open_drawer(
          "SubscriptionPlans",
          {
            plans: res?.data?.data?.subSetting,
            sharePercent: res?.data?.data?.subscriptionAppCommission,
          },
          "right"
        );
    } catch (error) {
      console.error("ERROR IN getAllPlan", error);
      Toast(error?.res?.data?.message || lang.anErrorOccured, "error");
      // stopLoader()
      setShowLoader(false);
    }
  };

  const addSubscriptionContent = () => {
    return (
      <div className="mt-3">
        <p className="w-500">
          {lang.pleaseSelect}
        </p>

        {plans?.map((plan) => {
          return (
            <div
              key={plan._id}
              className="my-3 cursorPtr"
              onClick={() => selectPlanHandler(plan)}
            >
              <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2 radius_8" style={{ backgroundColor: theme.dialogSectionBg }}>
                <div>
                  <div className="light_app_text">
                    Plan Name
                  </div>
                  <div>{plan.subscriptionTitle} Subscription</div>
                </div>
                <div>

                </div>
                <div>
                  <Icon
                    icon={`${Arrow_Left2}#arrowleft2`}
                    width={20}
                    height={20}
                    style={{ transform: "rotatey(180deg)" }}
                    class=""
                    alt="Back Arrow"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const selectPlanHandler = (plan) => {
    setPlans(null);
    setActivatePlan([]);
    setSelectedPlan(plan);
    setAddPlanPanel(true);
  };

  const SubscriptionPlaceholder = () => {
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "93%" }}
        >
          <div className="text-center">
            <Img
              src={env.SUBSCRIPTION_PLACEHOLDER_SVG}
              alt="Bank Desktop Icon"
              className="mb-4"
            />
            <p
              className={`${mobileView
                ? theme.type == "light"
                  ? "text-black"
                  : "text-white"
                : "dv_appTxtClr"
                }`}
            >
              {lang.noSubscriptionPlan}
            </p>
          </div>
        </div>
        {mobileView && (
          <div className="mx-3">
            <Button
              type="button"
              fclassname="btnGradient_bg rounded-pill"
              onClick={getAllPlan}
              disabled={profileData && [5, 6].includes(profileData.statusCode)}
              children={lang.addSubscription}
            />
          </div>
        )}
      </>
    );
  };

  const handleAddSubscription = async () => {
    setShowLoader(true);

    try {
      let formData = {
        subscriptionSettingId: selectedPlan._id,
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
      {
        drawerToast({
          title: lang.subsAdded,
          closeIconVisible: false,
          titleClass: "max-full",
          autoClose: true,
        });
      }
      setSelectedPlan(null);
      setAddPlanPanel(false);
      setActiveSubsPlan(true);
      setAmount(minSubscriptioValue);
      setDescription("");
      getActivePlan();

      setShowLoader(false);
    } catch (err) {
      console.error("ERROR IN handleAddSubscription > ", err);
      Toast(
        err?.response?.data?.message || "ERROR IN handleAddSubscription",
        "error"
      );
      setTimeout(() => {
        getActivePlan();
        setShowLoader(false);
      }, 1000);
    }
  };

  const handleUpdateSubscription = async (plan) => {
    try {
      setShowLoader(true);

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
        formData["userId"] = selectedCreatorId;
      }
      await updateSubscriptionPlanApi(formData);
      {
        drawerToast({
          title: lang.subsUpdated,
          closeIconVisible: false,
          titleClass: "max-full",
          autoClose: true,
        });
      }
      setEditPlan(null);
      setAddPlanPanel(null);
      setAmount(minSubscriptioValue);
      setDescription("");
      setActiveSubsPlan(true);
      getActivePlan();

      setShowLoader(false);
    } catch (err) {
      console.error("ERROR IN handleUpdateSubscription", err);
      Toast(err?.response?.data?.message, "error");
      setTimeout(() => {
        getActivePlan();
        setShowLoader(false);
      }, 1000);
    }
  };

  const editSubscriptionPlan = (plan) => {
    mobileView ? (
      open_drawer(
        "SubscriptionPlanSettings",
        {
          plan,
          updateScreen: true,
          getActivePlan,
        },
        "right"
      )
    ) : (
      <>
        {setEditPlan(plan)}
        {setAmount(plan.amount)}
        {setDescription(plan.description)}
        {setActiveSubsPlan(null)}
        {setAddPlanPanel(true)}
      </>
    );
  };

  const deleteDrawer = () => {
    open_dialog("DeleteSubPlanConfirm", {
      plan: editPlan,
      deletePlanFn,
    });
  };

  const deletePlanFn = () => {
    setShowLoader(true);
    setEditPlan(null);
    setAddPlanPanel(null);
    setAmount("");
    setDescription("");
    setActiveSubsPlan(true);
    getActivePlan();
    stopLoader();
    setShowLoader(false);
  };

  const changeHandler = () => {
    // startLoader();
    setShowLoader(true);
    setSelectedPlan(null);
    setAddPlanPanel(false);
    getAllPlan();
    // stopLoader();
    setShowLoader(false);
  };

  const backButton = () => {
    if (plans) {
      // startLoader();
      setShowLoader(true);
      setPlans(null);
      setActiveSubsPlan(true);
      getActivePlan();
      // stopLoader();
      setShowLoader(false);
    } else if (addPlanPanel & !editPlan) {
      // startLoader();
      setShowLoader(true);
      setSelectedPlan(null);
      setAddPlanPanel(false);
      getAllPlan();
      // stopLoader();
      setShowLoader(false);
    } else {
      // startLoader()
      setShowLoader(true);
      setEditPlan(null);
      setAmount();
      setActiveSubsPlan(true);
      setAddPlanPanel(false);
      // stopLoader()
      setShowLoader(false);
    }
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
      {mobileView ? (
        <>
          <Header title={lang.subsSettings} back={props.onClose} />
          <div className={"h-100 drawerBgCss overflow-auto"}>
            {activatePlan ? (
              <div
                className="mx-3 pb-5 mb-4 drawerBgCss"
                style={{ marginTop: "65px" }}
              >
                <h6 className="text-app py-3 mb-0">
                  {lang.activatedSubPlan}
                </h6>
                {activatePlan?.map((plan) => {
                  return (
                    <div
                      key={plan._id}
                      className="p-3 mb-2 radius_8 d-flex flex-column"
                      style={{ backgroundColor: theme.dialogSectionBg }}
                      onClick={() => editSubscriptionPlan(plan)}
                    >
                      <div className="row mx-0">
                        <div className="col-7 px-0 d-flex flex-column align-items-start">
                          <div className="light_app_text">Plan Name</div>
                          <div className="w-500">
                            {plan?.subscriptionTitle ? plan?.subscriptionTitle + " Subscription" :
                              `${plan?.duration} Month Subscription`}
                          </div>
                        </div>
                        <div className="col-5 px-0 d-flex flex-column align-items-start">
                          <div className="light_app_text">Price</div>
                          <div className="w-500">
                            $ {plan?.amount || "00.00"}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column mt-2">
                        <div className="light_app_text">
                          Description
                        </div>
                        <div className="w-500 line-clamp2">{plan?.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              SubscriptionPlaceholder()
            )}
          </div>
          {totalPlans > 0 && activatePlan && (
            <div className="position-absolute w-100 p-3 card_bg" style={{ bottom: "0px" }}>
              <Button
                type="button"
                fclassname="btnGradient_bg rounded-pill"
                onClick={getAllPlan}
                children={lang.addSubscription}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="myAccount_sticky_section_header">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-row">
                {(addPlanPanel || editPlan || plans) && !activeSubsPlan && (
                  <div
                    className="cursorPtr mr-3"
                    onClick={backButton}
                  >
                    <Icon
                      icon={`${env.backArrow}#left_back_arrow`}
                      color={theme?.text}
                      size={20}
                      viewBox="0 0 64 64"
                    />
                  </div>
                )}

                <h5 className="mb-0">
                  {plans ? lang.subsPlans : editPlan ? lang.editPlan : lang.subsSettings}
                </h5>
              </div>

              <div className="">
                {!plans && !addPlanPanel && totalPlans > 0 && (
                  <Button
                    type="button"
                    fclassname="btnGradient_bg rounded-pill py-2 px-4"
                    onClick={getAllPlan}
                    disabled={profileData && [5, 6].includes(profileData.statusCode)}
                    children={lang.addSubscription}
                  />
                )}
              </div>
            </div>
          </div>

          {!activatePlan && !plans && !showLoader && (
            <>
              {/* No Selected Plan Placeholder */}
              {SubscriptionPlaceholder()}
            </>
          )}

          {(addPlanPanel || editPlan) && (
            <div className="mt-3 col-8 px-0">
              <p
                className="w-500 mb-1">
                {lang.plans}
              </p>

              <div className="my-2 d-flex flex-row justify-content-between align-items-center radius_8 p-3" style={{ backgroundColor: theme.dialogSectionBg }}>
                <div>
                  {selectedPlan
                    ? selectedPlan?.subscriptionTitle
                    : editPlan?.subscriptionTitle} Subscription
                </div>
                <div>
                  <Button
                    type="button"
                    fclassname={`background_none rounded-pill py-1 px-3 ${editPlan ? "border border-danger" : "borderStrokeClr"}`}
                    btnSpanClass={editPlan ? "text-danger" : "text-app"}
                    onClick={editPlan ? deleteDrawer : changeHandler}
                    children={editPlan ? lang.delete : lang.change}
                  />
                </div>
              </div>

              <div className="mt-3 position-relative">
                <div className="text-app mb-1">Subscription Amount</div>
                <div className="d-flex flex-row justify-content-between align-items-center borderStroke px-3 py-2 radius_8 card_bg">
                  <input
                    type="text"
                    placeholder="Subscription amount"
                    inputMode="numeric"
                    style={{
                      background: "none",
                      border: "none",
                      width: "100%",
                      color: "var(--l_app_text)"
                    }}
                    value={amount}
                    onChange={(e) => {
                      pushAmount(e.target.value)
                    }}
                    onWheel={(e) => {
                      e.target.blur()
                      e.stopPropagation()
                    }}
                  />
                  <div>
                    {currency}
                  </div>
                </div>
                {(amount < minSubscriptioValue || amount > maxValueSubscription) &&
                  <div className="text-danger p-1 fntSz12">
                    {lang.lowestSubscriptionText} ${minSubscriptioValue} or {lang.maxSubscriptionText} ${maxValueSubscription}
                  </div>}
              </div>

              <div className="mt-3">
                <div className="text-app mb-1">Description</div>
                <textarea
                  type="text"
                  rows="4"
                  placeholder="Subscription Plan Description"
                  className="card_bg text-app borderStroke radius_8 w-100 px-3 py-2"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>

              <div className="mt-3  d-flex flex-row justify-content-between align-items-center">
                <div>
                  {lang.youWillGet}
                </div>
                <div>
                  ${userAmt.toFixed(2)}
                </div>
              </div>

              <div className="mt-1 d-flex flex-row justify-content-between align-items-center">
                <div>

                  {lang.appGets}
                </div>
                <div >

                  ${appAmt.toFixed(2)}
                </div>
              </div>
              <div className="m-5 pt-4">
                {!plans && addPlanPanel && (
                  <Button
                    disabled={confirmBtn}
                    fclassname="btnGradient_bg rounded-pill py-2 px-4"
                    onClick={editPlan
                      ? () => handleUpdateSubscription(editPlan)
                      : handleAddSubscription
                    }
                    children={editPlan ? lang.update : lang.confirm}
                  />
                )}
              </div>
            </div>
          )}

          {plans && (
            <>
              {/* Select subscription plan */}
              {addSubscriptionContent()}
            </>
          )}

          {!addPlanPanel && activeSubsPlan && !plans && (
            <div className="mt-3">
              <div className={`strong_app_text bold fntSz15`}>
                {lang.activatedSubPlan}
              </div>
              {activatePlan?.map((plan) => {
                return (
                  <div className="my-2" key={plan._id}>
                    <div
                      className="p-2 row m-0 cursorPtr radius_8"
                      style={{
                        backgroundColor: theme.dialogSectionBg,
                      }}
                      onClick={() => editSubscriptionPlan(plan)}
                    >
                      <div className="col-10">
                        <div className="row mx-0">
                          <div className="col-5 px-0 d-flex flex-column align-items-start">
                            <div className="light_app_text">Plan Name</div>
                            <div className="w-500">
                              {plan?.subscriptionTitle ? plan?.subscriptionTitle + " Subscription" :
                                `${plan?.duration} Month Subscription`}
                            </div>
                          </div>
                          <div className="col-7 px-0 d-flex flex-column align-items-start">
                            <div className="light_app_text">Price</div>
                            <div className="w-500">
                              $ {plan?.amount || "00.00"}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <div className="light_app_text">
                            Description
                          </div>
                          <div className="w-500 line-clamp2">{plan?.description}</div>
                        </div>
                      </div>
                      <div className="col-2 d-flex justify-content-end align-items-center">
                        <Icon
                          icon={`${Arrow_Left2}#arrowleft2`}
                          color={"var(--l_app_text)"}
                          width={16}
                          height={16}
                          class="arrowLeft"
                          style={{transform: "rotateY(180deg)"}}
                          alt="Left Arrow"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showLoader && !mobileView ? (
        <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
          <CustomDataLoader type="ClipLoader" loading={showLoader} size={60} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SubscriptionSettings;
