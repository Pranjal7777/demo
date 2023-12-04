import * as React from 'react';
import Img from '../../ui/Img/Img';
import { DIAMOND_COLOR } from '../../../lib/config';
import CustomTooltip from '../../customTooltip';

export const VIPbadge = () => {
    return (
        <div className='vipBadge ml-1'>
            <CustomTooltip
                placement="top"
                tooltipTitle={"This is a paid VIP message"}
                image={DIAMOND_COLOR}
                size={16}
            />
        </div>
    );
};