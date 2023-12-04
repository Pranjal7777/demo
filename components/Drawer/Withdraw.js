import Wrapper from "../../hoc/Wrapper";
import Header from "../header/header";
import { open_drawer } from "../../lib/global";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import * as clr from "../../lib/color";
import useWalletData from "../../hooks/useWalletData";
import Img from "../ui/Img/Img";
import { useTheme } from "react-jss";
import Icon from "../image/icon";

export default function Withdraw(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [wallet] = useWalletData();

  return (
    <Wrapper>
      <div className="bg-dark-custom vh-100">
        <Header
          title={lang.withdraw}
          icon={env.backArrow}
          back={() => {
            props.onClose();
          }}
        />
        <div
          className="col-12"
          style={{ paddingTop: "70px" }}
        >
          <div className="col-12 p-0">
            <div className="row m-0 align-items-center justify-content-center walletBalanceCard">
              <div className="col-12 p-0 text-center">
                <p className="m-0 fntSz15 txt_whiteClr">{lang.balance}</p>
                <h4 className="m-0 txt-heavy txt_whiteClr d-flex align-items-center justify-content-center">
                  <span>
                    {wallet &&
                      wallet.walletData.length &&
                      wallet.walletData[0].currency_symbol}{" "}
                  </span>
                  <span>
                    {wallet &&
                      wallet.walletData.length &&
                      wallet.walletData[0].balance}
                  </span>
                </h4>
                <div className="row m-0 align-items-center justify-content-center greyBtmBorder">
                  <div className="col-9 my-3">
                    <button
                      type="button"
                      className="btn btn-default transBgBtn"
                      onClick={() => open_drawer("withDrawalLogs", {}, "right")}
                    >
                      {lang.withdrawalLogs}
                    </button>
                  </div>
                </div>
                <div className="row m-0 pt-2 align-items-center justify-content-start">
                  <div className="col-3 pr-0">
                    <Img src={env.Withdraw_Methods_Icon} className="mt-2"></Img>
                  </div>
                  <div className="col-9 px-2 text-left">
                    <h6 className="m-0 txt_whiteClr">{lang.withdrawMethods}</h6>
                    <p className="m-0 fntSz13 lightWhiteClr">
                      {lang.withdrawMethodsMsg}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 py-3">
          <button
            type="button"
            className="btn btn-default greyBgBsClrBtn"
            data-dismiss="modal"
            data-toggle="modal"
            onClick={() =>
              open_drawer("BankDetails", {
                getStripe: props.getStripe,
                account: props.account,
                getUserTransactions: props.getUserTransactions,
              },
                "right"
              )
            }
          >
            <p className="m-0 d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center justify-content-start">
                <Icon
                  icon={`${env.Bank_Icon}#bank_icon`}
                  color={theme.appColor}
                  size={30}
                  class="mr-2"
                  viewBox="0 0 30 30"
                />
                {lang.bankAccounts}
              </span>
              <span>
                <Img src={env.DOWN_ARROW_PRIMARY} alt="Arrow Primary"
                />
              </span>
            </p>
          </button>
          {/* <button
            type="button"
            className="btn btn-default greyBgBsClrBtn my-3"
            data-dismiss="modal"
            data-toggle="modal"
          >
            <p className="m-0 d-flex align-items-center justify-content-between">
              <span>
                <Img src={env.Paypal_Icon} className="payPalIcon"></Img>
                {lang.paypal}
              </span>
              <span>
                <Img src={env.Right_Chevron_Icon} width="11"></Img>
              </span>
            </p>
          </button>*/}
        </div>
      </div>

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .walletBalanceCard {
            background: ${theme.palette.l_base};
            padding: 20px 0;
            border-radius: 13px;
          }
          .greyBtmBorder {
            border-bottom: 1px solid ${clr.GREY_COLOR_2};
          }
          .lightWhiteClr {
            color: ${clr.WHITE_COLOR_1};
          }
          .bankIcon {
            width: 20%;
            margin-bottom: 3px;
            margin-right: 12px;
          }
          .payPalIcon {
            width: 28%;
            margin-bottom: 3px;
            margin-right: 12px;
          }
        `}
      </style>
    </Wrapper>
  );
}
