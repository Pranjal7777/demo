import React, { useState } from 'react'
import Button from '../../components/button/button'
import { CROSS, CROSS_POSTSLIDER, CROSS_SIMPLE } from '../../lib/config/profile'
import Icon from '../../components/image/icon'
import { Toast, close_dialog, startLoader, stopLoader } from '../../lib/global/loader'
import DvLabelInput from '../../components/DVformControl/DvLabelInput'
import { updateEmployee, updateStatus, updateStatusEmployee } from '../../services/agency'
import { getCookie } from '../../lib/session'
import { Paper } from '@material-ui/core'
import useLang from '../../hooks/language'
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { greaterThanSixDigit, lowercaseCharacter, numericValue, specialCharacter, uppercaseCharacter, validatePasswordField } from '../../lib/global/password'
import { useEffect } from 'react'
import useEmployee from './hook/useEmployee'
import useAgencyCreatorList from './hook/useAgencyCreatorList'
import { updateCreatorHandler, updateEmployeeHandler } from '../../redux/actions/agency'
import { useDispatch } from 'react-redux'

const AgencyReason = (props) => {
  const { id, status, tab } = props;
  const uId = getCookie("agencyId")
  const { getEmployee } = useEmployee();
  const [lang] = useLang()
  const [reasonText, setReasonText] = useState();
  const [password, setPassword] = useState("");
  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { getCreatorList } = useAgencyCreatorList();
  const dispatch = useDispatch();
  const [passwordCheck, setPasswordCheck] = useState({
    six_digits: {
      id: 1,
      str: lang.passSixDigits,
      state: false,
    },
    a_numeric: {
      id: 2,
      str: lang.passNumeral,
      state: false,
    },
    uppercase: {
      id: 3,
      str: lang.passUpper,
      state: false,
    },
    special_char: {
      id: 4,
      str: lang.passSpecialChar,
      state: false,
    },
  });
  useEffect(() => {
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [password]);
  const ValidateSixDigitsInPassword = () => {
    try {
      const response = greaterThanSixDigit(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          six_digits: {
            ...prev.six_digits,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSixDigitsInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    }
  };

  const ValidateNumeralInPassword = () => {
    try {
      const response = numericValue(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          a_numeric: {
            ...prev.a_numeric,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateNumeralInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    }
  };

  const ValidateSpecialCharacterInPassword = () => {
    try {
      const response = specialCharacter(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          special_char: {
            ...prev.special_char,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSpecialCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    }
  };

  const ValidateUppercaseCharacterInPassword = () => {
    try {
      const response1 = uppercaseCharacter(password);
      const response2 = lowercaseCharacter(password);
      if (response1 && response2) {
        return setPasswordCheck((prev) => ({
          ...prev,
          uppercase: {
            ...prev.uppercase,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateUppercaseCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    }
  };
  const ValidatePassword = () => {
    try {
      const response = validatePasswordField(password);
      response ? setIsPasswordValid(true) : setIsPasswordValid(false);
    } catch (e) {
      console.error("ERROR IN ValidatePassword", e);
      setIsPasswordValid(false);
    }
  };

  const handleSubmit = () => {

    if (props.restPassword) {
      updateEmployeeData()
    } else if (props.isCreator) {
      handleReject();
    } else {
      handleAccept();
    }
    close_dialog("reasonAgency")
  }

  const handleAccept = async () => {
    let payload = {
      agencyId: uId,
      agencyEmployeeId: id,
      action: status,
      reason: reasonText
    }
    try {
      let response = await updateStatusEmployee(payload)
      startLoader()
      if (response.status === 200) {
        dispatch(updateEmployeeHandler(id))
        Toast(`${status} Successfully`)
      }
      stopLoader()
    } catch (e) {
      console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
        stopLoader();
    }
  }
  const handleReject = () => {
    let payload = {
      agencyId: uId,
      creatorId: id,
      action: status,
      reason: reasonText
    }
    updateStatus(payload)
      .then((res) => {
        startLoader()
        let response = res;
        if (response.status === 200) {
          dispatch(updateCreatorHandler(id))
          Toast(`${status} Sucessfully`);
        }
        stopLoader()
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
        stopLoader();
      })
  }
  const updateEmployeeData = async () => {
    let payload = {
      password: password,
      agencyUserId: props.agencyUserId
    }
    updateEmployee(payload)
      .then((res) => {
        startLoader()
        let response = res;
        if (response.status == 200) {
          Toast("Updated Sucessfully")
        }
        stopLoader()
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
        stopLoader();
      })
  }
  return (
    <div className='position-relative pt-2'>
      <div className='position-absolute' style={{ right: "6%", zIndex: "1", top: "10%" }}>
        <button
          style={{ fontSize: '20px' }}
          type="button"
          className="close custom_cancel_btn dv_appTxtClr text-app"
          data-dismiss="modal"
        >
          <Icon
            icon={`${CROSS_SIMPLE}#Icons_back`}
            size={25}
            class="pr-2 pointer marginL pb-1"
            alt="cross icon"
            viewBox="0 0 40 40"
            color="var(--l_app_text)"
            onClick={() => {
              props.submit
              close_dialog("reasonAgency")
            }}
          />
        </button>
      </div>
      <div className='col-12' style={{ height: "40vh", width: "80vw" }}>
        <div className='d-flex justify-content-center align-items-center'>
          <h4 className='text-app text-center pt-3 col-8'>{props.text}</h4>
        </div>
        <div className='col-12 px-5'>
          <div>
            {!props.restPassword && <p className='text-app mb-0 bold'>Reason</p>}
            {!props.restPassword ? <textarea
              className="w-100 dv_textarea_lightgreyborder mb-3 pt-2 pl-2 fntSz14"
            rows={4}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder={"Enter reason"} />
              : <div className='pt-4 pb-5'>
                <DvLabelInput
                  required
                  ispassword
                  label="Reset Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassvalidScreen(true)}
                  onBlur={() => setPassvalidScreen(false)}
                />
                {passwordValidationScreen && (
                  <Paper
                    className={`position-absolute d-block specific_section_bg ${isPasswordValid ? "text-success" : "text-danger"
                      }`}
                    style={{ zIndex: 2, width: "max-content" }}
                  >
                    {Object.values(passwordCheck).map((checker) => (
                      <div
                        key={checker.id}
                        className={`d-flex align-items-center p-1 mr-1 ${checker.state ? "text-success" : "text-danger"
                          }`}
                      >
                        <CheckOutlineIcon fontSize="small" className="mr-2" />
                        <p className="mb-0 font-weight-500 text-left" style={{ fontSize: '0.66rem' }}>
                          {checker.str}
                        </p>
                      </div>
                    ))}
                  </Paper>
                )}
              </div>}
        </div>
        <Button
            fclassname="font-weight-500 btnGradient_bg radius_22"
            isDisabled={props.restPassword && !isPasswordValid}
            onClick={handleSubmit}
        >
            {props.btnText}
        </Button>
        </div>
      </div>
      <style jsx>{`
      .dv_textarea_lightgreyborder{
        background:none !important;
        color:var(--l_app_text);
      }
      `}</style>
    </div>
  )
}

export default AgencyReason