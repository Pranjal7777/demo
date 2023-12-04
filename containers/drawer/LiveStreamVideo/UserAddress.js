import React from "react";
import { CREDIT_CARD, EDIT4, MAP_POINTER } from "../../../lib/config";

const UserAddress = (props) => {
  return (
    <div className="">
      <div className="col-12 font-weight-700  fntSz28">Confirm</div>
      <div
        className="col-12 py-3 font-weight-700 p-0 d-flex"
        style={{ borderBottom: "5px solid #EAEAEA" }}
      >
        <div className="col-auto">
          <img
            src="https://cdn.shoppd.net/products/0/0/small/Blue-Heaven-Cosmetics-Sketch-Eye-Liner_1610726298.jpeg"
            className="productCartCss"
          />
        </div>
        <div className="col">
          <p className="font-weight-600 mb-1 fontStyle">
            Nike mens NikeChroma Thong
          </p>
          <p className="font-weight-700 m-0 fontStyle">$2,999.99</p>
        </div>
      </div>

      <div className="col-12 d-flex  pt-4">
        <div className="col-auto">
          <img src={MAP_POINTER} />
        </div>
        <div className="col">
          <p className="mb-1 fntSz13" style={{ color: "#8C959D" }}>
            BILLING Address
          </p>
          <p className="fntSz12" style={{ color: "#242A37" }}>
            7542 Jerde Glens Suite 893, Innsbruck, 5th cross, Edinburgh,
            Santiago, Malaysia
          </p>
        </div>
        <div className="col-auto align-items-center d-flex">
          <img src={EDIT4} />
        </div>
      </div>

      <div className="col-12 d-flex  pt-4">
        <div className="col-auto">
          <img src={MAP_POINTER} />
        </div>
        <div className="col">
          <p className="mb-1 fntSz13" style={{ color: "#8C959D" }}>
            Delivery Address
          </p>
          <p className="fntSz12" style={{ color: "#242A37" }}>
            7542 Jerde Glens Suite 893, Innsbruck, 5th cross, Edinburgh,
            Santiago, Malaysia
          </p>
        </div>
        <div className="col-auto align-items-center d-flex">
          <img src={EDIT4} />
        </div>
      </div>

      <div className="col-12 d-flex  pt-4">
        <div className="col-auto">
          <img src={CREDIT_CARD} />
        </div>
        <div className="col">
          <p className="mb-1 fntSz13" style={{ color: "#8C959D" }}>
            Delivery Address
          </p>
          <p className="fntSz12" style={{ color: "#242A37" }}>
            7542 Jerde Glens Suite 893, Innsbruck, 5th cross, Edinburgh,
            Santiago, Malaysia
          </p>
        </div>
        <div className="col-auto align-items-center d-flex">
          <img src={EDIT4} />
        </div>
      </div>

      <div className="col-12 d-flex pb-3 py-3">
        <div className="col-6 px-3 d-flex justify-content-center">
          <div
            className="btnCss text-center py-1 noBtn"
            onClick={() => {
              props.onClose();
            }}
          >
            NO
          </div>
        </div>
        <div className="col-6 px-3 d-flex justify-content-center">
          <div className="btnCss text-center py-1 yesBtn">YES</div>
        </div>
      </div>
      <style jsx>{`
        .productCartCss {
          width: 66px;
          height: 66px;
          border-radius: 5px;
          border: 1px solid #fff;
          object-fit: cover;
        }

        .fontStyle {
          font-size: 13px;

          color: #000000;
        }

        .btnCss {
          border: 1px solid #000;
          border-radius: 19px;
          width: 100%;
        }

        .noBtn {
          color: #818ca3;
          border: 1px solid #818ca3;
        }

        .yesBtn {
          color: #ffffff;
          background: var(--l_base);
        }
      `}</style>
    </div>
  );
};

export default UserAddress;
