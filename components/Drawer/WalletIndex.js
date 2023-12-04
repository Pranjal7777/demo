import React, { useState } from 'react'
import useLang from '../../hooks/language';
import useWalletData from '../../hooks/useWalletData';
import Button from '../button/button';
import { Toast, backNavMenu, open_dialog, open_drawer } from '../../lib/global/loader';
import dynamic from 'next/dynamic';
import { useTheme } from 'react-jss';
import isMobile from '../../hooks/isMobile';
import WithDrawalLogs from './withDrawalLogs';
import WalletTrans from './WalletTrans';
import Image from '../image/image';
import { SIDEBAR_WALLET } from '../../lib/config/profile';
import Icon from '../image/icon';
import { BOMBSCOIN_LOGO, WINGSPAN_LOGO } from '../../lib/config/logo';
import useProfileData from '../../hooks/useProfileData';
import BuyBombsCoin from './BuyBombs';
import { useEffect } from 'react';
import { getWallteTransaction } from '../../services/payments';
import { defaultCountry, defaultCurrencyCode } from '../../lib/config/creds';
import { rechargeWalletCoins } from '../../lib/rxSubject';
import { getWallet } from '../../redux/actions';
import { useDispatch } from 'react-redux';
const Header = dynamic(() => import("../header/header"), { ssr: false });

const WalletIndex = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [wallet] = useWalletData();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [profileData] = useProfileData();
  const [activeTab, setActiveTab] = useState(false);
  const [activeLink, setactiveLink] = useState("available");
  const [withdrawWalletDetails, setWithdrawWalletDetails] = useState([]);
  const [flag, setFlag] = useState(false);

  const handleShowTransaction = (buttons) => {
    setactiveLink(buttons);
  };

  const Buttons = [
    {
      label: lang.transactions,
      //   link: "/profile/wallet",
      //   shalow: "/profile/wallet",
      active: "transactions",
    },
    {
      label: lang.withdrawLogs,
      //   link: "/profile/wallet",
      //   shalow: "/profile/wallet",
      active: "withdraw-logs",
    },
  ];

  const getType = () => {
    switch (activeLink) {
      case "withdraw-logs":
        return <WithDrawalLogs />;
      default:
        return <WalletTrans activeLink={activeLink} />;
    }
  };

  const getWithdrawWallet = async () => {
    let { username, email } = profileData;
    try {
      const res = await getWallteTransaction(
        wallet?.activeBalance,
        wallet?.walletData?.[0]?.walletid,
        defaultCurrencyCode || "USD",
        defaultCountry || "us",
        username,
        email,
      )
      if (res.status === 200) {
        setFlag(true);
        setWithdrawWalletDetails(res.data.data)
      } else if (res.status === 414) {
        open_drawer('WingspanSetupDialog',
          { emailName: email },
          "bottom"
        )
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 414) {
        open_drawer('WingspanSetupDialog',
          { emailName: email },
          "bottom"
        )
      } else {
        Toast(error?.response?.message, "error")
      }
    }
  }

  useEffect(() => {
    const rechargeCall = rechargeWalletCoins.subscribe((params) => {
      if (params.isApiCall) {
        dispatch(getWallet())
      }
    })
    return () => rechargeCall.unsubscribe();
  }, [])

  useEffect(() => {
    if (flag) {
      open_drawer('WithdrawWingspanMoney', { withdrawWalletDetails, walletDetails: wallet }, "bottom")
    }
  }, [withdrawWalletDetails])

  const handleWalletWithdrawDialog = () => {
    getWithdrawWallet();
  }

  return (
    <>
      <div>
        <div>
          <Header
            title={lang.wallet}
            back={() => {
              // Route.back();
              backNavMenu(props);
            }}
          />

          <div
            className="col-12 px-0"
            style={{
              paddingTop: "70px",
            }}
          >
            <div className="col-12 py-2 my-1">
              {profileData?.userTypeCode === 2 ? (<>
                <div className="col-12 px-0 d-flex flex-row">
                  <div className="mr-2">
                    <Button
                      type="button"
                      fclassname={`font-weight-500 py-2 rounded-pill borderStroke ${activeLink === "available" ? "gradient_bg" : "specific_section_bg"}`}
                      btnSpanClass='fntSz14'
                      onClick={() => handleShowTransaction("available")}
                      children={'Available'}
                    />
                  </div>
                  <div className="mr-2">
                    <Button
                      type="button"
                      fclassname={`font-weight-500 py-2 rounded-pill borderStroke ${activeLink === "pending" ? "gradient_bg" : "specific_section_bg"}`}
                      btnSpanClass='fntSz14'
                      onClick={() => handleShowTransaction("pending")}
                      children={'Pending'}
                    />
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      fclassname={`font-weight-500  py-2 rounded-pill borderStroke text-nowrap ${activeLink === "history" ? "gradient_bg" : "specific_section_bg"}`}
                      btnSpanClass='fntSz14'
                      onClick={() => handleShowTransaction("history")}
                      children={'Withdrawal History'}
                    />
                  </div>
                </div>
                {activeLink !== "history" && <div className="p-3 borderStroke radius_12 d-flex flex-column mt-3">
                  <div className='d-flex flex-row justify-content-between'>
                    <div>
                      <div className='text-capitalize'>{activeLink} {lang.balance}</div>
                      <div>
                        {profileData?.userTypeCode !== 1 ? (wallet?.[activeLink === "available" ? "activeBalance" : activeLink === "pending" ? "pendingBalance" : "masspayBalance"])?.toFixed(2) || 0 : (wallet?.walletData?.[0]?.balance)?.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <Icon
                        icon={`${WINGSPAN_LOGO}#wingspan`}
                        width={120}
                        height={40}
                        class='cursorPtr'
                        viewBox="0 0 140 50"
                        onClick={() => window.open("https://staging-my.wingspan.app/member", "_blank")}
                      />
                    </div>
                  </div>
                  {activeLink === "available" && <div className="mt-3">
                    <Button
                      type="button"
                      fclassname='btnGradient_bg rounded-pill py-2'
                      onClick={handleWalletWithdrawDialog}
                      children={'Withdraw Money'}
                    />
                  </div>}
                </div>}
              </>)
                :
                <div className="row d-flex m-0 px-3 py-2 justify-content-between borderStroke radius_12">
                  <div className="d-flex flex-column justify-content-between">
                    <div className='mb-1'>My Balance</div>
                    <h4 className={`w-700 `}>
                      {(profileData?.userTypeCode == 2 ? (wallet?.walletData?.[0]?.balance && parseFloat(wallet?.walletData?.[0]?.balance).toFixed(2)) : wallet?.walletData?.[0]?.balance) || 0} {lang.coins}
                    </h4>
                    <div className="gradient_text cursorPtr" onClick={() => setActiveTab(!activeTab)}>
                      {activeTab ? "Buy Bombshell Coins" : "View all transactions"}
                    </div>
                  </div>
                  <div>
                    <Icon
                      icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                      width={80}
                      height={80}
                      class='cursorPtr'
                      viewBox="0 0 88 88"
                    />
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: profileData.userTypeCode !== 1 ? `calc(calc(var(--vhCustom, 1vh) * 100) - ${mobileView ? "8.4rem" : "17.8rem"})` : "calc(calc(var(--vhCustom, 1vh) * 100) - 11.5rem)", overflowY: "auto" }} >
        {(profileData?.userTypeCode === 1 && !activeTab) ? <BuyBombsCoin {...props} /> : <WalletTrans {...props} activeLink={activeLink} />}
      </div>
    </>
  )
}

export default WalletIndex