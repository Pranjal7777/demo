import React, { useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import {
  close_drawer,
  drawerToast,
  open_drawer,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
  close_dialog,
} from "../../lib/global";
import { useDispatch, useSelector } from "react-redux";
import { getAddress } from "../../redux/actions/address";
import { buyPost } from "../../services/assets";
import usePg from "../../hooks/usePag";
import { CHECK, P_CLOSE_ICONS } from "../../lib/config";
import useReduxData from "../../hooks/useReduxState";
import dynamic from "next/dynamic";
const PurchaseConfirm = dynamic(() => import("./purchaseConfirm"), {
  ssr: false,
});
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { buyStreamAPI } from "../../services/liveStream";
import { purchaseLockedPost } from "../../services/bulkMessage";
import { updateChat } from "../../redux/actions/chat/action";
import { postRequestExtensionAPI, postVideoOrderAPI, timezone } from "../../services/videoCall";
import { setSelectedSoltExtendStream } from "../../redux/actions/extendVideoStream";
import { purchaseSuccessFromWallet } from "../../redux/actions/wallet";
import Icon from "../image/icon";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";

export default function BuyPost(props) {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const [defaultAddress, setDefault] = useState(reduxData.defaultAddress);
  const [defaultCard, setDefaultCard] = useState(reduxData.defaultCard);

  const selectedSlot = useSelector((state) => state?.setSelectedSlot);

  const [lang] = useLang();
  const { price = "0", currency = "$", isStream = false, creatorId, streamId, isScheduledStream = false, messageId, lockedPostId, chatId, isVideoCall = false, isCallExtension = false, slotArray = [], virtualOrderId } = props;
  const dispatch = useDispatch();
  const [pg] = usePg();

  const handleGetAddress = () => {
    dispatch(getAddress({ loader: true }));
  };
  const handleCloseDrawer = () => {
    // router.back();
  };

  const symbolReturn = (paymentCurrencyCode) => {
    switch (paymentCurrencyCode) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      default:
        return paymentCurrencyCode;
    }
  };

  const handleVideoCallRequestTimeout = () => {
    const openAction = mobileView ? open_drawer : open_dialog;
    openAction("successPayment", { successMessage: lang.requestCallSuccess }, "bottom");
    setTimeout(() => {
      dispatch(purchaseSuccessFromWallet(+props.price));
      props.updatePostPurchase?.();
    }, 1000);
  };

  const requestforbuyPost = async (paymentMethod, addressId, selectedSlot) => {
    startLoader();

    if (isCallExtension) {
      const payload = {
        extensionData: {
          extensionTime: selectedSlot.value,
          extensionCharge: selectedSlot.extensionCharges
        },
        status: "EXTENSION_REQUESTED",
        virtualOrderId
      };
      try {
        const response = await postRequestExtensionAPI(payload);
        if (response.status === 200) {
          stopLoader();
          mobileView ? close_drawer() : close_dialog();
          props.updatePostPurchase?.();
          Toast('Please Wait for Request to Accept', "success");
          dispatch(setSelectedSoltExtendStream({ extensionCharges: 0 }));
        }
      } catch (err) {
        stopLoader();
        mobileView ? close_drawer() : close_dialog();
        err.response && Toast(err.response?.data?.message || "Can't Request for Extension !", "error");
        dispatch(setSelectedSoltExtendStream({ extensionCharges: 0 }));
      } finally {
        stopLoader();
      }
      return;
    }

    if (isVideoCall) {
      const { scheduleDate, timeSlots } = props.slotData;
      const slotPayload = {
        creatorId,
        orderType: "VIDEO_CALL",
        scheduleDate,
        timeSlots,
        timezone: timezone()
      };
      try {
        const response = await postVideoOrderAPI(slotPayload);
        if (response.status === 200) {
          mobileView ? close_drawer() : close_dialog("buyPost")
          stopLoader();
          setTimeout(handleVideoCallRequestTimeout, 100);
        }

      } catch (err) {
        stopLoader();
        mobileView ? close_drawer() : close_dialog();
        err.response && Toast(err.response?.data?.message || "Slot couldn't get book!", "error");
      }

      return;
    }

    if (props.lockedPost) {
      try {
        const payload = {
          isometrikMessageId: messageId,
          sharedType: props?.messageType,
          conversationId: chatId,
          lockedPostId,
          creatorId,
        }
        if(props?.messageType === 'BULK') {
          payload['broadcastListId'] = props?.broadcastListId
        }
        if (addressId) {
          payload["addressId"] = addressId;
        }


        // API Calling
        try {
          const res = await purchaseLockedPost(payload);
          if (res.status === 200) {
            setTimeout(() => {
              mobileView ? open_drawer("successPayment", { successMessage: lang.postUnlock }, "bottom") : open_dialog("successPayment", { successMessage: lang.postUnlock })
            }, 200)
            if (mobileView) {
              close_drawer("buyPost")
              close_drawer("purchaseNewPost")
            } else {
              close_dialog("purchaseNewPost")
              close_dialog("buyPost");
            }
            // dispatch(updateChat(messageId, chatId));
            if (props.callBack) {
              props?.callBack(res.data.data)
            } else {
              Toast("Locked Post purchased successfully", "success");
            }
  
          }
        } catch(e) {
          console.error("ERROR IN requestforbuyPost", e);
        }



        stopLoader();
        close_drawer();

      } catch (err) {
        stopLoader();
        console.error("ERROR IN requestforbuyPost", err);
        Toast(err?.response?.data?.message, "error");
      }
    } else {
      if (isStream) {
        const requestPayloadStream = {
          creatorId,
          amount: +price,
          currency,
          streamId,
          isScheduledStream
        };
        if (addressId) {
          requestPayloadStream["addressId"] = addressId;
        }
        buyStreamAPI(requestPayloadStream)
          .then(() => {
            props.updatePostPurchase?.();
            dispatch(purchaseSuccessFromWallet(+price))
            stopLoader();
            mobileView ? close_drawer() : close_dialog();
            Toast('Stream Unlocked Successfully', "success");
          })
          .catch((err) => {
            stopLoader();
            mobileView ? close_drawer() : close_dialog();
            err.response && Toast(err.response?.data?.message || 'Stream Unlocked Fail!', "error");
          })
        return;
      }
      const requestPayload = {
        id: props.postId,
        purchaseType: props.postType,
      };
      if (addressId) {
        requestPayload["addressId"] = addressId;
      }
      buyPost(requestPayload)
        .then((res) => {
          if (props.updatePostPurchase) {
            if (res.data?.data[0]) {
              props.updatePostPurchase(res.data.data);
              if (props.callBack) {
                props?.callBack(res.data.data)
              }
            } else props.updatePostPurchase();

          }
          dispatch(purchaseSuccessFromWallet(+price))
          setTimeout(() => {
            mobileView ? open_drawer("successPayment", { successMessage: lang.postUnlock }, "bottom") : open_dialog("successPayment", { successMessage: lang.postUnlock })
          }, 100)
          if (mobileView) {
            close_drawer("buyPost")
            close_drawer("purchaseNewPost")
          } else {
            close_dialog("purchaseNewPost")
            close_dialog("buyPost");
          }

          stopLoader();
        })
        .catch((e) => {
          stopLoader();
          {
            mobileView ? close_drawer() : close_dialog();
          }
          e.response && Toast(e.response.data.message, "error");
        });
    }
  };

  return props.purchaseUsingCoins ?
    <>
      <div className='specific_section_bg text-app'>
        <div className=" pt-2">
          <div>
            <h4 className="text-app">{props.titleName}</h4>
            <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobileView ? '10px' : "12px", right: mobileView ? "18px" : "8px" }}>
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
          <div className='text-center mt-4'>
            <h4 className='mb-0 '>
              {props.title}
            </h4>
          </div>
          <div className="">
            <p className="text-wrap w-50 text-center mx-auto textFaintGray my-3 d-flex justify-content-center">{props.description} {props.price} <Icon
              icon={`${BOMBSCOIN_LOGO}#bombscoin`}
              hoverColor='var(--l_base)'
              color={'var(--l_app_text)'}
              width={16}
              height={16}
              class="mx-1"
              alt="Back Arrow"
            /> {lang.coins}</p>
          </div>
        </div>
        <div className='px-5 py-1 specific_section_bg mb-2'>
          <Button
            type="button"
            fclassname='rounded-pill my-2 gradient_bg'
            btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
            onClick={requestforbuyPost}
            children={props.button}
          />
        </div>
      </div>
    </>

    : defaultCard ? (
      <PurchaseConfirm
        {...props}
        title={`${isStream ? lang.streamBuyAlert : isVideoCall ? `${lang.buyVideoCallAlert} ${props.slotData.creatorName}` : isCallExtension ? lang.extendCallAsk : lang.confirmPostBuy} ${isVideoCall ? 'for' : ''} ${(isCallExtension || isStream) ? "" : isStream ? symbolReturn(currency) : currency}${(isCallExtension || isStream) ? "" : price}`}
        desc={lang.defaultWallet}
        checkout={requestforbuyPost}
        isStream={isStream}

        // Props For Video Call
        isCallExtension={isCallExtension}
        slotArray={slotArray}
        selectedSlot={selectedSlot}
        handlePaymentUsingWallet={true}
      />
    ) : (
      <Wrapper>
        {mobileView ? (
          <div className="btmModal">
            <div className="modal-dialog">
              <div className="modal-content pt-4 pb-4">
                <div className="col-12 w-330 mx-auto black">
                  <h6 className="mb-0 fntSz24 pb-2 w-100 mx text-app">
                    {isStream ? lang.streamBuyAlert : isVideoCall ? `${lang.buyVideoCallAlert} ${props.slotData.creatorName}` : isCallExtension ? lang.extendCallAsk : lang.confirmPostBuy} {isVideoCall ? 'for' : ''};
                  </h6>
                  {!isCallExtension && <h6 className="mb-0 fntSz24 pb-2 text-app">
                    {symbolReturn(currency)} {price}
                  </h6>}

                  <div className="d-flex pt-3 align-items-center justify-content-between">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-default greyBorderBtn"
                        data-dismiss="modal"
                        data-toggle="modal"
                        onClick={() => {
                          props.onClose();
                          props.onCloseDrawer && props.onCloseDrawer();
                        }}
                      >
                        {lang.no}
                      </button>
                    </div>
                    <div className="col-6">
                      <Button
                        type="button"
                        cssStyles={theme.blueButton}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGetAddress();
                          open_drawer("checkout", {
                            title: `${isStream ? lang.streamBuyAlert : isVideoCall ? `${lang.buyVideoCallAlert} ${props.slotData.creatorName}` : isCallExtension ? lang.extendCallAsk : lang.confirmPostBuy} ${isVideoCall ? 'for' : ''} ${isCallExtension ? "" : isStream ? symbolReturn(currency) : currency}${isCallExtension ? "" : price}`,
                            onClose: handleCloseDrawer,
                            getAddress: handleGetAddress,
                            radio: true,
                            checkout: requestforbuyPost,
                            applyOn: isVideoCall ? "VIDEO_CALL" : isStream ? "STREAM" : "POST_PURCHASE",
                            desc: lang.defaultBillingAddress,
                            creatorId: props.creatorId,
                            price: props.price,
                            isApplyPromo: true,
                            checkoutProps: {
                              showAmout: true,
                              currency: currency,
                              amount: price,
                            },
                          },
                            "right"
                          );
                        }}
                      >
                        {lang.yes}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="text-center pb-2 px-5">
              <h6 className="mb-0 dv__fnt30 w-700 pb-2">{isStream ? lang.streamBuyAlert : isVideoCall ? `${lang.buyVideoCallAlert} ${props.slotData.creatorName}` : isCallExtension ? lang.extendCallAsk : lang.confirmPostBuy} {isVideoCall ? 'for' : ''}</h6>

              {!isCallExtension && <h6 className="mb-0 dv__fnt30 w-700 pb-2">
                {isStream ? symbolReturn(currency) : currency} {price}
              </h6>}
            </div>

            <div className="d-flex pt-3 align-items-center justify-content-between">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default greyBorderBtn"
                  data-dismiss="modal"
                  data-toggle="modal"
                  onClick={() => {
                    props.onClose();
                  }}
                >
                  {lang.no}
                </button>
              </div>
              <div className="col-6">
                <Button
                  type="button"
                  cssStyles={theme.blueButton}
                  onClick={(e) => {
                    e.preventDefault();
                    handleGetAddress();
                    open_dialog("checkout", {
                      title: `${isStream ? lang.streamBuyAlert : isVideoCall ? `${lang.buyVideoCallAlert} ${props.slotData.creatorName}` : isCallExtension ? lang.extendCallAsk : lang.confirmPostBuy} ${isVideoCall ? 'for' : ''} ${isCallExtension ? "" : isStream ? symbolReturn(currency) : currency}${isCallExtension ? "" : price}`,
                      onClose: props.onClose,
                      getAddress: handleGetAddress,
                      radio: true,
                      checkout: requestforbuyPost,
                      applyOn: isVideoCall ? "VIDEO_CALL" : isStream ? "STREAM" : "POST_PURCHASE",
                      desc: lang.defaultBillingAddress,
                      creatorId: props.creatorId,
                      price: props.price,
                      isApplyPromo: true,
                      checkoutProps: {
                        showAmout: true,
                        currency: currency,
                        amount: price,
                      },
                      minHeightSize: true,
                      isCallExtension: isCallExtension,
                      selectedSlot: selectedSlot,
                      slotArray: slotArray,
                    });
                  }}
                >
                  {lang.yes}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    );
}
