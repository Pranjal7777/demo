import React from 'react';
import { useTheme } from 'react-jss';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';

const addExtension = (props) => {
    const { onClose, extensionOptions = [], handleAddExtension, slot = {} } = props;
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [lang] = useLang();

    const extensionAddition = (item, previousSlot) => {
        handleAddExtension(item, previousSlot);
        onClose?.();
    };

    return (
        <>
            <div className="btmModal">
                <div className="modal-dialog rounded">
                    <div
                        className={`${mobileView ? "modal-content-mobile" : "modal-content"
                            } pt-4`}
                    >
                        {!mobileView && (
                            <button
                                type="button"
                                className="close dv_modal_close"
                                data-dismiss="modal"
                                onClick={() => onClose()}
                            >
                                {lang.btnX}
                            </button>
                        )}
                        {<div className="col-12 mx-auto pb-4">
                            <h3
                                className={
                                    mobileView
                                        ? `mb-0 fntSz22 pb-2 text-center ${theme.type == "light" ? "txt-black" : "text-white"}`
                                        : "txt-black fntSz22 text-center pb-2"
                                }
                            >
                                {lang.chooseExtension}
                            </h3>

                            <div className="rep_res px-4">
                                {extensionOptions.length ? extensionOptions.map((item) => (
                                    <div onClick={() => extensionAddition(item, slot)} className="bookBtnStyle mb-2 txt-book fntWeight600 fntSz16 px-3 py-2 cursorPtr">
                                        {item.extensionDuration}
                                    </div>
                                )) : (
                                    <div className="bookBtnStyle mb-2 txt-book fntWeight600 fntSz16 px-3 py-2 text-center">
                                        No Extension Available!
                                    </div>
                                )}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                :global(.dv_modal_close) {
                    color: var(--l_app_text) !important;
                }
                `}
            </style>
        </>
    )
}

export default addExtension;