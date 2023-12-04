import React, { useState } from 'react'
import { getCookie } from '../../lib/session'
import { useRouter } from 'next/router'
import { useTheme } from "react-jss";
import useProfileData from '../../hooks/useProfileData'
import { open_dialog } from '../../lib/global'
import SidebarDropdown from '../../components/DropdownMenu/SidebarDropdown'
import useLang from '../../hooks/language'
import { isAgency } from '../../lib/config/creds';

function DVmoreSideBar(props) {

  const userType = getCookie("userType");
  const router = useRouter();
  const [profile] = useProfileData();
  const theme = useTheme()
  const [hover, setHover] = useState('');
  const [lang] = useLang();

  const subscriptionMenuContent = [
    // {
    //   label: 'My Subscriptions',
    //   isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
    //   url: "/my-subscriptions"
    // },
    {
      label: 'My Subscribers',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: "/my-subscribers"
    },
    {
      label: 'Manage Subscription Plans',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: "/subscription-settings"
    },
  ]
  const otherMenuContent = [
    {
      label: 'Terms & Conditions',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: "/terms-and-conditions"
    },
    {
      label: 'Privacy Policy',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: "/privacy-policy"
    },
    {
      label: 'DMCA',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: '/dmca'
    },
    {
      label: 'USC2257',
      isCreator: profile.userTypeCode == 1 || profile.userTypeCode == 2,
      url: '/usc2257'
    }
  ]
  const usermenubarcontent = [
    {
      bartext: 'Billing History',
      redirect: '/billing-history',
    },
    {
      bartext: lang.favourites,
      redirect: '/favourites',
    },
    {
      bartext: 'Collections',
      redirect: '/collections',
    },
    {
      bartext: 'Purchased Gallery',
      redirect: '/purchased-gallery',
    },
    {
      bartext: 'Debit/Credit Card',
      redirect: '/cards',
    },
    {
      bartext: 'Notification Settings',
      redirect: '/notification-settings',
    },
    {
      bartext: 'Report a Problem',
      redirect: '/report-problem',
    },
    {
      bartext: 'Become a Creator',
      redirect: '/become-creator',
    },
    {
      bartext: 'FAQ',
      redirect: '/faqs',
    },
    {
      bartext:
        <SidebarDropdown
          title={lang.other}
          titleClasses="fntSz15 pl-3 ml-1 py-2 "
          listClasses="pl-3 ml-1 py-2"
          titleStyle={{ padding: "1px" }}
          items={otherMenuContent}
          {...props}
        />,
      moremenu: true,
    },
    {
      bartext: 'Logout',
      dialog: 'Logout',
    },

  ]
  const creatormenubarcontent = [
    // {
    //   bartext: lang.dashboard,
    //   redirect: '/insights',
    // },
    // {
    //   bartext: 'Billing History',
    //   redirect: '/billing-history',
    // },
    {
      bartext: lang.favourites,
      redirect: '/favourites',
    },
    {
      bartext: 'Collections',
      redirect: '/collections',
    },
    // {
    //   bartext: 'Purchased Gallery',
    //   redirect: '/purchased-gallery',
    // },
    {
      bartext:
        <SidebarDropdown
          title={lang.subscription}
          titleClasses="fntSz15 pl-3 ml-1 py-2 "
          listClasses="pl-3 ml-1 py-2"
          titleStyle={{ padding: "1px" }}
          items={subscriptionMenuContent}
          {...props}
        />,
      moremenu: true,
    },
    // {
    //   bartext: 'Video Call Price Settings',
    //   redirect: '/video-call',
    // },
    // {
    //   bartext: 'Virtual Request',
    //   redirect: '/virtual-request',
    // },
    {
      bartext: 'Agency',
      redirect: '/myAgency',
    },
    {
      bartext: 'Notification Setting',
      redirect: '/notification-settings',
    },
    {
      bartext: 'CRM Automation',
      redirect: '/auto-message',
    },
    {
      bartext: 'Manage Lists',
      redirect: '/manage-list',
    },
    // {
    //   bartext: 'Join as a seller',
    //   redirect: '/join-as-seller',
    //   isSubDomain: !isSubDomain,
    // },
    {
      bartext: 'Refer your Friends',
      redirect: '/refer-friends',
    },
    {
      bartext: 'Report a Problem',
      redirect: '/report-problem',
    },
    {
      bartext: 'Reviews',
      redirect: '/review',
    },
    {
      bartext: 'FAQ',
      redirect: '/faqs',
    },
    {
      bartext:
        <SidebarDropdown
          title={lang.other}
          titleClasses="fntSz15 pl-3 ml-1 py-2 "
          listClasses="pl-3 ml-1 py-2"
          titleStyle={{ padding: "1px" }}
          items={otherMenuContent}
          {...props}
        />,
      moremenu: true,
    },
    {
      bartext: 'Logout',
      dialog: 'Logout',
    },
  ]
  if (isAgency()) {
    const agencyIndex = creatormenubarcontent.findIndex(item => item.bartext === 'Agency');
    if (agencyIndex !== -1) {
      creatormenubarcontent.splice(agencyIndex, 1);
    }

    const debitCardIndex = creatormenubarcontent.findIndex(item => item.bartext === 'Debit/Credit Card');
    if (debitCardIndex !== -1) {
      creatormenubarcontent.splice(debitCardIndex, 1);
    }
    const logoutIndex = creatormenubarcontent.findIndex(item => item.bartext === 'Logout');
    if (logoutIndex !== -1) {
      creatormenubarcontent.splice(logoutIndex, 1);
    }
  }

  const onClickHandler = (index, items) => {
    // setActiveTab(index);
    items?.redirect && router.push(items?.redirect);
    items?.dialog && open_dialog(items?.dialog);
  }

  return (
    <>
      <div className='mx-1'>
        <div className='row mx-0 light_app_text'>
          {((userType || profile?.userTypeCode) == 1 ? usermenubarcontent : creatormenubarcontent)?.map((items, index) => {
            if (items?.isSubDomain) return;
            return (<div key={`sd_${index}`} className='col-12 px-0 my-1' onMouseEnter={() => items?.moremenu ? setHover("") : setHover(index)} onMouseLeave={() => setHover('')}>
              <div>
                <div className={`d-flex flex-row flex-nowrap align-items-center cursorPtr ${!items?.moremenu && 'px-3 py-2'}`} onClick={() => onClickHandler(index, items)}>
                  <div className={`fntSz15 w-100 ${!items?.moremenu && 'ml-1'} ${[router.pathname, router.asPath].includes(items.redirect) || hover === index ? "gradient_text font-weight-500" : ""}`}>
                    {items?.bartext}
                  </div>
                </div>
              </div>
            </div>

            )
          })}
        </div>
      </div>
    </>
  )
}

export default DVmoreSideBar