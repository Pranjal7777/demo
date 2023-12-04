import React, { useEffect, useState } from 'react';
import Header from "../../header/header";
import CustButton from "../../button/button";
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import * as config from "../../../lib/config";
import { backNavMenu, close_drawer } from '../../../lib/global'
import { Checkbox, makeStyles } from '@material-ui/core';
import { NONE_ICON, HIGHLIGHTED_NONE_ICON } from '../../../lib/config';
import { handleContextMenu } from '../../../lib/helper';

const useStyles = makeStyles({
  cbStyle: {
    position: "absolute",
    right: "20px",
    bottom: 0,
    padding: 0,
  }

})

const ShoutoutCheckbox = (props) => {
  const { selectedVal, checkboxVal, setMyVal, heading } = props;
  const classes = useStyles();
  const theme = useTheme()
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [cbVal, setCbVal] = useState([]);
  const [chkBox, setChkBox] = useState(false);

  // useEffect(() => {

  // }, [chkBox])

  const handleChange = (value) => {
    setChkBox(!chkBox)
  }

  const handleSave = (e) => {
    props.setMyVal(instruct)


    close_drawer("ShoutoutFormInstruction")
  }

  const checkboxUI = (val) => (
    <label>
      <img src={val?.valueIcon ? val?.valueIcon : NONE_ICON} className='callout-none' onContextMenu={handleContextMenu} alt="dynamic render" style={{ width: "80px" }} />
      <br />
      <span>{val.value.en}</span>
      <Checkbox color="primary" className={classes.cbStyle} onChange={() => handleChange(val.value.en)} checked={chkBox} />
    </label>
  )

  return (
    <>
      {mobileView
        ? (
          <>
            <Header title={heading} back={props.onClose} />
            <div className="row m-0" style={{ paddingTop: "70px" }}>
              {checkboxVal.map((cbVal, index) => (
                <div key={index} className="col-4 text-center">
                  {checkboxUI(cbVal)}
                </div>
              ))}
            </div>

            <div className="posBtm">
              <CustButton
                type="submit"
                onClick={() =>
                  handleSave()
                }
                cssStyles={theme.blueButton}
              >
                {lang.save}
              </CustButton>
            </div>
          </>
        )
        : ""
      }
    </>
  )
}

export default ShoutoutCheckbox
