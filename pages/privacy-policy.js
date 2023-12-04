import React from "react";
import CustomHead from "../components/html/head";
import { WEB_LINK } from "../lib/config";
import { getCookie } from "../lib/session";
import DvHomeLayout from "../containers/DvHomeLayout";
import PrivacyPolicy from "../components/privacy-policy";
import Header from "../containers/Header";
import Footer from "../containers/Footer";

const Privacy = (props) => {
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
          <PrivacyPolicy />
          <Footer/>
        </div>
        :
        <div>
          <DvHomeLayout
            activeLink="privacy-policy"
            pageLink="/privacy-policy"
            withMore
          />
        </div>
      }
    </React.Fragment>
  );
}

export default Privacy;