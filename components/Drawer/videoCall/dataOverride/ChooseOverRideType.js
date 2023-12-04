
import { useState } from "react"
import Button from "../../../button/button"
import RadioButtonsGroup from "../../../radio-button/radio-button-group"
import { close_dialog } from "../../../../lib/global"
import useLang from "../../../../hooks/language"

export const ChooseOverRideType = (props) => {

    const types = [{ value: "1", label: "Single day" }, { value: "2", label: "Date range" }]
    const [value, setValue] = useState(types[0]);
    const [lang] = useLang()
    const changeInputHandler = (value) => {
        setValue(value)
    };
    return <>

        <div className="px-4 py-2">
            <h4 className="text-center mb-0 mt-3">{lang.setTimeOff}</h4>
            <p className="faintGray text-center">{lang.setTimeOffFor}</p>

            <div className="rep_res">
                <RadioButtonsGroup
                    labelPlacement="start"
                    value={value}
                    onRadioChange={(val) => changeInputHandler(val)}
                    buttonGroupData={types}
                ></RadioButtonsGroup>
            </div>
            <Button
                type="button"
                fclassname="gradient_bg mt-3 rounded-pill mt-3 mb-2"
                onClick={() => {
                    setTimeout(() => {
                        close_dialog("chooseOverRideType")
                    }, 100)
                    props.handleDateOverRide?.(value)
                }}
            >
                {lang.continue}
            </Button>
        </div>
        <style jsx>{`
         :global(.MuiRadio-colorPrimary){
            color: var(--l_app_text);
          }
        `}
        </style>
    </>
}
export default ChooseOverRideType