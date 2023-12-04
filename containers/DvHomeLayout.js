import dynamic from 'next/dynamic';
import React from 'react';
import isMobile from '../hooks/isMobile';
import useLang from '../hooks/language';
import DvSidebar from './DvSidebar/DvSidebar';
import MoreMenu from '../components/moremenu';
import DvProfilePage from './DvProfilePage/DvProfilePage';
import DvEditProfile from './DvEditProfile/DvEditProfile';

import { isAgency } from '../lib/config/creds';
import { useSelector } from 'react-redux';
const MainChat = dynamic(() => import('../components/chat/MainChat'), { ssr: false })
const MyVault = dynamic(() => import('../components/myVault/my-vault'), { ssr: false });
const MyFilesPage = dynamic(() => import('../components/myVault/my-files'), { ssr: false });
const MySubscription = dynamic(() => import("../components/Drawer/subscription/my-subscription"), { ssr: false });
const ExploreSearch = dynamic(() => import("./sub-pages/explore-search"), { ssr: false });
const MyOrderDetail = dynamic(() => import("./my_order/my_order_detail"), { ssr: false });
const MyOrder = dynamic(() => import("./my_order/my_order"), { ssr: false });
const WebChat = dynamic(() => import("./message/webChat"), { ssr: false });
const LiveStreamTabs = dynamic(() => import("./live-stream-tabs/live-stream-tabs"), { ssr: false });
const DvWallet = dynamic(() => import("./DvWallet/DvWallet"), { ssr: false });
const Dv_VideoCallSetting = dynamic(() => import("./DvVideoCallSetting/DvVideoCallSetting"), { ssr: false });
const Notification = dynamic(() => import("../components/notification"), { ssr: false });
const DvFeaturedCreators = dynamic(() => import('./DvHomePage/DvFeaturedCreators'), { ssr: false });
const SocialHomePage = dynamic(() => import("../containers/homepages/socialHomePage"));
const DeviceLog = dynamic(() => import("./agency/DeviceLog"), { ssr: false });
const Employee = dynamic(() => import("./agency/Employee"), { ssr: false });
const StatusLog = dynamic(() => import("./agency/StatusLog"), { ssr: false });
const AgencyProfile = dynamic(() => import("./agency/AgencyProfile"), { ssr: false });
const AgencyMyprofile = dynamic(() => import("./agency/AgencyMyprofile"), { ssr: false });
const AddEmployee = dynamic(() => import("./agency/AddEmployee"), { ssr: false });
const MyProfile = dynamic(() => import("./agency/MyProfile"), { ssr: false });
const CreatorAgency = dynamic(() => import("./agency/CreatorAgency"));
const FeaturedCreator = dynamic(() => import('../components/featureCreator'), { ssr: false });
const CreatorInsights = dynamic(() => import('../containers/creatorInsights/CreatorInsights'));

const DvHomeLayout = (props) => {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const appConfig = useSelector(state => state.appConfig)

  const componentList = {
    "HomePage": <SocialHomePage {...props} />,
    "wallet": <DvWallet
      getStripe={props.getStripe}
      account={props.account}
      setAccount={props.setAccount}
      homePageref={props.homePageref}
    />,
    "Live": <LiveStreamTabs
      selectedCategory={props.category}
      changeTheme={props.changeTheme}
      homePageref={props.homePageref}
    />,
    "Explore": <ExploreSearch
      {...props}
    />,
    "Chat": <WebChat
      active={true}
      isAgency={isAgency()}
      selectedCreatorId={selectedCreatorId}
      {...props}
      isMobile={false}
    />,
    "chat": <MainChat {...props} />,
    "Notification": <Notification
      {...props}
      homePageref={props.homePageref}
    />,
    "video-schedule": <Dv_VideoCallSetting homePageref={props.homePageref} isVideoCallPage={false} />,
    "my-orders": <MyOrder
      languages={props.languages}
      homePageref={props.homePageref}
      isOrderPage={true}
      pageTitle={lang.orders}
      shoutoutOrderList={props.purchaseOrderList}
      activeOrder={props.handleSingleOrderDetail}
      {...props}
    />,
    "my-orders/orderdetail": <MyOrderDetail
      languages={props.languages}
      homePageref={props.homePageref}
      orderDetails={props.orderDetails}
      isPurchasePage={props.isPurchasePage}
      currentOrder={props.currentOrder}
    />,
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
    "mySubscriptions": <MySubscription homePageref={props.homePageref} />,
    "MyVault": <MyVault {...props} />,
    "my-vault/myFilePage": <MyFilesPage {...props} />,
    "profile": <DvProfilePage
      setActiveStateStories={props.setActiveStateStories}
      isSticky={props.isSticky}
      tabType={props.tabType}
      activeNavigationTab={props.activeNavigationTab}
      homePageref={props.homePageref}
    />,
    "profile/edit": <DvEditProfile
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
    />,
    "agencyEmployee": <Employee />,
    "statusLog": <StatusLog />,
    "agencyProfile": <AgencyProfile />,
    "agencyMyprofile": <AgencyMyprofile />,
    "addEmployee": <AddEmployee />,
    "my_profile": <MyProfile />,
    "homePageAgency": <CreatorAgency />,
    "deviceLog": <DeviceLog />,
    "viewAllFeaturedCreators": <FeaturedCreator {...props} />,
    "myInsights": <CreatorInsights
      {...props}
    />
  }

  let pageContent = () => {
    if (props.withMore) {
      return <MoreMenu {...props} />
    }
    return componentList[props.activeLink];
  }

  return (
    <div className='w-100'>
      <div className="d-flex flex-row justify-content-between w-100 overflow-hidden" style={{height: "calc(var(--vhCustom, 1vh) * 100)"}}>
        {!mobileView && !props?.isSmallbar ? <div style={{ width: '20%', minWidth: '15.642rem', maxWidth: '26.6rem', borderRight: '1px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100 specific_section_bg'>
          <DvSidebar
            fullbar
            agencyMenuOpen={props.agencyMenuOpen}
            page={props.pageLink}
            withMore={props.withMore}
            changeTheme={props.changeTheme}
          />
        </div> : <>
          {
            !mobileView ? <div style={{ width: '8%', minWidth: '6.4rem', maxWidth: '7rem', borderRight: '1px solid var(--l_border)', overflowY: 'auto' }} className='sticky-top vh-100 specific_section_bg'>
              <DvSidebar />
            </div> : ""
          }</>
        }
        <div className='d-flex mx-auto' style={{ width: mobileView ? "100%" : `${props.isSmallbar ? "92%" : "80%"}` }}>
          <div style={{ width: `${(!mobileView && props.featuredBar) ? "calc(100% - 30vw)" : "100%"}` }}>
            {pageContent()}
          </div>
          {!mobileView && props.featuredBar && <div className="dv__freaturedCreatorsWidth sticky-top vh-100 specific_section_bg" style={{ width: '30vw', minWidth: '30vw', borderLeft: '1px solid var(--l_border)', overflowY: 'auto' }}>
            <DvFeaturedCreators setActiveState={props.setActiveState} />
          </div>}
        </div>

      </div>
      <style>
        <style jsx>
          {`
            .mv_wrap_home{
                height:${!mobileView && "inherit !important"}
                }
                `}
        </style>
      </style>
    </div>
  )
}

export default DvHomeLayout