import React, { useState } from "react";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";
import isMobile from "../../hooks/isMobile";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const SelectoreDrawer = dynamic(
  () => import("../../containers/drawer/selectore-drawer/selectore-drawer"),
  { ssr: false }
);
const Drawer = dynamic(() => import("./Drawer"), { ssr: false });
const VerifyAcc = dynamic(() => import("./VerifyAcc"), { ssr: false });
const InputField = dynamic(
  () => import("../../containers/profile/edit-profile/label-input-field"),
  { ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { cancelActivePlan } from "../../services/subscriptions";
import { setCancelSubscriptionId } from "../../redux/actions/otherProfileData";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import Icon from "../image/icon";

export default function CancelSubscription(props) {
  const theme = useTheme();
  const [selectedReason, setReasonSelected] = useState("");

  const [otherReason, setOtherReason] = useState("");
  const [toggleDrawer, setToggleDrawer] = useState("");
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const router = useRouter();

  const Reasons = [...props.reasons];
  Reasons.push({
    reason: "Others",
    status: 1,
    statusMsg: "Active",
    userType: 3,
  });

  const confirmCalcelation = () => {
    mobileView
      ? open_drawer(
        "confirmDrawer",
        {
          title: lang.cancelSubscriptionMsg,
          subtitle: `${lang.subscriptionValidTill} ${props.validTill}`,
          yes: handleCancelPlan,
        },
        "bottom"
      )
      : open_dialog("confirmDialog", {
        title: lang.cancelSubscriptionMsg,
        subtitle: `${lang.subscriptionValidTill} ${props.validTill}`,
        yes: handleCancelPlan,
        closeAll: true,
      });
  };

  const handleCancelPlan = async () => {
    startLoader();
    try {
      const reqPayload = {
        subscriptionId: props.subscriptionId,
        reason: selectedReason == "Others" ? otherReason : selectedReason,
      };
      const response = await cancelActivePlan(reqPayload);
      if (response.status == 200) {
        stopLoader();
        dispatch(setCancelSubscriptionId(props?.subscriptionId))

        // Updated by Bhavleen on May 11th
        if (props?.tabChange) {
          mobileView ? close_drawer("cancelSubscription") : close_dialog();
          props.tabChange();
          return;
        }

        if (mobileView) {
          setToggleDrawer(true);
          setTimeout(() => {
            setToggleDrawer(false);
            close_drawer("cancelSubscription");
            router.reload("/");
          }, 1000);
          // setTimeout(() => {
          //   dispatch({ type: "UPDATE_SUBSCRIPTION_STATUS", payload: false });
          //   Route.push({ pathname: "/subscriptions" });
          //   close_drawer();
          // }, 500);
        } else {
          open_dialog("successfullDialog", {
            title: lang.cancelHeading,
            desc: lang.cancelMsg,
            closeIconVisible: false,
            titleClass: "max-full",
            // autoClose: true,
            closeAll: true,
            // closing_time: 500,
          });
          {
            props?.isFromOtherProfilePage && setTimeout(() => {
              close_dialog("cancelSubscription");
              router.reload("/otherProfile");
            }, 1000);
          }

          // setTimeout(() => {
          //   dispatch({ type: "UPDATE_SUBSCRIPTION_STATUS", payload: false });
          //   Route.push({ pathname: "/subscriptions" });
          // }, 1000);
        }
      }
    } catch (e) {
      stopLoader();
      console.error("ERROR IN handleCancelPlan >", e);
      Toast(e?.response?.data?.message, "error");
    }
  };

  // function to handle input control
  const changeInput = (value) => {
    setOtherReason(value);
  };

  return (
    <Wrapper>
      <div className={"py-3 px-3 px-sm-5"}>
        <div className="text-center">
          <div className="text-right">
            <Icon
              icon={`${CLOSE_ICON_WHITE}#close-white`}
              color={"var(--l_app_text)"}
              size={16}
              onClick={() => props.onClose()}
              alt="back_arrow"
              class="cursorPtr px-2"
              viewBox="0 0 16 16"
            />
          </div>
          <div className="text-center">
            <h5 className="w-700" >{lang.cancelSubscription}</h5>
          </div>
        </div>
        <div className="col-12 px-0" >
          <SelectoreDrawer
            title={lang.selectReasons}
            labelPlacement="right"
            value={selectedReason}
            data={
              Reasons &&
              Reasons.length &&
              Reasons.map((data) => ({
                name: "deactivateReasons",
                value: data.reason,
                label: data.reason,
              })).map((option) => {
                return option;
                ``;
              })
            }
            onSelect={(selectedReason) => setReasonSelected(selectedReason)}
          ></SelectoreDrawer>
          {selectedReason === "Others" ? (
            <div className="col-12">
              <InputField
                autoComplete="off"
                onChange={changeInput}
                textarea={true}
                type="text"
                inputType="text"
                name="otherReason"
                placeholder="Reason"
                className="borderStroke background_none radius_8 text-app fntSz13"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={"my-3 px-3"}>
          <Button
            type="button"
            disabled={
              selectedReason == "" ||
              (selectedReason === "Others" && otherReason == "")
            }
            fclassname="rounded-pill btnGradient_bg py-2"
            onClick={() => confirmCalcelation()}
          >
            {lang.confirm}
          </Button>
        </div>
      </div>
      <Drawer open={toggleDrawer} anchor="bottom">
        <VerifyAcc heading={lang.cancelHeading} msg={lang.cancelMsg} />
      </Drawer>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .cancel_subscription_bg-color{
                background-color:${theme.type == "light" ? "#fff" : "#000"} 
          }
        `}
      </style>
    </Wrapper>
  );
}
