import * as React from 'react';
import { defaultCurrency } from '../../lib/config/creds';
import { convertCurrencyLocale } from '../../lib/global';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import Image from '../../components/image/image';
import { ARROW_GRADIENT_ICON } from '../../lib/config';
import { getCountryData, getCountryCode } from 'countries-list'
import ReactCountryFlag from 'react-country-flag';

export const InsightTopCountries = ({ topData }) => {
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const topCountries = topData?.topCountries || []
    const [seeMore, setSeeMore] = React.useState()
    const [dataLimit, setDataLimit] = React.useState(2)
    const handleSeeMoreClick = () => {
        setSeeMore(!seeMore)
        if (seeMore) {
            setDataLimit(2)
        } else {
            setDataLimit(10)
        }
    }
    return (
        <div className={`topCountries mt-3 ${mobileView ? 'p-2' : 'p-4'}`}>
            <h3 className='secTitle'>{lang?.topCountries}</h3>
            <div className='topList table-responsive'>
                <table className='cntryTable w-100'>
                    <thead>
                        <tr className='borderBtm'>
                            <th className='cname py-3'>{lang?.countryName}</th>
                            <th className='crank py-3'>{lang?.ranking}</th>
                            <th className='crank text-right py-3'>{lang?.totalEarnings2}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            topCountries.filter((f, indx) => indx < dataLimit).map((data, idx) => {
                                return (
                                    <tr className='countryItem borderBtm'>
                                        <td className='cname py-3'>
                                            <div className='d-flex align-items-center'>
                                                <div className='ccflag'>
                                                    <ReactCountryFlag
                                                        countryCode={getCountryCode(data?.countryCode) || "us"}
                                                        aria-label={data?.countryCode}
                                                        title={data?.countryCodeName || "us"}
                                                        svg
                                                        style={{
                                                            width: '24px',
                                                            height: "18px"
                                                        }}
                                                    />
                                                </div>
                                                <div className='ccname ml-2'>
                                                    {getCountryData(getCountryCode(data?.countryCode)).name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='crank py-3'>{data?.rank}</td>
                                        <td className='crank text-right py-3'>{defaultCurrency}{convertCurrencyLocale(+data?.totalEarning)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {
                    topCountries?.length > 3 ? <div className={`seeMore cursorPtr d-flex justify-content-center align-items-center p-2 mt-2  ${seeMore ? 'active' : ""}`} onClick={handleSeeMoreClick}>
                        <div className='cursorPtr d-flex justify-content-center align-items-center'>
                            <h3 className='m-0 yTitle gradient_text position-relative'>{seeMore ? lang?.seeLess : lang.seeMore}</h3>
                            <Image
                                src={`${ARROW_GRADIENT_ICON}#arrowGradient`}
                                width={24}
                                className="ml-1 smicon"
                            />
                        </div>
                    </div> : ""
                }
            </div>
            <style jsx>
                {
                    ` 
                    .topCountries {
                        border: 1px solid var(--l_border);
                        border-radius: ${mobileView ? '12px' : '20px'};
                        border-width: ${mobileView ? '1px' : '1px'} !important;
                    }
                    .topCountries table th{
                        font-size: ${mobileView ? '12px' : '18px'};
                        font-weight: 600;
                    }
                    .countryItem {
                        font-size: ${mobileView ? '12px' : '16px'};
                        font-weight: 400;
                        letter-spacing: 0px;
                    }
                    .countryItem:last-child {
                        border-bottom: none !important;
                    }
                    .seeMore {
                        background-color: var(--l_grayf6);
                        border-radius: 20px;
                        position: relative;
                    }
                    :global(.seeMore.active .smicon){
                        transform: rotate(180deg);
                    }
                    .seeMore h3::after {
                        display: block;
                        content: '';
                        position: absolute;
                        bottom: 0;
                        height: 2px;
                        width: 100%;
                        background: linear-gradient(180deg, #D33AFF 0%, #FF71A4 100%);
                    }
                    .yTitle {
                        font-size:  ${mobileView ? '12px' : '18px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                        text-align: left;
                    }
                    `
                }
            </style>
        </div>
    );
};