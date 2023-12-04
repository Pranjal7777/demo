import * as React from 'react';
import Icon from '../../image/icon';
import { DOLLAR_ICON } from "../../../lib/config/homepage";
import { useTheme } from 'react-jss';
import { authenticateUserForPayment } from '../../../lib/global';
import { isAgency } from '../../../lib/config/creds';
import { authenticate } from '../../../lib/global/routeAuth';
import { open_dialog, open_drawer } from '../../../lib/global/loader';
import isMobile from '../../../hooks/isMobile';
import useLang from '../../../hooks/language';
import { getCookie } from '../../../lib/session';
import { useRouter } from 'next/router';
import useProfileData from '../../../hooks/useProfileData';
import { getDeviceId } from '../../../lib/helper/detectDevice';
import { chatTipStatus } from '../../../lib/config/chat';

export const ReuestTipButton = ({ otherProfile, conversation }) => {
    const theme = useTheme();
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const auth = getCookie('auth');
    const router = useRouter();
    const [profile] = useProfileData();

    const handleRequestTip = () => {
        authenticate(router.asPath).then(() => {
            if (mobileView) {
                open_drawer("RequestTip", {
                    creatorId: otherProfile._id,
                    creatorName: otherProfile.username,
                    conversation: conversation
                }, 'bottom');
            } else {
                open_dialog("RequestTip", {
                    creatorId: otherProfile._id,
                    creatorName: otherProfile.username,
                    conversation: conversation
                });
            }
        })
    }

    return (
        <div className='chatTipBtn footerBtn' onClick={handleRequestTip}>
            <Icon
                icon={`${DOLLAR_ICON}#Dollar_tip`}
                color={`var(--l_light_app_text)`}
                size={mobileView ? 26 : 28}
                class="d-flex align-items-center cursorPtr"
                viewBox="0 0 20 20"
            />
        </div>
    );
};