import React from "react";
import Wrapper from "../../hoc/Wrapper";
import { convertTransectionDate } from "../../lib/global";
import Icon from "../image/icon";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import isMobile from "../../hooks/isMobile";

const WithdrawalInfo = (props) => {
  const [mobileView] = isMobile();
  //   console.log("withdrawal status", props);

  let {
    createdat,
    withdrawid,
    amount,
    currency,
    transactionid,
    status,
    notes
  } = props;

  const StatusTxtComponent = {
    "REQUESTED": "Requested",
    "PENDING": "Processing",
    "APPROVED": "Approved",
    "TRANSFERRED": "Paid Successfully",
    "FAILED": "Failed",
    "REJECTED": "Rejected",
  }

  const StatusClrComponent = {
    "REQUESTED": "text-primary",
    "PENDING": "text-primary",
    "APPROVED": "text-app",
    "TRANSFERRED": "text-success",
    "FAILED": "text-danger",
    "REJECTED": "text-danger",
  }

  const transferredStatus = (textColor) => {
    if (textColor === "text") {
      return StatusTxtComponent[status]
    }
    if (textColor === "color") {
      return StatusClrComponent[status]
    }
  }

  return (
    <Wrapper>
      <div className="p-3 d-flex justify-content-center flex-column mb-5" style={mobileView ? {} : { width: "500px" }}>
        <div className='d-flex flex-row justify-content-end align-items center'>
          <Icon
            icon={`${CLOSE_ICON_WHITE}#close-white`}
            color={"var(--l_app_text)"}
            size={16}
            onClick={() => props.onClose()}
            alt="back_arrow"
            class="cursorPtr"
            viewBox="0 0 16 16"
          />
        </div>
        <h5 className="text-center">Transaction Details</h5>
        <div className="row mx-0 mx-md-5">
          <div className="col-7 pl-0 pr-2 py-2">
            <div className="light_app_text">Transaction Id</div>
            <div>{transactionid || withdrawid}</div>
          </div>
          <div className="col-5 pl-0 pr-2 py-2">
            <div className="light_app_text">Transaction Amount</div>
            <div>{currency || "$"}{amount}</div>
          </div>
          <div className="col-7 pl-0 pr-2 py-2">
            <div className="light_app_text">Transaction Status</div>
            <div className={`${transferredStatus("color")}`}>{transferredStatus("text")}</div>
          </div>
          <div className="col-5 pl-0 pr-2 py-2">
            <div className="light_app_text">Date & Time</div>
            <div>{convertTransectionDate(createdat)}</div>
          </div>
          <div className="col-12 pl-0 pr-2 py-2">
            <div className="light_app_text">Transaction Details</div>
            <div>{transactionid || notes || "Withdrawal to" + pgname}</div>
          </div>
        </div>
      </div>
    </Wrapper >
  );
};

export default WithdrawalInfo;
