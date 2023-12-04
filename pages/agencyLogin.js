import React from 'react'
import isMobile from '../hooks/isMobile';
import { useTheme } from 'styled-components';
import useLang from '../hooks/language';
import { LOGINBANNER } from '../lib/config/homepage';
import LoginForm from '../containers/agency/LoginForm';
import { handleContextMenu } from '../lib/helper';
import FigureImage from '../components/image/figure-image';
import { CLOSE_ICON_WHITE, JUICY_HEADER_DARK_LOGO } from '../lib/config/logo';
import Icon from '../components/image/icon';
import { useRouter } from 'next/router';

const agencyLogin = () => {
  const [lang] = useLang();
  const router = useRouter();
  return (
    <div className={`h-screen overflow-hidden`}>
      <Icon
        icon={`${CLOSE_ICON_WHITE}#close-white`}
        color={"var(--l_app_text)"}
        width={16}
        height={16}
        viewBox="0 0 12 12"
        class="pointer"
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: "10" }}
        onClick={() => router.back()}
      />
      <div className={`col-12 d-flex align-items-center justify-content-center p-0 m-0 overflow-hidden vh-100`}>
        <div className="vh-100 col-7 px-0 pt-5 card_bg">
          <div className="m-auto text-center ">
            <div className="text-center pt-3">
              <FigureImage
                src={JUICY_HEADER_DARK_LOGO}
                width="190"
                height='75'
                fclassname="m-0 mb-4"
                id="logoUser"
                alt="logoUser"
              />
              <h3 className='text-app'>{lang.btnLogin}</h3>
              <div className='text-muted'>{lang.loginToAdmin}</div>
            </div>
          </div>
          <div className="col-12 p-0 d-flex align-items-center justify-content-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div >
  )
}

export default agencyLogin