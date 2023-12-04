import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { getCookie } from "../../lib/session";
import DvHomeLayout from "../../containers/DvHomeLayout"

const PurchaseDetailPage = (props) => {
  const { tab = "virtual-request" } = props?.query;

  const [mobileView] = isMobile();
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
  const homePageref = useRef(null);
  const userType = getCookie('userType');

  const [orderDetails, setOrderDetails] = useState({
    orderInfo: {
      id: "#OD8ETR5G45245W38",
      from: "ANTHONY MOSIS",
      to: "Sam Alexander",
      status: "PENDING",
      time: "5 June 2019 10:32AM",
    },
  });

  useEffect(() => {
    mobileView && Router.push("/virtual-requests");
  }, [])

  return (
    <Wrapper>
      {!mobileView
        ? <div className="mv_wrap_home" ref={homePageref} id="home-page">
          <DvHomeLayout
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            homePageref={homePageref}
            activeLink="virtual-request/purchasedetail"
            orderDetails={orderDetails}
            isPurchasePage={true}
            withMore={userType == 1 ? false : true}
            {...props}
          ></DvHomeLayout>
        </div>
        : ""
      }
    </Wrapper>
  );
};

PurchaseDetailPage.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  // returnLogin();
  return { query: query };
};
export default PurchaseDetailPage;
