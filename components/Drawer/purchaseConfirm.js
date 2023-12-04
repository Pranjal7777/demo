import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useLang from "../../hooks/language";
import useReduxData from "../../hooks/useReduxState";
import isMobile from "../../hooks/isMobile";
import Icon from "../../components/image/icon";
import { CARD_ICON, defaultCurrency, EDIT_COLORED, MAP_LOCATION, backArrow_black, EDIT4 } from "../../lib/config";
import {
  open_drawer,
  close_drawer,
  open_dialog,
  close_dialog,
} from "../../lib/global";
import { getAddress } from "../../redux/actions/address";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
const ExtensionSlots = dynamic(() => import("../../containers/videoCall/extensionSlots"), { ssr: false });
import { useTheme } from "react-jss";
import Router from "next/router";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import { Credit_Card_Icon } from "../../lib/config/header";
import { CoinPrice } from "../ui/CoinPrice";

export default function PurchaseConfirm(props) {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);

  const taxPercent = useSelector(state => state.appConfig.tax);
  const isTaxEnable = useSelector(state => state.appConfig.taxEnable);
  const [selectedCard, setSelectedCard] = useState("")

  const getDefaultCard = () => {
    return reduxData.cards && typeof reduxData.cards[0] != "undefined"
      ? reduxData.cards[0]
      : {};
  };


  const [address, setAddress] = useState(reduxData.defaultAddress);
  const totalTipAmount = () => ((taxPercent / 100) * Number(isCallExtension ? selectedSlot.extensionCharges : props.price)) + Number(isCallExtension ? selectedSlot.extensionCharges : props.price);
  const [card, setDefaultCard] = useState(reduxData.defaultCard);
  const selectedSlot = useSelector((state) => state?.setSelectedSlot);
  const { handlePaymentUsingWallet = false } = props;
  const { paymentProcessingFee } = useSelector(state => state.appConfig);
  const totalPaymentAmount = () => +paymentProcessingFee + Number(isCallExtension ? selectedSlot.extensionCharges : props.price)


  const handleCardChange = (selectedCard, cards) => {
    const val = cards.find(data => data.id === selectedCard)
    setSelectedCard(val)
  }

  useEffect(() => {
    setDefaultCard(reduxData.defaultCard);
    handleGetAddress();
    close_dialog("Address");
    close_dialog("checkout");
  }, [card]);

  const dispatch = useDispatch();

  const handleGetAddress = async () => {
    return
    await dispatch(getAddress({ loader: false }));
  };

  const [lang] = useLang();
  const { title, desc, alert, isCallExtension = false, slotArray = [], setSelectedSlot } = props;
  const getTile = (icon, desc, func) => {
    return (
      <div className="py-2 d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          <Icon
            icon={`${Credit_Card_Icon}#credit-card`}
            color={"var(--l_app_text)"}
            width={28}
            height={28}
            alt="cards_icon"
            viewBox="0 0 28 28"
          />
          <div className="pl-2">
            {desc}
          </div>
        </div>
        <div className="cursorPtr">
          <Icon
            icon={`${EDIT4}#edit-4`}
            color={"var(--l_app_text)"}
            alt="Edit Colored Icon"
            onClick={func}
            size={18}
            viewBox="0 0 18 18"
          />
        </div>
      </div>
    );
  };
  // console.log("asdasdad", card, address);

  return (
    <Wrapper>
      {mobileView ? (
        <div>
          <div className="p-3">
            <div className="text-right">
              <Icon
                icon={`${CLOSE_ICON_WHITE}#close-white`}
                color={"var(--l_app_text)"}
                size={16}
                onClick={() => props.onClose()}
                alt="back_arrow"
                class="cursorPtr px-2"
                viewBox="0 0 16 16"
              />
            </div>
            <div className="text-center mb-3">
              <h5 className="w-700 " >{title} {props.isStream && <span><CoinPrice price={props.price} showCoinText={true} size={18} /> </span>}</h5>
            </div>
            {isCallExtension && (
              <ExtensionSlots slotArray={slotArray} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />
            )}
            {props?.isSubscription && <div className="borderStrokeClr radius_12" style={{ padding: "10px 12px 8px", background: "linear-gradient(96.81deg, rgba(211, 58, 255, 0.1) 0%, rgba(255, 113, 164, 0.1) 100%)" }}>
              <div className="d-flex flex-row justify-content-between align-items-center py-1">
                <div className="text-app"><strong>{lang.planName}: </strong>{props.planName} {lang.subscription}</div>
                <div className="strong_app_text">{lang.price}: <strong className="text-app">{defaultCurrency}{isCallExtension ? selectedSlot.extensionCharges : props.price}</strong></div>
              </div>
              <div className="gradient_text w-500 line-clamp6 my-1">{props?.description}</div>
            </div>}

            {!props?.isSubscription && <h6 className="mb-0 fntSz16 pb-2 text-blue34 text-center">{desc}</h6>}

            {!handlePaymentUsingWallet &&
              <div className="col-12 my-3 py-1 radius_12" style={{ backgroundColor: theme?.dialogSectionBg }}>
                {getTile(
                  CARD_ICON,
                  `Card ending ${(selectedCard && selectedCard.last4 || card && card.last4) || ""}`,
                  () => {
                    open_drawer(
                      "checkout",
                      {
                        title: "Payment method",
                        selectedCard: card && card.id,
                        // amount: props.amount,
                        checkoutProps: {},
                        buttonText: "Continue",
                        handleCardChange,
                        onConfirm: (card) => {
                          // console.log("sadsadsad", card);
                          setDefaultCard(card);
                          close_drawer("checkout");
                          // console.log("zdasdd", address);
                        },
                      },
                      "right"
                    );
                  }
                )}
              </div>
            }

            {!props?.isSubscription && <h6 className="mb-0 fntSz16 pb-2 base_reject_clr">{alert}</h6>}

            {isTaxEnable
              ? <div className="text-right dv_appTxtClr">
                <p className="m-0">{lang.price}: {defaultCurrency}{isCallExtension ? selectedSlot.extensionCharges : props.price}</p>
                <p className="m-0">{lang.taxAmount} ({taxPercent}%): {defaultCurrency}{((taxPercent / 100) * Number(isCallExtension ? selectedSlot.extensionCharges : props.price)).toFixed(2)}</p>
                <hr className="my-1" />
                <p><b>{lang.totalAmount}: {defaultCurrency}{totalTipAmount()?.toFixed(2)}</b></p>
              </div>
              : ""
            }
            {(props?.walletRecharge || props?.isSubscription) && <div className="text-right">
              <p className="my-1">{lang.price}: {defaultCurrency}{isCallExtension ? selectedSlot?.extensionCharges : props.price}</p>
              <p className="my-1">{lang.processingFee}: {defaultCurrency}{paymentProcessingFee}.00</p>
              <p className="my-1"><b>{lang.totalAmount}: {defaultCurrency}{totalPaymentAmount()?.toFixed(2)}</b></p>
            </div>}

            <div className="mt-5">
              {props?.isSubscription && <div className="fntSz13 mb-2 strong_app_text"><strong className="text-app">{lang.note}: </strong>{alert}</div>}
              <Button
                type="button"
                fclassname="btnGradient_bg rounded-pill py-2"
                disabled={isCallExtension && !selectedSlot.value}
                onClick={() => {
                  props.checkout && props.checkout((selectedCard?.id || card?.id), address?._id, selectedSlot);
                  props.onClose && props.onClose();
                }}
              >
                {props?.isSubscription ? lang.subscribe : lang.yes}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 scroll-hide" style={{ maxWidth: "500px" }}>
          <div className="text-right" style={{ marginRight: "-10px" }}>
            <Icon
              icon={`${CLOSE_ICON_WHITE}#close-white`}
              color={"var(--l_app_text)"}
              size={16}
              onClick={() => props.onClose()}
              alt="back_arrow"
              class="cursorPtr"
              viewBox="0 0 16 16"
            />
          </div>
          <div className="text-center mb-3">
              <h4 className="w-600" >{title}{props.isStream && <span><CoinPrice price={props.price} showCoinText={true} size={22} /> </span>}</h4>
          </div>
          {isCallExtension && (
            <ExtensionSlots slotArray={slotArray} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />
          )}
          {props?.isSubscription && <div className="borderStrokeClr radius_12" style={{ padding: "10px 12px 8px", background: "linear-gradient(96.81deg, rgba(211, 58, 255, 0.1) 0%, rgba(255, 113, 164, 0.1) 100%)" }}>
            <div className="d-flex flex-row justify-content-between align-items-center py-1">
              <div className="text-app"><strong>{lang.planName}: </strong>{props.planName} {lang.subscription}</div>
              <div className="strong_app_text">{lang.price}: <strong className="text-app">{defaultCurrency}{isCallExtension ? selectedSlot.extensionCharges : props.price}</strong></div>
            </div>
            <div className="gradient_text w-500 line-clamp4 fntSz13">{props?.description}</div>
          </div>}
            {!props?.isSubscription && <h6 className="mb-0 fntSz16 pb-2 text-blue34 text-center">{desc}</h6>}
          {!handlePaymentUsingWallet && <div className="col-12 my-3 py-1 radius_12" style={{ backgroundColor: theme?.dialogSectionBg }}>
            {getTile(
              CARD_ICON,
              `Card ending ${(selectedCard && selectedCard.last4 || card && card.last4) || ""}`,
              () => {
                open_dialog("checkout", {
                  title: "Payment method",
                  selectedCard: card && card.id,
                  checkoutProps: {},
                  buttonText: "Continue",
                  handleCardChange,
                  onConfirm: (card) => {
                    setDefaultCard(card);
                    close_dialog("checkout");
                  },
                });
              }
            )}
          </div>}
          {!props?.isSubscription && <h6 className="mb-0 fntSz16 pb-2 base_reject_clr">{alert}</h6>}
          {isTaxEnable
            ? <div className="text-right">
              <p className="m-0">{lang.price}: {defaultCurrency}{isCallExtension ? selectedSlot.extensionCharges : props.price}</p>
              <p className="m-0">{lang.taxAmount} ({taxPercent}%): {defaultCurrency}{((taxPercent / 100) * Number(isCallExtension ? selectedSlot.extensionCharges : props.price)).toFixed(2)}</p>
              <hr className="my-1" />
              <p><b>{lang.totalAmount}: {defaultCurrency}{totalTipAmount()?.toFixed(2)}</b></p>
            </div>
            : ""
          }
          {(props?.walletRecharge || props?.isSubscription) && <div className="text-right">
            <p className="my-1">{lang.price}: {defaultCurrency}{isCallExtension ? selectedSlot?.extensionCharges : props.price}</p>
            <p className="my-1">{lang.processingFee}: {defaultCurrency}{paymentProcessingFee}.00</p>
            <p className="my-1"><b>{lang.totalAmount}: {defaultCurrency}{totalPaymentAmount()?.toFixed(2)}</b></p>
          </div>}

          <div className="mt-3">
            {props?.isSubscription && <div className="fntSz12 py-2 strong_app_text"><strong className="text-app">{lang.note}: </strong>{alert}</div>}
            <Button
              type="button"
              fclassname="btnGradient_bg rounded-pill py-2"
              disabled={isCallExtension && !selectedSlot.value}
              onClick={() => {
                props.checkout && props.checkout((selectedCard?.id || card?.id), address?._id, selectedSlot);
                props.onClose && props.onClose();
              }}
            >
              {props?.isSubscription ? lang.subscribe : props?.isVipMsgPlan ? lang.purchase : lang.yes}
            </Button>
          </div>
        </div>
      )
      }
      <style jsx>{`
      :global(.coinprice){
       display: ${props.isStream && "inline"};
      }
      `}
      </style>
    </Wrapper >
  );
}
