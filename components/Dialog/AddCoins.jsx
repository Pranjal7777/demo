import isMobile from "../../hooks/isMobile"
import useLang from "../../hooks/language"
import { P_CLOSE_ICONS } from "../../lib/config"
import { Arrow_Left2 } from "../../lib/config/homepage"
import Icon from "../image/icon"
import { useEffect, useState } from "react"
import Button from "../button/button"
import { getWalletBombsList, recharWalletCoins } from "../../services/payments"
import { BOMBSCOIN_LOGO } from "../../lib/config/logo"
import useReduxData from "../../hooks/useReduxState"
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from "../../lib/global/loader"
import { useUserWalletBalance } from "../../hooks/useWalletData"
import usePg from "../../hooks/usePag"
import { useDispatch } from "react-redux"
import { rechargeSuccess } from "../../redux/actions/wallet"
import { getAddress } from "../../redux/actions"
import { CoinPrice } from "../ui/CoinPrice"

const AddCoins = (props) => {
    const [lang] = useLang();
    const [mobile] = isMobile();
    const [walletRechargelist, setWalletRechageList] = useState([]);
    const [selectedPlan, setPlan] = useState({ activeIndex: null, amount: null, coins: null });
    const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
    const [userWalletBalance] = useUserWalletBalance()
    const [pg] = usePg();
    const dispatch = useDispatch()

    useEffect(() => {
        getWalletRecharList();
    }, [])

    const getWalletRecharList = async (countryCode) => {
        startLoader()
        try {
            const res = await getWalletBombsList(countryCode || "US");
            setWalletRechageList(res?.data?.data)
            stopLoader()
        } catch (error) {
            stopLoader()
            console.log(error);
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

    const handleSelectPlan = (amount, index, coins) => {
        setPlan({ activeIndex: index, amount, coins });
    }

    const rechargeWallet = async (paymentMethod, addressId, amount) => {
        startLoader();
        let payload = {
            paymentMethod: paymentMethod,
            pgLinkId: typeof pg[0] != "undefined" ? pg[0]?._id : "",
            amount: amount,
        }
        try {
            const res = await recharWalletCoins(payload);
            if (res.status === 200) {
                dispatch(rechargeSuccess(selectedPlan.coins))
                if (mobile) {
                    close_drawer("addCoins")
                    close_drawer("checkout")
                } else {
                    close_dialog("addCoins")
                    close_dialog("checkout")
                }
                setTimeout(() => {
                    mobile ? open_drawer("successPayment", { successMessage: lang.successCoinsCreditedMsg, showCoins: true, coins: selectedPlan.coins }, "bottom") : open_dialog("successPayment", { successMessage: lang.successCoinsCreditedMsg, showCoins: true, coins: selectedPlan.coins }, "bottom")
                }, 100)
            }
            stopLoader();
        } catch (error) {
            console.log(error);
            Toast(error.message, 'error')
            stopLoader();
        }
    }

    const handleGetAddress = () => {
        dispatch(getAddress({ loader: true }));
    };

    const handleRechargeWallet = ({ amount, coins }) => {
        if (reduxData.defaultCard) {
            if (mobile) {
                open_drawer("purchseConfirmDialog", {
                    title: `${lang.confirmRecharge} ${coins} coins for $${amount}`,
                    desc: lang.defaultBillingAddress,
                    checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                    closeAll: false,
                    price: amount,
                    walletRecharge: true,
                }, "bottom");
            } else {
                open_dialog("purchaseConfirm", {
                    title: `${lang.confirmRecharge} ${coins} coins for $${amount}`,
                    desc: lang.defaultBillingAddress,
                    checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                    closeAll: false,
                    price: amount,
                    walletRecharge: true,
                });
            }
        } else {
            handleGetAddress()
            if (mobile) {
                open_drawer("checkout", {
                    title: lang.selectBillingAddress,
                    onClose: props.onClose,
                    getAddress: handleGetAddress,
                    radio: true,
                    checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                    closeAll: false,
                });
            } else {
                open_dialog("checkout", {
                    title: lang.selectBillingAddress,
                    onClose: props.onClose,
                    getAddress: handleGetAddress,
                    radio: true,
                    checkout: (paymentMethod, addressId) => rechargeWallet(paymentMethod, addressId, amount),
                    closeAll: false,
                });
            }
        }
    }

    const handlePurchaseCoins = () => {
        handleRechargeWallet(selectedPlan)
    }
    const handleGoBack = () => {
        mobile ? close_drawer("addCoins") : close_dialog("addCoins")
    }

    return <>
        <div className='specific_section_bg text-app'>
            <div className=" pt-2">
                <div>
                    <div className='hover_bgClr position-absolute' onClick={handleGoBack} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", left: mobile ? "18px" : "8px" }}>
                        {
                            <Icon
                                icon={`${Arrow_Left2}#arrowleft2`}
                                hoverColor='var(--l_base)'
                                width={16}
                                height={16}
                                class="arrowLeft"
                                alt="Left Arrow"
                            />}
                    </div>
                    <h4 className="text-app">{props.titleName}</h4>
                    <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", right: mobile ? "18px" : "8px" }}>
                        <Icon
                            icon={`${P_CLOSE_ICONS}#cross_btn`}
                            hoverColor='var(--l_base)'
                            color={'var(--l_app_text)'}
                            width={20}
                            height={20}
                            alt="Back Arrow"
                        />
                    </div>
                </div>
                <div className='text-center my-3'>
                    <h4 className='mb-0 '>
                        {lang.addCoins}
                    </h4>
                </div>

                <div className="pt-2 px-3">

                    <div>
                        <div className="w-100 mb-4">
                            <div className={`p-3 radius_12 cursorPtr borderStroke`} onClick={() => handleSelectPlan(data?.amount, 0, handleExtraCoins(data?.amount, data?.value, data?.cashbackType))}>
                                <div className="">
                                    <p className="m-0 textFaintGray"> {lang.walletBalance}</p>
                                </div>
                                <div className="mt-1">
                                    <span className="d-flex w-500" style={{ gap: "0.4rem" }}>
                                        <span>{userWalletBalance?.toFixed(2)}</span>
                                        <Icon
                                            icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                            width={20}
                                            height={20}
                                            class='cursorPtr'
                                            viewBox="0 0 88 88"
                                        />
                                        <span>{lang.coins}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row col-12 px-0 mx-0 pt-3" style={{ height: mobile ? "calc(var(--vhCustom, 1vh) * 37)" : "calc(var(--vhCustom, 1vh) * 38)", overflowY: "auto", }}>
                        {walletRechargelist?.map((data, index) => {
                            return (
                                <div className="col-4 col-md-3 pl-0 mb-4 position-relative">
                                    <div className={`p-2 radius_12 d-flex flex-column justify-content-between align-items-center cursorPtr ${selectedPlan?.activeIndex === index ? "border1pxSolid" : "borderStroke"}`} onClick={() => handleSelectPlan(data?.amount, index, handleExtraCoins(data?.amount, data?.value, data?.cashbackType))}>
                                        {data?.cashbackType && !!data?.value && <div className="gradient_bg adjustText  position-absolute fntSz10 d-flex" style={{ top: "-10px", padding: '2px 12px', borderRadius: "7px" }}>
                                            {data?.cashbackType !== "FIXED" ? `${data?.value} % Extra` :
                                                <CoinPrice price={data?.value} size="10" suffixText="EXTRA" showCoinText={false} iconSize={13} />}
                                        </div>}
                                        <div className="py-2 textFaintGray">
                                            {handleExtraCoins(data?.amount, data?.value, data?.cashbackType)} {lang.coins}
                                        </div>
                                        <div>
                                            <Icon
                                                icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                                width={30}
                                                height={30}
                                                class='cursorPtr'
                                                viewBox="0 0 88 88"
                                            />
                                        </div>
                                        <h5 className="pt-2 text-center mb-0 w-700">
                                            ${data?.amount}
                                        </h5>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            <div className='px-5 py-1 specific_section_bg'>
                <Button
                    type="button"
                    fclassname='rounded-pill my-2 gradient_bg'
                    btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
                    onClick={handlePurchaseCoins}
                    disabled={!selectedPlan.amount}
                    children={lang.addCoins}
                />
            </div>
        </div>
        <style jsx>{`
        :global(.adjustText .prefix){
         font-size:10px !important;
        }
        :global(.adjustText .bombCoin){
            margin-left:0.25rem!important;;
           }
        `}
        </style>
    </>
}
export default AddCoins