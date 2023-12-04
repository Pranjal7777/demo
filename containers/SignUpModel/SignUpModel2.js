import React from "react";

import Button from "../../components/button/button";
import useLang from "../../hooks/language";
import { close_dialog } from "../../lib/global";
import isMobile from "../../hooks/isMobile";

const SignUpModel2 = (props) => {
  const [lang] = useLang();
  const { docSubmittedRedirection = false, currentTheme = "" } = props
  const [mobileView] = isMobile();
  return (
    <div className="dv_modal_wrap" style={{ width: !mobileView ? "502px" : "" }}>
      <div className="col-12 px-0 text-center">
        <h5>
          {docSubmittedRedirection ? lang.docSubmitted : props.isAgency ? lang.profileSubmittedAgency : lang.profileSubmitted}
        </h5>
        <h6 className="col-auto light_app_text w-400 my-4">
          {props.isAgency ? lang.pendingAgency : docSubmittedRedirection ? lang.docSubmittedRedirectingMsg : lang.pendingMessage}
        </h6>
        <Button
          href="#submitted"
          fclassname="btnGradient_bg rounded-pill"
          children={docSubmittedRedirection ? lang.continue : lang.btnLogin}
          onClick={() => { close_dialog(), !props.isAgency ? window.open('/login', '_self') : docSubmittedRedirection ? window.location.href = "/" : window.open('/agencyLogin', '_self') }}
        />
      </div>
      <style jsx>{`
        :global(.profileSubmitted .targetDialog),:global(.profileDocSubmitted .targetDrawer){
          background: ${currentTheme === "white" && "white !important"};
          border: ${currentTheme === "white" && "none !important"};
        }
`}
      </style>
    </div>
  );
};

export default SignUpModel2;
