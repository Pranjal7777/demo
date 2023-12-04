import React, { useEffect } from "react";
// import Button from "../../../components/button/button";
import InputText from "../formControl/inputText";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { focus } from "../../lib/global";
import DVinputText from "../DVformControl/DVinputText";

const DVname = (props) => {
    const [lang] = useLang();

    const { setStap, signUpdata = {} } = props;
    const [Register, value, error] = useForm({
        defaultValue: { ...signUpdata },
    });

    useEffect(() => {
        focus("firstName");
    }, []);

    return (
        <form>
            <div className="row mb-3">
                <div className="col">
                    <div className="position-relative">
                        <DVinputText
                            className="form-control dv_form_control"
                            id="firstName"
                            autoFocus
                            name="firstName"
                            error={error.firstName}
                            defaultValue={signUpdata.firstName}
                            ref={Register({
                                validate: [
                                    {
                                        validate: "required",
                                        error: lang.firstNameError,
                                    },
                                ],
                            })}
                            placeholder={lang.firstNamePlaceholder}
                        ></DVinputText>
                    </div>
                </div>
                <div className="col">
                    <div className="position-relative">
                        <DVinputText
                            className="form-control dv_form_control"
                            name="lastName"
                            error={error.lastName}
                            defaultValue={signUpdata.lastName}
                            ref={Register({
                                validate: [
                                    {
                                        validate: "required",
                                        error: lang.lastNameError,
                                    },
                                ],
                            })}
                            placeholder={lang.lastNamePlaceholder}
                        ></DVinputText>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default React.memo(DVname);
