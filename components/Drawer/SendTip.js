import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDetectHeaderHight from "../../hooks/detectHeader-hight";
import useLang from "../../hooks/language";
import usePg from "../../hooks/usePag";
import useReduxData from "../../hooks/useReduxState";
import { defaultCurrency, INFO, P_CLOSE_ICONS } from "../../lib/config";
import debounce from "lodash/debounce";
import Image from "../image/image";
import {
  close_dialog,
  close_drawer,
  drawerToast,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getAddress } from "../../redux/actions/address";
import { postTip } from "../../services/assets";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { palette } from "../../lib/palette";

import Wrapper from "../../hoc/Wrapper";
const Switch = dynamic(() => import("../../components/formControl/switch"), {
  ssr: false,
});
const InputText = dynamic(() => import("../formControl/inputText"), {
  ssr: false,
});
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const TextField = dynamic(() => import("@material-ui/core/TextField"), {
  ssr: false,
});
const InputAdornment = dynamic(
  () => import("@material-ui/core/InputAdornment"),
  { ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { sendTipStreamAPI } from "../../services/liveStream";
import Icon from "../image/icon";
import { Arrow_Left2 } from "../../lib/config/homepage";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { purchaseSuccessFromWallet } from "../../redux/actions/wallet";
import { authenticate } from "../../lib/global/routeAuth";
import { CoinPrice } from "../ui/CoinPrice";

export default function SendTip({ isRequest, tipData, ...props }) {
  const { streamId } = props;
  const theme = useTheme();
  useDetectHeaderHight("sendTipHeader", "sendTipBody");
  const [anonymous, setAnonymous] = useState(false);
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const profileData = useSelector(state => state.profileData);
  const [pg] = usePg();
  const [note, handleNot] = useState("");
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [activeIndex, setActiveIndex] = useState(null);
  const [userWalletBalance] = useUserWalletBalance()

  const [tip, handleTip] = useState();
  const [totalTipAmount, setTotalTipAmount] = useState(0);
  const taxPercent = useSelector(state => state.appConfig.tax);
  const isTaxEnable = useSelector(state => state.appConfig.taxEnable);

  const dispatch = useDispatch();
  const handleCloseDrawer = () => {
    router.back();
  };

  // PS: This function will close all drawers open by sendingTip after sending a Tip
  const closeSendTipDrawer = () => {
    close_drawer("Address");
    close_drawer("addCard");
    close_drawer("checkout");
    close_drawer("purchseConfirmDialog");
    close_drawer("SentTip");
    props.onCloseDrawer?.();
  };

  const [btnDisable, setBtnDisable] = useState(true)
  const minTipValue = useSelector((state) => state.appConfig.minTipValue)
  const maxTipValue = useSelector((state) => state.appConfig.maxTipValue);
  const [lowestTipPrice, setLowestTipPrice] = useState(minTipValue);
  const [maxTipPrice, setMaxTipPrice] = useState(maxTipValue);
  const [planTipAmount, setPlanTipAmount] = useState(useSelector((state) => state?.appConfig?.tipAmount || []))
  const [sendTipType, setTipType] = useState({ type: "custom-tip", amount: minTipValue })
  const [minReqError, setMinReqError] = useState()

  const handleGetAddress = async () => {
    await dispatch(getAddress({ loader: true }));
  };

  useEffect(() => {
    if (isRequest && tipData) {
      handleTip(tipData?.amount)
      setTipType({ type: "custom-tip", amount: tipData?.amount })
      handleNot(tipData?.comments)
      setBtnDisable(false)
    }
  }, [isRequest, tipData])

  useEffect(() => {
    setLowestTipPrice(minTipValue);
    if (!isRequest) {
      handleTip(minTipValue)
      setBtnDisable(false)
    }
    setTotalTipAmount(((taxPercent / 100) * Number(tip)) + Number(tip));
  }, [])

  const sendTip = (paymentMethod, addressId) => {
    if (btnDisable) {
      return;
    }
    startLoader();
    let requestPayload = {
      id: props.postId,
      creatorId: props.creatorId,
      amount: sendTipType.amount,
      currency: "USD",
      trigger: props.trigger || 1,
      isAnonymous: anonymous,
      // addressId: addressId,
      trigger: props.trigger || 1, // ( 1 - POST , 2 - STORY )
    };
    if (addressId) {
      requestPayload["addressId"] = addressId;
    }

    if (note) {
      requestPayload["notes"] = note;
    }
    if (streamId) {
      delete requestPayload.id;
      delete requestPayload.trigger;
      requestPayload.streamId = streamId;
      requestPayload.amount = +requestPayload.amount;
      requestPayload.senderName = requestPayload.isAnonymous ? 'Someone' : profileData.username;
      if (!note) requestPayload.notes = ' ';

      sendTipStreamAPI(requestPayload)
        .then((data) => {
          // props.updateTip && props.updateTip(tip);
          dispatch(purchaseSuccessFromWallet(+requestPayload.amount))
          stopLoader();
          mobileView ? closeSendTipDrawer() : close_dialog();

          //  drawerToast({
          //   icon: CHECK,
          //   title: lang.tipSend,
          //   desc: data.data.message,
          //   closeIconVisible: false,
          //   titleClass: "max-full",
          //   autoClose: true,
          Toast(data.data.message || "Success");
        })
        .catch((e) => {
          stopLoader();
          mobileView ? closeSendTipDrawer() : close_dialog();
          e.response &&
            e.response.data &&
            Toast(e.response.data.message, "error");
        });
      mobileView ? close_drawer("purchaseConfirmWallet") : close_dialog("purchaseConfirmWallet")

      return;
    }
    if (isRequest) {
      requestPayload = {
        ...requestPayload,
        isometrikMessageId: props?.messageId,
        isometrikMessageMetadata: props?.metaData,
        isometrikConversationId: props?.conversationId
      }
    }
    postTip(requestPayload)
      .then((data) => {
        props.page !== "creatorProfile" && props.updateTip && props.updateTip(+requestPayload.amount);
        if(props?.successCallback) {
          props.successCallback(+requestPayload.amount, anonymous, note)
        }
        stopLoader();
        dispatch(purchaseSuccessFromWallet(sendTipType.amount))
        mobileView ? closeSendTipDrawer() : close_dialog();
        setTimeout(() => {
          mobileView ? open_drawer("successPayment", { successMessage: data.data.message || data.message || "Success", isCoinAnimation: true }, "bottom") : open_dialog("successPayment", { successMessage: data.data.message || data.message || "Success", isCoinAnimation: true })
        }, 100)
        mobileView ? close_drawer("purchaseConfirmWallet") : close_dialog("purchaseConfirmWallet")
      })
      .catch((e) => {
        console.log(e.message, "error")
        stopLoader();
        mobileView ? closeSendTipDrawer() : close_dialog();
        e.response &&
          e.response.data &&
          Toast(e.response.data.message, "error");
      });
  };



  let mobileThemeBox = {
    background: theme.type == "light" ? palette.l_input_bg : palette.d_input_bg,
    color: theme.text,
    border: theme.type == "light" ? "none" : `1px solid ${theme.border}`,
  };
  const handleRechargeWallet = (amount, index, coins) => {
    setActiveIndex(index);
    handleTip(amount)
    setTipType({
      type: "plan-type",
      amount: Number(amount)
    })
    handleTipChange(amount, index)
  }

  const handlePurchaseCoins = () => {
    mobileView ? open_drawer("addCoins", {}, "bottom") : open_dialog("addCoins", {}, "bottom")
  }

  const handlePurchase = () => {
    if (mobileView) {
      open_drawer("purchaseConfirmWallet", {
        title: lang.almostDone,
        description: <div ><span className="d-flex fntSz14"> {`${lang.setToSendTip} of`}
          <span className="ml-1"><CoinPrice price={sendTipType.amount} showCoinText={true} size={14} suffixText={`to`} /></span>
        </span></div>,
        descriptionTwo: `${props?.creatorName || ""}`,
        checkout: sendTip,
        closeAll: true,
        price: sendTipType.amount,
        handlePaymentUsingWallet: true,
        button: lang.confirmTip
      });
    } else {
      open_dialog("purchaseConfirmWallet", {
        title: lang.almostDone,
        description: <div ><span className="d-flex fntSz14"> {`${lang.setToSendTip} of`}
          <span className="ml-1"><CoinPrice price={sendTipType.amount} showCoinText={true} size={14} suffixText={`to`} /></span>
        </span></div>,
        descriptionTwo: `${props?.creatorName || ""}`,
        checkout: sendTip,
        closeAll: true,
        price: sendTipType.amount,
        handlePaymentUsingWallet: true,
        button: lang.confirmTip
      });
    }
  }

  const handlePurchaseSuccess = () => {
    mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
  }

  const handleSendTip = () => {
    authenticate().then(() => {
      mobileView
        ?
        (userWalletBalance < sendTipType.amount) ?
          open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : handlePurchase()
        :
        (userWalletBalance < sendTipType.amount) ?
          open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) : handlePurchase()
    })
  }

  const handleTipChange = (tipAmount, index = null) => {
    if (!isNaN(Number(tipAmount))) {
      if (isRequest) {
        if (Number(tipAmount) < tipData?.amount) {
          setMinReqError(lang.tipMinReqError)
          setBtnDisable(true)
        } else {
          if (Number(tipAmount) >= lowestTipPrice && Number(tipAmount) <= maxTipPrice) {
            setBtnDisable(false);
          } else {
            setBtnDisable(true)
          }
          setMinReqError()
          setBtnDisable(false)
        }
      } else {
        if (Number(tipAmount) >= lowestTipPrice && Number(tipAmount) <= maxTipPrice) {
          setBtnDisable(false);
        } else {
          setBtnDisable(true)
        }
      }
      handleTip(tipAmount)
      setTipType({
        type: "custom-tip",
        amount: Number(tipAmount)
      })
      if (isTaxEnable) {
        setTotalTipAmount(((taxPercent / 100) * Number(tipAmount)) + Number(tipAmount));
      }
      setActiveIndex(index)
    } else {
      handleTip(0)
      setTipType({
        type: "custom-tip",
        amount: 0
      })
      setActiveIndex(index)
    }
  }

  return (
    <div className="sendTipWrap">
      {mobileView ? (
        <div className="text-app card_bg">
          <div className='hover_bgClr position-absolute' onClick={() => props.onClose()} style={{ borderRadius: "10px", padding: '6px', top: mobileView ? '10px' : "12px", right: mobileView ? "18px" : "8px", zIndex: 1 }}>
            <Icon
              icon={`${P_CLOSE_ICONS}#cross_btn`}
              hoverColor='var(--l_base)'
              color={'var(--l_app_text)'}
              width={20}
              height={20}
              alt="Back Arrow"
            />
          </div>
          <div>
            <div className="py-4">
              <div className="col-12 px-4 mx-auto">
                <form>
                  {/* <div className="row form-label">
                    <div className="col-10">
                     <label className="text-app bold fntSz25">{lang.sendTip}</label>
                    </div>
                    <div className="col-2">
                    <Image
                      src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_ICON_WHITE}`}
                      onClick={() => props.onClose()}
                      color="white"
                      width="20"
                      alt="close_icon"
                      style={{ marginBottom: "4px" }}
                    />
                    </div>
                  </div> */}
                  <div className="">
                    <div className="text-center mb-4">  <h4 className="text-app">{lang.sendTip}</h4></div>
                  </div>
                  <div className="w-100 mb-4">
                    <div className={`p-3 radius_12 cursorPtr borderStroke d-flex justify-content-between`} >
                      <div>
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
                      <div>
                        <Button
                          type="button"
                          fclassname='rounded-pill my-2 gradient_bg'
                          btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
                          onClick={handlePurchaseCoins}
                          children={lang.addCoins}
                        />
                      </div>
                    </div>
                  </div>
                  {
                    !isRequest ?
                      <div className="row col-12 px-0 mx-0 mb-3 manageScroll" style={{ overflowX: "auto", flexWrap: "nowrap" }}>
                        {planTipAmount?.map((amount, index) => {
                          return (
                            <div className="col-4 col-md-3 pl-0 mb-2  position-relative">
                              <div className={`p-2 radius_12 d-flex flex-column justify-content-between align-items-center cursorPtr ${activeIndex === index ? "border1dot5pxSolid" : "borderStroke"}`} onClick={() => handleRechargeWallet(amount, index)}>
                                <div>
                                  <Icon
                                    icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                    width={30}
                                    height={30}
                                    class='cursorPtr'
                                    viewBox="0 0 88 88"
                                  />
                                </div>
                                <div className={activeIndex === index ? "gradient_text" : ""}>
                                  <h5 className="pt-2 text-center mb-0 w-700 ">
                                    {amount}
                                  </h5>
                                  <div className="divt-2 text-center mb-0 fntSz11 mt-1">
                                    {lang.coins}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div> : ""}
                  {
                    isRequest ? <><label className="text-muted labelText">{"Message"}</label>
                      <div className="form-group">
                        <textarea
                          disabled={(tip < lowestTipPrice || tip > maxTipPrice) || isRequest}
                          readOnly={isRequest}
                          value={note}
                          className="form-control input-tip-text-area-tip text-app"
                          placeholder="Enter here"
                          rows={3}
                        />
                      </div></> : ""
                  }
                  <label className="text-muted labelText">{lang.tipAmount}</label>

                  {/* <div className="form-lebel fntSz13 mb-2 pb-1">
                  {lang.tipAmount}
                  </div> */}
                  <div className="form-group mb-3">
                    <InputText
                      value={sendTipType.amount}
                      type="text"
                      min={lowestTipPrice}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-control tip-amount pl-45"
                      placeholder={lang.tipAmount}
                      onChange={(e) => {
                        handleTipChange(e.target?.value)
                      }}
                      cssStyles={
                        mobileView
                          ? theme.type == "light"
                            ? mobileThemeBox
                            : mobileThemeBox
                          : mobileThemeBox
                      }
                      readOnly={isRequest}
                      disabled={isRequest}
                    />
                    <span className="setLftPosAbs dv_base_color font-weight-bold fntSz15">
                      <Icon
                        icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                        width={20}
                        height={20}
                        class='cursorPtr'
                        viewBox="0 0 88 88"
                      /></span>
                  </div>
                  {
                    (tip < lowestTipPrice || tip > maxTipPrice) &&
                    <p
                      className='ml-2 form-group text-danger'
                      style={{
                        // position: 'absolute',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginTop: '-16px',
                        left: '30',
                      }}
                    >{lang.lowestTipText} ${lowestTipPrice} or {lang.maxTipText} ${maxTipPrice}</p>
                  }
                  {
                    minReqError ? <p
                      className='ml-2 form-group text-danger'
                      style={{
                        // position: 'absolute',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginTop: '-16px',
                        left: '30',
                      }}
                    >{minReqError}</p> : ""
                  }

                  {/* <div className="form-lebel fntSz13 mb-2 pb-1 mt-3">{lang.notes}</div> */}
                  {!isRequest ? <><label className="text-muted labelText">{lang.message}</label>
                    <div className="form-group">
                      <textarea
                        disabled={(tip < lowestTipPrice || tip > maxTipPrice) || isRequest}
                        readOnly={isRequest}
                        onChange={(e) => handleNot(e.target.value)}
                        value={note}
                        className="form-control input-tip-text-area-tip text-app"
                        placeholder="Enter here"
                        rows={3}
                      />
                    </div></> : ''}
                  {!isRequest ? <div className="row justify-content-between mb-0">
                    <div className="col-auto d-flex align-items-center dv_appTxtClr">
                      <h6 className="mv_create_post_toggler d-flex">
                        {"Make tip anonymous"}
                        <Icon
                          onClick={() => {
                            drawerToast({
                              title: "Anonymous",
                              desc: lang.annonymousPay,
                              closeIconVisible: false,
                            });
                          }}
                          color='var(--l_base)'
                          icon={INFO + "#info"}
                          width={12}
                          height={12}
                          class="align-top ml-2 "
                          viewBox='0 0 29.25 29.25'
                        />
                      </h6>
                    </div>
                    <div className="col-auto">
                      <label className="mv_create_post_switch_toggler ">
                        <input
                          checked={anonymous}
                          type="checkbox"
                          onChange={() => setAnonymous(!anonymous)}
                        />
                        <span className="slider round" />
                      </label>
                    </div>

                    {isTaxEnable
                      ? <div className="col-12 text-right">
                        <p className="m-0">{lang.tip}: {defaultCurrency}{tip}</p>
                        <p className="m-0">{lang.taxAmount} ({taxPercent}%): {defaultCurrency}{((taxPercent / 100) * Number(tip)).toFixed(2)}</p>
                        <hr className="my-1" />
                        <p><b>{lang.totalAmount}: {defaultCurrency}{totalTipAmount.toFixed(2)}</b></p>
                      </div>
                      : ""
                    }

                  </div> : ""}

                  <div className="">
                    <Button
                      disabled={btnDisable}
                      type="submit"
                      onClick={(e) => {
                        // console.log(">", props.creatorName)
                        e.preventDefault();
                        if (userWalletBalance < sendTipType.amount) return open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom")
                        open_drawer("purchaseConfirmWallet", {
                          title: lang.almostDone,
                          description: <div ><span className="d-flex fntSz14"> {`${lang.setToSendTip} of`}
                            <span className="ml-1"><CoinPrice price={sendTipType.amount} showCoinText={true} size={14} suffixText={`to`} /></span>
                          </span></div>,
                          descriptionTwo: `${props?.creatorName || ""}`,
                          checkout: sendTip,
                          closeAll: true,
                          price: sendTipType.amount,
                          handlePaymentUsingWallet: true,
                          button: lang.confirmTip
                        }, "bottom");

                      }}
                      cssStyles={{ borderRadius: "100px" }}
                      href="#Tipsentsuccessfully"
                      fclassname="radius_12 gradient_bg"
                    >
                      {lang.sendTip}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) :

        (
          <div className="py-3 px-5">

            <button
              type="button"
              className="close dv_modal_close"
              data-dismiss="modal"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>

            <div className="">
              <div className="text-center mb-4">  <h4 className="text-app">{lang.sendTip}</h4></div>
            </div>
            {/* <div className="w-100 mb-4"> */}
            <div className={`p-3 radius_12 cursorPtr borderStroke d-flex justify-content-between align-items-center`} >
              <div>
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
              <div>
                <Button
                  type="button"
                  fclassname='rounded-pill my-2 gradient_bg'
                  btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
                  onClick={handlePurchaseCoins}
                  children={lang.addCoins}
                />
              </div>
            </div>
            {
              !isRequest ? <div className="row col-12 px-0 mx-0 my-3 pb-2 manageScroll" style={{ overflowX: "auto", flexWrap: "nowrap" }}>
                {planTipAmount?.map((amount, index) => {
                  return (
                    <div className="col-4 col-md-3 pl-0 position-relative">
                      <div className={`p-2 radius_12 d-flex flex-column justify-content-between align-items-center cursorPtr ${activeIndex === index ? "border1dot5pxSolid" : "borderStroke"}`} onClick={() => handleRechargeWallet(amount, index)}>
                        <div>
                          <Icon
                            icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                            width={30}
                            height={30}
                            class='cursorPtr'
                            viewBox="0 0 88 88"
                          />
                        </div>
                        <div className={activeIndex === index ? "gradient_text" : ""}>
                          <h5 className="pt-2 text-center mb-0 w-700 ">
                            {amount}
                          </h5>
                          <div className="divt-2 text-center mb-0 fntSz11 mt-1">
                            {lang.coins}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div> : ""
            }
            {
              isRequest ? <><label className="text-muted labelText mt-2">{"Message"}</label>
                <div className="form-group">
                  <textarea
                    disabled={(tip < lowestTipPrice || tip > maxTipPrice) || isRequest}
                    readOnly={isRequest}
                    value={note}
                    className="form-control input-tip-text-area-tip text-app"
                    placeholder="Enter here"
                    rows={3}
                  />
                </div></> : ""
            }
            <label className="text-muted labelText">{lang.tipAmount}</label>
            <div className="form-group mb-3">
              <InputText
                value={sendTipType.amount}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-control tip-amount pl-45"
                placeholder={lang.tipAmount}
                onChange={(e) => {
                  handleTipChange(e.target?.value)
                }}
                cssStyles={
                  mobileView
                    ? theme.type == "light"
                      ? mobileThemeBox
                      : mobileThemeBox
                    : mobileThemeBox
                }
                readOnly={isRequest}
                disabled={isRequest}
              />
              <span className="setLftPosAbs dv_base_color font-weight-bold fntSz15">
                <Icon
                  icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                  width={20}
                  height={20}
                  class='cursorPtr'
                  viewBox="0 0 88 88"
                /></span>
            </div>
            {
              (tip < lowestTipPrice || tip > maxTipPrice) &&
              <p
                className='ml-2 form-group text-danger'
                style={{
                  // position: 'absolute',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '-10px',
                  left: '30',
                }}
              >{lang.lowestTipText} ${lowestTipPrice} or {lang.maxTipText} ${maxTipPrice}</p>
            }
            {
              minReqError ? <p
                className='ml-2 form-group text-danger'
                style={{
                  // position: 'absolute',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '-10px',
                  left: '30',
                }}
              >{minReqError}</p> : ""
            }
            {!isRequest ? <><label className="text-muted labelText">{lang.message}</label>
              <div className="form-group">
                <textarea
                  disabled={(tip < lowestTipPrice || tip > maxTipPrice) || isRequest}
                  readOnly={isRequest}
                  onChange={(e) => handleNot(e.target.value)}
                  value={note}
                  className="form-control input-tip-text-area-tip text-app"
                  placeholder="Enter here"
                  rows={3}
                />
              </div></> : ''}

            {!isRequest ? <div className="row justify-content-between my-1">
              <div className="col-auto">
                <p className="hdr__sm__Title text-muted fntSz12">{lang.makeTip}</p>
              </div>
              <div className="col-auto">
                <Switch
                  onChange={() => setAnonymous(!anonymous)}
                  checked={anonymous}
                />
              </div>

              {isTaxEnable
                ? <div className="col-12 text-right">
                  <p className="m-0">{lang.tip}: {defaultCurrency}{tip}</p>
                  <p className="m-0">{lang.taxAmount} ({taxPercent}%): {defaultCurrency}{((taxPercent / 100) * Number(tip)).toFixed(2)}</p>
                  <hr className="my-1" />
                  <p><b>{lang.totalAmount}: {defaultCurrency}{totalTipAmount.toFixed(2)}</b></p>
                </div>
                : ""
              }

            </div> : ""}

            <Button
              disabled={btnDisable}
              type="submit"
              fclassname="gradient_bg rounded-pill"
              onClick={(e) => {
                e.preventDefault();
                handleSendTip()
              }}
              cssStyles={theme.blueButton}
              href="#Tipsentsuccessfully"
            >
              {lang.sendTip}
            </Button>
          </div>
        )}
      <style jsx>
        {`
          .input-tip-text-area-tip, :global(.sendTipWrap .tip-amount) {
            color: var(--l_app_text);
            border-radius: 12px !important;
            background-color: transparent !important;
            border: 1px solid var(--l_border);
            padding: 16px;
          }
          .sendTipWrap textarea:focus {
            border-color: var(--l_base);
          }
          :global(.sendTipWrap .tip-amount) {
            padding-left: 45px !important
          }
          :global(.MuiInputBase-input), 
          :global(.MuiFormLabel-root),
          :global(.MuiTypography-colorTextSecondary),
          .hdr__sm__Title,
          .dv_modal_close{
            color: var(--l_app_text) !important;
          }
          .text-muted{
            color: #AAAAAA !important;
          }
          :global(.pl-45){
            padding-left:45px;
          }
          .manageScroll::-webkit-scrollbar,
          .manageScroll::-webkit-scrollbar {
            display: block !important;
          }
          .manageScroll::-webkit-scrollbar-thumb {
            background-color:var(--l_base) !important;
          }
          .labelText {
            margin-bottom: 10px;
            color: ${theme.type === 'light' ? 'var(--l_light_app_text)' : 'var(--l_light_app_text)'};
            font-size: ${mobileView ? '12px' : '14px'};
          }
        `}
      </style>
    </div>
  );
}
