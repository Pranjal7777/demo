import * as React from 'react';
import useLang from '../../hooks/language';
import { useTheme } from 'react-jss';
import Image from '../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../lib/config';
import useProfileData from '../../hooks/useProfileData';
import { close_dialog, drawerToast, open_dialog } from '../../lib/global/loader';
import { sendMail } from '../../lib/global/routeAuth';

const CreateType = (props) => {
    const [lang] = useLang()
    const theme = useTheme()
    const [profile] = useProfileData();

    const handleCreatePost = () => {
        setTimeout(() => {
            close_dialog('createNew')
        }, 400)
        if (profile && [5, 6].includes(profile.statusCode)) {
            return drawerToast({
                closing_time: 15000,
                title: lang.submitted,
                desc: lang.unverifiedProfile,
                closeIconVisible: true,
                button: {
                    text: lang.contactUs,
                    onClick: () => {
                        sendMail();
                    },
                },
                titleClass: "max-full",
                autoClose: true,
                isMobile: false,
            });
        }
        else {
            open_dialog("POST_DIALOG", {
                story: false,
            })
        }
    }

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
            <h3 className='text-center title'>{lang.createNew}</h3>
            <div className='select-box p-2'>
                <div className='select-item d-flex align-items-center p-3 mt-3' onClick={handleCreatePost}>
                    <div className='selecticon mr-2'>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" id="createPost">
                            <ellipse cx="14" cy="14" rx="14" ry="14" fill="url(#paint0_linear_2742_24442)" fill-opacity="0.2" />
                            <g clip-path="url(#clip0_2742_24442)">
                                <path d="M12.2513 19.8327H15.7513C18.668 19.8327 19.8346 18.666 19.8346 15.7493V12.2493C19.8346 9.33268 18.668 8.16602 15.7513 8.16602H12.2513C9.33464 8.16602 8.16797 9.33268 8.16797 12.2493V15.7493C8.16797 18.666 9.33464 19.8327 12.2513 19.8327Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8.55859 18.0542L11.4344 16.1233C11.8953 15.8142 12.5603 15.8492 12.9744 16.205L13.1669 16.3742C13.6219 16.765 14.3569 16.765 14.8119 16.3742L17.2386 14.2917C17.6936 13.9008 18.4286 13.9008 18.8836 14.2917L19.8344 15.1083M12.2511 12.8333C12.5605 12.8333 12.8573 12.7104 13.0761 12.4916C13.2948 12.2728 13.4178 11.9761 13.4178 11.6667C13.4178 11.3572 13.2948 11.0605 13.0761 10.8417C12.8573 10.6229 12.5605 10.5 12.2511 10.5C11.9417 10.5 11.6449 10.6229 11.4261 10.8417C11.2073 11.0605 11.0844 11.3572 11.0844 11.6667C11.0844 11.9761 11.2073 12.2728 11.4261 12.4916C11.6449 12.7104 11.9417 12.8333 12.2511 12.8333Z" stroke="#F5D0FF" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_2742_24442" x1="0" y1="0" x2="30.9014" y2="3.68774" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#D33AFF" />
                                    <stop offset="1" stop-color="#FF71A4" />
                                </linearGradient>
                                <clipPath id="clip0_2742_24442">
                                    <rect width="14" height="14" fill="white" transform="translate(7 7)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className='selectLabel'>{lang.newPost}</div>
                </div>
                <div className='select-item d-flex align-items-center p-3 mt-3'>
                    <div className='selecticon mr-2'>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse opacity="0.2" cx="14" cy="14" rx="14" ry="14" fill="url(#paint0_linear_2742_11339)" />
                            <g clip-path="url(#clip0_2742_11339)">
                                <path d="M8.16797 19.834H19.8346" stroke="#F5D0FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.6875 9.33268V19.8327H15.3125V9.33268C15.3125 8.69102 15.05 8.16602 14.2625 8.16602H13.7375C12.95 8.16602 12.6875 8.69102 12.6875 9.33268ZM8.75 12.8327V19.8327H11.0833V12.8327C11.0833 12.191 10.85 11.666 10.15 11.666H9.68333C8.98333 11.666 8.75 12.191 8.75 12.8327ZM16.9167 15.7493V19.8327H19.25V15.7493C19.25 15.1077 19.0167 14.5827 18.3167 14.5827H17.85C17.15 14.5827 16.9167 15.1077 16.9167 15.7493Z" stroke="#F5D0FF" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_2742_11339" x1="0" y1="0" x2="30.9014" y2="3.68774" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#D33AFF" />
                                    <stop offset="1" stop-color="#FF71A4" />
                                </linearGradient>
                                <clipPath id="clip0_2742_11339">
                                    <rect width="14" height="14" fill="white" transform="translate(7 7)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className='selectLabel'>{lang.conductPoll}</div>
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
                        border-radius: 12px;
                        cursor: pointer;
                    }
                    .create-new .close_icon {
                        top: 0.75rem;
                        right: 1.5rem;
                    }
                    .create-new .selectLabel {
                        font-size: 18px;
                        font-weight: 500
                    }
                    `
                }
            </style>
        </div>
    );
};

export default CreateType