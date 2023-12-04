import React, { useEffect, useState } from "react";
import { open_dialog, open_drawer, startLoader, stopLoader, Toast } from "../../lib/global";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import find from "lodash/find";
import RadioButton from "../formControl/Radio";
import { deleteStripeAccountAPI, getConnectAccount, getPgCountryAPI } from "../../services/payments";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
import { useTheme } from "react-jss";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { getCookie, setCookie } from "../../lib/session";
import isEmpty from "lodash/isEmpty";
import usePg from "../../hooks/usePag";
const Button = dynamic(() => import("../button/button"), { ssr: false });
const Icon = dynamic(() => import("../image/icon"), { ssr: false });

const CardTile = (props) => {
  let { selected, last4, selectBank, id, theme } = props;

  return (
    <div
      className="row mb-3 align-items-center"
      onClick={() => {
        selectBank(id);
      }}
    >
      <div className="col-auto pr-1">
        <div className="card-radio">
          <RadioButton checked={selected}></RadioButton>
        </div>
      </div>
      <div className="col-auto pl-0 pr-0 row align-items-center mx-0">
        <Icon
          icon={`${env.Bank_Icon_card}#bank_account_icon`}
          color={theme.appColor}
          size={40}
          viewBox="0 0 40 25.005"
        />
      </div>
      <div className="col">
        <h6 className="w-400  fntSz18 mb-0">xxxx xx {last4}</h6>
      </div>
      <div
        className="col-auto"
        onClick={(e) => {
          e.stopPropagation();
          open_drawer("accountDetails", { ...props }, "right");
        }}
      >
        <Image src={env.next_arch} alt="SVG Image for Next Arch" width={10} />
      </div>
    </div>
  );
};

export default function BankDetails(props) {
  // const { account = {} } = props;
  const theme = useTheme();
  const [countryCode, setCountryCode] = useState();
  const [currencyCode, setCurrencyCode] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [account, setAccount] = useState(props.account || {});
  const { external_accounts = {} } = account;
  const [pg] = usePg();
  const getDefaultExternalAccount = () => {
    let data =
      external_accounts &&
      external_accounts.data &&
      external_accounts.data.length > 0 &&
      external_accounts.data.filter((data) => data.default_for_currency);

    if (data && data.length > 0) {
      return data[0].id;
    }
    return "";
  };

  // console.log("props", props)

  const [bank, selectBank] = useState(getDefaultExternalAccount());
  const [lang] = useLang();
  const [accountDetails, setAccDetails] = useState();
  const [validateAccount, setValidateAccount] = useState(!!Object.keys(account).length);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  var verified = false;

  if (props.account && Object.keys(props.account).length > 0) {
    let { individual = {} } = props.account;
    let { verification } = individual;
    if (verification.status) {
      verified = true;
    } else {
      verified = false;
    }
  }

  const getStripe = async () => {
    try {
      let accounts = await getConnectAccount();
      setAccount(accounts.data.data);
    } catch (e) {
      console.error("ERROR IN getStripe", e);
      setAccount(props.account || {});
    }
  };

  const deleteConfirmation = () => {
    open_drawer("confirmDrawer", {
      title: lang.confirmDeleteStripe,
      subtitle: lang.cantBeOndone,
      cancelT: 'Cancel',
      submitT: 'Delete',
      yes: deleteStripeAccount,
      closeAll: true,
    }, "bottom");
  };

  const deleteStripeAccount = async () => {
    try {
      startLoader();
      const res = await deleteStripeAccountAPI();
      if (res.status === 200) {
        Toast(lang.accountDeleted, "success");
        setValidateAccount(false);
        setAccount({});
      }
      stopLoader();
      window.location.reload()

    } catch (err) {
      stopLoader();
      console.error("ERROR IN deleteStripeAccount", err);
      Toast(err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    } else {
      getStripAccount();
    }

    setToggleDrawer(true);
  }, []);

  const getStripAccount = async () => {
    try {
      const data = await getConnectAccount();
      setAccount(data.data.data);

    } catch (err) {
      console.error("ERROR IN addAccount");
    };
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

  const getStripeAccounts = async () => {
    if (isEmpty(account)) {
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

  return (
    <Wrapper>
      <div className="bg-dark-custom wrap d-flex flex-column">
        <div>
          <Header
            title={lang.bankDetails}
            icon={env.backArrow}
            back={() => {
              props.onClose();
            }}
          />
          <div
            className="col-12"
            style={{
              paddingTop: "70px",
            }}
          >
            <div
              className="col-12 stipeAccDiv px-0"
              onClick={() => {
                if (verified) return
                open_drawer("AddStripeAcc",
                  { getStripe, getStripeAccounts },
                  "right"
                )
              }
              }
            >
              <div className="row m-0 px-3 align-items-center justify-content-start">
                {verified ? (
                  <div className="col-2 text-center p-0">
                    <Img src={env.Verified_Icon} width="20" />
                  </div>
                ) : ""}
                <div className="col p-0">
                  <div className="d-flex align-items-center justify-content-start myClass">
                    <Img
                      src={env.Stripe_Account}
                      className="bankIcon"
                      alt="Bank Icon"
                    />
                    <div className="px-2">
                      <h6
                        className={`m-0 ${theme.type == "light" ? "fontgreyClr" : "text-white"
                          } txt-heavy`}
                      >
                        {lang.stripeAccount}
                      </h6>
                      <p
                        className={
                          verified
                            ? "m-0 base_success_clr fntSz13"
                            : "m-0 dv_base_color fntSz13"
                        }
                      >
                        {verified ? `${lang.verified}` : `${lang.unverified}`}
                      </p>
                    </div>
                    {verified && (
                      <div className="col-auto">
                        <Tooltip title={lang.deleteStripeAccount}>
                          <IconButton
                            onClick={deleteConfirmation}
                            className="capsule_item_filled ">
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
                {verified
                  ? "" : (
                    <div className="col-2 text-center p-0">
                      <Img
                        src={env.DOWN_ARROW_PRIMARY}
                        alt="Down Arrow Primary"
                      />
                    </div>
                  )}
              </div>
              {verified ? (
                <div className="row m-0 mt-3 px-3 align-items-center justify-content-center greyTopBorder">
                  <div className="col-10 p-0">
                    <Button
                      type="button"
                      fclassname="mt-2"
                      cssStyles={theme.blueBorderButton}
                      onClick={() =>
                        open_drawer("AddBankAcc",
                          {
                            getStripe,
                            countryCode: countryCode,
                            currencyCode: currencyCode,
                            currencySymbol: currencySymbol
                          },
                          "right"
                        )
                      }
                    >
                      {lang.addAccount}
                    </Button>
                  </div>
                </div>
              ) : ""}
            </div>
          </div>
        </div>
        <div className="h-100 overflow-auto">
          <div className="col-12 pt-3">
            <p className="m-0 txt-heavy">{lang.bankAccounts}</p>
            <div className="pt-3">
              {external_accounts &&
                external_accounts.data &&
                external_accounts.data.length > 0 ? (
                external_accounts.data.map((card, i) => {
                  return (
                    <div key={i}>
                      <CardTile
                        selected={card.id == bank}
                        selectBank={selectBank}
                        {...card}
                        theme={theme}
                        getStripe={getStripe}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="vh-50 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <Img src={env.DV_Bank_Icon} alt="Bank Icon" />
                    <p className="m-0 mt-3">{lang.noBankAccounts}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="my-4 px-3">
          <Button
            disabled={!bank}
            type="button"
            cssStyles={theme.blueButton}
            onClick={() => {
              open_drawer(
                "WithDrawanDialog",
                {
                  id: bank,
                  bankAccounts: find(external_accounts.data, { id: bank }),
                  getUserTransactions: props.getUserTransactions,
                  account: props.account,
                },
                "right"
              );
              // handleAddCards();
            }}
          >
            {lang.next}
            {/* {lang.confirmPay} */}
          </Button>
        </div>
      </div>

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .stipeAccDiv {
            padding: 15px 0;
            background-color: ${theme.type == "light"
            ? theme.palette.l_app_bg
            : theme.palette.d_app_bg};
            border-radius: 13px;
            border: 1px solid ${theme.type === "light" ? "#000" : "#c9c9c9"};
          }
          .greyTopBorder {
            border-top: 1px solid ${theme.palette.l_grey_border};
          }
          :global(.capsule_item_filled){
            background-color:var(--l_base)!important;
            color:var(--white)!important;
          }
        `}
      </style>
    </Wrapper>
  );
}
