import React from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { open_drawer, startLoader, stopLoader } from "../../../lib/global";
import { validateReferralCodeRequest } from "../../../services/auth";
import { useTheme } from "react-jss";

const Refer = (props) => {
  const theme = useTheme();
  const { setStap, signUpdata = "" } = props;
  const [lang] = useLang();
  const [Register, value, error, isValid, setElementError] = useForm({
    emptyAllow: true,
  });

  // validate ref code
  const validateRefCode = async () => {
    return new Promise(async (res, rej) => {
      try {
        startLoader();
        const response = await validateReferralCodeRequest(value.refCode);
        res();
        stopLoader();
      } catch (e) {
        setElementError("refCode", e.response.data.message);
        rej();
        stopLoader();
      }
    });
  };

  // Check validations and if valid then submit form
  const goToNext = async (e) => {
    e && e.preventDefault();
    // Check email validation whiile submit
    try {
      value.refCode && (await validateRefCode());
    } catch (e) {
      return;
    }
    setStap(value);
  };

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  React.useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <div>
      <form>
        <div className="w-330 mx-auto content-secion" style={{ height: "400px", overflow: "hidden" }}>
          <div className="col-12 text-center">
            <div className="mb-4">
              <div className="form-group">
                <InputText
                  autoFocus
                  ref={Register({ emptyAllow: true })}
                  name="refCode"
                  defaultValue={signUpdata}
                  error={error.refCode}
                  placeholder={lang.refCode}
                  maxlength="10"
                ></InputText>
              </div>
            </div>
          </div>
        </div>
        <div className="terms_policy_sec">
          <div className="txt-book fntSz14 text-center mb-1">
            {lang.byCreating + " "} <br />
            <a
              className="txt-heavy"
              href="terms-and-conditions"
              target="_blank"
            >
              {lang.termandcondition + " "}
            </a>{" "}
            {lang.and + " "} &nbsp;
            <a className="txt-heavy" href="privacy-policy" target="_blank">
              {lang.privacyAndPolicy}
            </a>
          </div>
        </div>
        <div className="posBtm">
          <Button
            disabled={!isValid}
            type="submit"
            onClick={goToNext}
            cssStyles={theme.blueButton}
            id="scr2"
          >
            {lang.next}
          </Button>
        </div>
      </form>
      <style jsx>{`
          :global(.terms_policy_sec){
            bottom: calc(0% + 60px);
          }
      `}</style>
    </div>
  );
};

export default React.memo(Refer);
