import React, { useRef, useState } from 'react'
import useLang from '../../../hooks/language';
import Button from '../../../components/button/button';
import DVinputText from '../../../components/DVformControl/DVinputText';
import Icon from '../../../components/image/icon';
import { EDIT_PROFILE_ICON, IMAGE_TYPE, P_CLOSE_ICONS } from '../../../lib/config';
import isMobile from '../../../hooks/isMobile';
import Image from '../../../components/image/image';
import { ADD_FILE_LOGO } from '../../../lib/config/placeholder';
import Script from 'next/script';
import { useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';

const RenameFolderDialog = (props) => {
    const [lang] = useLang();
    const [mobile] = isMobile();
    const fileSelect = useRef(null);
    const [rename, setRename] = useState(props?.filename || '');
    const [imageFile, setImageFile] = useState(props.image || "");
    const [isCoverImageChanged, setCoverImageChanged] = useState(false)
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [showEditIcon, setShowEditIcon] = useState(false)

    const handleCreate = () => {
        let data = {
            rename: rename,
            imageUrl: imageFile,
        }
        if (imageFile) {
            props?.handleName(data, isCoverImageChanged);
        } else {
            props?.handleName(({ rename }));
        }
        props.onClose();
    }

    return (
        <>
            <Script
                defer={true}
                src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
            />
            <div className='borderStroke'>
                <div className="px-5 pt-4">
                    <div>
                        <h4 className="text-app text-center">{props.titleName}</h4>
                        <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", right: mobile ? "18px" : "8px" }}>
                            <Icon
                                icon={`${P_CLOSE_ICONS}#cross_btn`}
                                hoverColor='var(--l_base)'
                                color={'var(--l_app_text)'}
                                width={20}
                                height={20}
                                alt="Back Arrow"
                            />
                        </div>
                    </div>
                    <div className="pt-3 mb-0">
                        {props.imageInput && <div className='borderStroke cursorPtr radius_12 d-flex justify-content-center align-items-center mb-3 mx-auto position-relative' style={{ width: "6rem", height: "6rem" }} onClick={() => fileSelect.current.click()}>
                            {imageFile ? <Image
                                src={URL.createObjectURL(imageFile)}
                                width="100%"
                                height="100%"
                                style={{ borderRadius: '12px', objectFit: "cover" }}
                            /> : props?.folderDetail?.coverImage ? <div className='position-relative h-100'>
                                <Image
                                    src={s3ImageLinkGen(S3_IMG_LINK, props?.folderDetail?.coverImage, 40, 188, 200)}
                                    width="100%"
                                    height="100%"
                                    style={{ borderRadius: '12px', objectFit: "cover" }}
                                    onLoad={() => { setShowEditIcon(true) }}
                                />
                                {showEditIcon && <div
                                    className="position-absolute editImage "
                                    style={{ cursor: "pointer" }}
                                >
                                    <Icon
                                        icon={EDIT_PROFILE_ICON + "#edit_prfile"}
                                        size={14}
                                        color={"var(--l_app_text)"}
                                        viewBox="0 0 14 14"
                                    />
                                </div>}
                            </div> :
                                <>
                                    <Image
                                        src={ADD_FILE_LOGO}
                                        width="40"
                                        height="40"
                                    />
                                    <div className='position-absolute fntSz10' style={{ bottom: "8px" }}>{lang.coverPicture}</div>
                                </>
                            }
                            {<input
                                type="file"
                                className='d-none'
                                accept={IMAGE_TYPE}
                                ref={(el) => (fileSelect.current = el)}
                                onChange={(e) => {
                                    setImageFile(e?.target?.files[0])
                                    setCoverImageChanged(true)
                                }}
                            />}

                        </div>
                        }
                        <div className='w-100'>
                            <DVinputText
                                className="dark_input_section specific_section_bg borderStroke radius_12 text-app"
                                style={{ padding: '21.5px' }}
                                id="accountHolderName"
                                name="accountHolderName"
                                value={rename}
                                autoComplete='off'
                                placeholder={props.titleName}
                                onChange={(e) => setRename(e.target.value)}
                                type="accountHolderName"
                            />
                        </div>
                    </div>
                </div>
                <div className={`px-5 ${mobile ? "py-3" : "pb-3"}  specific_section_bg`}>
                    <Button
                        type="button"
                        fclassname='rounded-pill my-2 btnGradient_bg'
                        btnSpanClass=" font-weight-500 letterSpacing3"
                        onClick={handleCreate}
                        disabled={!isCoverImageChanged && (rename === props?.filename || !rename.length)}
                        children={props?.submitBtn || lang?.rename}
                    />
                    {props?.cancelBtn && <Button
                        type="button"
                        cssStyles={{
                            background: "none",
                            border: '1px solid var(--l_base)'
                        }}
                        fclassname='rounded-pill my-2'
                        btnSpanClass="gradient_text font-weight-500 letterSpacing3"
                        onClick={props.onClose}
                        children={props?.cancelBtn}
                    />}
                </div>
                <style jsx>{`
                .editImage{
                    bottom: 5px;
                    right: 5px;
                    background: #ab9a9a7d;
                    border-radius: 50%;
                    height: 25px;
                    width: 25px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                `}</style>
            </div>
        </>
    )
}

export default RenameFolderDialog