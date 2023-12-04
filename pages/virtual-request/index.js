import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  guestLogin,
} from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { getUserShoutoutList } from "../../services/shoutout";
import CustomHead from "../../components/html/head";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import DvHomeLayout from "../../containers/DvHomeLayout"
import MyPurchasePage from "../virtual-requests";
import RouterContext from "../../context/RouterContext";

function MyOrders(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const [purchaseListOrder, setPurchaseListOrder] = useState([]);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const userType = getCookie('userType');
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    if (selectedFilter.length >= 1) {
      getPurchaseOrder(0)
    }
  }, [selectedFilter])

  useEffect(() => {
    // mobileView && router.push("/virtual-requests");
    if(auth) {
      getPurchaseOrder(0);
    }
    
  }, [auth]);

  const getPurchaseOrder = async (page = 0, limit = 10) => {
    if (mobileView) return;
    setIsLoading(true)

    let payload = {
      trigger: "MY_PURCHASES",
      limit,
      offset: page * limit,
      status: selectedFilter === "ALL" ? "" : selectedFilter,
    };
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    try {
      let res = await getUserShoutoutList(payload);
      if (res.status === 200) {
        setPageCount(page);
        setHasMore(true);
        let data = res?.data?.data;
        setPurchaseListOrder([...purchaseListOrder, ...data]);

      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setHasMore(false);
    }
  };


  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={false} forAgency={false} {...props}>
      <div className="mv_wrap_home" ref={homePageref} id="home-page">
        {mobileView ? (
          <>
            <MyPurchasePage />
          </>
        ) : (
          <>
            <DvHomeLayout
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              activeLink="virtual-request"
              homePageref={homePageref}
              {...props}
              featuredBar
              pageCount={pageCount}
              purchaseOrderList={purchaseListOrder}
              handleDesktopLoader={isLoading}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              setPurchaseListOrder={setPurchaseListOrder}
              setPageCount={setPageCount}
              withMore={userType == 1 ? false : true}
            />
            <PaginationIndicator
              id="order_page"
              totalData={purchaseListOrder}
              pageEventHandler={() => {
                if (!isLoading && hasMore) {
                  getPurchaseOrder(pageCount + 1, true);
                }
              }}
            />
          </>
        )}
      </div>
    </RouterContext>
  );
}

MyOrders.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query,
  };
};

export default MyOrders;
