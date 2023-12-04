import React from "react";
import CustomHead from "../components/html/head";
import UscLegacy from "../components/USC-legacy";
import { WEB_LINK } from "../lib/config";
import { getCookie } from "../lib/session";
import DvHomeLayout from "../containers/DvHomeLayout";
import Header from "../containers/Header";
import Footer from "../containers/Footer";

export default function TermsAndConditions(props) {
  const auth = getCookie("auth");
  return (
    <React.Fragment>
      <CustomHead
        url={`${WEB_LINK}/USC-legacy`}
        {...props.seoSettingData}
      />
      {!auth ?
        <div>
          <Header {...props} />
          <UscLegacy />
          <Footer />
        </div>

        :
        <div>
          <DvHomeLayout
            activeLink="USC-legacy"
            pageLink="/usc2257"
            withMore
          />
        </div>
      }
    </React.Fragment>
  );
}