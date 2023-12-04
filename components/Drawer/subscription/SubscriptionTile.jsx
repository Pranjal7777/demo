import { Avatar } from "@material-ui/core";
import { useTheme } from "react-jss";
import moment from "moment";
import Route from "next/router";

import isMobile from "../../../hooks/isMobile";
import {
  open_dialog,
  open_drawer,
  open_progress,
  Toast,
} from "../../../lib/global";
import useLang from "../../../hooks/language";
import { getReasons } from "../../../services/auth";
import Button from "../../button/button";

// For Renew The Plan
import { useSelector } from "react-redux";
import FigureCloudinayImage from "../../cloudinayImage/cloudinaryImage.jsx";
import { setCookie } from "../../../lib/session";
import { handleContextMenu } from "../../../lib/helper";

const SubscriptionTile = (props) => {
  const { plan, subscriber } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();

  // For Renew The Plan
  const isPlanCancelled = plan?.status === "CANCELLED"
  const CancelSubscriptionId = useSelector((data) => data?.CancelSubscriptionId)

  const cancelPlanHandler = async () => {
    // startLoader();
    try {
      let reasonType = 4; // 4 -> cancel subscription
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        // stopLoader();
        let arr = response && response.data && response.data.data;
        mobileView
          ? open_drawer(
            "cancelSubscription",
            {
              reasons: arr,
              validTill: moment(plan?.planEndTime).format("MMM DD, YYYY"),
              subscriptionId: plan?._id,
            },
            "right"
          )
          : open_dialog("cancelSubscription", {
            reasons: arr,
            validTill: moment(plan?.planEndTime).format("MMM DD, YYYY"),
            subscriptionId: plan?._id,
            closeAll: true,
          });
      }
    } catch (e) {
      console.error("ERROR IN cancelPlanHandler >", e);
      // stopLoader();
      Toast(
        e?.response?.data?.message || "Error In cancelPlanHandler",
        "error"
      );
    }
  };

  const renewPlanHandler = () => {
    Route.push(
      `/${plan?.userUsername || plan?.userUsername}`);
  };

  const creatorProfileRedirection = () => {
    if (plan.userTypeCode === 2) {
      open_progress();
      setCookie("otherProfile", `${plan?.userUsername || plan?.userUsername}$$${plan?.userId || plan?.userid || plan?._id}`)
      Route.push(
        `/${plan?.userUsername || plan?.userUsername}`
      );
    }
  }

  const handleDurationType = (type) => {
    let planType;
    if (['DAY', 'DAYS'].includes(type)) {
      return planType = 'DAY(S)'
    } else if (['MONTH', 'MONTHS', 'MONTHLY'].includes(type)) {
      return planType = 'MONTH(S)'
    }
  }

  return (
    // <li>
    <div className={`row mx-3 mx-md-0 align-items-start align-items-md-center radius_8 mb-2 py-3 ${plan?.userTypeCode === 2 && "cursorPtr"}`} style={{ backgroundColor: theme.dialogSectionBg }}>
      <div className="col-9 col-md-6 d-flex flex-row align-iteems-center" onClick={creatorProfileRedirection}>
        <div className="pr-3 callout-none" onContextMenu={handleContextMenu}>
          {plan?.profilePic ? (
            <FigureCloudinayImage
              publicId={plan.profilePic}
              width={"100%"}
              height={"100%"}
              ratio={1}
              className="follow-profile"
            />
          ) : (
            <Avatar
              className={
                mobileView ? "mui-cust-avatar" : "mui-cust-avatar-dv"
              }
            >
              {plan?.userFullName[0]}
            </Avatar>
          )}
        </div>
        <div className="d-flex flex-column justify-content-center">
          <h6 className="mb-0">
            {plan?.userUsername || plan?.userFullName || "Anonymous"}
          </h6>
          {!subscriber && (
            <div className="light_app_text">
              {props.value == 0 ? (
                <small className="text-nowrap">{((isPlanCancelled || CancelSubscriptionId === plan?._id) ? lang.planEnds : lang.nextCharged) + ": "}
                  <span className="text-app">{moment(plan?.planEndTime).format("MMM DD, YYYY")}</span>
                </small>
              ) : (
                <>
                  <small className="tetx-nowrap">{lang.subscriptionPlanExpired + ": "}
                    <span className="text-app">{moment(plan?.planEndTime).format("MMM DD, YYYY")}</span>
                  </small>
                </>
              )}
            </div>
          )}
          {(props.value == 0 || subscriber) && !(isPlanCancelled || CancelSubscriptionId === plan?._id) && (
            <small className="light_app_text">
              {`${lang.renewsEvery} ${plan?.planDuration} ${handleDurationType(plan?.planDurationType)}`}
            </small>
          )}
        </div>
      </div>

      <div className="col-3 p-0" onClick={creatorProfileRedirection}>
        <div className="light_app_text">Price</div>
        <h6 className="mb-0">${plan?.totalAmount || plan?.amount || "00.00"}</h6>
      </div>

      <div className="col-12 col-md-3 pt-2 pt-md-0">
        {props.value != 0 && !subscriber ?
          <div className="">
            <Button
              type="submit"
              fclassname="py-2 btnGradient_bg rounded-pill mt-1 px-3"
              onClick={renewPlanHandler} >
              {lang.renew}
            </Button>
          </div> : ""}
        {!subscriber && props.value == 0 ? (
          <div className="">
            <Button
              isDisabled={(isPlanCancelled || CancelSubscriptionId === plan?._id)}
              type="submit"
              fclassname="background_none borderStrokeClr rounded-pill py-2 mt-1 px-3"
              btnSpanClass="gradient_text w-500"
              onClick={cancelPlanHandler} >
              {(isPlanCancelled || CancelSubscriptionId === plan?._id) ? lang.unsubscribed : lang.cancel}
            </Button>
          </div>

        ) : ""}
      </div>
    </div>
  );
};

export default SubscriptionTile;
