import React, { useEffect, useState } from 'react';

const SlickSwitch = (props) => {
  const { checked = false, onChange } = props;
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
      <label className="switch">
        <input onChange={handleToggler} type="checkbox" checked={props.checked} />
        <span className="slider"></span>
      </label>
      <style jsx>{`
        .switch {
          position: relative;
          width: 25px;
          height: 6px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 34px;
          background-color: #ccc;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          height: 6px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: -10px;
          bottom: -4px;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          box-sizing: border-box;
          border-radius: 50%;
          background:#ccc;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(30px);
          box-sizing: border-box;
          background: linear-gradient(180deg, #D33AFF 0%, #FF71A4 100%);

        }
      `}</style>
    </div>
  );
};

export default SlickSwitch;
