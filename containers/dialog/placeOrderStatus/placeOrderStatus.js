import React from "react";
import Image from "../../../components/image/image";
import Wrapper from "../../../hoc/Wrapper";
import * as config from "../../../lib/config";
const PlaceOrderStatus = (props) => {
  return (
    <Wrapper>
      <div className="px-3 py-5 d-flex justify-content-center flex-column align-items-center">
        <div>
          <Image src={config.TICK_MARK} />
        </div>
        <div className="fntWeight700 pt-3 fntSz22">{props.title}</div>
      </div>
    </Wrapper>
  );
};

export default PlaceOrderStatus;
