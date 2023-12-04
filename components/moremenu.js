import React from 'react';
import DVmoreSideBar from '../containers/DvSidebar/DvmoreSideBar';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import JoinAsSeller from './JoinAsSeller';
import { isAgency } from '../lib/config/creds';
import { useTheme } from 'react-jss';
import isMobile from '../hooks/isMobile';

const NSFWContent = dynamic(() => import('./NSFWContent'), { ssr: false });
const ManageList = dynamic(() => import('./manageLists'), { ssr: false });
const MyOrderDetail = dynamic(() => import("../containers/my_order/my_order_detail"), { ssr: false });
const MyOrder = dynamic(() => import("../containers/my_order/my_order"), { ssr: false });
const UscLegacy = dynamic(() => import("./USC-legacy"), { ssr: false });
const CardsList = dynamic(() => import("./Drawer/CardsList"), { ssr: false });
const Dv_VideoCallSetting = dynamic(() => import("../containers/DvVideoCallSetting/DvVideoCallSetting"), { ssr: false });
const AutoMessage = dynamic(() => import("../pages/automessage"), { ssr: false });
const Legalcontentcomp = dynamic(() => import("./legalContent"), { ssr: false });
const DMCA = dynamic(() => import("./DMCA.jsx"), { ssr: false });
const PrivacyPolicy = dynamic(() => import("./privacy-policy"), { ssr: false });
const TermCondition = dynamic(() => import("./term-condition"), { ssr: false });
const FAQ = dynamic(() => import("./Drawer/FAQ"), { ssr: false });
const Dv_ReportProblem = dynamic(() => import("../containers/Dv_ReportProblem/Dv_ReportProblem"), { ssr: false });
const Dv_ReferFriends = dynamic(() => import("../containers/Dv_ReferFriends/Dv_ReferFriends"), { ssr: false });
const SubscriptionSettings = dynamic(() => import("../components/Drawer/subscription/SubscriptionSettings"), { ssr: false });
const MySubscribers = dynamic(() => import("../components/Drawer/subscription/my-subscribers"), { ssr: false });
const PurchasedPosts = dynamic(() => import("./Drawer/PurchasedPosts"), { ssr: false });
const FavouritePosts = dynamic(() => import("./Drawer/FavouritePosts"), { ssr: false });
const CollectionPosts = dynamic(() => import("./Drawer/CollectionPosts"), { ssr: false });
const MySubscription = dynamic(() => import("../components/Drawer/subscription/my-subscription"), { ssr: false });
const DVBillingPlans = dynamic(() => import("../containers/DV_BillingPlans"), { ssr: false });
const Registration = dynamic(() => import("../pages/signup-as-creator"), { ssr: false });
const ReviewTab = dynamic(() => import('../containers/profile/reviewTab'), { ssr: false });
const AgencyRequest = dynamic(() => import('./AgencyRequest'), { ssr: false });
const DashboardContainer = dynamic(() => import('../containers/dashboard/DashboardContainer'), { ssr: false });
const NotiFicationSetting = dynamic(() => import('./NotiFicationSetting'), { ssr: false });
const CreatorInsights = dynamic(() => import('../containers/creatorInsights/CreatorInsights'));


const MoreMenu = (props) => {
  const statusCode = useSelector((state) => state.profileData.statusCode);
  const theme = useTheme();
  const [mobileView] = isMobile()

  const componentList = {
    "billing-plans": <DVBillingPlans homePageref={props.homePageref} />,
    "favourites": <FavouritePosts homePageref={props.homePageref} isMoreMenu={true} />,
    "collections": <CollectionPosts homePageref={props.homePageref} isMoreMenu={true} />,
    "purchased-gallery": <PurchasedPosts
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
      isMoreMenu={true}
    />,
    "mySubscriptions": <MySubscription homePageref={props.homePageref} />,
    "mySubscribers": <MySubscribers homePageref={props.homePageref} />,
    "subsSettings": <SubscriptionSettings homePageref={props.homePageref} />,
    "video-call": <Dv_VideoCallSetting homePageref={props.homePageref} isVideoCallPage={true} />,

    "auto-message": <AutoMessage {...props} />,
    "notification-settings": <NotiFicationSetting {...props} />,
    "manageLists": <ManageList {...props} />,
    "refer-friends": <Dv_ReferFriends homePageref={props.homePageref} />,
    "report-problem": <Dv_ReportProblem homePageref={props.homePageref} />,
    "faqs": <FAQ
      FaqList={props.FaqList}
      parentList={props.parentList}
      homePageref={props.homePageref}
    />,
    "terms-conditions": <TermCondition moreMenu={true} />,
    "privacy-policy": <PrivacyPolicy moreMenu={true} />,
    "DMCA-legacy": <DMCA moreMenu={true} />,
    "NSFWContent": <NSFWContent moreMenu={true} />,
    "USC-legacy": <UscLegacy moreMenu={true} />,
    "legal-content": <Legalcontentcomp />,
    "becomeCreator": <Registration BecomeCreator={true} {...props} />,
    "JoinAsSeller": <JoinAsSeller {...props} />,
    "reviews": <ReviewTab {...props} />,
    "virtual-request": <MyOrder
      languages={props.languages}
      homePageref={props.homePageref}
      isOrderPage={false}
      pageTitle="Virtual Requests"
      shoutoutOrderList={props.purchaseOrderList}
      activeOrder={props.handleSingleOrderDetail}
      {...props}
    />,
    "virtual-request/purchasedetail": <MyOrderDetail
      languages={props.languages}
      homePageref={props.homePageref}
      orderDetails={props.orderDetails}
      isPurchasePage={props.isPurchasePage}
      currentOrder={props.currentOrder}
    />,
    "myDashboard": <DashboardContainer
      {...props}
    />,
    "myInsights": <CreatorInsights
      {...props}
    />
  }
  if (!isAgency()) {
    componentList["myAgency"] = <AgencyRequest />;
    componentList["cards"] = <CardsList homePageref={props.homePageref} />;
  }
  let PageContent = () => {
    return componentList[props.activeLink]
  }
  return (
    <div className='d-flex w-100'>
      {
        mobileView ?
          <div id="page_more_side_bar" className='page_more_side_bar p-3 overflowY-auto overflowX-hidden' style={{ height: 'calc(calc(var(--vhCustom, 1vh) * 100) - 12px)' }}>
            {PageContent()}
          </div>
          : <div className={`mx-3 mt-3 row d-flex overflow-hidden specific_section_bg ${theme.type === "light" && "borderStroke"}`} style={{ borderRadius: "12px 12px 0px 0px", height: 'calc(calc(var(--vhCustom, 1vh) * 100) - 16px)' }}>
            <div className='col-3 p-3 sticky-top overflowY-auto specific_section_bg' style={{ borderRight: "1px solid var(--l_border)", height: statusCode !== 1 ? "92vh" : "calc(calc(var(--vhCustom, 1vh) * 100) - 17px)" }}>
              <DVmoreSideBar
                {...props}
              />
            </div>
            <div id="page_more_side_bar" className='page_more_side_bar col-9 p-4 overflowY-auto overflowX-hidden' style={{ height: 'calc(calc(var(--vhCustom, 1vh) * 100) - 12px)' }}>
              {PageContent()}
            </div>
          </div>
      }


    </div>
  )
}

export default MoreMenu