import React, { useState } from "react";
import Header from "../../header/header";
import CustButton from "../../button/button";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { close_drawer } from "../../../lib/global";

const ShououtFormStaticField = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  const [instruct, setInstruct] = useState(props.staticBookingFor)

  const handleSave = () => {
    props.handleBookingForField(instruct);
    close_drawer("ShoutoutFormInstructionStaticField")

  }

  return (
    <>
      {mobileView ? (
        <>
          <Header title={props.heading} back={props.onClose} />
          <div className="text-center" style={{ paddingTop: "70px" }}>
            <textarea
              rows="6"
              maxLength="100"
              autoFocus
              value={instruct}
              onChange={(e) => setInstruct(e.target.value)}
              placeholder={lang.shoutOutPlaceholder}
              style={{ width: "92%" }}
            />
            <div className="posBtm">
              <CustButton
                type="submit"
                onClick={() => handleSave()}
                cssStyles={theme.blueButton}
              >
                {lang.save}
              </CustButton>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ShououtFormStaticField;
