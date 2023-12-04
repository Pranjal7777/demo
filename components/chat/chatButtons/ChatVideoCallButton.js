import * as React from 'react';
import Icon from '../../image/icon';
import { VIDEO_CALL_OUTLINE } from '../../../lib/config/logo';
import isMobile from '../../../hooks/isMobile';
import { authenticate, authenticateUserForPayment } from '../../../lib/global';
import { isAgency } from '../../../lib/config/creds';
import { open_dialog, open_drawer } from '../../../lib/global/loader';
import { getCookie } from '../../../lib/session';
import useLang from '../../../hooks/language';

export const ChatVideoCallButton = ({ profile, otherProfile, conversation }) => {
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const auth = getCookie('auth');

    const handleBookVideoCall = () => {
        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
            !isAgency() && authenticate()
                .then(() => {
                    const propsToUsevideoCallRequest = {
                        heading: lang.VideoCallRequest,
                        creatorId: otherProfile._id,
                        creatorName: otherProfile.firstName + " " + otherProfile.lastName,
                        creatorProfilePic: otherProfile.profilePic,
                        videoCallPrice: otherProfile.videoCallPrice
                    };
                    if (mobileView) open_drawer('videoCallRequest', propsToUsevideoCallRequest, 'right');
                    else open_dialog('videoCallRequest', propsToUsevideoCallRequest);
                });
        })
    };

    return (
        <div className='d-flex align-items-center chatVideoCallBtn mr-2' onClick={handleBookVideoCall}>
            <Icon
                icon={`${VIDEO_CALL_OUTLINE}#video_call_outline`}
                class="cursorPtr"
                size={mobileView ? 24 : 32}
                color={'var(--l_light_app_text)'}
            />
        </div>
    );
};