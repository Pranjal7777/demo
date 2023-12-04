import React from "react";
import * as config from "../../../lib/config";

const ProductListTag = (props) => {
  const productTag = [1, 2, 3, 4, 5];

  return (
    <div className="">
      <div className="d-flex col-12 align-items-center borderCss">
        <div className="col px-0 fntSz17 py-3 font-weight-700">
          Tagged Products (5)
        </div>
        <div
          className="col-auto px-0 "
          onClick={() => {
            props.onClose();
          }}
        >
          <img src={config.P_CLOSE_ICONS} />
        </div>
      </div>

      {productTag.map((pro, index) => (
        <div className="col-12 d-flex py-2 borderCss">
          <div className="col-auto px-0 position-relative">
            <img
              src="https://cdn.shoppd.net/products/0/0/small/Roadster-Men-Navy-Beige-Regular-Checked-Casual-Shirt_1611332702.jpeg"
              className="productTagCss"
            />
            <div className="counterCss">5</div>
          </div>
          <div className="col">
            <p className="m-0 fntSz13 font-weight-500">
              Nike mens NikeChroma Thong
            </p>
            <p className="m-0 fntSz14 font-weight-700">$2,999.99</p>
            <p className="m-0 cancelPrice">$4.99</p>
          </div>
          <div className="d-flex align-items-center col-auto pr-0">
            <div className="buyBtn">Buy Now</div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .productTagCss {
          width: 75px;
          height: 75px;
          object-fit: contain;
          border: 1px solid #c0c0c0;
          padding: 5px;
        }

        .cancelPrice {
          font-size: 11px;
          text-decoration: line-through;
          color: #8c959d;
        }

        .buyBtn {
          border: 1px solid;
          border-radius: 5px;
          padding: 10px 2px;
          font-size: 10px;
          width: 68px;
          text-align: center;
          font-weight: 700;
          color: #fff;
          background: var(--l_base);
        }

        .borderCss {
          border-bottom: 3px solid #eaeae8;
        }

        .counterCss {
          width: 17px;
          text-align: center;
          top: 4px;
          left: 5px;
          position: absolute;
          background: #221717c2;
          color: #fff;
          font-size: 10px;
          border-radius: 15px;
          padding: 1px;
        }
      `}</style>
    </div>
  );
};

export default ProductListTag;
