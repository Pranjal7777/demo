import React, { useState ,useEffect} from "react";
import Header from "../../header/header";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import RadioButton from "../../radioButtons/radio";
import { backNavMenu, close_drawer } from "../../../lib/global";
import InputTextArea from "../../../components/formControl/textArea";
import CustButton from "../../button/button";

function ShoutoutOccasion(props) {
  const { occasion, setMyVal, heading } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
  const [otherOptionValue, setOtherOptionValue] = useState(
    occasion?.otherTextValue || ""
  );

  useEffect(() => {
    occasion?.otherTextValue?.length > 0 ? setIsTextAreaVisible(true) : "";
  }, [occasion?.otherTextValue]);

  const back = () => close_drawer("ShoutoutFormOccasion");

  const handleOccasionChange = (value) => {
    if (value == "Others") {
      setMyVal(value);
      setIsTextAreaVisible(true);
    } else {
      setMyVal(value);
    }
  };

  const handleOtherOptionValue = () => {
    setMyVal("Others", otherOptionValue);
    back();
  };

  const onchangeHandle = (e) => {
    setOtherOptionValue(e.target.value);
  };

  return (
    <>
      {mobileView ? (
        <>
          <Header title={heading} back={props.onClose} />
          <div
            className="position-absolute d-flex flex-column justify-content-between "
            style={{ paddingTop: "70px" }}
          >
            <div>
              <RadioButton
                isTextAreaVisible={isTextAreaVisible}
                ShoutoutOccasion={true}
                handleValue={
                  (occasion?.value?.length && occasion?.value) ||
                  occasion?.value
                }
                radioBttons={props.radioBttons}
                handleChange={handleOccasionChange}
              />
            </div>
            {isTextAreaVisible && (
              <>
                
                <textarea
                  rows="3"
                  maxLength="50"
                  autoFocus
                  value={otherOptionValue}
                  onChange={(e) => onchangeHandle(e)}
                  placeholder={lang.shoutOutPlaceholder}
                  style={{
                    margin:"auto",
                    width: "92%",
                    padding: "6px",
                    background: `${theme.shoutoutField}`,
                    color: `${theme?.text}`,
                    border: "none",
                  }}
                  className="mt-2"
                />
                <div
                  className="text-right col-12 pt-2"
                  style={{ color: theme?.text }}
                >
                  {(otherOptionValue && otherOptionValue.length) || 0}/50
                </div>
                <div className="posBtm mt-5 position-relative">
                  <CustButton
                    type="submit"
                    onClick={() => handleOtherOptionValue()}
                    cssStyles={theme.blueButton}
                    disable={
                      otherOptionValue && otherOptionValue.length > 100
                        ? true
                        : false
                    }
                  >
                    {lang.save}
                  </CustButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default ShoutoutOccasion;
