import isMobile from "../../hooks/isMobile"
import useLang from "../../hooks/language"
import { P_CLOSE_ICONS } from "../../lib/config"
import { Arrow_Left2 } from "../../lib/config/homepage"
import Icon from "../image/icon"
import Button from "../button/button"
import { BOMBSCOIN_LOGO } from "../../lib/config/logo"

const PurchaseNewPost = (props) => {
    const [lang] = useLang();
    const [mobile] = isMobile();
    const { handlePaymentThroughWallet } = props

    return <>
        <div className='specific_section_bg text-app'>
            <div className=" pt-2">
                <div>
                    <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", left: mobile ? "18px" : "8px" }}>
                        <Icon
                            icon={`${Arrow_Left2}#arrowleft2`}
                            hoverColor='var(--l_base)'
                            width={16}
                            height={16}
                            class="arrowLeft"
                            alt="Left Arrow"
                        />
                    </div>
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
                        {lang.purchasePost}
                    </h4>
                </div>
                <div className="">
                    <p className="text-wrap w-50 text-center mx-auto textFaintGray my-3 d-flex justify-content-center">{lang.unlockPost}  <Icon
                        icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                        hoverColor='var(--l_base)'
                        color={'var(--l_app_text)'}
                        width={20}
                        height={20}
                        class="mx-1"
                        alt="Back Arrow"
                    /><span >{props.price} {lang.coins}</span></p>
                </div>
            </div>
            <div className='px-5 py-1 specific_section_bg mb-2'>
                <Button
                    type="button"
                    fclassname='rounded-pill my-2 gradient_bg'
                    btnSpanClass=" font-weight-500 letterSpacing3 text-white fntsz1rem"
                    onClick={handlePaymentThroughWallet}
                    children={lang.purchasePost}
                />
            </div>
        </div>
    </>
}
export default PurchaseNewPost