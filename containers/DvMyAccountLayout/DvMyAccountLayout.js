import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Wrapper from "../../hoc/Wrapper";
import * as env from "../../lib/config";
import Image from "../../components/image/image";
import DvProfilePage from "../DvProfilePage/DvProfilePage";
import useProfileData from "../../hooks/useProfileData";
import { open_dialog } from "../../lib/global";
import Dv_ReferFriends from "../Dv_ReferFriends/Dv_ReferFriends";
import DvEditProfile from "../DvEditProfile/DvEditProfile";
import FAQ from "../../components/Drawer/FAQ";
import ChangeLanguage from "../../components/Drawer/ChangeLanguage";
import { handleEmailShare } from "../../lib/share/handleShare";
import AddressList from "../../components/Drawer/AddressList";
import CardsList from "../../components/Drawer/CardsList";
import Dv_ReportProblem from "../Dv_ReportProblem/Dv_ReportProblem";
import useLang from "../../hooks/language";
import DvWallet from "../DvWallet/DvWallet";
import DVBillingPlans from "../DV_BillingPlans";
import PurchasedPost from "../../components/Drawer/PurchasedPosts";
import FavouritePosts from "../../components/Drawer/FavouritePosts";
import CollectionPosts from "../../components/Drawer/CollectionPosts";
import isMobile from "../../hooks/isMobile";

// Modified By Bhavleen on April 28th, 2021
import MySubscription from "../../components/Drawer/subscription/my-subscription";
import MySubscribers from "../../components/Drawer/subscription/my-subscribers";
import SubscriptionSettings from "../../components/Drawer/subscription/SubscriptionSettings";
import Icon from "../../components/image/icon";
import MyOrder from "../my_order/my_order";
import MyOrderDetail from "../my_order/my_order_detail";
import Img from "../../components/ui/Img/Img";
// import AutoMessage from "../../pages/automessage";
import Dv_VideoCallSetting from "../DvVideoCallSetting/DvVideoCallSetting";
import { getCookie } from "../../lib/session";
import ReviewTab from "../profile/reviewTab";
import MarkatePlaceHeader from "../markatePlaceHeader/markatePlaceHeader";
import DashboardContainer from "../dashboard/DashboardContainer";
import isTablet from "../../hooks/isTablet";
import DvSidebar from "../DvSidebar/DvSidebar";

const DvHeader = dynamic(() => import("../DvHeader/DvHeader"), { ssr: false });

const DvMyAccountLayout = (props) => {
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState(props.activeLink);
  const [profile] = useProfileData();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const current_theme = useSelector((state) => state.theme);
  let orderCount = useSelector((state) => state?.profileData?.orderCount);
  const [expanded, setExpanded] = React.useState(false);

  const [currentOrder, setCurrentOrder] = useState(null);
  useEffect(() => {
    const node = document.getElementById(`nav_${activeLink}`);
    if (node) {
      node.scrollIntoViewIfNeeded();
    }
  }, [activeLink]);

  const handleSlidetoTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const handleSingleOrderDetail = (orderIndex) => {
    setCurrentOrder(orderIndex)
  }

  let pageContent = () => {
    switch (props.activeLink) {
      case "profile":
        return (
          <DvProfilePage
            setActiveStateStories={props.setActiveStateStories}
            isSticky={props.isSticky}
            tabType={props.tabType}
            activeNavigationTab={props.activeNavigationTab}
            homePageref={props.homePageref}
            setActiveNavigationTab={props.setActiveNavigationTab}
          />
        );

      case "profile/edit":
        return (
          <DvEditProfile
            bannerImage={props.bannerImage}
            onBannerImageChange={props.onBannerImageChange}
            profileImage={props.profileImage}
            onProfileImageChange={props.onProfileImageChange}
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validationSchema={props.validationSchema}
            handleChangeBio={props.handleChangeBio}
            bioValue={props.bioValue}
            bioLen={props.bioLen}
            gender={props.gender}
            homePageref={props.homePageref}
            handleNSFWChanges={props.handleNSFWChanges}
            isNSFWAllow={props.isNSFWAllow}
            {...props}
          />
        );

      case "collections":
        return <CollectionPosts homePageref={props.homePageref} />;

      case "wallet":
        return (
          <DvWallet
            getStripe={props.getStripe}
            account={props.account}
            setAccount={props.setAccount}
            homePageref={props.homePageref}
          />
        );

      case "faqs":
        return (
          <FAQ
            FaqList={props.FaqList}
            parentList={props.parentList}
            homePageref={props.homePageref}
          />
        );

      // Modified By Bhavleen on April 28th, 2021
      case "mySubscriptions":
        return <MySubscription homePageref={props.homePageref} />;

      case "mySubscribers":
        return <MySubscribers homePageref={props.homePageref} />;

      case "subsSettings":
        return <SubscriptionSettings homePageref={props.homePageref} />;

      case "address":
        return (
          <AddressList
            getAddress={props.getAddress}
            profileView={true}
            homePageref={props.homePageref}
          />
        );

      case "purchased-gallery":
        return (
          <PurchasedPost
            data={props.data}
            loading={props.loading}
            setPage={props.setPage}
            setLoading={props.setLoading}
            getLikedPost={props.getLikedPost}
            handleReloadItem={props.handleReloadItem}
            totalCount={props.totalCount}
            offset={props.offset}
            homePageref={props.homePageref}
            hasMore={props.hasMore}
            apiResponse={props.apiResponse}
          />
        );

      case "favourites":
        return <FavouritePosts homePageref={props.homePageref} />;

      case "cards":
        return <CardsList homePageref={props.homePageref} />;

      case "refer-friends":
        return <Dv_ReferFriends homePageref={props.homePageref} />;

      case "report-problem":
        return <Dv_ReportProblem homePageref={props.homePageref} />;

      case "video-call":
        return <Dv_VideoCallSetting homePageref={props.homePageref} isVideoCallPage={true} />;

      case "video-schedule":
        return <Dv_VideoCallSetting homePageref={props.homePageref} isVideoCallPage={false} />;

      case "billing-plans":
        return <DVBillingPlans homePageref={props.homePageref} />;

      case "change-language":
        return (
          <ChangeLanguage
            languages={props.languages}
            homePageref={props.homePageref}
          />
        );

      case "my-orders":
        return (
          <MyOrder
            languages={props.languages}
            homePageref={props.homePageref}
            isOrderPage={true}
            pageTitle={lang.orders}
            shoutoutOrderList={props.purchaseOrderList}
            activeOrder={handleSingleOrderDetail}
            {...props}
          />
        );

      case "auto-message":
        return (
          <AutoMessage
            {...props}
          />
        );

      case "my-orders/orderdetail":
        return (
          <MyOrderDetail
            languages={props.languages}
            homePageref={props.homePageref}
            orderDetails={props.orderDetails}
            isPurchasePage={props.isPurchasePage}
            currentOrder={currentOrder}
          />
        );

      case "virtual-request":
        return (
          <MyOrder
            languages={props.languages}
            homePageref={props.homePageref}
            isOrderPage={false}
            pageTitle="Virtual Requests"
            shoutoutOrderList={props.purchaseOrderList}
            activeOrder={handleSingleOrderDetail}
            {...props}
          />
        );

      case "virtual-request/purchasedetail":
        return (
          <MyOrderDetail
            languages={props.languages}
            homePageref={props.homePageref}
            orderDetails={props.orderDetails}
            isPurchasePage={props.isPurchasePage}
            currentOrder={currentOrder}
          />
        );
      case "reviews":
        return (
          <ReviewTab
            languages={props.languages}
            homePageref={props.homePageref}
            userId={getCookie("uid")}
            isCreatorSelf={true}
            {...props}
          />
        );

      case "myDashboard":
        return (
          <DashboardContainer
            {...props}
          />
        );
    }
  };

  return (
    <Wrapper>
      <div 
        id="profile_page_cont"
        className="bg-dark-custom vh-100 overflow-auto d-flex"
      >
        <div style={{ width: '8%', minWidth: '6.4rem', maxWidth: '7rem', borderRight: '1.5px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100 specific_section_bg'>
          <DvSidebar />
        </div>
        <div className="d-flex justify-content-between mx-auto" style={{ width: `${tabletView ? '90vw' : '89%'}`, }}>
          <div className='w-100'>
            {activeLink == "language" ? content() : pageContent()}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default DvMyAccountLayout;
