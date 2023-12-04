import React from "react";
import Button from "../button/button";
import InputText from "../formControl/inputText";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { startLoader, stopLoader } from "../../lib/global";
import { validateReferralCodeRequest } from "../../services/auth";
import DVinputText from "./DVinputText";

const DVrefer = (props) => {
    const { setStap, signUpdata = {} } = props;
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
            } catch (e) {
                setElementError("refCode", e.response.data.message);
                rej();
                stopLoader();
            }
        });
    };

    //check validations and if valid then submit form
    const goToNext = async (e) => {
        e && e.preventDefault();
        // check email validation whiile submit
        try {
            value.refCode && (await validateRefCode());
        } catch (e) {
            return;
        }
        setStap(value);
    };
    return (
        <div>
            <form>
                <div className="form-group">
                    <DVinputText
                        className="form-control dv_form_control"
                        autoFocus
                        ref={Register({ emptyAllow: true })}
                        name="refCode"
                        error={error.refCode}
                        placeholder={lang.refCode}
                    ></DVinputText>
                </div>
            </form>
        </div>
    );
};

export default React.memo(DVrefer);
