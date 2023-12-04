import React, { useState } from "react";
import Button from "../../../components/button/button";
import RadioButton from "../../../components/formControl/radioButton";
import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import { close_drawer, close_dialog } from "../../../lib/global";

const SelectoreDrawer = (props) => {
  const {
    onSelect,
    onClose,
    value = "",
    data,
    title,
    button,
    labelPlacement,
    darkgreyBg,
    verifyDoc,
    handleClose,
  } = props;

  const [lang] = useLang();
  const [document, setDocument] = useState(value);
  const handleDocumentSelect = (value) => {
    setDocument(value);
    !button && handleClick(value);
  };
  const [mobileView] = isMobile();
  const theme = useTheme();

  const handleClick = (value) => {
    onSelect && onSelect(value);
    mobileView ? close_drawer('radioSelectore') : close_dialog("radioSelector");
  };

  return (
    <Wrapper>
      <div className={`col-12 mx-auto`}>
        <h5 className="text-center light_app_text">
          {title || lang.selectDoc}
        </h5>
        <div className="row">
          <div className="col-12 manageLabelText">
            <form>
              {data?.length > 0 &&
                data?.map((radioData, index) => {
                  return (
                    <RadioButton
                      key={index}
                      leftLabel={verifyDoc}
                      name={radioData.name}
                      value={radioData.value}
                      label={radioData.label}
                      labelPlacement={labelPlacement}
                      checked={document == radioData.value}
                      onChange={handleDocumentSelect}
                    />
                  );
                })}

              {button ? (
                <Button
                  onClick={handleClick.bind(null, document)}
                  disabled={!document}
                  type="button"
                  fclassname="mt-4"
                  cssStyles={theme.blueButton}
                >
                  {button}
                </Button>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
        <style jsx>
          {`
          .text-app-profile, :global(.dv__RadioContainer) {
            color: var(--l_app_text) !important;
          }
          :global(.manageLabelText label){
            color: ${props.theme === "white" && "black !important;"}
          }
        `}
        </style>
      </div>
    </Wrapper>
  );
};

export default SelectoreDrawer;
