import React from "react";
import CustomHead from "../components/html/head";
import TermCondition from "../components/term-condition";
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
        url={`${WEB_LINK}/terms-and-conditions`}
        {...props.seoSettingData}
      />
      {!auth ?
        <div>
          <Header {...props} />
          <TermCondition />
          <Footer />
        </div>

        :
        <div>
          <DvHomeLayout
            activeLink="terms-conditions"
            pageLink="/terms-and-conditions"
            withMore
          />
        </div>
      }
    </React.Fragment>
  );
}