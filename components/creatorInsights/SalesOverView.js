import * as React from 'react';
import { defaultCurrency } from '../../lib/config/creds';
import { convertCurrencyLocale } from '../../lib/global';
import isMobile from '../../hooks/isMobile';

export const SalesOverView = ({ thisMonth = 0.00, lastMonth = 0.00, allTime = 0.00 }) => {

    const [mobileView] = isMobile()

    return (
        <div className='salesOverView p-3'>
            <h3 className='secTitle mt-2'>Sales Overview</h3>
            <div className='overView row px-0 py-2'>
                <div className='oItem col-3 pr-2'>
                    <div className='oInner'>
                        <p className={`title m-0 ${mobileView ? 'fntSz10' : 'fntSz16'}`}>This month</p>
                        <p className={`title m-0 font-weight-bold ${mobileView ? 'fntSz12' : 'fntSz20'}`}>{`${defaultCurrency}${convertCurrencyLocale(thisMonth)}`}</p>
                    </div>
                </div>
                <div className='oItem col-3 px-2 d-flex flex-column align-items-center'>
                    <div className='oInner'>
                        <p className={`title m-0 ${mobileView ? 'fntSz10' : 'fntSz16'}`}>Last month</p>
                        <p className={`title m-0 font-weight-bold ${mobileView ? 'fntSz12' : 'fntSz20'}`}>{`${defaultCurrency}${convertCurrencyLocale(lastMonth)}`}</p>
                    </div>
                </div>
                <div className='oItem col-3 px-2 d-flex flex-column align-items-center'>
                    <div className='oInner'>
                        <p className={`title m-0 ${mobileView ? 'fntSz10' : 'fntSz16'}`}>All Time</p>
                        <p className={`title m-0 font-weight-bold ${mobileView ? 'fntSz12' : 'fntSz20'}`}>{`${defaultCurrency}${convertCurrencyLocale(allTime)}`}</p>
                    </div>
                </div>
            </div>
            <style jsx>
                {
                    `.salesOverView {
                        background-color: var(--l_grayf6);
                        border-radius: 20px;
                    }
                    .oItem:not(:last-child) {
                        border-right: 1px solid var(--l_border);
                    }
                    `
                }
            </style>
        </div>
    );
};