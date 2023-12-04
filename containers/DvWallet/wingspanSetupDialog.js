import React from 'react'
import Icon from '../../components/image/icon'
import { CLOSE_ICON_WHITE } from '../../lib/config/logo'
import Button from '../../components/button/button'
import isMobile from '../../hooks/isMobile'
import { obfuscateEmail } from '../../lib/helper'

const WingspanSetupDialog = (props) => {
    const [mobileView] = isMobile();
    const { emailName = "" } = props;
    return (
        <div className='p-3 text-center' style={mobileView ? {} : { maxWidth: "450px" }}>
            <div className="text-right">
                <Icon
                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                    color={"var(--l_app_text)"}
                    size={16}
                    onClick={() => props.onClose()}
                    alt="back_arrow"
                    class="cursorPtr"
                    viewBox="0 0 16 16"
                />
            </div>
            <h3>Setup Wingspan</h3>
            <div className='p-3 px-md-4 pb-5'>{`Please setup your Wingspan account to withdraw money. Check your email (${obfuscateEmail(emailName)}) to complete your Wingspan registration.`}</div>
            <div>
                <Button
                    type="button"
                    fclassname="btnGradient_bg rounded-pill"
                    onClick={() => props.onClose()}
                    children="Ok Got It"
                />
            </div>
        </div>
    )
}

export default WingspanSetupDialog