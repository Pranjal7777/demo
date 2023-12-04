import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { defaultCurrency } from "../../../lib/config/creds";

export default function EditShoutoutPrice(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [value, setValue] = useState(props.value);
  const [lowestShoutPrice, setLowestShoutPrice] = useState()
  const [currencySymbol, setCurrencySymbol] = useState("dollar");

  const minShoutOutValue = useSelector((state) => state.appConfig.minShoutoutValue);
  const maxShoutoutValue = useSelector((state) => state.appConfig.maxShoutoutValue)

  useEffect(() => {
    setLowestShoutPrice(minShoutOutValue)
  }, [])


  React.useEffect(() => {
    const defaultCurrency = menuItems.filter(data => data.label == props?.currency?.toLowerCase())
    setCurrencySymbol(defaultCurrency[0]?.label)
  }, [])

  const handleSubmit = () => {
    props.onChange?.(value);
    props.onClose();
  };

  const handleOnChange = (e) => {
    let val = e.target.value;
    const regex = ValidateTwoDecimalNumber(val);
    if (regex || !val) setValue(val);
  };

  const blockInvalidChar = (e) => {
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
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

          <div className="container" style={{ marginTop: "100px" }}>
            <div className="row">
              <div className="col-2 pl-0 alignIcon">
                <DropdownMenu
                  button="Currency"
                  value={'$'}
                  handleCurrency={CurrencyChange}
                  menuItems={menuItems}
                  currencySymbol={currencySymbol}
                  className="app-text"
                />
              </div>

              <div className="col-10">
                <InputField
                  id="shoutoutPrice"
                  type="number"
                  name="shoutoutPrice"
                  fclassname="colorPlaceholderAdjust text-app mv_form_control_Input borderStroke"
                  inputMode="decimal"
                  value={value}
                  placeholder={lang.enterPrice}
                  error={props.error}
                  onChange={handleOnChange}
                  onBlur={props.onBlur}
                  onKeyPress={NumberValidator}
                  autoFocus
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#f1f2f6",
                    color: "#000"
                  }}
                />
                {
                  (value < lowestShoutPrice || value > maxShoutoutValue) &&
                  < p
                    style={{
                      position: 'absolute',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'red',
                      top: '42px'
                    }}
                    >{lang.lowestShoutoutText} {defaultCurrency} {lowestShoutPrice} {lang.maxText} {defaultCurrency} {maxShoutoutValue}</p>
                }
                <style jsx>{`
                :global(.colorPlaceholderAdjust::placeholder){
                  color: var(--l_light_grey1) !important;
                  }
                :global(.colorPlaceholderAdjust){
                  color: #818ca3 !important;
                }  
                :global(.alignIcon >div >div> div){
                  padding-left:25px  !important;
                }
                `}</style>
              </div>
            </div>

            <div className="posBtm">
              <Button
                disabled={Number(value) < lowestShoutPrice || Number(value) > maxShoutoutValue}
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
              <div className="py-4 text-center">
                <h6 className=" my-2">{lang.setShoutPrice}</h6>
                <div className="d-flex pt-2 col-12">
                  <div>
                    {/* <DropdownMenu
                  button="Currency"
                  className="dv_form_control_input"
                  value={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'}`}
                  handleCurrency={CurrencyChange}
                  menuItems={menuItems}
                  currencySymbol={currencySymbol}
                /> */}
                    <p className="position-absolute fntSz15" style={{ left: "16%", top: "36%", zIndex: "1" }}>{defaultCurrency}</p>
                  </div>
                  <div className="col-10 m-auto position-relative">
                  <InputField
                    disUeff={props.disUeff}
                    id="shoutoutPrice"
                      className="dv_form_control_input pl-3 "
                    type="number"
                    name="shoutoutPrice"
                    inputMode="decimal"
                    value={value}
                    placeholder={lang.enterPrice}
                    error={props.error}
                    onChange={handleOnChange}
                      onKeyDown={blockInvalidChar}
                      onKeyPress={NumberValidator}
                    onBlur={props.onBlur}
                    autoFocus
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f1f2f6",
                      border: `1px solid ${theme.text} !important`
                    }}
                    cssStyles={mobileView ? "" : webInoutStyle}
                  />
                  {
                      (value < lowestShoutPrice || value > maxShoutoutValue) &&
                      < p className="m-0"
                      style={{
                        position: 'absolute',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'red',
                            top: '52px',
                        left: '20px',
                        textAlign: "left"
                      }}
                      >{lang.lowestShoutoutText} {defaultCurrency} {lowestShoutPrice} {lang.maxText} {defaultCurrency} {maxShoutoutValue}</p>
                    }
                </div>
              </div>

              <Button
                  disabled={Number(value) < lowestShoutPrice || Number(value) > maxShoutoutValue}
                type="submit"
                cssStyles={theme.blueButton}
                  fclassname="mb-2 mt-5"
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
              :global(.MuiInputBase-input){
                color: var(--l_app_text) !important;
              }
              :global(.form-group){
                margin: 0 !important;
              }
              :global(.MuiOutlinedInput-notchedOutline){
                border-color: var(--l_app_text) !important;
              }
              :global(.MuiSelect-icon){
                color : var(--l_app_text) !important;
              }
              :global(input::placeholder){
                color: var(--l_app_text) !important;
              }
              :global(.customReqInput > div){
              width:80%
              }
              :global(.alignIcon){
                width:80%
                }
              
            `}
          </style>
        </Wrapper>
      )}
    </div>
  );
}
