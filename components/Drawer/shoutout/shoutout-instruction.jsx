import React, { useState } from 'react';
import Header from "../../header/header";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import Button from '../../button/button';
import { close_drawer } from '../../../lib/global/loader';

function ShoutoutInstructions(props) {
  const { heading, instruction, labelHeading = "" } = props;
  const theme = useTheme()
  const [lang] = useLang();
  const [mobileView] = isMobile();
  let stateVal = instruction?.length ? instruction[0]?.value || instruction : ""
  const [instruct, setInstruct] = useState(stateVal)

  const handleSave = (e) => {
    props.setMyVal(instruct)
    close_drawer("ShoutoutFormInstruction")
  }

  return (
    <>
      {mobileView
        ? (<>
          <Header title={heading} back={props.onClose} />
          <div className='text-center m-3' style={{ paddingTop: "60px" }}>
            <label className='text-left w-100'>
              {labelHeading}
            </label>
            <textarea
              rows="6"
              maxLength="300"
              autoFocus
              value={instruct}
              onChange={(e) => setInstruct(e.target.value)}
              placeholder={lang.shoutOutPlaceholder}
              className='card_bg borderStroke radius_8 w-100 h-100 p-3 text-app'
            />
            <div
              className="text-right col-12 pt-2"
              style={{ color: theme?.text }}
            >
              {(instruct && instruct.length) || 0}/300
            </div>
            <div className="mt-3">
              <Button
                type="submit"
                fixedBtnClass="active"
                onClick={() =>
                  handleSave()
                }
                disabled={!instruct}
              >
                {lang.save}
              </Button>
            </div>
          </div>
        </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default ShoutoutInstructions;
