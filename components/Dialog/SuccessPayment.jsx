import isMobile from "../../hooks/isMobile"
import useLang from "../../hooks/language"
import { P_CLOSE_ICONS } from "../../lib/config"
import Icon from "../image/icon"
import { useEffect } from "react"
import { close_dialog, close_drawer } from "../../lib/global/loader"
import { SUCCESS_PAYMENT } from "../../lib/config/logo"
import LottieAnimation from "../lottieAnimation"
import successSendTipAnimation from '../../public/Bombshell/images/lottie-animations/sendtip-animation.json';

const SuccessPayment = ({ isCoinAnimation = false, ...props }) => {
    const [lang] = useLang();
    const [mobile] = isMobile();
    useEffect(() => {
        const id = setTimeout(() => {
            if (!isCoinAnimation) {
            mobile ? close_drawer("successPayment", {}, "bottom") : close_dialog("successPayment", {})
            }
        }, 5000)
        return () => {
            clearTimeout(id)
        }
    }, [])

    const handleCompleteAnim = () => {
        mobile ? close_drawer("successPayment", {}, "bottom") : close_dialog("successPayment", {})
    }
    return <>
        <div className='specific_section_bg text-app'>
            {
                isCoinAnimation ?
                    <LottieAnimation handleCompleteAnim={handleCompleteAnim} animationFile={successSendTipAnimation} />
                    : <div className=" pt-2">
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
                        <div className='text-center mt-4'>
                            <h4 className='mb-0 '>
                                {lang.congratulation}
                            </h4>
                        </div>
                        <div className="">
                            <Icon
                                icon={`${SUCCESS_PAYMENT}#success_payment`}
                                width={200}
                                height={200}
                                class='cursorPtr d-flex justify-content-center'
                                viewBox="0 0 311 295"
                            />
                            <p className="text-wrap w-50 text-center mx-auto textFaintGray my-3">{props.successMessage}  {!!props.showCoins && <span>{props.coins} {lang.coins}</span>}</p>

                        </div>
                    </div>
            }
        </div>
        <style jsx>{`
        :global(.mu-dialog){
            visibility:${isCoinAnimation && "hidden"}
        }
        `}</style>
    </>
}
export default SuccessPayment