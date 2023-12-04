import React, { useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import * as config from "../../lib/config";
import Button from "../button/button";
import Img from "../ui/Img/Img";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";

export default function MsgDialog(props) {
  const theme = useTheme();
  const { title, desc } = props;

  return (
    <Wrapper>
      <div className="p-3 text-center" style={{maxWidth: "500px"}}>
        <div className="text-right">
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
        {title && <h5 className="text-app w-700 mb-3">{title}</h5>}
        {desc && <div className="light_app_text mb-4">{desc}</div>}
        <div className="d-flex flex-row justify-content-center">
          <Button
            type="button"
            data-dismiss="modal"
            data-toggle="modal"
            fclassname="btnGradient_bg rounded-pill w-auto px-4"
            onClick={() => props.button.onClick()}
            children={props.button.text}
          />
        </div>
      </div>

      <style jsx>{`
      :global(.MsgDialog > .targetDialog){
        background: ${props.theme === "white" && "white !important"};
        border: ${props.theme === "white" && "none !important"}; 
      }
      `}
      </style>
    </Wrapper>
  );
}
