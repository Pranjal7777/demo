import React, { useState, useEffect } from "react";
import Wrapper from "../../../hoc/Wrapper";
import dynamic from "next/dynamic";
import Button from "../../../components/button/button";
import Reasons from "../../../components/radio-button/shoutout-radio";
import { getReasons } from "../../../services/auth";

const RadioButtonsGroup = dynamic(
  () => import("../../../components/radio-button/radio-button-group"),
  { ssr: false }
);
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
const InputTextArea = dynamic(
  () => import("../../../components/formControl/textArea"),
  { ssr: false }
);

const UserCancelOrder = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  const purchaseStatusCode = {
    "VIDEO_CALL": 7,
    "VIDEO_SHOUTOUT": 6
  }
  const orderStatusCode = {
    "VIDEO_CALL": 8,
    "VIDEO_SHOUTOUT": 5
  }

  const handleCancelOrder = () => {
    props.isPurchasePage
      ? props.handleAcceptOrCancel("CANCELLED", reason == "others" ? otherReason : reason)
      : props.handleAcceptOrCancel("REJECTED", reason == "others" ? otherReason : reason);
  };

  useEffect(() => {
    GetDeactivateReasons();
  }, []);

  const GetDeactivateReasons = async () => {
    try {
      let reasonType = props.isPurchasePage ? purchaseStatusCode[props?.orderType] : orderStatusCode[props?.orderType];
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        setCancelReason([...response?.data?.data])
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const changeInput = (event) => {
    let inputControl = event;
    setOtherReason(inputControl);
  };

  return (
    <Wrapper>
      <div className="" style={{ padding: "25px" }}>
        <p className="text-center fntWeight700 fntSz25 text-app" style={{ color: mobileView ? theme?.text : theme?.palette?.l_slider_bg }}>{lang.rejectOrder}</p>
        <p className="text-center fntSz16" style={{ color: "#666666" }}>
          {lang.rejectionReason}
        </p>
        <div>
          <Reasons handleReasonOnChange={setReason} reason={reason} reasonsList={cancelReason} />
        </div>
        <div className="cancelShoutout">
          {reason.toLowerCase() === "others" ? (
            <div className="col-12 p-0">
              <InputTextArea
                autoComplete="off"
                onChange={changeInput}
                textarea={true}
                type="text"
                inputType="text"
                name="otherReason"
                placeholder="Reason"
                value={otherReason}
                className="form-control mv_form_control_profile_textarea_white"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="col-12 d-flex px-0">
          <div className="col-6 px-2 text-center cursorPtr">
            <Button
              type="button"
              fclassname="borderStroke background_none rounded-pill py-2"
              onClick={props.onClose}
            >
              No
            </Button>
          </div>
          <div className="col-6 px-2 text-center cursorPtr">
            <Button
              type="button"
              fclassname="btnGradient_bg rounded-pill"
              onClick={handleCancelOrder}
              isDisabled={reason.toLowerCase() == "others" ? !otherReason : !reason}
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
      :global(.cancelShoutout  .mv_form_control_profile_textarea_white:focus) {
            border: 1px solid #ced4da !important;
          }
      `}</style>
    </Wrapper>
  );
};

export default UserCancelOrder;
