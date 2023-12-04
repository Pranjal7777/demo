import React from "react";
import * as config from "../../lib/config";
import useLang from "../../hooks/language";
import FigureImage from "../../components/image/figure-image";

const ForgotPassword1 = (props) => {
  const [lang] = useLang();
  // const { resetLink } = props;
  // console.log("Forgot Password1:", resetLink);

  return (
    // {/* // user_forgot_modal_request_sent */ }
    <div>
      <button
        type="button"
        className="close dv_modal_close"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>
      <div className="dv_modal_wrap">
        <div className="col-12 d-flex align-items-center flex-column">
          <FigureImage
            src={config.checkedLogo}
            width="100"
            height="100"
            alt="checked"
          />

          <div className="dv_modal_title text-center mb-3">
            {lang.resetLinkSet}
          </div>
          <p className="col-auto txt-book fntSz14 dv_upload_txt_color dv_text_shdw text-center mb-4">
            {lang.mailSentMsg}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword1;
