import * as React from 'react';
import { convertCurrencyLocale } from '../../lib/global';
import { defaultCurrency } from '../../lib/config/creds';
import isMobile from '../../hooks/isMobile';

export const InsightList = ({ items = [] }) => {
    const [mobileView] = isMobile()


    const getItemValue = (value, unit) => {
        if (unit === 'currency') {
            return `${defaultCurrency}${value.toString().includes(".") ? convertCurrencyLocale(value.toFixed(2)) : convertCurrencyLocale(value)}`
        }
        if (unit === 'normal') {
            return value;
        }
        return convertCurrencyLocale(value)
    }

    return (
        <div className='insList d-flex flex-wrap py-2'>
            {
                items.map((item, idx) => {
                    return (
                        <div className={`${mobileView ? 'px-2 py-2' : 'px-4 py-4'}  gradient_bg dataItem`}>
                            <p className={`font-weight-bold mb-1 text-app line1 ${mobileView ? 'fntSz12' : 'fntSz20'}`}>{`${getItemValue(item.value, item.unit)}`}</p>
                            <p className={`text-app mb-0 line2 ${mobileView ? 'fntSz10' : 'fntSz16'}`}>{`${item.title}`}</p>
                        </div>
                    )
                })
            }
            <style jsx>
                {
                    `
                   .dataItem {
                    border-radius: ${mobileView ? '12px' : '18px'};
                    min-width: ${mobileView ? 'calc(25% - 6px)' : 'calc(25% - 12px)'};
                    max-width: ${mobileView ? 'calc(25% - 6px)' : 'calc(25% - 12px)'};
                    flex: 0 0 ${mobileView ? 'calc(25% - 6px)' : 'calc(25% - 12px)'};
                    margin: ${mobileView ? '4px' : '7.5px'};
                  }
                  .dataItem:nth-child(4n+1) {
                    margin-left: 0px;
                  }
                  .dataItem:nth-child(4n) {
                    margin-right: 0px;
                  }
                   `
                }
            </style>
        </div>
    );
};