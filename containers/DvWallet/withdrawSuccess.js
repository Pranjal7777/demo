import isMobile from "../../hooks/isMobile"
import { P_CLOSE_ICONS } from "../../lib/config"
import { useEffect } from "react"
import { SUCCESS_PAYMENT } from "../../lib/config/logo"
import Icon from "../../components/image/icon"
import Button from "../../components/button/button"
import { close_dialog, close_drawer } from "../../lib/global/loader"

const WithdrawSuccessInfo = ({ ...props }) => {
    const [mobile] = isMobile();

    useEffect(() => {
        close_dialog("WithdrawWingspanMoney");
        close_drawer("WithdrawWingspanMoney");
        const id = setTimeout(() => {
            props?.onClose()
        }, 5000)
        return () => {
            clearTimeout(id)
        }
    }, [])

    return (
        <div className='specific_section_bg text-app p-4' style={mobile ? {} : { width: "450px" }}>
            <div>
                <h4 className="text-app">{props.titleName}</h4>
                <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", right: mobile ? "18px" : "8px" }}>
                    <Icon
                        icon={`${P_CLOSE_ICONS}#cross_btn`}
                        hoverColor='var(--l_base)'
                        color={'var(--l_app_text)'}
                        width={20}
                        height={20}
                        alt="Back Arrow"
                    />
                </div>
            </div>
            <div className="text-center px-4">
                <Icon
                    icon={`${SUCCESS_PAYMENT}#success_payment`}
                    width={100}
                    height={100}
                    class='cursorPtr d-flex justify-content-center'
                    viewBox="0 0 311 295"
                />
                <h5 className="mx-3 mx-md-5 mt-2">
                    {props?.successMessage}
                </h5>
                <p className="light_app_text">{props?.successMessage2}</p>
            </div>
            <div className="mt-5">
                <Button
                    type="button"
                    fclassname="btnGradient_bg rounded-pill"
                    onClick={() => props?.onClose()}
                    children={props?.btnText || "Ok Got it!!"}
                />
            </div>
        </div>
    )
}
export default WithdrawSuccessInfo