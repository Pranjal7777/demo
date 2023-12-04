import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import { startLoader, stopLoader } from "../../lib/global";
import { getReportReasons, reportPostService } from "../../services/assets";
import * as config from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const RadioButtonsGroup = dynamic(
  () => import("../radio-button/radio-button-group"),
  { ssr: false }
);
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const InputTextArea = dynamic(
  () => import("../../components/formControl/textArea"),
  { ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";

export default function ReportPost(props) {
  const theme = useTheme();
  const { drawerData, back } = props;
  const [lang] = useLang();
  const [reportReasonsList, setReportReasonsList] = useState([]);
  const [value, setValue] = useState("");
  const [showSuccessView, setSuccessView] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [mobileView] = isMobile();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    const reportType = drawerData.reportType || 1;
    getReportReasons(reportType)
      .then((res) => {
        if (res) {
          const resList = res.data.data.map((x) => {
            return {
              value: x.reason,
              label: x.reason,
            };
          });
          setValue(resList[0].value);
          resList.push({
            value: "Others",
            label: "Others",
          });
          setReportReasonsList(resList);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const reportSubmitHandler = () => {
    if (!value) return;
    if (value == "Others" && !otherReason) return;
    startLoader();
    const payload = {
      reportType: drawerData.reportType || 1,
      reportedId: drawerData.reportedId,
      reason: value == "Others" ? otherReason : value,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    reportPostService(payload)
      .then((res) => {
        setSuccessView(true);
        stopLoader();
        if (res) {
          setResponseMsg(res.data.message);
        }
      })
      .catch((error) => {
        setSuccessView(true);
        stopLoader();
        if (error.response) {
          setResponseMsg(error.response.data.message);
        }
      });
    setTimeout(() => {
      back();
    }, 5000 || config.DRAWER_TOASTER_TIME);
  };

  // function to handle input control
  const changeInput = (event) => {
    let inputControl = event;
    setOtherReason(inputControl);
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog rounded">
          <div
            className={`${mobileView ? "modal-content-mobile" : "modal-content"
              } pt-4`}
          >
            {!mobileView && (
              <button
                type="button"
                className="close dv_modal_close"
                data-dismiss="modal"
                onClick={() => props.onClose()}
              >
                {lang.btnX}
              </button>
            )}
            {!showSuccessView ? (
              <div className="col-12 w-330 mx-auto pb-4" >
                <h3
                  className={
                    mobileView
                      ? `mb-0 fntSz22 pb-3 ${theme.type == "light" ? "txt-black" : "text-white"
                      }`
                      : // Commented on 24th March by Bhavleen
                      // : "txt-black dv__fnt24 dv__black_color mb-0 pb-2 mx-auto"
                      "txt-black dv__fnt30 pb-2 text-nowrap"
                  }
                >
                  {lang.reportPost}
                  {drawerData.reportType == 2 ? " user ?" : " post ?"}
                </h3>

                <div className="rep_res">
                  <RadioButtonsGroup
                    // label="abusive content"
                    labelPlacement="start"
                    value={value}
                    onRadioChange={(val) => setValue(val)}
                    buttonGroupData={reportReasonsList}
                  ></RadioButtonsGroup>
                </div>
                {value === "Others" ? (
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
                      className=" form-control mv_form_control_profile_textarea_white"
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="d-flex pt-3 align-items-center justify-content-between">
                  <div className="col-12">
                    <Button
                      type="button"
                      fixedBtnClass={"active"}
                      onClick={reportSubmitHandler}
                      disabled={!value || (value == "Others" && !otherReason)}
                    >
                      {lang.report}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={back}
                className={`col-12 w-330 mx-auto 
                  ${mobileView ? "" : "text-center mb-3"}`}
              >
                <div className="check_icon pb-3">
                  {/* <Img
                    src={config.CHECK}
                    width="74.52pt"
                    height="74.52pt"
                    style={{ borderRadius: "50%" }}
                    alt="check"
                  /> */}
                  <Icon
                    icon={`${config.CHECK}#check_icon`}
                    color={theme?.appColor}
                    size={60}
                    viewBox="0 0 74.521 74.521"
                  />
                </div>
                <h3 className="mb-0 fntSz22 pb-3 bold">{"Reported !"}</h3>

                <p className="text-muted fntSz15">{responseMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.mv_form_control_profile_textarea_white) {
            width: 100%;
            height: 50px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            // color: #50555f !important;
            border: 1px solid #50555f !important;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            -webkit-transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
            transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
          }

          :global(.mv_form_control_profile_textarea_white:focus) {
            border: 1px solid #50555f !important;
            // color: #50555f !important;
          }
          :global(.MuiRadio-colorPrimary){
            color: var(--l_app_text);
          }
          :global(.dv_modal_close) {
            right: 20px;
        }
        `}
      </style>
    </Wrapper>
  );
}
