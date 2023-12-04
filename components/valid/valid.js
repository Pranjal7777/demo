import React, { useEffect, useState } from "react";
import InfoIcon from "@material-ui/icons/Info";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Fade from "react-reveal/Fade";
import { useTheme } from "react-jss";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const Valid = (props) => {
  const { validMsg } = props;
  const [show, toggle] = useState(true);
  useEffect(() => {
    // console.log("use effectcaled");
    toggle(true);
    setTimeout(() => {
      toggle(false);
    }, 2000);
  }, [validMsg]);
  const theme = useTheme();

  return (
    <div>
      <div className={`error-tooltip-container ${props.extracls ? props.extracls : ''}`} style={(props.typeCheck ==="username" || props.typeCheck ==="email")  ? {right:"0"}:{}}>
        <div>
          <ClickAwayListener onClickAway={() => toggle(false)}>
            <CheckCircleIcon
              fontSize="small"
              style={{ fill: theme.palette.l_green }}
              onClick={() => toggle(!show)}
            />
          </ClickAwayListener>
        </div>
      </div>
      <Fade when={props.typeCheck ==="email" ? false : show}>
        {show && <div className="success-tooltip">{validMsg}</div>}
      </Fade>{" "}
    </div>
  );
};

export default Valid;
