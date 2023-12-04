import React from 'react'
import useLang from '../../../hooks/language'
import Button from '../../../components/button/button';
import Icon from '../../../components/image/icon';
import { CLOSE_ICON_WHITE } from '../../../lib/config/logo';

const DeleteFolderDialog = (props) => {
    const [lang] = useLang();
    return (
        <>
            <div className='borderStroke'>
                <div className="d-block d-md-none text-right pt-3 pr-3">
                    <Icon
                        icon={`${CLOSE_ICON_WHITE}#close-white`}
                        color={"var(--l_app_text)"}
                        size={16}
                        onClick={() => props.onClose()}
                        alt="back_arrow"
                        class="cursorPtr px-2"
                        viewBox="0 0 16 16"
                    />
                </div>
                <div className="px-5 pt-md-4 text-center">
                    <h4 className="text-app">{lang.delete} {props?.title}</h4>
                    <p className={`pt-3 mb-0  ${!!props?.description ? "text-app" : "light_app_text"}`}>
                        {lang.sureDelete} {props.subTitle}?
                    </p>
                    {!!props?.description && <p className="mb-0 light_app_text">
                        {props.description}?
                    </p>}
                </div>
                <div className='px-3 px-md-5 py-3 specific_section_bg'>
                    <Button
                        type="button"
                        cssStyles={{
                            background: "rgba(255, 52, 52, 0.1)",
                            border: '1px solid #FF3434',
                        }}
                        fclassname='rounded-pill my-2'
                        btnSpanClass="text-danger font-weight-500 letterSpacing3"
                        onClick={() => { props?.delete(), props.onClose() }}
                        children={props?.sunbmitBtn || lang?.delete}
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
                        children={props?.cancelBtn || lang?.cancel}
                    />}
                </div>
            </div>
            <style jsx>{`
                @media screen and (min-width: 720px) {
                    :global(.deleteFiles>div>div) {
                        max-width: 500px;
                        min-width: 500px;
                    }
                }
            `}</style>
        </>
    )
}

export default DeleteFolderDialog