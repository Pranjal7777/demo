import * as React from 'react';
import Icon from '../../image/icon';
import { CHAT_DOCUMENT } from '../../../lib/config/chat';
import useLang from '../../../hooks/language';
import isMobile from '../../../hooks/isMobile';
import { close_dialog, close_drawer, open_dialog, open_drawer } from '../../../lib/global/loader';
import { TextareaAutosize } from '@material-ui/core';
import Button from '../../button/button';
import Image from '../../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../../lib/config';
import { useTheme } from 'react-jss';

export const ChatNotesButton = ({ conversation, handleSubmitNotes, fetchConversation, otherProfile }) => {
    const [lang] = useLang()
    const [mobileView] = isMobile()

    const handleOpenNotes = async () => {
        let convo = await fetchConversation(conversation?.conversationId);

        if (mobileView) {
            open_drawer("chatNotes", {
                handleSubmit: handleSubmitNotes,
                conversation: convo || conversation,
                mode: convo?.metaData?.userNotes?.[otherProfile?._id] ? 'edit' : 'add',
                otherProfile: otherProfile
            }, 'bottom')
        } else {
            open_dialog("chatNotes", {
                handleSubmit: handleSubmitNotes,
                conversation: convo || conversation,
                mode: convo?.metaData?.userNotes?.[otherProfile?._id] ? 'edit' : 'add',
                otherProfile: otherProfile
            })
        }
    }

    return (
        <div className='chNoteBtn mr-2'>
            <Icon
                icon={`${CHAT_DOCUMENT}#documentText`}
                class="cursorPtr"
                size={mobileView ? 24 : 32}
                color={'var(--l_light_app_text)'}
                onClick={() => handleOpenNotes()}
            />
        </div>
    );
};

export const ChatNotes = ({ conversation, handleSubmit, otherProfile, ...props }) => {
    const [notesData, setNotesData] = React.useState('')
    const [lang] = useLang();
    const theme = useTheme();
    const [mobileView] = isMobile()
    const [editMode, setEditMode] = React.useState(false)
    const [mode, setMode] = React.useState('add');

    React.useEffect(() => {
        if (props?.mode === 'edit') {
            setMode('edit')
        }
    }, [props])

    React.useEffect(() => {
        if (conversation) {
            let note = conversation?.metaData?.userNotes?.[otherProfile?._id];
            if (note) {
                setNotesData(note)
            }
        }
    }, [conversation, otherProfile])

    return (
        <div className={`chatNotes p-4 ${editMode || mode === 'add' ? 'editMode' : 'noEdit'}`}>
            <h3 className={`dv_appTxtClr mb-3 ${mobileView ? 'fntSz22' : 'fntSz28'}`}>{mode === 'edit' && editMode ? lang?.editNotes : lang?.addNotes}</h3>
            <div className='close_icon notesClose cursorPtr'>
                <Image
                    src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                    onClick={() => props.onClose()}
                    color="white"
                    width="20"
                    alt="close_icon"
                    style={{ marginBottom: "4px" }}
                />
            </div>
            <p className='dv_appTxtClr fntSz16'>{`${lang?.notesAbout} ${conversation?.opponentDetails?.userName}`}</p>
            <TextareaAutosize
                type="text"
                placeholder={`${lang?.addNotes}...`}
                value={notesData}
                minRows={5}
                maxRows={10}
                readOnly={!editMode && mode === 'edit'}
                autoFocus
                className="form-control textAreaChat ml-0 my-2 mr-2"
                onChange={(e) => {
                    setNotesData(e.target.value);
                }}
            // onKeyDown={
            //   handleSubmitComment
            // }
            />
            <Button
                type="button"
                fclassname='noteSubmit cursorPtr gradient_bg rounded-pill py-3 mt-3 d-flex align-items-center justify-content-center text-white'
                btnSpanClass='text-white'
                btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                onClick={() => {
                    if (!editMode && mode === 'edit') {
                        setEditMode(true)
                    } else {
                        handleSubmit(conversation, notesData, () => {
                            if (mode === 'edit') {
                                setEditMode(false)
                            } else {
                                setMode('edit')
                            }
                        }, otherProfile._id)
                    }
                }}
                children={mode === 'edit' ? (!editMode ? lang.edit : lang?.update) : lang.save}
                disabled={!notesData && mode === 'add'}
            />
            <style jsx>
                {
                    `
                    :global(.textAreaChat) {
                        border-radius: 12px;
                        border: 2px solid var(--l_border) !important;
                        font-size: 16px;
                        background: transparent !important;
                        color: var(--l_app_text) !important;
                        height: auto;
                        padding: 10px 18px;
                        font-family: "Roboto", sans-serif !important;
                    }
                    :global(.noEdit .textAreaChat) {
                        border-width: 0px !important;
                        padding: 0px !important;
                    }
                    :global(.noteSubmit) {
                        width: 60%;
                        margin: auto;
                    }
                    :global(.notesClose) {
                        right: 15px;
                        top: 5px;
                    }
                    `
                }
            </style>
        </div>
    )
}