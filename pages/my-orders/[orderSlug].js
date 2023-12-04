import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";
import DvMyAccountLayout from "../../containers/DvMyAccountLayout/DvMyAccountLayout";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import DvHomeLayout from "../../containers/DvHomeLayout";
import RouterContext from "../../context/RouterContext";

const OrderDetailPage = (props) => {
  const { tab = "my-orders" } = props?.query;

  const [mobileView] = isMobile();
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
  const homePageref = useRef(null);

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
    mobileView && Router.push("/my_orders");
  }, [])

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <Wrapper>
        {!mobileView &&
          <div className="mv_wrap_home" ref={homePageref} id="home-page">
            <DvHomeLayout
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              homePageref={homePageref}
              activeLink="my-orders/orderdetail"
              orderDetails={orderDetails}
              {...props}
              isPurchasePage={false}
            />
          </div>
        }
      </Wrapper>
    </RouterContext>
  );
};

OrderDetailPage.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  // returnLogin();
  return { query: query };
};
export default OrderDetailPage;
