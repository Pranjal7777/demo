import * as React from 'react';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader } from '../../../lib/global/loader';
import isMobile from '../../../hooks/isMobile';
import { postBulkMessage } from '../../../services/bulkMessage';
import { stopLoader } from '../../../lib/global';
import { updateBlkMsgSubject } from '../../../lib/rxSubject';
import useLang from '../../../hooks/language';
import { isAgency } from '../../../lib/config/creds';
import { useSelector } from 'react-redux';

export const useBulkMessage = ({ ...props }) => {
    const [mobileView] = isMobile()
    const [selectedLists, setSelectedLists] = React.useState([])
    const [lang] = useLang()
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);


    const handleSelectedList = (e, data) => {
        if (data.listType === 'DEFAULT') {
            const currentListIndex = selectedLists.find((list) => list.subTitle === data.subTitle);
            if (e.target.checked) {
                setSelectedLists((prev) => [data]);
            } else if (currentListIndex !== -1) {
                setSelectedLists((prev) => {
                    const newPrev = [...prev]
                    newPrev.splice(currentListIndex, 1)
                    return newPrev
                });
            }
        } else {
            const currentListIndex = selectedLists.find((list) => list._id === data._id);
            if (e.target.checked) {
                setSelectedLists((prev) => [data]);
            } else if (currentListIndex !== -1) {
                setSelectedLists((prev) => {
                    const newPrev = [...prev]
                    newPrev.splice(currentListIndex, 1)
                    return newPrev
                });
            }
        }
    }

    const handleBulkMessageSend = (postingPayload) => {
        const listData = { ...selectedLists[0] }
        const bulkPayload = {
            "listType": listData.listType,
            "listTitle": listData.listTitle,
            "listSelectedValue": listData.listType === 'DEFAULT' ? listData.subTitle : listData._id, // 'MY_FOLLOWERS', 'FOLLOWINGS', 'MY_SUBSCRIBERS', 'UNSUBSCRIBERS'
            "postData": [...postingPayload.postData],
            "description": postingPayload.description,
            "postType": postingPayload.price && +postingPayload.price > 0 ? "LOCKED_POST" : "BULK_POST", // BULK_POST,LOCKED_POST
            "price": +postingPayload.price,
            "currencyCode": postingPayload.currency.currency_code,
            "currencySymbol": postingPayload.currency.symbol,
        }
        if (postingPayload.previewData && postingPayload.previewData.length > 0) {
            bulkPayload['previewData'] = [...postingPayload.previewData];
        }
        if (!postingPayload.description) {
            delete bulkPayload.description;
        }
        if (isAgency()) {
            bulkPayload["userId"] = selectedCreatorId;
        }
        return new Promise((resolve) => {
            startLoader()
            postBulkMessage(bulkPayload).then(res => {
                resolve(res)
                stopLoader();
                return;
            }).catch(e => {
                stopLoader();
                Toast(e?.response?.data?.message || e.message, 'error')
            })
        })

    }
    const handleUploadSuccess = () => {
        if (mobileView) {
            close_drawer()
        } else {
            close_dialog()
        }
        Toast(lang.bulkSendSuccess)
        updateBlkMsgSubject.next()
    }

    const handleCreateBulkMessage = (handleClose) => {
        mobileView ? open_drawer('CREATE_POST', {
            sendLocked: true,
            isBulk: true,
            handleClose: handleClose,
            // sendTo: recipientId,
            sendLockPost: handleBulkMessageSend,
            onUploadSuccess: handleUploadSuccess
        }, "bottom")
            : open_dialog("POST_DIALOG", {
                sendLocked: true,
                isBulk: true,
                handleClose: handleClose,
                // sendTo: recipientId,
                sendLockPost: handleBulkMessageSend,
                onUploadSuccess: handleUploadSuccess
            })
    }

    const addBulkMessageHandler = () => {
        mobileView ? open_drawer("bulkMessage", {
            close: () => close_drawer("bulkMessage"),
        }, "bottom") : open_dialog("bulkMessage", {
            close: () => close_dialog("bulkMessage"),
        });
    }
    return {
        selectedLists,
        handleSelectedList,
        setSelectedLists,
        addBulkMessageHandler,
        handleCreateBulkMessage,
    };
};
