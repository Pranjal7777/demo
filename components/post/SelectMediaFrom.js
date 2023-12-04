import * as React from 'react';
import useLang from '../../hooks/language';
import { useTheme } from 'react-jss';
import Image from '../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../lib/config';
import useProfileData from '../../hooks/useProfileData';
import { drawerToast, open_dialog } from '../../lib/global/loader';
import { sendMail } from '../../lib/global/routeAuth';
import isMobile from '../../hooks/isMobile';

const SelectMediaFrom = ({ handleSelect, ...props }) => {
    const [lang] = useLang();
    const theme = useTheme();
    const [mobileView] = isMobile()

    return (
        <div className='create-new p-4 position-relative'>
            <div className='close_icon'>
                <Image
                    src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                    onClick={() => props.onClose()}
                    color="white"
                    width="20"
                    alt="close_icon"
                    style={{ marginBottom: "4px" }}
                />
            </div>
            <h3 className='mainTitle text-center title text-app'>{lang.selectFrom}</h3>
            <div className='select-box p-2'>
                <div onClick={() => handleSelect(2)} className={`select-item d-flex align-items-center p-3 mt-3 ${mobileView ? 'justify-content-center' : ''}`}>
                    <div className='selecticon mr-2'>
                        <svg width={mobileView ? "24" :"32"} height={mobileView ? "24" :"32"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.2" cx="16" cy="16" r="16" fill="url(#paint0_linear_2870_15444)" />
                            <path d="M5 12.8C4.72386 12.8 4.5 13.0239 4.5 13.3C4.5 13.5762 4.72386 13.8 5 13.8V12.8ZM7.72731 12.8H5V13.8H7.72731V12.8Z" fill="#836B8A" />
                            <path d="M5 18.2004C4.72386 18.2004 4.5 18.4243 4.5 18.7004C4.5 18.9766 4.72386 19.2004 5 19.2004V18.2004ZM7.72731 18.2004H5V19.2004H7.72731V18.2004Z" fill="#836B8A" />
                            <path d="M24.5001 16C24.5001 20.6897 20.6585 24.5 15.9091 24.5C11.1596 24.5 7.31805 20.6897 7.31805 16C7.31805 11.3103 11.1596 7.5 15.9091 7.5C20.6585 7.5 24.5001 11.3103 24.5001 16Z" stroke="#836B8A" />
                            <ellipse cx="16.3628" cy="9.24956" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="20.9089" cy="11.0501" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="22.7279" cy="16.45" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="20.9089" cy="20.9502" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="16.3628" cy="22.7498" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="10.9096" cy="20.9502" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="9.09066" cy="16.45" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <ellipse cx="10.9096" cy="11.0501" rx="0.454551" ry="0.45" fill="#836B8A" />
                            <path d="M18.57 16.0658C18.57 17.5274 17.3731 18.7122 15.8968 18.7122C14.4204 18.7122 13.2236 17.5274 13.2236 16.0658C13.2236 14.6042 14.4204 13.4194 15.8968 13.4194C17.3731 13.4194 18.57 14.6042 18.57 16.0658Z" stroke="#836B8A" />
                            <path d="M15.8978 13.2363V11.6643" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M13.6974 13.8828L12.7297 12.9236" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M18.1046 14.0334L19.2274 12.9219" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M19.0772 16.0691H20.3475" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M11.4511 16.0652H13.039" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M18.5681 16.0639C18.5681 14.6023 17.3713 13.4174 15.8949 13.4174C14.4186 13.4174 13.2217 14.6023 13.2217 16.0639C13.2217 17.5254 14.4186 18.7103 15.8949 18.7103C17.3713 18.7103 18.5681 17.5254 18.5681 16.0639Z" stroke="#836B8A" />
                            <path d="M15.897 18.8926V20.4646" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M13.6895 18.2482L12.7261 19.2124" stroke="#836B8A" stroke-linecap="round" />
                            <path d="M18.1028 18.0962L19.2256 19.2078" stroke="#836B8A" stroke-linecap="round" />
                            <defs>
                                <linearGradient id="paint0_linear_2870_15444" x1="0" y1="0" x2="35.3159" y2="4.21456" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#D33AFF" />
                                    <stop offset="1" stop-color="#FF71A4" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className='selectLabel text-app'>{lang.myVault}</div>
                </div>
                <div onClick={() => handleSelect(1)} className={`select-item d-flex align-items-center p-3 mt-3 ${mobileView ? 'justify-content-center' : ''}`}>
                    <div className='selecticon mr-2'>
                        <svg width={mobileView ? "24" :"32"} height={mobileView ? "24" :"32"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.2" cx="16" cy="16" r="16" fill="url(#paint0_linear_2870_15919)" />
                            <path d="M23.1604 11.7918C23.1604 9.09583 22.4884 8.42383 19.7924 8.42383H11.3684C8.67237 8.42383 8.00037 9.09583 8.00037 11.7918V16.5918C8.00037 19.2878 8.67237 19.9598 11.3684 19.9598H14.4004V23.5758H11.7924M8.00037 16.7598H14.4004" stroke="#836B8A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24.0004 16.64V21.208C24.0004 23.104 23.5284 23.576 21.6324 23.576H18.7924C16.8964 23.576 16.4244 23.104 16.4244 21.208V16.64C16.4244 14.744 16.8964 14.272 18.7924 14.272H21.6324C23.5284 14.272 24.0004 14.744 24.0004 16.64Z" stroke="#836B8A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M20.1956 21H20.2036" stroke="#836B8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <defs>
                                <linearGradient id="paint0_linear_2870_15919" x1="0" y1="0" x2="35.3159" y2="4.21456" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#D33AFF" />
                                    <stop offset="1" stop-color="#FF71A4" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className='selectLabel text-app'>{lang.fromDevice}</div>
                </div>
            </div>
            <style jsx>
                {
                    `
                    .create-new .title {
                        font-size: 1.75em
                    }
                    .create-new .select-box {
                        width: 100%;
                        max-width: 300px;
                        margin:auto
                    }
                    .create-new .select-item {
                        border: 1px solid var(--l_border);
                        border-radius: ${mobileView ? '60px' : '12px'};
                        cursor: pointer;
                    }
                    .create-new .close_icon {
                        top: 0.75rem;
                        right: 1.5rem;
                    }
                    .create-new .selectLabel {
                        font-size: ${mobileView ? "16px" : "18px"};
                        font-weight: 500
                    }
                    `
                }
            </style>
        </div>
    );
};

export default SelectMediaFrom;