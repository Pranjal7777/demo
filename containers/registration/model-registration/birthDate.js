import React, { useState } from "react";
import Button from "../../../components/button/button";
import Error from "../../../components/error/error";
import DatePicker from "../../../components/formControl/datePicker";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { inValidDate } from "../../../lib/validation/validation";
import { useTheme } from "react-jss";
import { getCurrentAge } from "../../../lib/date-operation/date-operation";

const BirthDate = (props) => {
  const { setStap, signUpdata = {} } = props;
  const [date, setDate] = useState(signUpdata.dateOfBirth || getCurrentAge());
  //language
  const [lang] = useLang();
  const theme = useTheme();

  return (
    <form
      onSubmit={(e) => {
        e && e.preventDefault();
        setStap({ dateOfBirth: date });
      }}
    >
      <div className="w-330 mx-auto content-secion pb-3">
        <div className="col-12 text-center">
          <div className="mb-4 position-relative">
            <DatePicker
              className={`datepickerInput ${
                inValidDate(date) ? "input-error-error" : ""
              }`}
              maxDate={getCurrentAge()}
              value={signUpdata.dateOfBirth || getCurrentAge()}
              onChange={(e) => setDate(e.target.value)}
            />
            {inValidDate(date) && (
              <Error errorMessage={lang.dateOfBirthError}></Error>
            )}
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={inValidDate(date)}
          type="submit"
          role="button"
          // onClick={(e) => {
          //   e && e.preventDefault();
          //   setStap({ dateOfBirth: date });
          // }}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(BirthDate);
