import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { guestLogin, open_drawer, startLoader, stopLoader } from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import { getCards } from "../../redux/actions/index";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import useProfileData from "../../hooks/useProfileData";

import CustomHead from "../../components/html/head";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import { getUserShoutoutList } from "../../services/shoutout";
import RouterContext from '../../context/RouterContext'
import DvHomeLayout from "../../containers/DvHomeLayout";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";

const DvMyAccountLayout = dynamic(
  () => import("../../containers/DvMyAccountLayout/DvMyAccountLayout"),
  { ssr: false }
);

function MyOrders(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [currProfile] = useProfileData();
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseListOrder, setPurchaseListOrder] = useState([]);
  const [handleDesktopLoader, setHandleDesktopLoader] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const filterOption = [
    { label: "ALL", value: 5 },
    { label: "REQUESTED", value: 1 },
    { label: "ACCEPTED", value: 2 },
    { label: "COMPLETED", value: 3 },
    { label: "CANCELLED", value: 4 },
    { label: "FAILED", value: 6 },
    { label: "REJECTED", value: 7 },
  ]

  useEffect(() => {
    if (selectedFilter.length >= 1) {
      getPurchaseOrder(0)
    }
  }, [selectedFilter])

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    mobileView && router.push("/my_orders");
    setToggleDrawer(true);
    !mobileView && getPurchaseOrder();
  }, []);

  const getPurchaseOrder = async (page = 0, loader) => {
    mobileView ? startLoader() : setHandleDesktopLoader(true);
    setHandleDesktopLoader(true);
    let payload = {
      trigger: "MY_ORDERS",
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
        let data = res?.data?.data;
        setPurchaseListOrder([...purchaseListOrder, ...data]);
        setTotalPostCount(data.length);
        mobileView ? stopLoader() : setHandleDesktopLoader(false);
        setHandleDesktopLoader(false);
        setIsLoading(false);
      } else {
        mobileView ? stopLoader() : setHandleDesktopLoader(false);
      }
    } catch (e) {
      mobileView ? stopLoader() : setHandleDesktopLoader(false);
      setIsLoading(false);
      setHandleDesktopLoader(false);
      console.log(e);
    }
  };

  const handleCloseDrawer = () => {
    router.back();
  };

  // if (!validGuest && !auth) {
  //   return (
  //     <div className="mv_wrap_home">
  //       <CustomHead {...props.seoSettingData} />
  //     </div>
  //   );
  // }

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
    <div className="mv_wrap_home" ref={homePageref} id="home-page">
      {mobileView ? (
        <>
          <div></div>
        </>
      ) : (
        <>
            {/* <DvMyAccountLayout
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            activeLink="my-orders"
            homePageref={homePageref}
            purchaseOrderList={purchaseListOrder}
            {...props}
            pageCount={pageCount}
            handleDesktopLoader={handleDesktopLoader}
            filterOption={filterOption}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            setPurchaseListOrder={setPurchaseListOrder}
            setPageCount={setPageCount}
          /> */}
            <DvHomeLayout
              activeLink="my-orders"
              pageLink="/my-orders"
              featuredBar
              homePageref={homePageref}
              purchaseOrderList={purchaseListOrder}
              {...props}
              pageCount={pageCount}
              handleDesktopLoader={handleDesktopLoader}
              filterOption={filterOption}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              setPurchaseListOrder={setPurchaseListOrder}
              setPageCount={setPageCount}
          />
          {purchaseListOrder && purchaseListOrder.length ? (
            <PaginationIndicator
                id="order_page"
              elementRef={homePageref}
              totalData={purchaseListOrder}
              totalCount={purchaseListOrder.length || 500}
              pageEventHandler={() => {
                if (!isLoading && totalPostCount) {
                  getPurchaseOrder(pageCount + 1, true);
                }
                // setIsLoading(true);
              }}
            />
          ) : (
            ""
          )}
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
