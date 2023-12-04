import React, { useEffect } from 'react'
import { UserMigrartionLoginBanner, UserMigrartionLoginBannerMobile } from '../lib/config/homepage';
import LoginForm from '../containers/userMigrationLoginForm';
import { useState } from 'react';
import isMobile from '../hooks/isMobile';
import { returnHome } from '../lib/global/routeAuth';
import { CLOSE_ICON_WHITE, JUICY_HEADER_LOGO } from '../lib/config/logo';
import { useRouter } from 'next/router';
import Icon from '../components/image/icon';
import { RecaptchaProvider } from '../hoc/RecaptchaProvider';
import { getCookiees, setCookie } from '../lib/session';
import { ParseToken } from '../lib/parsers/token-parser';
import { guestLogin } from '../lib/global/guestLogin';

// step 1 = user registered and otp sent to email (for migration)
// step 2 = enter otp
// step 3 = user already register with us
// step 4 = user already registered - enter password
// step 5 = user not registered on platform - need to create account

const Login = (props) => {
    const [step, setStepper] = useState(0);
    const [mobileView] = isMobile();
    const router = useRouter()

    useEffect(() => {
        if (props?.token) {
            setCookie('token', ParseToken(props?.token))
        }
    }, [])

    return (
        <RecaptchaProvider>
            <div className={`lpage w-100`}>
                <Icon
                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                    color={mobileView ? "black" : "var(--l_app_text)"}
                    width={16}
                    height={16}
                    viewBox="0 0 12 12"
                    class="pointer"
                    style={{ position: "fixed", top: "20px", right: "20px", zIndex: "10" }}
                    onClick={() => router.back()}
                />
                {mobileView ?
                    <div className={`overflow-auto`} style={{ height: "calc(var(--vhCustom, 1vh) * 100)" }}>
                        <div className="d-flex align-items-start justify-content-center h-100" >
                            <LoginForm step={step} setStepper={setStepper} />
                        </div>
                    </div>
                    :
                    <div className={`row m-0 justify-content-center w-100 vh-100`}>
                        <div className="col-4 h-100" >
                            <LoginForm step={step} setStepper={setStepper} />
                        </div>
                    </div>

                }
            </div >
        </RecaptchaProvider>
    )
}

Login.getInitialProps = async ({ Component, ctx, userToken }) => {
    const { req, res } = ctx;
    returnHome(req, res);
    let token = userToken || getCookiees("token", req);
    if (!token?.toString?.().length) {
        const guestData = await guestLogin();
        token = guestData.token;
    }
    return { token: token };
};
export default Login