import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import WalletTrans from "../../components/Drawer/WalletTrans";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useWalletData from "../../hooks/useWalletData";
import { open_dialog } from "../../lib/global";
import Button from "../../components/button/button";
import Image from "../../components/image/image";
import { SIDEBAR_WALLET } from "../../lib/config/profile";
import useProfileData from "../../hooks/useProfileData";
import { BOMBSCOIN_LOGO, gradient_info, WINGSPAN_LOGO } from "../../lib/config/logo";
import BuyBombsCoin from "../../components/Drawer/BuyBombs";
import { getWallteTransaction } from "../../services/payments";
import { defaultCountry, defaultCurrencyCode, isAgency } from "../../lib/config/creds";
import { Toast } from "../../lib/global/loader";
import { rechargeWalletCoins } from "../../lib/rxSubject";
import { getWallet } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const Icon = dynamic(() => import("../../components/image/icon.jsx"), { ssr: false });

export default function DvWallet(props) {
  const [lang] = useLang();
  const [profileData] = useProfileData();
  const [wallet] = useWalletData();
  const [activeLink, setactiveLink] = useState("available");
  const [activeTab, setActiveTab] = useState(false);
  const [withdrawWalletDetails, setWithdrawWalletDetails] = useState([]);
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const agencyProfileData = useSelector((state) => state?.agencyProfile)
  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const rechargeCall = rechargeWalletCoins.subscribe((params) => {
      if (params.isApiCall) {
        dispatch(getWallet())
      }
    })
    return () => rechargeCall.unsubscribe();
  }, [])

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
        open_dialog('WingspanSetupDialog',
          { emailName: isAgency() ? agencyProfileData?.agencyEmail : email }
        )
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 414) {
        open_dialog('WingspanSetupDialog',
          { emailName: isAgency() ? agencyProfileData?.agencyEmail : email }
        )
      } else {
        Toast(error?.response?.message, "error")
      }
    }
  }

  useEffect(() => {
    if (flag) {
      open_dialog('WithdrawWingspanMoney', { withdrawWalletDetails, walletDetails: wallet })
    }
  }, [withdrawWalletDetails])

  const handleWalletWithdrawDialog = () => {
    getWithdrawWallet();
  }

  const paymentAmountCard = (label, amount, curruncy, className = "") => {
    return (
      profileData?.userTypeCode !== 1 ? <div className="row d-flex m-0 px-3 py-2 align-items-center">
        <div className="col-3 px-0 py-2 text-capitalize">
          {activeLink} Balance
        </div>

        <div className="col-3 px-0 d-flex align-items-center justify-content-center">
          <Image
            src={SIDEBAR_WALLET}
            width="28"
            height="28"
          />
          <h2 className={`w-700 ml-2 mb-0 dv__fnt21`}>
            {curruncy || "$"} {(amount && parseFloat(amount).toFixed(2)) || 0}
          </h2>
        </div>
        {activeLink === "available" && <div className="col-6 px-0 d-flex justify-content-end">
          <Button
            type="button"
            fclassname='font-weight-500 rounded-pill gradient_bg w-auto py-2 px-4'
            onClick={handleWalletWithdrawDialog}
            children={'Withdraw Money'}
          />
        </div>}
      </div> :
        <div className="d-flex m-0 px-3 py-2 justify-content-between">
          <div className="d-flex flex-column justify-content-between">
            <div>My Balance</div>

            <div className="d-flex align-items-center justify-content-start">
              <Image
                src={SIDEBAR_WALLET}
                width="28"
                height="28"
              />
              <h2 className={`pl-2 w-700 mb-0 dv__fnt21 text-nowrap`}>
                {(amount && parseFloat(amount).toFixed(2)) || 0} {lang.coins}
              </h2>
            </div>
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
    );
  };

  const Buttons = [
    {
      label: lang.transactions,
      //   link: "/profile/wallet",
      //   shalow: "/profile/wallet",
      active: "transactions",
    },
    // {
    //   label: lang.withdrawMoney,
    //   //   link: "/profile/wallet",
    //   //   shalow: "/profile/wallet",
    //   active: "withdraw",
    // },
    {
      label: lang.withdrawLogs,
      //   link: "/profile/wallet",
      //   shalow: "/profile/wallet",
      active: "withdraw-logs",
    },
  ];

  const handleShowTransaction = (buttons) => {
    setactiveLink(buttons);
  };

  return (
    <Wrapper>
      <div className="row m-0 vh-100 w-100 overflow-hidden">
        {profileData?.userTypeCode !== 1 ? (<> <div className="col-12 pt-3 pb-2 d-flex align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center mb-2">
            <h4 className="mb-0 mr-2">My Wallet</h4>
            <Image
              src={gradient_info}
              width={20}
              height={20}
              className="cursorPtr"
              alt="wallet info"
              onClick={() => open_dialog("WithdrawChargeDetails", { walletInfo: "activePendingInfo" })}
            />
          </div>
          <div>
            <Icon
              icon={`${WINGSPAN_LOGO}#wingspan`}
              width={120}
              height={40}
              color="var(--l_app_text)"
              class='cursorPtr'
              viewBox="0 0 140 50"
              onClick={() => window.open("https://staging-my.wingspan.app/member", "_blank")}
            />
          </div>
        </div>
          <div className="col-12 d-flex flex-row">
            <div className="mr-2">
              <Button
                type="button"
                fclassname={`font-weight-500 px-4 py-2 rounded-pill borderStroke ${activeLink === "available" ? "gradient_bg" : "specific_section_bg"}`}
                onClick={() => handleShowTransaction("available")}
                children={'Available'}
              />
            </div>
            <div className="mr-2">
              <Button
                type="button"
                fclassname={`font-weight-500 px-4 py-2 rounded-pill borderStroke ${activeLink === "pending" ? "gradient_bg" : "specific_section_bg"}`}
                onClick={() => handleShowTransaction("pending")}
                children={'Pending'}
              />
            </div>
            <div className="mr-2">
              <Button
                type="button"
                fclassname={`font-weight-500 px-4 py-2 rounded-pill borderStroke ${activeLink === "history" ? "gradient_bg" : "specific_section_bg"}`}
                onClick={() => handleShowTransaction("history")}
                children={'Withdrawal History'}
              />
            </div>
          </div> </>)
          :
          <div className="col-12 pt-3">
            <h4 className="mb-0">My Wallet</h4>
          </div>
        }
        {activeLink !== "history" && <div className="col-12 p-0">
          <div>
            <div className="specific_section_bg mt-3 mx-3 radius_12 borderStroke">
              {paymentAmountCard(
                "Wallet Balance",
                profileData?.userTypeCode !== 1 ? (wallet?.[activeLink === "available" ? "activeBalance" : activeLink === "pending" ? "pendingBalance" : "masspayBalance"]) : wallet?.walletData?.[0]?.balance,
                wallet?.walletData?.length &&
                wallet?.walletData[0]?.currency_symbol,
                "text-success"
              )}
            </div>
          </div>
        </div>}
        <div className="col-12 mt-2">
          <div
            className="specific_section_bg radius_12 pb-2 borderStroke"
            style={{ height: activeLink !== "history" ? "calc(var(--vhCustom, 1vh) * 68)" : "calc(var(--vhCustom, 1vh) * 80)", overflowY: "auto" }}
          >
            {(profileData?.userTypeCode === 1 && !activeTab) ? <BuyBombsCoin {...props} /> : <WalletTrans {...props} activeLink={activeLink} />}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
