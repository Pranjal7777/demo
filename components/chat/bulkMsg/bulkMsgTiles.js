import React, { useEffect, useRef, useState } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
import BulkMessageUI from '../../../containers/message/bulkMessageUI'
import Chat from '../webChat/chat'
import { getChatList } from '../../../redux/actions/chat/action'
import { connect } from 'react-redux'
import { ChatSideBarHeader } from '../ChatSideBarHeader'
import DetailBulkMessage from '../../Drawer/bulkMessage/singleBulkMessage'
import isMobile from '../../../hooks/isMobile'
import { useTheme } from 'react-jss'
import { useBulkMessage } from './useBulkMessage'
import { updateBlkMsgSubject } from '../../../lib/rxSubject'

const BulkMsgTiles = (props) => {
    const bulkMsgListRef = useRef();
    const bulkMsgDetailRef = useRef();
    const bulkRxRef = React.useRef()
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [flag, setFlag] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [sortBy, setSortBy] = useState();
    const { addBulkMessageHandler } = useBulkMessage()

    const handleRefresh = () => {
        return bulkMsgListRef?.current.refreshList({ isInitial: true })

        //  new Promise(async (resolve) => {
        //     let { getChats } = props;
        //     getChats(
        //         getChatList({
        //             name: "sale",
        //             type: env.TRIGGER_POINT.sale,
        //             initial: true,
        //         })
        //     );
        //     setTimeout(resolve, 1);
        // });
    };

    React.useEffect(() => {
        bulkRxRef.current = updateBlkMsgSubject.subscribe(() => {
            console.log("update bulk message upload")
            handleRefresh()
        })

        return () => {
            if (bulkRxRef.current) {
                bulkRxRef.current?.unsubscribe()
                bulkRxRef.current = undefined;
            }
        }
    }, [])

    const handleSortBy = (value) => {
        setSortBy(value || 'DEFAULT')
    }

    return (
        <>
            <div className='row mx-0 h-100'>
                <div className='col-12 col-md-4 px-0 d-flex flex-column' style={{ height: '100vh' }}>
                    <ChatSideBarHeader sortBy={sortBy} onSortBy={handleSortBy} bulkMsgListRef={bulkMsgListRef} addBulkMessageHandler={addBulkMessageHandler} />
                    {/* <PullToRefresh
                        onRefresh={handleRefresh}
                        fetchMoreThreshold={500}
                    > */}
                    <div className="chatList overflow-auto" id={`bulk-msg-pagination`}>
                        <BulkMessageUI
                            bulkMsgListRef={bulkMsgListRef}
                            bulkMsgDetailRef={bulkMsgDetailRef}
                            flag={flag}
                            pageCount={pageCount}
                            setFlag={setFlag}
                            setPageCount={setPageCount}
                            sortBy={sortBy}
                            addBulkMessageHandler={addBulkMessageHandler}
                        />
                    </div>
                    {/* </PullToRefresh> */}
                </div>
                {!mobileView && <div className="col-12 col-md-8 px-0 section-2 position-relative borderStroke bulkChatMainSection">
                    <DetailBulkMessage bulkMsgDetailRef={bulkMsgDetailRef} addBulkMessageHandler={addBulkMessageHandler} />
                </div>}
            </div>
            <style jsx>{`
                .bulkChatMainSection{
                    background: ${theme.type === "light" ? "url(/Bombshell/images/chat/bulk-bg-light.svg)" : "url(/Bombshell/images/chat/bulk-bg-dark.svg)"};
                    background-position: center;
                    background-size: cover;
                }
            `}</style>
        </>
    )
}

const maptoState = (state) => {
    return {
        redux: state,
    };
};

const dispatchAction = (dispatch) => {
    return {
        getChats: (dispatchAction) => dispatch(dispatchAction),
        getMessages: (dispatchAction) => dispatch(dispatchAction),
        changeReadStatus: (dispatchAction) => dispatch(dispatchAction),
        deleteChat: (dispatchAction) => dispatch(dispatchAction),
        reduxDispatch: (dispatchAction) => dispatch(dispatchAction),
    };
};

export default connect(maptoState, dispatchAction)(BulkMsgTiles);