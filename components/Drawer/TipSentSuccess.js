import React from "react";
import { checkedLogo } from "../../lib/config";
import Img from "../ui/Img/Img";

export default function TipSuccessSent() {
  return (
    <div
      className="modal fade bottom btmModal"
      id="Tipsentsuccessfully"
      onclick="nav_home_model()"
    >
      <div className="modal-dialog">
        <div className="modal-content pt-4 pb-4">
          <div className="col-12 w-330 mx-auto">
            <figure>
              <Img
                src={checkedLogo}
                width="74"
                height="74"
                alt="check_svg"
              />
            </figure>
            <h5 className="mb-3">Tip sent successfully</h5>
            <div className="txt-book fntSz16 mb-4">
              Thanks! Your tip has been sent to Penny Lane..
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
