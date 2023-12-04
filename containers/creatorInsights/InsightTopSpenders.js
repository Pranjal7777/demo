import * as React from 'react';
import { defaultCurrency } from '../../lib/config/creds';
import { convertCurrencyLocale } from '../../lib/global';
import isMobile from '../../hooks/isMobile';
import FigureCloudinayImage from '../../components/cloudinayImage/cloudinaryImage';
import Button from '../../components/button/button';
import useLang from '../../hooks/language';
import Image from '../../components/image/image';
import { ARROW_GRADIENT_ICON } from '../../lib/config';
import { useChatFunctions } from '../../hooks/useChatFunctions';

export const InsightTopSpenders = ({ topData }) => {
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const topSpenders = topData?.topSpenders || []
    const [seeMore, setSeeMore] = React.useState()
    const [dataLimit, setDataLimit] = React.useState(3)
    const { handleChat } = useChatFunctions()


    const handleSeeMoreClick = () => {
        setSeeMore(!seeMore)
        if (seeMore) {
            setDataLimit(3)
        } else {
            setDataLimit(10)
        }
    }
    return (
        <div className={`topSpenders mt-3 ${mobileView ? 'p-2' : 'p-4'}`}>
            <h3 className='secTitle'>{lang?.topSpenders}</h3>
            <div className='topList'>
                <div className='inner-wrapper'>
                    {
                        topSpenders.filter((f, indx) => indx < dataLimit).map((user, idx) => {
                            return (
                                <div className='userItem borderBtm d-flex align-items-center justify-content-between p-2' key={user?.userName}>
                                    <div className='d-flex align-items-center p-3'>
                                        <div className='userRank'>
                                            {`#${idx + 1}`}
                                        </div>
                                        <div className='userInfo d-flex align-items-center'>
                                            <div className='userPic mx-3' style={{ height: mobileView ? 40 : 80, width: mobileView ? 40 : 80 }}>
                                                <FigureCloudinayImage
                                                    publicId={user?.profilePic}
                                                    width={mobileView ? 40 : 80}
                                                    height={mobileView ? 40 : 80}
                                                    ratio={1}
                                                    className="mv_profile_logo"
                                                    alt={user?.userName}
                                                />
                                            </div>
                                            <div className='userDetail'>
                                                <p className='userName mb-2'>{user?.userName}</p>
                                                <p className='spendTitle m-0'>{lang?.totalSpent}</p>
                                                <p className='spendAmout m-0'>{`${defaultCurrency}${convertCurrencyLocale(user?.spend)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        fclassname={`py-2 px-4 mr-2 rounded-pill w-auto gradient_bg`}
                                        onClick={() => { handleChat({ userId: user?.userId }) }}
                                    >
                                        {lang.message}
                                    </Button>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    topSpenders?.length > 3 ? <div className={`seeMore cursorPtr d-flex justify-content-center align-items-center p-2 mt-2  ${seeMore ? 'active' : ""}`} onClick={handleSeeMoreClick}>
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
                    `.topSpenders {
                        border: 1px solid var(--l_border);
                        border-radius: ${mobileView ? '12px' : '20px'};
                        border-width: ${mobileView ? '1px' : '1px'} !important;
                    }
                    .userItem .userName {
                        font-size: ${mobileView ? '12px' : '14px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                    }
                    .spendTitle {
                        color: var(--l_light_app_text);
                        font-size: ${mobileView ? '8px' : '14px'};
                    }
                    .spendAmout {
                        color: var(--l_app_text);
                        font-size: ${mobileView ? '10px' : '14px'};
                        font-weight: 600;
                    }
                   .userRank {
                        color: var(--l_app_text);
                        font-size: 14px;
                        font-weight: 600;
                    }
                    :global(.userPic img) {
                        height: 100% !important;
                        width: 100% !important;
                    }
                    .userItem:last-child {
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