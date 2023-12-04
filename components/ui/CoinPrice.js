import * as React from 'react';
import Icon from '../image/icon';
import { BOMBSCOIN_LOGO } from '../../lib/config/logo';

export const CoinPrice = ({ align = 'left', price = '0.00', suffixText, prefixText, size = '18', showCoinText = true, iconSize = "18", displayStyle='block' }) => {
    return (
        <div className={`coinprice ${align === 'center' ? 'justify-content-center' : ''} ${displayStyle === 'flex' ? 'd-flex align-items-center' : ''}`}>
            {prefixText ? <span className='suffix mr-1 noLineHeight'>{`${prefixText}`}</span> : ""}<span style={{ marginTop: displayStyle === 'flex' ? '0px' : '2px' }} className='mr-1 noLineHeight priceAmount'>{`${price} `}</span>
            {/* <span className='bombCoin mr-1'> */}
                <Icon
                    icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                    width={iconSize || size}
                    height={iconSize || size}
                    class='cursorPtr d-inline-block mr-1 noLineHeight'
                    viewBox="0 0 88 88"
                />
            {/* </span> */}
            {showCoinText && <span className='noLineHeight'>Coins</span>}
            {suffixText ? <span className='prefix noLineHeight'>{` ${suffixText}`}</span> : ""}
            <style jsx>
                {`
                :global(.bombCoin > div) {
                    display: inherit !important;
                }
                .coinprice * {
                    font-size: ${size}px;
                    line-height: initial;
                }
                `}
            </style>
        </div>
    );
};