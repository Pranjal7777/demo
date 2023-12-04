import React, { useEffect, useState } from "react";
import Wrapper from "../wrapper/wrapper";

const Switch = (props) => {
  const { checked = false, onChange, disabled } = props;
  const [toggler, setToggler] = useState(checked);
  const handleToggler = (e) => {
    setToggler((prev) => !prev);
    let value = e.target.checked;

    onChange && onChange({ value: value });
  };

  useEffect(() => {
    props.checked && setToggler(props.checked);
  }, [props.checked]);
  return (
    <div>
      <label className="mv_create_post_switch_toggler m-0"> 
        <input
          onChange={handleToggler}
          type="checkbox"
          checked={props.checked}
          disabled={disabled}
        />
        <span className="slider round" />
      </label>
    </div>
  );
};
export default Switch;
