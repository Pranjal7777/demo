import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";

import { close_dialog, close_drawer, startLoader, stopLoader, Toast } from "../../lib/global";
import useLang from "../../hooks/language";
import Wrapper from "../../hoc/Wrapper";
import { getCards } from "../../redux/actions";
import isMobile from "../../hooks/isMobile";
import Button from "../button/button";
import { postCardAPI } from "../../services/card";

export const CardForm = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpire: "",
    cardCvv: ""
  });
  const [btnDisable, setBtnDisable] = useState(true);
  const [expireValidationMsg, setExpireValidationMsg] = useState();


  useEffect(() => {
    if (cardDetails.cardNumber.length === 19 && cardDetails.cardExpire.length === 5 && cardDetails.cardCvv.length > 2) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [cardDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cardNumber, cardExpire, cardCvv } = cardDetails;

    try {
      startLoader();
      const payload = {
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardExpire: cardExpire.replace("/", ""),
        cardCvv
      };

      await postCardAPI(payload);
      dispatch(getCards());
      Toast(lang.cardAdded, "success");
      stopLoader();
      mobileView ? props.onClose() : close_dialog("addCard");

    } catch (e) {
      console.error("[error]", e);
      stopLoader();
      mobileView ? props.onClose() : close_dialog("addCard")
      Toast("Fail to add card", "error");
    }
  }

  const handleChange = (key, value, e) => {
    const currentYear = new Date().getFullYear();
    const currentYearLastTwoValue = String(currentYear).slice(2);
    const lastMonth = 12; // December 
    if (key === "cardNumber") {
      // To enter SPACE after 4 Digits inside card Number
      value = value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (key === "cardExpire") {
      value = value.replace(
        /[^0-9]/g, '' // To allow only numbers
      ).replace(
        /^([2-9])$/g, '0$1' // To handle 3 > 03
      ).replace(
        /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
      ).replace(
        /^0{1,}/g, '0' // To handle 00 > 0
      ).replace(
        /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
      );

      // To check if CARD EXPIRY YEAR is not lower than current Year
      if (value.length === 5 && value.slice(3) < Number(currentYearLastTwoValue)) {
        setExpireValidationMsg("Year can't be lower than Current Year");
        return;
      }

      setExpireValidationMsg("");
    }
    setCardDetails({ ...cardDetails, [key]: value });
  }

  return (
    <Wrapper>
      <div className="px-0 px-sm-3">
        <div style={{ backgroundColor: theme.dialogSectionBg }} className="my-4 radius_12 borderStroke text-app">

          {/* Card Number Field */}
          <div className="p-3">
            <p className="mb-2">{lang.cardNumber}</p>
            <div className="p-2 inputBorder">
              <input
                type="tele"
                maxlength="19"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoFocus
                className="w-100 m-0 p-0 card-text text-app"
                onChange={(e) => handleChange("cardNumber", e.target.value, e)}
                value={cardDetails.cardNumber}
              />
            </div>
          </div>

          <div className="row mx-0 pb-3">
            {/* Card Expiry Field */}
            <div className="col-6">
              <p className="mb-2">{lang.expiresOn}</p>
              <div className="p-2 inputBorder">
                <input
                  type="tele"
                  maxlength="5"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  className="w-100 m-0 p-0 card-text text-app"
                  onChange={(e) => handleChange("cardExpire", e.target.value)}
                  value={cardDetails.cardExpire}
                />
              </div>
              <p style={{ width: "200%" }} className="mb-2 mt-1 fntSz10 errorMsgColor">{expireValidationMsg}</p>
            </div>

            {/* Card CVV Field */}
            <div className="col-6">
              <p className="mb-2">{lang.cvv}</p>
              <div className="p-2 inputBorder">
                <input
                  type="tele"
                  maxlength="3"
                  inputMode="numeric"
                  placeholder="CVV"
                  className="w-100 m-0 p-0 card-text text-app"
                  onChange={(e) => handleChange("cardCvv", e.target.value)}
                  value={cardDetails.cardCvv}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button
            type="button"
            fixedBtnClass={"active"}
            onClick={(e) => handleSubmit(e)}
            disabled={btnDisable}
            children={lang.confirm}
          />
        </div>
      </div>

      <style jsx>{`
        .confirmBtn {
          position: absolute;
          top:80%;
          left: 5%;
          width: 90%;
        }
        .card-text {
          background: transparent;
          border: 0;
        }
        .inputBorder{
          border: 1.5px solid #5E3A68;
          border-radius: 8px;
        }
      `}
      </style>
    </Wrapper>
  );
};
