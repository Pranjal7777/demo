import {
  close_dialog,
  close_drawer,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { deleteSubscriptionPlanApi } from "../../../services/subscriptions";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { isAgency } from "../../../lib/config/creds";
import Button from "../../button/button";

export default function DeleteSubPlanConfirm(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const { plan } = props;
  const theme = useTheme();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const deleteSubPlan = async (planId) => {
    const payload = {
      planId: planId,
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    try {
      startLoader();
      mobileView
        ? close_drawer("DeleteSubPlanConfirm")
        : close_dialog("DeleteSubPlanConfirm");

      // API CALLS
      await deleteSubscriptionPlanApi(payload);
      Toast(lang.planDeleted, "success");

      mobileView ? (
        <>
          {setTimeout(() => close_drawer(), 2500)}
          {setTimeout(
            () => open_drawer("SubscriptionSettings", {}, "right"),
            3000
          )}
        </>
      ) : (
        setTimeout(() => props.deletePlanFn(), 500)
      );
    } catch (err) {
      console.error("ERROR IN deleteSubPlan > ", err);
      Toast(err?.response?.data?.message, "error");
      stopLoader();
    }
  };

  const actionButtons = () => {
    return (
      <div className="d-flex pt-3 align-items-center justify-content-between">
        <div className="col-6">
          <Button
            type="button"
            fclassname="background_none rounded-pill borderStrokeClr"
            data-dismiss="modal"
            data-toggle="modal"
            onClick={() => deleteSubPlan(plan._id)}
            children={lang.confirm}
          />
        </div>
        <div className="col-6">
          <Button
            type="button"
            fclassname="btnGradient_bg rounded-pill"
            data-dismiss="modal"
            data-toggle="modal"
            onClick={() => props.onClose()}
            children={lang.cancel}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {mobileView ? (
        <div className="p-4">
          <h5>
            {lang.deleteSubPlan}
          </h5>
          <div className="strong_app_text">
            {lang.deletesubPlanMessage}
          </div>
          {actionButtons()}
        </div>
      ) : (
        <div className="py-3 px-5">
          <div className="text-center">
            <h5 className="txt-black dv__fnt30">{lang.deleteSubPlan}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>

          <div className="text-center">
            <p className="text-muted">{lang.deletesubPlanMessage}</p>
          </div>

          {actionButtons()}
        </div>
      )}
    </>
  );
}
