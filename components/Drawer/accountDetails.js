import React from "react";
import { open_drawer, startLoader, stopLoader, Toast } from "../../lib/global";
import { deleteExternal } from "../../services/payments";
import useLang from "../../hooks/language"
import dynamic from "next/dynamic";
const Header = dynamic(()=>import("../header/header"),{ssr:false});
const Button = dynamic(()=>import("../button/button"),{ssr:false});
import { useTheme } from "react-jss";

const AccountDetails = (props) => {
  const theme = useTheme();
  const [lang] = useLang();

  return (
    <div className="d-flex flex-column bg-dark-custom h-100 text-app">
      <div>
        <Header back={props.onClose} title={"Bank details"}></Header>
        <div className="bank-account col-12 pt-4 mt-1">
          <p className="fntSz16 blue3 mb-3">Account Number</p>
          <p className="acount-details text-app fntSz18">
            xxxx xxxx xxxx {props.last4}
          </p>
        </div>
      </div>
      <div className="posBtm">
        <Button
          type="submit"
          disabled={props.default_for_currency}
          onClick={(e) => {
            e.preventDefault();
            // handleGetAddress();
            open_drawer(
              "confirmDrawer",
              {
                title: lang.dltBankAccount,
                yes: () => {
                  startLoader();
                  deleteExternal({
                    accountId: props.id,
                  })
                    .then(() => {
                      props.onClose();
                      stopLoader();
                      props.getStripe && props.getStripe();
                    })
                    .catch((e) => {
                      stopLoader();
                      Toast(e.response.data.message, "error");
                    });
                },
              },
              "bottom"
            );
            // sendTip();
          }}
          cssStyles={theme.blueButton}
        >
          {"Delete Account"}
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
