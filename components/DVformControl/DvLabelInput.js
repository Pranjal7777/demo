import React from 'react';
import Icon from '../image/icon';
import { eye_grey, passwordHideBlack } from '../../lib/config/logo';
import { useTheme } from 'react-jss';
import Error from '../error/error';

const DvLabelInput = (props) => {
  const { label, required, type, className, isTextArea, ispassword, istext, error, errorClass, errorIocnClass } = props;
  const theme = useTheme();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div>
      <div className={`form__group ${className}`}>
        {!isTextArea ? <input
          className={`form__field w-100 text-app ${type === "text" && "text-capitalize"}`} type={!ispassword ? type : showPassword ? "text" : "password"} required={required} placeholder={label}  {...props} /> :
          <textarea className="form__field w-100 pt-2 height_text" placeholder="Input text" rows={4} cols={5} {...props} ></textarea>}
        <label htmlFor="name" className="form__label">{`${label}  ${required ? "*" : ""}`}</label>
        {istext && <p className='text-dark position-absolute bold fntSz17' style={{ top: "20%", left: "96%" }}>{istext}</p>}
        {error && <Error errorMessage={error} className={errorClass} errorIocnClass={errorIocnClass} name={props.name} />}
        {ispassword && <div onClick={() => setShowPassword(!showPassword)} className="dv_setRgtPosAbs">
          {!showPassword
            ?
            <Icon
              icon={`${passwordHideBlack}#invisible`}
              color="var(--l_app_text)"
              size={20}
              viewBox="0 0 14.153 10.566"
            />
            :
            <Icon
              icon={`${eye_grey}#passVisibleGery`}
              color="var(--l_app_text)"
              size={20}
              viewBox="0 0 14.153 10.566"
            />
          }
        </div>}
      </div>
      <style jsx>{`
        .form__group {
          position: relative;
        }
        .height_text{
          height:5rem !important;
        }
        .form__field {
          border: 1px solid silver !important;
          border-radius: 10px;
          box-sizing: border-box;
          color: var(--l_app_text);
          height: 40px;
          background-color: var(--l_app_bg);
          padding: 0rem 15px;
        }

        .form__field::placeholder {
          color: transparent;
        }

        .form__field:placeholder-shown ~ .form__label {
          top: 10px;
          border-right: none;
          border-left: none;
        }

        .form__label {
          background-color: var(--l_app_bg);
          color: #9b9b9b;
          display: block;
          font-size: .9em;
          margin-left: 10px;
          padding: 0 10px;
          pointer-events: none;
          position: absolute;
          top: -10px;
          transition: 0.2s;
        }

        .form__field:focus {
          border: 2px solid var(--l_base) !important;
          outline: none;
        }

        .form__field:focus ~ .form__label {
          background-color: var(--l_app_bg);
          color: var(--l_base);
          font-size: .9em;
          margin-left: 10px;
          padding: 0 10px;
          position: absolute;
          top: -10px;
          transition: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default DvLabelInput;
