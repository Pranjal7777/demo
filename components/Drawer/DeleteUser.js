import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Icon from "../image/icon"

// Asstes
import * as env from "../../lib/config";
// import Img from "../ui/Img/Img";

export default function DeleteUser() {
  const [lang] = useLang();
  const theme = useTheme();

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div className="modal-content pt-4 pb-4">
            <div className="col-12 w-330 mx-auto">
              {/* <Img src={env.CHECK} className="my-3"></Img> */}
              <Icon
                icon={`${env.CHECK}#check_icon`}
                color={theme.appColor}
                size={60}
                class="my-3"
                viewBox="0 0 74.521 74.521"
              />
              <h5 className="mb-0 fntSz22 pb-2">{lang.deleteAccountHeading}</h5>
              <div className="fntSz13 bse_dark_text_clr mb-3">
                {lang.deleteAccountMsg}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
