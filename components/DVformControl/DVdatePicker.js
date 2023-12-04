import React, { useState } from "react";
import Error from "../error/error";
import useLang from "../../hooks/language";
import { inValidDate } from "../../lib/validation/validation";
import { getCurrentAge } from "../../lib/date-operation/date-operation";
import DVdatePickerInput from "./DVdatePickerInput";
import moment from "moment";

const DVdatePicker = (props) => {
  const { setStap, signUpdata = {} } = props;
  const [date, setDate] = useState(signUpdata.dateOfBirth || getCurrentAge());
  //language
  const [lang] = useLang();

  return (
    <form>
      <div className="form-group">
        {
          props.labelTitle && <label className="label__title" for={props.id}>{props.labelTitle}</label>
        }
        <DVdatePickerInput
          // className="form-control dv_form_control"
          className={`datepickerInput
          `}
          // ${inValidDate(date) && "dv_form_control"}    //this is class move outside to comment out this line
          // maxDate={getCurrentAge()}
          maxDate={moment().subtract(18, 'years')._d}
          value={signUpdata.dateOfBirth}
          onChange={(e) => {
            setDate(e.target.value);
            props.setDatePicker(e.target.value);
          }}
          disabled={props.disabledField}
        ></DVdatePickerInput>
        {/* {inValidDate(date) && (
          <Error errorMessage={lang.dateOfBirthError}></Error>
        )} */}
      </div>
    </form>
  );
};

export default React.memo(DVdatePicker);
