// @flow 
import * as React from 'react';
import { palette } from '../../../lib/palette';
import isMobile from '../../../hooks/isMobile';
import { useTheme } from 'react-jss';
import Icon from '../../image/icon';
import { DOLLAR_ICON_GRADIENT, P_CLOSE_ICONS, defaultCurrency } from '../../../lib/config';
import useLang from '../../../hooks/language';
import { DOLLAR_ICON } from '../../../lib/config/homepage';
import Image from '../../image/image';
import { useSelector } from 'react-redux';
import InputText from '../../formControl/inputText';
import Button from '../../button/button';
import { getDeviceId } from '../../../lib/helper/detectDevice';
import { textencode } from '../../../lib/chat';
import { Toast, close_dialog, close_drawer, startLoader, stopLoader } from '../../../lib/global/loader';

const RequestTip = ({ editMode, editData, message, conversation, ...props }) => {
    const [mobileView] = isMobile();
    const theme = useTheme()
    const [lang] = useLang()
    const minTipValue = useSelector((state) => state.appConfig.minTipValue)
    const maxTipValue = useSelector((state) => state.appConfig.maxTipValue);
    const [tip, setTip] = React.useState()
    const [note, setNote] = React.useState("")

    let mobileThemeBox = {
        background: theme.type == "light" ? palette.l_input_bg : palette.d_input_bg,
        color: theme.text,
        border: theme.type == "light" ? "none" : `1px solid ${theme.border}`,
    };

    React.useEffect(() => {
        if (editMode && editData) {
            setTip(editData?.amount)
            setNote(editData?.comments)
        }
    }, [editMode, editData])

    const handleSubmitTip = async (e) => {
        e.preventDefault()
        startLoader()
        try {
            const msgPayload = {
                "showInConversation": true,
                "metaData": {
                    "secretMessage": true,
                    "messageType": "TIP_REQUEST",
                    "amount": Number(tip),
                    "comments": note || '',
                    "status": "REQUESTED" // REQUESTED, SENT
                },
                "messageType": 0,
                "events": {
                    "updateUnreadCount": true,
                    "sendPushNotification": true
                },
                "encrypted": true,
                "deviceId": getDeviceId(),
                "customType": "NormalMessage",
                "conversationId": conversation?.conversationId,
                "conversationType": 0,
                "isGroup": false,
                "body": "VGlwIFJlcXVlc3Q=",
                "searchableTags": [
                    "Tip Request"
                ]
            }
            if (note) {
                msgPayload.searchableTags = [...msgPayload?.searchableTags, note, textencode(note)]
            }
            const { chatClient } = await import('isometrik-chat');
            await chatClient()?.message?.postMessages(msgPayload);
            stopLoader()
            mobileView ? close_drawer() : close_dialog()
        } catch (e) {
            stopLoader()
            Toast(lang.somethingWrong, 'error')
        }
    }

    const handleEditTip = async (e) => {
        e.preventDefault()
        try {
            const newMetaData = {
                ...message.metaData,
                comments: note || '',
                amount: tip
            }
            const { chatClient } = await import('isometrik-chat');
            await chatClient()?.message?.patchMessages({
                conversationId: message?.conversationId,
                metaData: newMetaData,
                messageId: message?.messageId,
                // updateMessageWithoutNotifyingMembers: true
            });
            stopLoader()
            mobileView ? close_drawer() : close_dialog()
        } catch (e) {
            stopLoader()
            Toast(lang.somethingWrong, 'error')
        }

    }

    return (
        <div className='requestTip card_bg text-app p-4'>
            <div className='hover_bgClr position-absolute' onClick={() => props.onClose()} style={{ borderRadius: "10px", padding: '6px', top: mobileView ? '10px' : "12px", right: mobileView ? "18px" : "8px", zIndex: 1 }}>
                <Icon
                    icon={`${P_CLOSE_ICONS}#cross_btn`}
                    hoverColor='var(--l_base)'
                    color={'var(--l_app_text)'}
                    width={20}
                    height={20}
                    alt="Back Arrow"
                />
            </div>
            <div className="d-flex align-items-center justify-content-center mb-3">
                {/* <Image
                    src={`${DOLLAR_ICON_GRADIENT}#dollarGradient`}
                    width={28}
                    height={28}
                    class="d-flex align-items-center cursorPtr gradient_text"
                    viewBox="0 0 20 20"
                    style={{ margin: '5px' }}
                /> */}
                <h4 className="text-app text-center fntSz28 text-center m-0">{lang.requestTip}</h4>
            </div>
            <p className='fntSz16 text-center' style={{ color: 'var(--l_light_app_text)' }}>{lang.requestTipDesc}</p>
            <div className='labelText'>
                {lang.message}
            </div>
            <div className="form-group">
                <textarea
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    className="form-control input-tip-text-area-tip text-app"
                    placeholder={lang.writeSomething}
                    rows={4}
                />
            </div>
            <div className='labelText'>
                {lang.tipAmount}
            </div>
            <div className='position-relative tipInput'>
                <InputText
                    value={tip}
                    type="text"
                    min={minTipValue}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control tip-amount pl-45"
                    placeholder="0"
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            if (e.target.value?.toString?.().includes('.')) {
                                setTip(Number(e.target.value.toString().split(".")[0]))
                            } else {
                                setTip(e.target.value)
                            }
                        } else {
                            setTip(0)
                        }

                    }}
                    cssStyles={
                        mobileView
                            ? theme.type == "light"
                                ? mobileThemeBox
                                : mobileThemeBox
                            : mobileThemeBox
                    }
                />
                <div className='currencyIcon d-flex align-items-center justify-content-center'>{defaultCurrency}</div>
            </div>

            {
                (tip < minTipValue || tip > maxTipValue) &&
                <p
                    className='ml-2 form-group text-danger'
                    style={{
                        // position: 'absolute',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginTop: '0px',
                        left: '30',
                    }}
                >{lang.lowestTipText} ${minTipValue} or {lang.maxTipText} ${maxTipValue}</p>
            }
            <Button
                fclassname="rTipbtn gradient_bg"
                disabled={tip < minTipValue || tip > maxTipValue || !tip}
                onClick={editMode ? handleEditTip : handleSubmitTip}
            >
                {editMode ? lang.update : lang.request}
            </Button>
            <style jsx>
                {`
            :global(.RequestTip.MuiPaper-root) {
                min-width: ${mobileView ? '100%' : '600px'};
            }
          .input-tip-text-area-tip, :global(.requestTip .tip-amount) {
            color: var(--l_app_text);
            border-radius: 12px !important;
            background-color: transparent !important;
            border: 1px solid var(--l_border);
            padding: 16px;
          }
          :global(.requestTip .tip-amount) {
            border-radius: 12px !important;
            padding-left: 28px !important;
            font-size: 16px;
          }
          :global(.rTipbtn) {
            border-radius: 20px !important;
          }
          .requestTip .tipInput .currencyIcon {
            display:block;
            height: 100%;
            font-size: 16px;
            position: absolute;
            left: 16px;
            top: 0;
            line-height: 0;
          }
          :global(.MuiInputBase-input), 
          :global(.MuiFormLabel-root),
          :global(.MuiTypography-colorTextSecondary),
          .hdr__sm__Title,
          .dv_modal_close{
            color: var(--l_app_text) !important;
          }
          .text-muted{
            color: #AAAAAA !important;
          }
          :global(.pl-45){
            padding-left:45px;
          }
          .manageScroll::-webkit-scrollbar,
          .manageScroll::-webkit-scrollbar {
            display: block !important;
          }
          .manageScroll::-webkit-scrollbar-thumb {
            background-color:var(--l_base) !important;
          }
          .labelText {
            margin-bottom: 10px;
            color: ${theme.type === 'light' ? 'var(--l_light_app_text)' : 'var(--l_light_app_text)'};
            font-size: ${mobileView ? '12px' : '14px'};
          }
          textarea:focus {
            border-color: var(--l_base);
          }
        `}
            </style>
        </div>
    );
};

export default RequestTip