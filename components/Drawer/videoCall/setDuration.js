import React, { useEffect, useState } from "react";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import * as config from "../../../lib/config";
import isMobile from "../../../hooks/isMobile";
import Wrapper from "../../../hoc/Wrapper";

const RadioButtonsGroup = dynamic(
  () => import("../../radio-button/radio-button-group"),
  { ssr: false }
);

export default function setDuration(props) {
  const theme = useTheme();
  const { handleSlotChanger, slotOption, slot, onClose } = props;
  const [lang] = useLang();
  const [reportReasonsList, setReportReasonsList] = useState(slotOption);
  const [value, setValue] = useState(slot);
  const [mobileView] = isMobile();

  // function to handle input control
  const changeInputHandler = (value) => {
    setValue(value)
    handleSlotChanger(value)
    onClose();
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog rounded">
          <div
            className={`${
              mobileView ? "modal-content-mobile" : "modal-content"
            } pt-4`}
          >
            {!mobileView && (
              <button
                type="button"
                className="close dv_modal_close"
                data-dismiss="modal"
                onClick={() => props.onClose()}
              >
                {lang.btnX}
              </button>
            )}
            {<div className="col-12 mx-auto pb-4 px-4">
                <h3
                  className={
                    mobileView
                    ? `mb-0 fntSz18 pt-3 pb-2 ${
                          theme.type == "light" ? "txt-black" : "text-white"
                        }`
                      : // Commented on 24th March by Bhavleen
                        // : "txt-black dv__fnt24 dv__black_color mb-0 pb-2 mx-auto"
                        "txt-black fntSz22 text-center pb-2"
                  }
                >
                  {lang.SelectSlot}
                </h3>

                <div className="rep_res">
                  <RadioButtonsGroup
                    // label="abusive content"
                    labelPlacement="start"
                    value={value}
                    onRadioChange={(val) => changeInputHandler(val)}
                    buttonGroupData={reportReasonsList}
                  ></RadioButtonsGroup>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
