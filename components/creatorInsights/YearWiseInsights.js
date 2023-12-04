import * as React from 'react';
import InsightAccordian from './InsightAccordian';
import { useTheme } from 'react-jss';
import { defaultCurrency } from '../../lib/config/creds';
import { convertCurrencyLocale } from '../../lib/global';
import useLang from '../../hooks/language';
import { insColors } from './insightConfig';
import Icon from '../image/icon';
import { ARROW_GRADIENT_ICON } from '../../lib/config';
import Image from '../image/image';
import isMobile from '../../hooks/isMobile';


const InsightTable = ({ items, totalGross = 0.00, totalNet = 0.00, data }) => {
    const [lang] = useLang()
    const [mobileView] = isMobile()
    const [showMore, setShowMore] = React.useState(false)
    return (
        <div className='inTable w-100 px-3 mt-3'>
            <table className='insight-table w-100'>
                <thead>
                    <tr className='tIRow borderBtm'>
                        <th className='tTitle dv_appTxtClr text-left py-3 tWidth1' >{lang.revenueSource}</th>
                        <th className='tTitle dv_appTxtClr text-left py-3 tWidth2' >{lang.gross}</th>
                        <th className='tTitle dv_appTxtClr text-left py-3 tWidth3' >{lang.net}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item, iidx) => {
                            return (
                                <tr className='tIRow borderBtm' key={item?.title || `irow${iidx}`}>
                                    <td className={`trTitle dv_appTxtClr text-left py-3 tBullet ${insColors[iidx]}`} >{item.title}</td>
                                    <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(item?.gross)}`}</td>
                                    <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(item?.net)}`}</td>
                                </tr>
                            )
                        })
                    }
                    <tr className='tIRow borderBtm'>
                        <td className='trTitle dv_appTxtClr text-left py-3 tBullet insCol10' >{lang.total}</td>
                        <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(totalGross)}`}</td>
                        <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(totalNet)}`}</td>
                    </tr>
                    <tr className='tIRow'>
                        <td className='trTitle dv_appTxtClr text-left py-3 showToggle gradient_text cursorPtr' onClick={() => setShowMore(!showMore)}>{!showMore ? lang.showFees : lang.hideFees}</td>
                    </tr>
                    {
                        showMore ? <>
                            <tr className='tIRow borderBtm'>
                                <td className='trTitle dv_appTxtClr text-left py-3 tBullet insCol11' >{lang.platformFees}</td>
                                <td className='trTitle dv_appTxtClr text-left py-3' ></td>
                                <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(data?.platformFees || 0)}`}</td>
                            </tr>
                            <tr className='tIRow borderBtm'>
                                <td className='trTitle dv_appTxtClr text-left py-3 tBullet insCol12' >{lang.bankFees}</td>
                                <td className='trTitle dv_appTxtClr text-left py-3' ></td>
                                <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(data?.bankFees || 0)}`}</td>
                            </tr>
                            <tr className='tIRow'>
                                <td className='trTitle dv_appTxtClr text-left py-3 tBullet insCol13' >{lang.agencyFees}</td>
                                <td className='trTitle dv_appTxtClr text-left py-3' ></td>
                                <td className='trTitle dv_appTxtClr text-left py-3' >{`${defaultCurrency}${convertCurrencyLocale(data?.agencyFees || 0)}`}</td>
                            </tr>
                        </> : ""
                    }
                </tbody>
            </table>
            <style jsx>
                {
                    `
                    .inTable {
                        border: 1px solid var(--l_border);
                        border-radius: 20px;
                    }
                    .tBullet {
                        position: relative;
                        padding-left: 18px;
                    }
                    .tBullet::before {
                        display: block;
                        content: "";
                        height: 12px;
                        width: 12px;
                        position: absolute;
                        background: red;
                        border-radius: 12px;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 0;
                    }
                    .tWidth1 {
                        width: ${mobileView ? '75vw' : '80vw'} 
                    }
                    .tWidth2 {
                        width:${mobileView ? '12.5vw' : '10vw'}
                    }
                    .tWidth3 {
                        width: ${mobileView ? '12.5vw' : '10vw'}
                    }
                    .insCol1::before {
                        background: #FFC678;
                    }
                    .insCol2::before {
                        background: #D33BFE;
                    }
                    .insCol3::before {
                        background: #27CA40;
                    }
                    .insCol4::before {
                        background: #FF6058;
                    }
                    .insCol5::before {
                        background: #8C34FF;
                    }
                    .insCol6::before {
                        background: #2AB6FF;
                    }
                    .insCol7::before {
                        background: #A70C0C;
                    }
                    .insCol8::before {
                        background: #E2DA11;
                    }
                    .insCol9::before {
                        background: #7480E3;
                    }
                    .insCol10::before {
                        background: linear-gradient(180deg, #D33AFF 0%, #FF71A4 100%);
                    }
                    .insCol11::before {
                        background: #FE70A5;
                    }
                    .insCol12::before {
                        background: #FEA832;
                    }
                    .insCol13::before {
                        background: #2AFF28;
                    }
                    `
                }
            </style>
        </div>

    )
}


export const YearWiseInsights = ({ list = [], moreList = [], fetchMore, noFetchMore }) => {
    const [lang] = useLang()
    const theme = useTheme()
    const [mobileView] = isMobile()
    const [seeMore, setSeeMore] = React.useState(false)
    const [selectedAccord, setSelectedAccord] = React.useState(0)
    const handleScroll = (id) => {
        const elem = document.getElementById(id)
    }
    const handleAccordClick = (idx) => {
        setSelectedAccord(idx === selectedAccord ? false : idx);
        if (idx !== selectedAccord) {
            handleScroll(`accordInsel${idx}`);
        }
    }

    const handleSeeMoreClick = () => {
        if (!seeMore) {
            setSeeMore(true)
            // fetchMore()
        } else {
            setSeeMore(false)
        }
    }

    return (
        <div className='yearwiseIns py-3'>
            {
                list.map((listItem, idx) => {
                    return (
                        <InsightAccordian
                            title={
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h3 className='m-0 yTitle dv_appTxtClr'>{new Date(listItem.dateTime).getMonth() === (new Date()).getMonth() ? lang?.currentMonth : listItem.dateTime.replace("-", " ")}</h3>
                                    <h3 className='m-0 yTitle dv_appTxtClr'>{`${defaultCurrency} ${convertCurrencyLocale(listItem.totalGross)}`}</h3>
                                </div>
                            }
                            isExpanded={idx === selectedAccord}
                            theme={theme}
                            details={
                                <InsightTable data={listItem} items={listItem.data} totalGross={listItem.totalGross} totalNet={listItem.totalNet} />
                            }
                            handleToggle={() => { handleAccordClick(idx) }}
                            accordId={`accordInsel${idx}`}
                        />
                    )
                })
            }
            {seeMore ?
                moreList.map((listItem, idx) => {
                    return (
                        <InsightAccordian
                            title={
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h3 className='m-0 yTitle dv_appTxtClr'>{new Date(listItem.dateTime).getMonth() === (new Date()).getMonth() ? lang?.currentMonth : listItem.dateTime.replace("-", " ")}</h3>
                                    <h3 className='m-0 yTitle dv_appTxtClr'>{`${defaultCurrency} ${convertCurrencyLocale(listItem.totalGross)}`}</h3>
                                </div>
                            }
                            isExpanded={idx + 'm' === selectedAccord}
                            theme={theme}
                            details={
                                <InsightTable items={listItem.data} totalGross={listItem.totalGross} totalNet={listItem.totalNet} />
                            }
                            handleToggle={() => { handleAccordClick(idx + "m") }}
                            accordId={`accordInsel${idx}m`}
                        />
                    )
                }) : ""
            }
            {
                list?.length > 0 && !noFetchMore && !seeMore ? <div className={`seeMore cursorPtr d-flex justify-content-center align-items-center p-3  ${seeMore ? 'active' : ""}`} onClick={handleSeeMoreClick}>
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
            <style jsx>
                {
                    `
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
                    .yearwiseIns .yTitle {
                        font-size:  ${mobileView ? '12px' : '16px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                        text-align: left;
                    }
                    :global(.yearwiseIns .tTitle) {
                        font-size: ${mobileView ? '12px' : '18px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                        text-align: left;
                    }
                    :global(.yearwiseIns .trTitle) {
                        font-size: ${mobileView ? '12px' : '16px'};
                        font-weight: 400;
                        letter-spacing: 0px;
                        text-align: left;
                    }
                    `
                }
            </style>
        </div>
    );
};