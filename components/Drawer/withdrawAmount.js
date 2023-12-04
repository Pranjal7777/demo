import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import moment from "moment";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { InputAdornment, TextField } from "@material-ui/core";

import useLang from "../../hooks/language";
import Icon from "../image/icon";
import { Bank_Icon_card } from "../../lib/config";
import { getPgCountryAPI, getWallteTransaction, withDrawMoney } from "../../services/payments";
import {
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getCookie, getCookiees } from "../../lib/session";
import useWalletData from "../../hooks/useWalletData";
import usePg from "../../hooks/usePag";
import { getWallet } from "../../redux/actions";
import isMobile from "../../hooks/isMobile";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });


const WithdrawAmount = (props) => {
  const [pg] = usePg();
  const [lang] = useLang();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [wallet] = useWalletData();

  const { bankAccounts = {}, account } = props;

  const [amount, setAmount] = useState("");
  const [recevingAmount, setRecevingAmount] = useState("");
  const [error, setError] = useState("");
  const symbol =
    wallet && wallet.walletData.length && wallet.walletData[0].currency_symbol;
  const walletId =
    wallet && wallet.walletData.length && wallet.walletData[0].walletid;
  const walletBalance =
    wallet && wallet.walletData.length && wallet.walletData[0].balance;
  const currency =
    wallet && wallet.walletData.length && wallet.walletData[0].currency;

  const [balance, setBalance] = useState(walletBalance || 0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const [countryCode, setCountryCode] = useState();
  const [currencyCode, setCurrencyCode] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();

  // const Currency = getCookie("currency");
  // const usersCurrencyCode = getCookie("currencyCode");
  // const usersCountryCode = getCookie("stripeCountryCode");

  const [exchangeRate, setExchangeRate] = useState("");
  const [appCommission, setAppCommission] = useState("");
  const [appCommissionDeducted, setAppCommissionDeducted] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const pgId = typeof pg[0] != "undefined" ? pg[0].pgId : "";
  const pgName = typeof pg[0] != "undefined" ? pg[0].pgName : "";

  const getAmount = async (value) => {
    try {
      const data = await getWallteTransaction(value, walletId, currencyCode, countryCode);

      setError("");
      setRecevingAmount(data.data.data.netPay);
      setTotalAmount(data.data.data.totalAmount);

      setWithdrawAmount(data.data.data.withdrawAmount)
      setExchangeRate(data.data.data.exchangeRate)
      setAppCommission(data.data.data.withdrawChargeInPer)
      setAppCommissionDeducted(data.data.data.appCommission)
    } catch (e) {
      setError(e?.response?.data?.message);
      setBtnDisable(true);
    }
  }

  // const getAmount = useCallback(
  //   debounce((value) => {
  //     getWallteTransaction(value, walletId, currencyCode, countryCode)
  //       .then((data) => {
  //         setError("");
  //         setRecevingAmount(data.data.data.netPay);
  //         setTotalAmount(data.data.data.totalAmount);
  //         setWithdrawAmount(data.data.data.withdrawAmount)
  //         setExchangeRate(data.data.data.exchangeRate)
  //         setAppCommission(data.data.data.withdrawChargeInPer)
  //         setAppCommissionDeducted(data.data.data.appCommission)
  //         // this.setState({
  //         //   balance: wallet.data.data.withdrawAmount,
  //         // });
  //       })
  //       .catch((e) => {
  //         setError(e?.response?.data?.message);
  //         setBtnDisable(true);
  //       });
  //   }, 500),
  //   [] // will be created only once initially
  // );

  const handleInput = (e) => {
    let value = e.target.value;

    // let pending = parseFloat(balance) - parseFloat(value || 0);

    // if (pending < 0) {
    //   return;
    // }

    value > 0 && value <= walletBalance ? setBtnDisable(false) : setBtnDisable(true);

    setError("");
    setRecevingAmount("");
    setTotalAmount("");
    setBalance(value);
    setAmount(value);
    getAmount(value);
  };

  const userWithDrowMoney = async (bank) => {
    // let { id } = accountDetails;
    let userId = getCookiees("uid");
    try {
      let requestPayload = {
        pgId: pgId,
        bankId: bankAccounts.account,
        amount: amount,
        withdrawCurrency: currencyCode,
        pgName: pgName,
        autoPayout: true,
        walletId: walletId,
        withdrawAmount: recevingAmount,
        countryCode: countryCode
      };

      startLoader(true);
      let data = await withDrawMoney(requestPayload);

      dispatch(getWallet());
      open_drawer("paymentSuccess", {
        getUserTransactions: props.getUserTransactions,
        id: data.data.data.txnId,
        type: 7,
        text: "Withdrawal request submitted successfully",
        rechargeMode: data.data.data.notes,
        amount,
        currency,
        time: moment(data.data.data.createdAt).format("DD MMM YY ,h:mm a"),
        mobileView,
        theme,
      },
        "right"
      );
      setBalance("");
      setAmount("");
      setError("");
      setRecevingAmount("");
      stopLoader(false);
      setTotalAmount("");
    } catch (e) {
      stopLoader(false);
      console.error("ERROR IN userWithDrowMoney", e);
      Toast(e, "error");
    }
  };

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

  return (
    <div className="bg-dark-custom wrap d-flex flex-column text-app">
      <div>
        <Header title={lang.withdrawMoney} back={props.onClose}></Header>
        <div className="col-12" style={{ paddingTop: "70px" }}>
          <div className="col-12 mb-3 align-items-center py-4 bg-white card-detail">
            <div className="row justify-content-between align-items-center mb-3">
              <div className="col-auto">
                <h6 className="fntSiz12 mb-0 text-left ashColor">
                  Receiving Account
                </h6>
              </div>
              <div className="col-auto">
                <div className="customAnch" onClick={props.onClose}>
                  Change
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-auto pr-0">
                {/* <Img src={Bank_Icon_card} height="30px" /> */}
                <Icon
                  icon={`${Bank_Icon_card}#bank_account_icon`}
                  color={theme.appColor}
                  size={40}
                  viewBox="0 0 40 25.005"
                />
              </div>
              {/* <div className="col"> */}
              <div className="d-flex align-items-center pl-3">
                <h6 className="baseColor fntSz18 mb-0">
                  xxxx xxxx xxxx {bankAccounts.last4}
                </h6>
              </div>
            </div>
            {/* <p className="mb-0 fntSz10 redClr">
              Withdraw to bank account with a withdrawal fee of 0.1%
            </p> */}
          </div>
        </div>
        <div className="row mx-0 mt-4 mb-3">
          <div className="col-12">
            {/* <h6 className="fntSz14 mb-2 text-left ashColor">
              Withdrawal Amount
            </h6>
            <div className="form-group mb-1 mt-1">
              <input
                onChange={handleInput}
                value={amount}
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter the amount"
                className="form-control rechargeControl"
                defaultValue={250}
              />
              <span className="currencyChange">
                <div className="customAnch">
                  {currency}
                  <span className="pr-1" />{" "}
                </div>
              </span>
            </div> */}

            <TextField
              label={lang.withdrawalAmount}
              InputProps={{
                endAdornment: <InputAdornment color="primary" position="end">{currency}</InputAdornment>
              }}
              placeholder={lang.withdrawalAmount}
              onChange={handleInput}
              value={amount}
              min="0"
              inputMode="numeric"
              fullWidth
            />

            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                {recevingAmount && (
                  <>
                    <p className="m-0 fntSz12 text-capitalize">{lang.withdrawAmount}:{" "}{currencySymbol}{" "}{withdrawAmount}</p>
                    <p className="m-0 fntSz12 text-capitalize">{lang.exchangeRate}:{" "}{exchangeRate}</p>
                    <p className="m-0 fntSz12 text-capitalize">{lang.appCommission}:{" "}{appCommission}{"%"}</p>
                    <p className="m-0 fntSz12 text-capitalize">{lang.appCommissionDeducted}:{" "}{currencySymbol}{" "}{appCommissionDeducted}</p>
                    <p className="mb-0 fntSz11 ashColor">
                      Receving Amount : $ {recevingAmount}
                    </p>
                  </>
                )}
                {!recevingAmount && error && amount && (
                  <p className="mb-0 fntSz11 text-danger">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="posBtm">
          <Button
            disabled={!amount}
            type="submit"
            onClick={(e) => {
              open_drawer(
                "confirmDrawer",
                {
                  yes: () => {
                    userWithDrowMoney();
                  },
                  title: "Are you sure want to withdraw the money ?",
                },
                "bottom"
              );
              // sendTip();
            }}
            cssStyles={theme.blueButton}
          >
            {lang.submit}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawAmount;
