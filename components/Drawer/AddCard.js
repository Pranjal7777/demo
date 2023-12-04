import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { CardForm } from "./CardForm";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { close_dialog, close_drawer } from "../../lib/global";
import Wrapper from "../../hoc/Wrapper";

const Header = dynamic(() => import("../header/header"), { ssr: false });

export default function AddCard(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();

  const handleBack = () => {
    props.onClose && props.onClose("");
  };

  return (
    <Wrapper>
      {mobileView
        ? ""
        : <button
          type="button"
          className="close dv__modal_close"
          data-dismiss="modal"
          onClick={() => close_dialog("addCard")}
        >
          {lang.btnX}
        </button>
      }
      <div className={mobileView ? "bg-dark-custom w-100 vh-100" : "py-3"}>
        {mobileView
          ? <Header
            title={lang.addDebitCreditCard}
            back={() => {
              props.checkoutScreen ? close_drawer("addCard") : handleBack();
            }}
          />
          : <h5 className="content_heading text-center px-1 py-3 m-0">
            {lang.addDebitCreditCard}
          </h5>
        }
        <div className={mobileView ? "col-12 addCardSec" : "col-12"}>
          <div style={mobileView ? { paddingTop: "86px" } : {}}>
            {/* <Elements stripe={stripePromise}> */}
            <CardForm
              onClose={() => mobileView ? props.onClose() : close_dialog("addCard")}
            />
            {/* </Elements> */}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
          .addCardSec {
            // height: calc(100vh - 50px);
            height: 100vh;
          }
        `}
      </style>
    </Wrapper>
  );
}
