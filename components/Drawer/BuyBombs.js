import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import useProfileData from "../../hooks/useProfileData";
import { getWalletBombsList, recharWalletCoins } from "../../services/payments";
import { Toast, open_dialog, open_drawer, startLoader, stopLoader } from "../../lib/global/loader";
import useReduxData from "../../hooks/useReduxState";
import useLang from "../../hooks/language";
import usePg from "../../hooks/usePag";
import { CoinPrice } from "../ui/CoinPrice";
import { rechargeWalletCoins } from "../../lib/rxSubject";

const Icon = dynamic(() => import("../image/icon"), { ssr: false });

const BuyBombsCoin = (props) => {
    const [lang] = useLang();
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileView] = isMobile();
    const [profileData] = useProfileData();
    const [walletRechargelist, setWalletRechageList] = useState([]);
    const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
    const [pg] = usePg();

    useEffect(() => {
        getWalletRecharList();
    }, [])

    const getWalletRecharList = async (countryCode) => {
        try {
            const res = await getWalletBombsList(countryCode || "US");
            setWalletRechageList(res?.data?.data)

        } catch (error) {
            console.log(error);
        }
    }
    const rechargeWallet = async (paymentMethod, addressId, amount, setPaymentInProgress) => {
        startLoader();
        let payload = {
            paymentMethod: paymentMethod,
            pgLinkId: typeof pg[0] != "undefined" ? pg[0]?._id : "",
            amount: amount,
        }
        try {
            setPaymentInProgress?.(true)
            const res = await recharWalletCoins(payload);
            rechargeWalletCoins.next({ isApiCall: true })
            stopLoader();
            mobileView ? open_drawer("successPayment", { successMessage: res?.data?.message }, "bottom") : open_dialog("successPayment", { successMessage: res?.data?.message })
        } catch (error) {
            console.log(error);
            Toast(error.message, 'error')
            stopLoader();
        }
    }

    const handleRechargeWallet = (amount, index, coins) => {
        setActiveIndex(index);
        if (reduxData.defaultCard) {
            mobileView ? open_drawer("purchseConfirmDialog", {
                title: `${lang.confirmRecharge} ${coins} coins for $${amount}`,
                desc: lang.defaultBillingAddress,
                checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                closeAll: true,
                price: amount,
                walletRecharge: true,
            }, "bottom") : open_dialog("purchaseConfirm", {
                title: `${lang.confirmRecharge} ${coins} coins for $${amount}`,
                desc: lang.defaultBillingAddress,
                checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                closeAll: true,
                price: amount,
                walletRecharge: true,
            });
        } else {
            mobileView ?
                open_drawer("checkout", {
                    title: lang.selectBillingAddress,
                    onClose: props.onClose,
                    radio: true,
                    checkout: (paymentMethod, addressId, promocode = null, setPaymentInProgress) => rechargeWallet(paymentMethod, addressId, amount, setPaymentInProgress),
                    closeAll: true,
                }) :
                open_dialog("checkout", {
                    title: lang.selectBillingAddress,
                    onClose: props.onClose,
                    radio: true,
                    checkout: (paymentMethod, addressId, promocode = null, setPaymentInProgress) => rechargeWallet(paymentMethod, addressId, amount, setPaymentInProgress),
                    closeAll: true,
                });
        }
    }

    const handleExtraCoins = (amount, extra, type) => {
        let totalCoins;
        if (type == "PERCENTAGE") {
            totalCoins = amount + (amount * extra / 100)
        } else {
            totalCoins = amount + extra
        }
        return totalCoins;
    }

    return (
        <Wrapper>
            <div
                className={
                    mobileView
                        ? "h-100 flex flex-column overflow-hidden"
                        : "h-100 flex flex-column px-0 py-2 overflow-hidden"
                }
            >
                <div className="col-12 py-1">
                    <div className="row m-0 d-flex align-items-center justify-content-between">
                        <p className="col-12 mb-2 px-0 fntSz15 text-app">
                            {lang.selectPackage}
                        </p>
                        <div className="row col-12 px-0 mx-0 pt-3" style={{ height: !(profileData.userTypeCode === 1 && mobileView) ? "calc(var(--vhCustom, 1vh) * 60)" : "calc(var(--vhCustom, 1vh) * 68)", overflowY: "auto" }}>
                            {walletRechargelist?.map((data, index) => {
                                return (
                                    <div className="col-4 col-md-3 pl-0 mb-4 position-relative">
                                        <div className={`p-2 radius_12 d-flex flex-column justify-content-between align-items-center cursorPtr ${activeIndex === index ? "border1pxSolid" : "borderStroke"}`} onClick={() => handleRechargeWallet(data?.amount, index, handleExtraCoins(data?.amount, data?.value, data?.cashbackType))}>
                                            {data?.cashbackType && !!data?.value && <div className="gradient_bg text-white rounded-pill position-absolute fntSz11 d-flex" style={{ top: "-10px", padding: '2px 12px' }}>
                                                {data?.cashbackType !== "FIXED" ? `${data?.value} % Extra` :
                                                    <CoinPrice price={data?.value} showCoinText={false} suffixText={"Extra"} size="11" iconSize="12" />}
                                            </div>}
                                            <div className="py-2">
                                                {handleExtraCoins(data?.amount, data?.value, data?.cashbackType)} coins
                                            </div>
                                            <div>
                                                <Icon
                                                    icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                                    width={50}
                                                    height={50}
                                                    class='cursorPtr'
                                                    viewBox="0 0 88 88"
                                                />
                                            </div>
                                            <h4 className="pt-2 mb-0 font-weight-700 gradient_text">
                                                ${data?.amount}
                                            </h4>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

export default BuyBombsCoin;