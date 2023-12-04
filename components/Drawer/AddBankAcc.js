import { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import { TextField } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ErrorIcon from '@material-ui/icons/Error';

import {
  getLocationData,
  sendMail,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import useLang from "../../hooks/language";
import * as clr from "../../lib/color";
import { addBank, getBankFieldsAPI } from "../../services/payments";
import useProfileData from "../../hooks/useProfileData";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import { defaultCountry, defaultCurrencyCode } from "../../lib/config";
import usePg from "../../hooks/usePag";
import { getCookie } from "../../lib/session";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });

export default function AddBankAcc(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [pg] = usePg();
  const [profile] = useProfileData();
  const [mobileView] = isMobile();
  const { onClose, countryCode, currencySymbol, currencyCode } = props;

  const [fields, setFields] = useState([]);
  const [textFields, setTextFields] = useState({})
  const [valueFields, setValueFields] = useState({});
  const [isEnable, setIsEnable] = useState(true);

  useEffect(() => {
    getLocationData();
    getBankFields();
  }, []);

  useEffect(() => {
    // Function making dynamic TextFields according to Bank Account Response
    if (fields?.length) {
      fields.map((field) => {
        setTextFields((prev) => ({
          ...prev,
          [field.fieldName.replace(" ", "")]: ""
        }))
      })
    }
  }, [fields]);

  useEffect(() => {
    checkIsEnable();
  }, [textFields]);

  const checkIsEnable = () => {
    let myCount = 0;

    for (let key in textFields) {
      if (textFields[key] !== "") {
        myCount += 1;
      }
    }

    if (myCount === Object.keys(textFields).length) {
      setIsEnable(false);
    } else {
      setIsEnable(true);
    }
  };

  const getBankFields = async () => {
    const PG_ID = typeof pg[0] != "undefined" ? pg[0].pgId : "";

    const payload = {
      PG_ID,
      country: countryCode || defaultCountry,
    }

    try {
      startLoader();
      const res = await getBankFieldsAPI(payload);
      if (res.status === 200) {
        setFields(res.data.data);
      } else if (res.status === 204) {
        setFields("");
      }

      stopLoader();
    } catch (err) {
      stopLoader();
      console.error("ERROR IN getBankFields", err);
    }
  }

  const handleAddBankAcc = async () => {

    try {
      startLoader();
      let { email, username } = profile; // ?? not sure if it is profile data

      const payload = {
        email,
        // account_number: form.account.value,
        // routing_number: form.rNumber.value,
        account_holder_type: "individual",
        account_holder_name: username,
        country: countryCode || defaultCountry,
        currency: currencyCode || defaultCurrencyCode,
      };

      if (Object.keys(textFields).length === 1) {
        payload.account_number = Object.values(textFields)[0];
      } else if (Object.keys(textFields).length === 2) {
        payload.account_number = Object.values(textFields)[0];
        payload.routing_number = Object.values(textFields)[1];
      } else {
        payload.account_number = Object.values(textFields)[0];
        payload.routing_number = `${Object.values(textFields)[1]}${Object.values(textFields)[2]}`;
      }

      await addBank(payload);

      props.getStripe && props.getStripe();
      Toast("Bank account added successfully", "success");
      !mobileView && props?.getStripAccount();
      stopLoader();
      onClose();

    } catch (e) {
      stopLoader();
      console.error("ERROR IN handleAddBankAcc", e);
      Toast(e?.response?.data?.message, "error");
    }
  };

  const handleChange = (e, key) => {
    setTextFields((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const FormObjects = () => {
    return (
      <div style={mobileView ? { marginTop: "70px" } : {}}>
        {fields
          ? fields.length
            ? Object.keys(textFields).map((name, index) => (
              <div key={index} className="mx-4">
                <TextField
                  id={name}
                  autoFocus={false}
                  label={name}
                  value={valueFields[name]}
                  style={{ width: `${mobileView ? "85vw" : "30vw"}` }}
                  onChange={(e) => handleChange(e, name)}
                  fullWidth
                  className="my-2"
                />
              </div>
            ))
            : <div className="my-4">
              <Skeleton
                variant="rect"
                height="50px"
                className="my-2"
              />
              <Skeleton
                variant="rect"
                height="50px"
                className="my-2"
              />
              <Skeleton
                variant="rect"
                height="50px"
                className="my-2"
              />
            </div>
          : <div className="p-2 text-center">
            <ErrorIcon style={{ fontSize: 70 }} color="secondary" className="mb-2" />
            <p className="font-weight-600 fntSz16">
              {lang.noFieldsErr1}
            </p>
            <p className="font-weight-600">
              {lang.noFieldsErr2}
            </p>

            <Button
              type="button"
              cssStyles={theme.blueButton}
              onClick={() => sendMail()}
            >
              {lang.contactUs}
            </Button>
          </div>
        }
      </div>
    )
  }

  return (
    <Wrapper>
      <div className={mobileView ? "drawerBgCss vw-100 vh-100" : "p-4"}>
        {!mobileView && (
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => onClose()}
          >
            {lang.btnX}
          </button>
        )}

        {mobileView ? (
          <Header
            title={lang.addBankAccount}
            back={() => {
              onClose();
            }}
          />
        ) : (
          <h5 className="content_heading text-center px-1 py-3 m-0">
            {lang.addBankAccount}
          </h5>
        )}

        {FormObjects()}

        {fields && <div className={mobileView ? "bottomBtn px-3" : "px-3 py-2"}>
          <Button
            type="button"
            cssStyles={theme.blueButton}
            disabled={isEnable}
            onClick={() => handleAddBankAcc()}
          >
            {mobileView ? lang.confirm : lang.save}
          </Button>
        </div>}

      </div>

      <style jsx>{`
        :global(.MuiDrawer-paper) {
          color: inherit;
        }
        .stipeAccDiv {
          padding: 15px 0;
          background-color: #f1f2f6;
          border-radius: 13px;
        }
        .greyTopBorder {
          border-top: 1px solid ${clr.GREY_COLOR_2};
        }
        :global(.MuiInputBase-input){
          color:var(--l_app_text);
        }
        :global(.MuiFormLabel-root){
          color:var(--l_app_text);
          opacity:0.5;
        }
        :global(.MuiFormLabel-root.Mui-focused){
          color:var(--l_base)!important;
        }
        :global(.MuiInput-underline:after){
          border-bottom:2px solid var(--l_base)!important;
        }
      `} </style>
    </Wrapper>
  );
}
