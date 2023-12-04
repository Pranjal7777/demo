import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { useTheme } from "react-jss";
import moment from "moment";
import { FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Tooltip } from "@material-ui/core";

import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { defaultCurrency, defaultCurrencyCode, DV_Bank_Icon, Right_Chevron_Icon_Grey, Stripe_Account, Verified_Icon } from "../../lib/config";
import {
  close_dialog,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import {
  deleteExternal,
  getConnectAccount,
  getPgCountryAPI,
  getWallteTransaction,
  withDrawMoney,
} from "../../services/payments";
import Bank from "./bankTile";
import Img from "../../components/ui/Img/Img";
import usePg from "../../hooks/usePag";
import useWalletData from "../../hooks/useWalletData";
import { getWallet } from "../../redux/actions";
import Button from "../../components/button/button"
import  DeleteOutline  from "@material-ui/icons/DeleteOutline";
import { getCookie } from "../../lib/session";

export default function DvWithdrawMoney(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [wallet] = useWalletData();
  const dispatch = useDispatch();
  const [pg] = usePg();
  // const usersCountryCode = account.country;
  const [countryCode, setCountryCode] = useState();
  const [currencyCode, setCurrencyCode] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [account, setAccount] = useState(props.account || {});
  const [amount, setAmount] = useState();

  let { external_accounts = {} } = account;

  const pgId = typeof pg[0] != "undefined" ? pg[0].pgId : "";
  const pgName = typeof pg[0] != "undefined" ? pg[0].pgName : "";
  const symbol =
    wallet &&
    wallet.walletData &&
    wallet.walletData.length &&
    wallet.walletData[0].currency_symbol;
  const walletId =
    wallet &&
    wallet.walletData &&
    wallet.walletData.length &&
    wallet.walletData[0].walletid;
  const walletBalance =
    wallet &&
    wallet.walletData &&
    wallet.walletData.length &&
    wallet.walletData[0].balance;
  const currency =
    wallet &&
    wallet.walletData &&
    wallet.walletData.length &&
    wallet.walletData[0].currency;

  const [totalAmount, setTotalAmount] = useState(0);
  const [balance, setBalance] = useState(walletBalance || 0);
  const [receivingAmount, setReceivingAmount] = useState("");
  const [verified, setVerification] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [exchangeRate, setExchangeRate] = useState("");
  const [appCommission, setAppCommission] = useState("");
  const [appCommissionDeducted, setAppCommissionDeducted] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");


  const [errorMsg, setErrorMsg] = useState({
    msg: "",
    status: "",
  });

  useEffect(() => {
    getStripeAccount();
  }, [props.account, props.validateAccount]);

  useEffect(() => {
    external_accounts = account.external_accounts;
    if (account && Object.keys(account).length > 0) {
      let { individual = {} } = account;
      let { verification } = individual;
      if (verification?.status) {
        setVerification(true);
        props.setValidateAccount(true);
      } else {
        setVerification(false);
        props.setValidateAccount(false);
      }
    }
  }, [account]);

  useEffect(() => {
    getCountryList();
  }, [account])

  const getCountryList = async () => {
    const PG_ID = typeof pg[0] != "undefined" ? pg[0].pgId : "";

    try {
      startLoader();
      const res = await getPgCountryAPI(PG_ID);
      const localCountries = res.data.data;
      localCountries.map((country) => {
        if (country.countryCode === account.country) {
          const currency = country.currencies
          currency.map((currency) => {
            const countryCurrencies = currency.symbol
            const countryCurrenciesCode = currency.code
            setCurrencySymbol(countryCurrencies)
            setCurrencyCode(countryCurrenciesCode)
            setCountryCode(account.country)
          })
        }
      })
      stopLoader();

    } catch (err) {
      stopLoader();
      console.error("ERROR IN getCountryList", err);
    }
  };

  const getStripeAccount = async () => {
    if (isEmpty(props.account)) {
      try {
        startLoader();
        let accounts = await getConnectAccount();
        setAccount(accounts?.data?.data);
        stopLoader();
      } catch (err) {
        console.error("ERROR IN getStripeAccount", err);
        setAccount(props.account || {});
        setVerification(false);
        stopLoader();
      }
    } else {
      setAccount(props.account);
    }
  }

  const userWithDrowMoney = async (bank) => {
    let { id } = account;
    try {
      let requestPayload = {
        pgId: pgId,
        bankId: id,
        amount: amount,
        withdrawCurrency: currencyCode,
        pgName: pgName,
        autoPayout: true,
        walletId: walletId,
        withdrawAmount: withdrawAmount,
        countryCode: countryCode
      };

      startLoader();
      let data = await withDrawMoney(requestPayload);

      dispatch(getWallet());
      open_dialog("paymentSuccess", {
        id: data.data.data.txnId,
        type: 7,
        text: "Withdrawal request submitted successfully",
        rechargeMode: data.data.data.notes,
        amount,
        currencySymbol,
        time: moment(data.data.data.createdAt).format("DD MMM YY ,h:mm a"),
        theme,
      },
        "right"
      );
      setBalance("");
      setAmount("");
      setReceivingAmount("");
      stopLoader();
      setTotalAmount("");
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const withDrawAmount = (bank) => {
    open_dialog("confirmDialog", {
      title: lang.withdrawMoney,
      subtitle: lang.confirmWithdraw,
      b1Text: lang.no,
      b2Text: lang.yes,
      yes: () => {
        userWithDrowMoney(bank);
        close_dialog();
      },
    });
  };

  const deleteAccount = (data) => {
    open_dialog("confirmDialog", {
      title: lang.dltBankAccountTxt,
      subtitle: lang.dltBankAccount,
      submitT: lang.delete,
      yes: async () => {
        startLoader();
        try {
          await deleteExternal({
            accountId: data.id,
          });
          props.getStripe && props.getStripe();
          getStripeAccount()
        } catch (e) {
          Toast(e.response.data.message, "error");
        }
        stopLoader();
        close_dialog("confirmDialog");
      },
    });
  };

  const bankAccounts = () => {
    let { external_accounts = {} } = account;
    let { data } = external_accounts;

    return (
      <div className="mt-2 pt-1">
        <Bank
          withDrawAmount={withDrawAmount}
          amount={amount}
          deleteAccount={deleteAccount}
          banks={data}
          btnDisable={btnDisable}
          errorMsg={errorMsg.status}
        />

        {/* <div className="d-flex justify-content-end">
          <div style={{ width: "100px" }}>
            <Button
              type="button"
              cssStyles={theme.blueButton}
              onClick={withDrawAmount}
              disabled={errorMsg.status === "error" || !amount}
            >
              {lang.continue}
            </Button>
          </div>
        </div> */}
      </div>
    );
  };

  const getValue = async (value) => {
    try {
      const res = await getWallteTransaction(value, walletId, currencyCode, countryCode);

      if (res.status == 200) {
        setErrorMsg({
          msg: `receiving amount: ${currencySymbol}${" "}${res.data.data.netPay}`,
          status: "success"
        });

        setWithdrawAmount(res.data.data.withdrawAmount)
        setExchangeRate(res.data.data.exchangeRate)
        setAppCommission(res.data.data.withdrawChargeInPer)
        setAppCommissionDeducted(res.data.data.appCommission)

        setBalance(value);
        // setReceivingAmount(res.data.data.withdrawAmount);
        setTotalAmount(res.data.data.totalAmount);
      }

    } catch (err) {
      setErrorMsg({
        msg: err?.response?.data?.message,
        status: "error",
      });
      console.error("ERROR IN getValue", err);
    }
  }

  const handleAmount = (e) => {
    const value = e.target.value;
    setAmount(e.target.value);
    getValue(value);
  }

  const WithdrawInput = () => {
    return (
      <div className="d-flex justify-content-between">
        <FormControl fullWidth variant="outlined">
          <InputLabel
            className="dv_primary_color"
            htmlFor="outlined-adornment-amount">
            {lang.withdrawAmount}
          </InputLabel>
          <OutlinedInput
            value={amount}
            onChange={(e) => handleAmount(e)}
            className="dv_primary_color"
            startAdornment={<InputAdornment className="dv_primary_color" position="start">{defaultCurrency}</InputAdornment>}
            inputMode="decimal"
            type="number"
            placeholder="0.00"
            error={errorMsg.status === "error"}
            labelWidth={130}
          />
          {errorMsg.status === "success" && <p className="m-0 fntSz12 text-capitalize">{lang.withdrawAmount}:{" "}{currencySymbol}{" "}{withdrawAmount}</p>}
          {errorMsg.status === "success" && <p className="m-0 fntSz12 text-capitalize">{lang.exchangeRate}:{" "}{exchangeRate}</p>}
          {errorMsg.status === "success" && <p className="m-0 fntSz12 text-capitalize">{lang.appCommission}:{" "}{appCommission}{"%"}</p>}
          {errorMsg.status === "success" && <p className="m-0 fntSz12 text-capitalize">{lang.appCommissionDeducted}:{" "}{currencySymbol}{" "}{appCommissionDeducted}</p>}
          <p className={`m-0 fntSz12 text-capitalize ${errorMsg.status === "success" ? "text-success" : "text-danger"}`}>{" "}{errorMsg.msg}</p>
        </FormControl>
      </div>
    )
  }

  return (
    <Wrapper>
      <div className="col-12 py-3 px-0">
        {!isEmpty(account) &&
          !(
            external_accounts &&
            external_accounts.data &&
            external_accounts.data.length == 0
          ) && WithdrawInput()
        }
      </div>

      {isEmpty(account)
        ? <>
          {/* Stripe Account not created */}
          <h5
            className={`txt-roman dv__fnt18  ${theme?.type == "light" ? "dv__black_color" : "dv__white_color"}`}
            style={{ maxWidth: "99%" }}
          >
            {lang.addStripeAccMsg}
          </h5>
          <div className="mt-3 mb-4">
            <div className="row m-0">
              <div className="col-4 p-0">
                <Button
                  cssStyles={theme.dv_blueButton}
                  onClick={() => {
                    open_dialog("AddStripeAcc", {
                      getStripe: props.getStripe,
                      getStripeAccount,
                    });
                  }}
                >
                  {lang.connectStripeAccount}
                </Button>
              </div>
            </div>
          </div>
        </>
        : verified
          ? <>
            {/* Verified Stripe Account */}
            {external_accounts &&
              external_accounts.data &&
              external_accounts.data.length > 0
              ? bankAccounts()
              : <div className="text-center">
                <Img src={DV_Bank_Icon} alt="Bank Desktop Icon" />
                <p className={`txt-heavy ${theme.type == "light" ? "dv__black_color" : "dv__white_color"} dv__fnt18 mb-2`}>
                  {lang.bankAccounts}
                </p>
                <p className={`txt-roman ${theme.type == "light" ? "dv__black_color" : "dv__white_color"} dv__fnt14 txt-capitalize`}>
                  {lang.bankingServicesMsg}
                </p>
              </div>
            }

            <div className="mt-4 mb-5">
              <div className="row m-0 align-items-end justify-content-between">
                <div className="col-4 p-0">
                  <div className="d-flex align-items-center justify-content-start p-2 verifiedStripeSec">
                    <Img src={Stripe_Account} className="stripeIcon" alt="Stripe Account Image" />
                    <div className="px-2">
                      <h6 className="m-0 dv__Grey_var_2 dv__fnt16 txt-roman">
                        {lang.stripeAccount}
                      </h6>
                    </div>
                    <Img
                      src={Verified_Icon}
                      width="10px"
                      className="verifiedIcon"
                      alt="Verified Icon"
                    />
                  </div>
                </div>
                <div className="col-4 p-0">
                  <button
                    type="button"
                    onClick={() => {
                      open_dialog("AddBankAcc", {
                        getStripe: props.getStripe,
                        getStripAccount: getStripeAccount,
                        currencyCode: currencyCode,
                        countryCode: countryCode,
                        currencySymbol: currencySymbol
                      });
                    }}
                    className="btn btn-default dv__blueborderBtn px-3"
                    style={{
                      height: "3.221vw",
                      width: "13.420vw",
                      fontSize: "1.171vw",
                      borderRadius: "1.610vw",
                      fontFamily: "Roboto, sans-serif !important",
                      margin: "0 0 0 auto",
                    }}
                  >
                    {lang.addBankAccount}
                  </button>
                </div>
              </div>
              {props.activeLink === "withdraw" && props.validateAccount && (
                <div className="mt-3 mb-4">
                  <div className="row m-0">
                    <div className="col-4 p-0">
                      <Button
                        cssStyles={theme.dv_blueButton}
                        onClick={props.deleteConfirmation}
                      >
                        <DeleteOutline className="m" />
                        {lang.deleteStripeAccount}
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>
          </>
          : <>
            {/* unVerified Stripe Account */}
            <h5
              className={`txt-roman dv__fnt18 ${theme?.type == "light" ? "dv__black_color" : "dv__white_color"}`}
              style={{ maxWidth: "90%" }}
            >
              {lang.addStripeAccMsg}
            </h5>
            <div className="mt-3 mb-4">
              <div className="row m-0">
                <div className="col-4 p-0">
                  <div
                    className="d-flex align-items-center justify-content-start p-2 unverifiedStripeSec"
                    onClick={() => {
                      open_dialog("AddStripeAcc", {
                        getStripe: props.getStripe,
                        getStripeAccount,
                      });
                    }}
                  >
                    <Img src={Stripe_Account} className="stripeIcon" alt="Stripe Account Image" />
                    <div className="px-2">
                      <h6 className="m-0 dv__Grey_var_2 dv__fnt16 txt-roman">
                        {lang.stripeAccount}
                      </h6>
                    </div>
                    <Img
                      src={Right_Chevron_Icon_Grey}
                      className="chevronIcon"
                      alt="Right Chevron Icon Grey"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
      }

      <style jsx>
        {`
          :global(.stripeIcon) {
            width: 1.683vw;
            height: 1.683vw;
          }
          .unverifiedStripeSec {
            background: #ff00002f;
            border: 1px solid #ff0000;
            position: relative;
            border-radius: 5px;
            height: 2.635vw;
            cursor: pointer;
          }
          .verifiedStripeSec {
            background: #03a75121;
            border: 1px solid #03a751;
            position: relative;
            border-radius: 5px;
            height: 2.635vw;
          }
          :global(.verifiedIcon) {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 15px;
            width: 1.197vw;
          }
          :global(.unverifiedStripeSec .chevronIcon) {
            width: 9px;
            position: absolute;
            right: 10px;
          }
          @media (min-width: 700px) and (max-width: 991.98px){
            :global(.dv__blueborderBtn){
              font-size: calc(1.171vw + 3px)!important;
              height: unset !important;
            }
          }
          
        `}
      </style>
    </Wrapper>
  );
}
