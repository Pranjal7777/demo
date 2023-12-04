import React, { useState } from "react";

const PostingCheckbox = (props) => {
  const { checked = false, onChange, label, name } = props;
  const [toggler, setToggler] = useState(checked);
  const handleToggler = (e) => {
    setToggler((prev) => !prev);
    let value = e.target.checked;
    onChange && onChange({ value: value });
  };
  return (
    <div>
      <label className="mv_create_post_radio_type">
        {label}
        <input
          type="checkbox"
          name={name}
          onChange={handleToggler}
          checked={props.checked}
        />
        <span className="checkmark" />
      </label>
    </div>
  );
};

export default PostingCheckbox;
