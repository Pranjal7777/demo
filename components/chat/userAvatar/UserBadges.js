import * as React from 'react';
import dynamic from 'next/dynamic';
import Icon from '../../image/icon';
import { BLOCKED, BLOCK_AG } from '../../../lib/config/homepage';
import Img from '../../ui/Img/Img';
import { convertCurrencyLocale } from '../../../lib/global';
import { textdecode } from '../../../lib/textEncodeDecode';
import { defaultCurrency } from '../../../lib/config/creds';

const VIPbadge = dynamic(() => import('./VIPbadge').then(mod => mod.VIPbadge))


export const UserBadges = ({ conversation, isOtherVip, profile, isSideBar = false }) => {
    const getTotalSpend = () => {
        let userSpend;
        if (conversation?.opponentDetails?.metaData?.spendAmountWithCreators) {
            let spend = textdecode(conversation?.opponentDetails?.metaData?.spendAmountWithCreators)
            if (spend) {
                spend = JSON.parse(spend)
                userSpend = spend[profile?._id]
            }
        }
        return userSpend
    }
    const totalSpend = React.useMemo(() => getTotalSpend(), [conversation, profile])

    return (
        <div className='user-badge d-flex align-items-center'>
            {
                totalSpend ? <div className='totalSpend ml-2 mr-1 position-relative'>{`${defaultCurrency}${convertCurrencyLocale(totalSpend)}`}</div> : ""
            }
            {
                isOtherVip && isSideBar ? <VIPbadge /> : ""
            }
            {
                conversation.messagingDisabled && isSideBar ? <div className='ml-1'>
                    <Img
                        src={`${BLOCKED}#blocked`}
                        width={16}
                        height={16}
                        // color={'#FF0000'}
                        class="cursorPtr" /></div> : ""
            }

        </div>
    );
};