import React, { useState } from "react";
import { useTheme } from "react-jss";

import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import RadioButton from "../formControl/radioButton";
import Wrapper from "../../hoc/Wrapper";
import Img from "../ui/Img/Img";
import Icon from "../image/icon";
import { handleContextMenu } from "../../lib/helper";

export default function CardTile(props) {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const theme = useTheme();
  const {
    cardData,
    openConfirmModel,
    deleteIcon = true,
    radio = false,
    selectedCard,
    onCardSelect,
    isCardUsed = true,
  } = props;

  return (
    <Wrapper>
      <div
        onClick={() => onCardSelect(cardData.id)}>
        <div className={`my-2 ${((cardData.id == selectedCard) && isCardUsed) ? "radius_12 borderStrokeClr" : "radius_12 unSelectedSection"}`}>
          <div className="cursorPtr radius_12 text-app" style={{ backgroundColor: theme.dialogSectionBg }}>
            <div className="p-3">
              <div className="d-flex justify-content-between mb-2">
                <p className="m-0">{lang.cardNumber}</p>
                <div className="d-flex col-4 p-0 align-items-baseline justify-content-end">
                  <Icon
                    icon={`${env.DELETE_SVG}#delete_icon_b`}
                    size={22}
                    onClick={(e) => {
                      e.stopPropagation();
                      openConfirmModel(cardData);
                    }}
                    class="d-flex justify-content-end"
                    viewBox="0 0 22 22"
                  />
                </div>
              </div>

              <div className="col-12 p-2 inputBorder mb-2">
                <div className="d-flex">
                  <img src={cardData.brand == "visa" ? env.VISA : env.MASTER_CARD} alt="card_brand" className="pr-2 callout-none" contextMenu={handleContextMenu}
                  />
                  <p className="mb-0">
                    **** **** **** {cardData.last4}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <div className="col-md-6 pl-0">
                  {lang.expiresOn}
                  <div className="inputBorder">
                    <p className="m-0 p-2">{cardData?.cardExpire?.slice(0, 2)}/{cardData?.cardExpire?.slice(-2)}</p>
                  </div>
                </div>
                <div className="col-md-6 p-0">
                  {lang.cvv}
                  <div className="inputBorder">
                    <p className="m-0 p-2" type="password">***</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .inputBorder{
          border: 1.5px solid #5E3A68;
          border-radius: 8px;
        }
      `}</style>
    </Wrapper>
  );
}
