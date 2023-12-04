import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTheme } from "react-jss";

import { guestLogin } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import Wrapper from "../hoc/Wrapper"
import CustomHead from "../components/html/head";
import { WEB_LINK } from "../lib/config";
import DvHomeLayout from "../containers/DvHomeLayout";
import FAQ from "../components/Drawer/FAQ.js";

function FAQs(props) {
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [validGuest, setValidGuest] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
  }, []);


  if (!validGuest && !auth) {
    return (
      <div>
        <CustomHead
          url={`${WEB_LINK}/faqs`}
          {...props.seoSettingData}
        ></CustomHead>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="mv_wrap_home" ref={homePageref} id="home-page">
        {mobileView ? (<FAQ
          onClose={router.back}
          {...props}
        ></FAQ>
        )
          : (
            <DvHomeLayout
              activeLink="faqs"
              parentList={[]}
              homePageref={homePageref}
              withMore
              {...props}
              pageLink="/faqs"
            />
          )}
      </div>
    </Wrapper>
  );
}

FAQs.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default FAQs;
