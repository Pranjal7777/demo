import React, { useState } from "react";
import Header from "../../../components/header/header";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../../../components/button/button";
import InputField from "./label-input-field";
import DropdownMenu from "../../../components/DropdownMenu/currencyDropdwn";
import { backNavMenu } from "../../../lib/global";
import { NumberValidator, ValidateTwoDecimalNumber } from "../../../lib/validation/validation";
import isMobile from "../../../hooks/isMobile";
import Wrapper from "../../../hoc/Wrapper";

export default function EditShoutoutPrice(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [value, setValue] = useState(props.value);
  const [currencySymbol, setCurrencySymbol] = useState("dollar");

  React.useEffect(()=>{
    const defaultCurrency = menuItems.filter(data => data.label == props?.currency?.toLowerCase())
    setCurrencySymbol(defaultCurrency[0]?.label)
  },[])

  const handleSubmit = () => {
    props.onChange?.(value);
    props.onClose();
  };

  const handleOnChange = (e) => {
    let val = e.target.value;
    const regex = ValidateTwoDecimalNumber(val);
    if (regex || !val) setValue(val);
  };

  const CurrencyChange = (e) => {
    setCurrencySymbol(e.target.value);
    props?.handleCurrencyChange(e);
  };

  const menuItems = [
    // {
    //   label: "rupees",
    //   icon: "₹",
    // },
    {
      label: "dollar",
      icon: "$",
    },
    // {
    //   label: "euro",
    //   icon: "€",
    // },
  ];

  const webInoutStyle = {
    background: theme.palette.l_input_bg,
    color: theme.palette.l_app_text,
  };

  return (
    <div className="col-12">
      {mobileView ? (
        <Wrapper>
          <Header back={() => backNavMenu(props)} title={lang.changePrice} />

          <div className="container" style={{ marginTop: "90px" }}>
            <div className="row">
              <div className="col-2 pl-0">
                <DropdownMenu
                  button="Currency"
                  value={'$'}
                  handleCurrency={CurrencyChange}
                  menuItems={menuItems}
                  currencySymbol={currencySymbol}
                />
              </div>

              <div className="col-10">
                <InputField
                  id="shoutoutPrice"
                  className="dv_form_control_input"
                  type="number"
                  name="shoutoutPrice"
                  inputMode="decimal"
                  value={value}
                  placeholder={lang.enterPrice}
                  error={props.error}
                  onChange={handleOnChange}
                  onBlur={props.onBlur}
                  autoFocus
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#f1f2f6",
                    color : "#000"
                  }}
                />
              </div>
            </div>

            <div className="posBtm">
              <Button
                disabled={!Number(value)}
                type="submit"
                cssStyles={theme.blueButton}
                fclassname="my-3"
                onClick={handleSubmit}
              >
                {lang.save || "Save"}
              </Button>
            </div>
          </div>
        </Wrapper>
      ) : (
        <Wrapper>
          <div>
            <button
              type="button"
              className="close dv__modal_close"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>
            <div className="p-4 text-center">
              <h6 className="dv__modelHeading my-2">{lang.setShoutPrice}</h6>
              <div className="d-flex pt-2">
                <DropdownMenu
                  button="Currency"
                  value={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'}`}
                  handleCurrency={CurrencyChange}
                  menuItems={menuItems}
                  currencySymbol={currencySymbol}
                />
                <div className="col-10">
                  <InputField
                    id="shoutoutPrice"
                    type="number"
                    name="shoutoutPrice"
                      inputMode="numeric"
                      onKeyPress={NumberValidator}
                    value={value}
                    placeholder={lang.enterPrice}
                    error={props.error}
                    onChange={handleOnChange}
                    onBlur={props.onBlur}
                    autoFocus
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f1f2f6",
                    }}
                    cssStyles={mobileView ? "" : webInoutStyle}
                  />
                </div>
              </div>

              <Button
                disabled={!Number(value)}
                type="submit"
                cssStyles={theme.blueButton}
                fclassname="my-3"
                onClick={handleSubmit}
              >
                {lang.save || "Save"}
              </Button>
            </div>
          </div>

          <style jsx>
            {`
              :global(.MuiDialog-paper) {
                max-width: 450px;
              }
              :global(.MuiDrawer-paper) {
                color: inherit;
              }
              :global(.MuiOutlinedInput-notchedOutline){
                border-color: #fff !important;
              }
              :global(.MuiSelect-icon){
                color : #fff !important;
              }
            `}
          </style>
        </Wrapper>
      )}
    </div>
  );
}
