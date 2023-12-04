import React from "react";
import Wrapper from "../../hoc/Wrapper";
// Asstes
import Icon from "../image/icon";
import { CLOSE_ICON_WHITE, DONE_ICON } from "../../lib/config/logo";
import { close_drawer } from "../../lib/global/loader";
import Image from "../image/image";

export default function VerifyAcc(props) {
  const { heading, msg } = props;

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div className="modal-content py-3">
            <div className="text-right px-3">
              <Icon
                icon={`${CLOSE_ICON_WHITE}#close-white`}
                color={"var(--l_app_text)"}
                size={16}
                onClick={() => close_drawer("cancelSubscription")}
                alt="back_arrow"
                class="cursorPtr"
                viewBox="0 0 16 16"
              />
            </div>
            <div className="col-12 w-330 mx-auto d-flex flex-column align-items-center">
              <h4>{heading}</h4>
              <Image
                src={DONE_ICON}
                width={84}
                height={84}
                className="my-3"
              />
              <div className="light_app_text">
                {msg}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .maxWidth70 {
            max-width: 70%;
          }
        `}
      </style>
    </Wrapper>
  );
}
