import React, { useState } from "react";
import * as env from "../../lib/config";
import Img from "../../components/ui/Img/Img";
import useLang from "../../hooks/language"

const CardTile = (props) => {
  let { selected, last4 } = props;

  return (
    <div onClick={props.onClick.bind(null, props)}>
      <div
        className={`d-flex flex-wrap mb-0 bank-tile ${selected && "bank-seleted"
          }`}
      >
        <div className="row m-0 align-items-center">
          <div>
            <Img src={env.Bank_Icon} className="bank-image-icon" />
          </div>
          <div className="ml-3 dv__fnt16 txt-heavy viewText">
            xxxx xxxx xxxx {last4 || 3452}
          </div>
        </div>

        <div>
          {!props.default_for_currency && (
            <Img
              className="bank-delete-image"
              src={env.Delete_Red}
              onClick={
                props.deleteAccount
                  ? (e) => {
                    props.deleteAccount({ card: "bank", id: props.id });
                    e.stopPropagation();
                  }
                  : () => { }
              }
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .bank-tile {
          cursor: pointer;
          border: 1px solid lightgrey !important;
          width: 31.551vw;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          padding: 8px 10px;
          background-color: #f3f3f3 !important;
          margin-right: 15px;
          border-radius: 4px;
          color: black;
          font-weight: 600 !important;
          height: 2.66vw;
        }
        :global(.bank-delete-image) {
          width: 15px;
        }
        :global(.bank-image-icon) {
          height: 15px;
        }
        .bank-seleted {
          border: 1px solid grey !important;
          background-color: lightgrey;
        }
        @media (min-width: 700px) and (max-width: 991.98px){
          .bank-tile {
            height: unset;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

const Card = (props) => {
  return (
    <div className="wallet-bank-tile">
      <div
        className="d-flex w-100 flex-wrap align-items-center"
        onClick={props.onClick}
      >
        <label className="dv__RadioContainer ml-0 mr-3 mb-0 d-flex  justify-content-center align-items-center">
          <input
            id={props.lable}
            type="radio"
            name={props.name}
            value={props.value}
            checked={props.checked}
          />
          <span className="checkmark" />
        </label>
        <label htmlFor={props.lable} className="mb-0 cursorPtr">
          <p
            className={`mb-0 ${props.checked && props.lableColor ? "innerText1" : "innerText"
              }`}
          >
            <CardTile {...props} />
          </p>
        </label>
      </div>

      <style jsx>
        {`
          :global(.wallet-bank-tile .bank-tile) {
            margin-bottom: 0px !important;
            margin-right: 0px !important;
            width: 350px;
            background-color: #b7b7b7;
          }
          .innerText {
            color: black;
            font-weight: 500;
            font-size: 0.8rem;
            margin-bottom: 0px !important;
          }
          .margin-left-37 {
            margin-left: 37px;
          }
        `}
      </style>
    </div>
  );
};

const Banks = (props) => {
  const [lang] = useLang();
  let { banks, btnDisable, errorMsg, amount, withDrawAmount } = props;

  let [selectedBank, setBank] = useState();

  return (
    <>
      <div className="col-12 row m-0 p-0">
        {banks && banks.map((bank, index) => {
          return (
            <div
              key={index}
              className="d-flex align-item-center pb-2 mb-2 mr-4"
            >
              <Card
                onClick={() => {
                  setBank(bank.id);
                }}
                value={bank.id}
                checked={bank.id == selectedBank}
                label={`bank_${index}`}
                name="bank_account"
                key={index}
                {...bank}
                deleteAccount={props.deleteAccount}
              />
            </div>
          );
        })}
      </div>

      {/* {selectedBank && props.amount && (
        <h6
          className="txt-roman pb-2 mb-0 dv__fnt12 dv__red_var_1"
          style={{ marginLeft: "3vw" }}
        >
          {props.feeMsg}
        </h6>
      )} */}

      <div className="d-flex justify-content-end">
        <div className="mx-1" style={{ width: "100px" }}>
          <button
            // disabled={!parseInt(props.amount)}
            disabled={!selectedBank || errorMsg === "error" || !amount}
            onClick={withDrawAmount}
            className="dv__blueBgBtn btn btn-default my-3"
            style={{ width: "fit-content", padding: "10px 20px 10px 20px" }}
          >
            {lang.continue}
          </button>
        </div>
      </div>
    </>
  );
};

export default Banks;
