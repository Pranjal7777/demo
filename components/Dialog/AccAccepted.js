import React, { useState } from "react";
import { useTheme } from "react-jss";

import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import * as config from "../../lib/config";
import Button from "../button/button";
import Img from "../ui/Img/Img";
import VerifyId from "./VerifyId";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import Icon from "../image/icon";

const AccAccepted = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { title, desc } = props;
  const [currentScreen, setCurrentScreen] = useState();

  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <Wrapper>
      {!currentScreen ? (
        <div className="p-4 text-center" style={{ maxWidth: "500px" }}>
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
          {title && <h4 className="mb-3">{title}</h4>}
          {desc && <div className=" mb-3">{desc}</div>}
          <div className="d-flex flex-row justify-content-center mt-4">
            <Button
              type="button"
              fclassname="btnGradient_bg rounded-pill w-auto px-4 py-2"
              onClick={() => updateScreen(<VerifyId />)}
            >
              {lang.continue}
            </Button>
          </div>
        </div>
      ) : (
        currentScreen
      )}
    </Wrapper>
  );
};

export default AccAccepted;
