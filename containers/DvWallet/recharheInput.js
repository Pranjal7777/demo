const RechargeInputSection = (props) => {
  let { defaultCurrency, currency, balance, amount, handleInput } = props;
  return (
    <div>
      <div className="pb-2 recharge-wallet-section">
        <h5 className="dv__Grey_var_1 dv__fnt12 mb-3 text-uppercase">
          {props.Withdraw ? "Withdraw amount" : "Enter Amount"}
        </h5>

        <div
          className="position-relative d-flex align-items-center pb-1"
          style={{ width: "29.282vw", height: "2.66vw" }}
        >
          <input
            onChange={handleInput}
            value={amount}
            type="number"
            // className="form-input"
            inputMode="decimal"
          // onKeyDown={(e) => NumberValidator(e)}
          />
          <div className="select-input-blox">
            <div className="txt-heavy dv__fnt18 dv__black_color">
              {currency}
            </div>
          </div>
        </div>
        <div className="mb-3">
          {props.recevingAmount && (
            <p className="mb-0 txt-roman dv__fnt14 pt-2 dv__grren_var_1">
              Receving Amount : $ {props.recevingAmount}
            </p>
          )}
          {!props.recevingAmount && props.error && props.amount && (
            <p className="mb-0 txt-roman dv__fnt14 pt-2 dv__red_var_1">
              {props.error}
            </p>
          )}
        </div>
      </div>
      <style jsx>{`
        .wallet-blace-text {
          color: red;
          font-size: 0.65rem;
          margin-top: 2.5px;
        }

        .select-input-blox {
          position: absolute;
          right: 1px;
          min-width: 72px;
          height: 96%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaeaea;
        }
        :global(.recharge-wallet-section input) {
          width: 29.282vw;
          height: 2.66vw !important;
          color: #000000 !important;
          padding-left: 25px !important;
          padding-right: 86px !important;
          font-weight: 600;
          font-size: 1rem !important;
          border-radius: 1px !important;
          border-radius: 3px !important;
          border: 1px solid #c4c4c4;
          font-family: "Roboto", sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default RechargeInputSection;
