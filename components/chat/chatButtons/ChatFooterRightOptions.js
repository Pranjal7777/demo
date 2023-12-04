import * as React from 'react';
import { ChatTipButton } from './ChatTipButton';
import useProfileData from '../../../hooks/useProfileData';
import { ReuestTipButton } from './RequestTipButton';

export const ChatFooterRightOptions = ({ conversation, otherProfile }) => {
    const [profile] = useProfileData()
    return (
        <div className='d-flex align-items-center chFooterRight'>
            {
                otherProfile?.userTypeCode == 2 && profile?.userTypeCode == 1 ? <ChatTipButton otherProfile={otherProfile} conversation={conversation}/> : <></>
            }
            {
                otherProfile?.userTypeCode == 1 && profile?.userTypeCode == 2 ? <ReuestTipButton conversation={conversation} otherProfile={otherProfile}/> : <></>
            }
            <style jsx>
                {
                    `
                    :global(.chFooterRight .footerBtn:last-child) {
                        margin-right: 0 !important
                    }
                    `
                }
            </style>
        </div>
    );
};