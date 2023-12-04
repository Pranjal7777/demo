import React, { useEffect, useState } from 'react';
import Icon from '../image/icon';
import { CHECK, UNCHECK } from '../../lib/config';

/**
 * @description
 * @author kashinath
 * @date 26/05/2023
 */

const Checkbox = ({ label, checked = false, onChange, id, myList }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked])

  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onChange && onChange(e, newValue);
  };

  return (
    <>
      <div className='checkbox position-relative'>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          id={id}
        />
        <div className='checkboxIcon'>
          {myList ?
            <Icon
              icon={isChecked ? `${CHECK}#check_icon` : `${UNCHECK}#uncheck_icon`}
              color={isChecked ? "green" : "var(--l_app_text_less_opacity)"}
              size={20}
              viewBox="0 0 24 24"
            />
            :
            <Icon
            icon={`${CHECK}#check_icon`}
            color={isChecked ? "green" : "var(--l_app_text_less_opacity)"}
            size={20}
            viewBox="0 0 24 24"
          />
          }

        </div>
        {label}
      </div>
      <style jsx>{`
        .checkbox{
          width: 24px;
          height: 24px;
        }
        .checkboxIcon{
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 0;
        }
        .checkbox input{
          position: absolute;
          width: 24px;
          height: 24px;
          opacity: 0;
          top: 0px;
          left: 0px;
          z-index: 9;
          cursor: pointer;
        }
            `}</style>
    </>
  );
};

export default Checkbox;
