import React, { useEffect, useState } from 'react';
import CustButton from "../../button/button";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { close_drawer } from '../../../lib/global';
import Reasons from '../../radio-button/shoutout-radio';
import { getReasons } from '../../../services/auth';
import dynamic from "next/dynamic";
const InputTextArea = dynamic(
  () => import("../../../components/formControl/textArea"),
  { ssr: false }
);

const OrderConfirm = (props) => {
  const [mobileView] = isMobile()
  const theme = useTheme()
  const [lang] = useLang();
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
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

  useEffect(() => {
    !props.isPurchasePage ? setStatus("REJECTED") : setStatus("CANCELLED")
    GetDeactivateReasons();
  }, [])

  const changeInput = (event) => {
    let inputControl = event;
    setOtherReason(inputControl);
  };


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

  const handleCancelOrder = () => {
    close_drawer(
      "OrderCancel",
      "bottom"
    )
    props.handleAcceptOrCancel(status, reason.toLowerCase() == "others" ? otherReason : reason)
  }


  return (
    <div>
      {mobileView
        ? (
          <div className='p-3 py-4'>
            <div>
              <p className='bold mb-1' style={{ fontSize: '6vw', color: `${theme?.text}` }}>{lang.cancelOrder}</p>
              <p style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.selectReason}</p>
            </div>
            <div>
              <div>
                <Reasons handleReasonOnChange={setReason} reason={reason} reasonsList={cancelReason} />
              </div>
            </div>
            <div>
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

            <div className='d-flex mt-4'>
              <CustButton
                type="submit"
                style={{ width: '70%', marginRight: '10px' }}
                onClick={
                  () => close_drawer(
                    "OrderCancel",
                    "bottom"
                  )
                }
                cssStyles={theme.blueBorderButton}
              >
                {lang.no}
              </CustButton>
              <CustButton
                type="submit"
                style={{ width: '70%', marginLeft: '10px' }}
                onClick={handleCancelOrder}
                cssStyles={theme.blueButton}
                isDisabled={reason.toLowerCase() == "others" ? !otherReason : !reason}
              >
                {lang.yes}
              </CustButton>
            </div>
          </div>
        ) : <></>
      }
      <style jsx>
        {`
          :global(.mv_form_control_profile_textarea_white) {
            width: 100%;
            height: 50px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: ${theme.text} !important;
            border: 1px solid #50555f !important;
            background-color: ${theme.sectionBackground};
            background-clip: padding-box;
            border-radius: 0.25rem;
            -webkit-transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
            transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
          }

          :global(.mv_form_control_profile_textarea_white:focus) {
            color: ${theme.text} !important;
            border: 1px solid #50555f !important;
            background-color: ${theme.sectionBackground};
          }
        `}
      </style>
    </div>
  )
}

export default OrderConfirm;
