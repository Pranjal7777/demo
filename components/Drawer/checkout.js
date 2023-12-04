import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import find from "lodash/find";

import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import PromoInput from "../input-box/promo-input";
import isMobile from "../../hooks/isMobile";
import { validatePromocodeApi } from "../../services/subscriptions";
import Wrapper from "../../hoc/Wrapper";
import { deleteCardAPI } from "../../services/card";
import { getCards } from "../../redux/actions";
import Drawer from "./Drawer";
import DeleteCardConfirm from "./DeleteCardConfirm";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const CardTile = dynamic(() => import("./CardTile"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });

export default function Checkout(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const { checkoutProps = {}, handleCardChange } = props;

  const [toggleaddCardDrawer, setToggleAddCardDrawer] = useState(false);
  const [toggledeleteCardDrawer, setToggleDeleteCardDrawer] = useState(false);
  const [selectedCard, setCardData] = useState(props.selectedCard || false);
  const [promocode, setPromocode] = useState(checkoutProps.promocode);
  const [promoApplied, applyPromocode] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [isPaymentInProgress, setPaymentInProgress] = useState(false);

  const cards = useSelector((state) => state.cardsList);

  const handleAddCards = () => {
    mobileView
      ? open_drawer("addCard", {}, "right")
      : open_dialog("addCard", { checkoutScreen: true });
  };

  const handleCloseDrawer = () => {
    setToggleAddCardDrawer(false);
  };

  const checkout = () => {
    close_dialog();
  };

  const closeConfirmModel = () => {
    setToggleDeleteCardDrawer(false);
  };

  const handleValidatePromocode = () => {
    startLoader();
    const payload = {
      subscriptionPlanId: checkoutProps.subscriptionPlanId,
      promoCode: promocode,
    };
    validatePromocodeApi(payload)
      .then((res) => {
        stopLoader();
        if (res && res.data) {
          const finalAmount = res.data.data.finalAmount;
          applyPromocode(true);
          Toast(res.data.message, "success");
          setDiscountedAmount(Number(finalAmount));
        }
      })
      .catch((e) => {
        stopLoader();
        Toast(e.response.data.message, "error");
      });
  };


  const handleDeleteCard = async (data) => {
    startLoader();
    try {
      const response = await deleteCardAPI({
        cardId: data.id,
      });

      if (response.status == 200) {
        stopLoader();
        dispatch(getCards());
        Toast("Card Deleted", "success");
        closeConfirmModel();
      }
      close_dialog("confirmDeleteAddress");
    } catch (e) {
      stopLoader();
      Toast(e?.response?.data?.message, "error");
    }
  };

  const openConfirmModel = (data) => {
    setCardData(data);
    console.log("data", data);
    mobileView
      ? setToggleDeleteCardDrawer(true)
      : open_dialog("confirmDeleteAddress", {
        title: lang.cardDeleteConfirmation,
        selectedCard: data,
        handleDeleteCard,
      });
  };

  return (
    <Wrapper>
      {mobileView ? (
        <div className="wrap d-flex flex-column">
          <div>
            <Header
              title={lang.choosePayment}
              back={() => {
                close_drawer("checkout");
              }}
            />
            <div className="container" style={{ paddingTop: "60px" }}>
              <div className="add-card">
                <div className="w-600">{lang.savedCards}</div>
                <div className="dv_base_color" onClick={() => handleAddCards()}>
                  + {lang.add}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`d-flex align-items-center justify-content-center ${cards ? "overflow-auto" : "h-50"}`}
          >
            {cards && cards.length
              ? <div className="col-12" style={{height: "calc(calc(var(--vhCustom, 1vh) * 100) - 200px)"}}>
                {cards.length && cards.map((data, index) => (
                  <CardTile
                    onCardSelect={(id) => {
                      setCardData(id);
                    }}
                    className="bg-bck31"
                    selectedCard={selectedCard}
                    cardData={data}
                    key={index}
                    openConfirmModel={openConfirmModel}
                    deleteIcon={false}
                    radio={true}
                  />
                ))}
              </div>
              : <div>
                <Img src={env.No_Card_Found} />
                <p className="m-0 mt-3">{lang.noCardsFound}</p>
              </div>
            }
          </div>
          <div className="p-3">
            <Button
              disabled={!selectedCard}
              type="button"
              fclassname="btnGradient_bg rounded-pill"
              onClick={() => {
                const validPromo = promoApplied ? promocode : null;
                props.handleCardChange && handleCardChange(selectedCard, cards)
                props.onConfirm
                  ? props.onConfirm(find(cards, { id: selectedCard }))
                  : isPaymentInProgress ? "" : props.checkout
                    ? props.checkout(
                      selectedCard,
                      props.selectAddress,
                      validPromo,
                      setPaymentInProgress
                    )
                    : checkout();
              }}
            >
              {props.buttonText || lang.confirmPay}
            </Button>
          </div>


          {/* Delete Confirmation Model */}
          <Drawer
            open={toggledeleteCardDrawer}
            anchor="bottom"
            onClose={closeConfirmModel}
          >
            <DeleteCardConfirm
              title={lang.cardDeleteConfirmation}
              selectedCard={selectedCard}
              handleDeleteCard={handleDeleteCard}
              onClose={closeConfirmModel}
            />
          </Drawer>
        </div>
      ) : (
        <div className="p-3 overflowY-auto" style={{ maxHeight: "600px" }}>
          <div className="text-center">
            <h5 className="txt-black dv__fnt30">{lang.debitCreditCard}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => close_dialog("checkout")}
          >
            {lang.btnX}
          </button>

          {cards && (
            <>

              <div
                className={`add-card ${checkoutProps.showAmout ? "pt-0" : "pt-3"
                  }`}
              >
                <div className="w-600">{lang.savedCards}</div>
                <div
                  className="dv_base_color cursor-pointer"
                  onClick={() => handleAddCards()}
                >
                  + {lang.add}
                </div>
              </div>
            </>
          )}

          <div>
            {cards && cards.length ? (
              <div className="col-12 p-0">
                {cards.map((data, index) => (
                  <CardTile
                    onCardSelect={(id) => {
                      setCardData(id);
                    }}
                    selectedCard={selectedCard}
                    cardData={data}
                    key={index}
                    deleteIcon={false}
                    radio={true}
                    openConfirmModel={openConfirmModel}
                  />
                ))}
              </div>
            ) : (
              <div className="my-5 text-center">
                <Img src={env.No_Card_Found} alt="no_card_placeholder" />
                <p className="m-0 mt-3 font-weight-bold">{lang.noCardsFound}</p>
              </div>
            )}
          </div>

          <div className="my-4 px-3">
            {cards ? (
              <Button
                disabled={!selectedCard}
                type="button"
                fclassname="btnGradient_bg rounded-pill py-2"
                onClick={() => {
                  props.handleCardChange && handleCardChange(selectedCard, cards)
                  props.onConfirm
                    ? props.onConfirm(find(cards, { id: selectedCard }))
                    : isPaymentInProgress ? "" : props.checkout
                      ? props.checkout(
                        selectedCard,
                        props.selectAddress,
                        promocode, setPaymentInProgress
                      )
                      : checkout();
                }}
              >
                {props.buttonText || lang.confirmPay}
              </Button>
            ) : (
              <Button
                type="button"
                fclassname="btnGradient_bg rounded-pill py-2"
                onClick={() => handleAddCards()}
              >
                {lang.addCard}
              </Button>
            )}
          </div>
        </div>
      )}

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
        `}
      </style>
    </Wrapper>
  );
}
