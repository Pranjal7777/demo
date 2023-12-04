import React from "react";
import { useDispatch } from 'react-redux';
import isMobile from "../../../hooks/isMobile";
import { getCurrentStreamMessagesHook } from "../../../hooks/liveStreamHooks";
import { textdecode } from "../../../lib/chat";
import { open_drawer, open_dialog } from "../../../lib/global";
import { getMessagesStreamAction } from "../../../redux/actions/liveStream/liveStream";
import LiveStreamVideo from "./LiveStreamVideo";

const liveStreamVideoWrapper = (props) => {
  const { streamId, isActive } = props;
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [messages] = getCurrentStreamMessagesHook();
  const commentBoxRef = React.useRef(null);
  const [comments, setComments] = React.useState([]);
  const [firePagination, setFirePagination] = React.useState(null);
  const [isChatHidden, setChatHidden] = React.useState(false);
  const [isShowLatency, setShowLatency] = React.useState(false);

  React.useEffect(() => {
    if (messages.data.length && isActive) {
      const messagesToSet = messages.data.map((message) => ({ username: message.senderName || message.sender_identifier || message.senderIdentifier, message: textdecode(message.body), id: message.sentat || message.timestamp }));
      setComments(messagesToSet);
    } else setComments([]);
  }, [messages.data, isActive]);

  React.useEffect(() => {
    if (comments.length) {
      const scrollHeight = commentBoxRef.current?.scrollHeight;
      if (commentBoxRef.current) commentBoxRef.current.scrollTop = scrollHeight;
    }
  }, [comments]);

  React.useEffect(() => {
    if (firePagination && messages.pageToken && isActive) {
      console.log('Fired Pagination --->>');
      dispatch(getMessagesStreamAction(streamId, 20, messages.pageToken, () => setFirePagination(false), () => setFirePagination(false)));
    }
  }, [firePagination]); // To Fire Pagination only once

  const handleCommentScroll = () => {
    if (commentBoxRef.current?.scrollTop < 6) {
      console.log('Handling Pagination');
      setFirePagination(true);
    }
  }

  React.useEffect(() => {
    if (!isActive) return;
    commentBoxRef.current?.addEventListener('scroll', handleCommentScroll);
    return () => {
      commentBoxRef.current?.removeEventListener('scroll', handleCommentScroll);
    }
  }, [isActive]);

  const handleSettings = (settingType) => {
    switch (settingType) {
      case 'TOGGLE_CHAT':
          setChatHidden(!isChatHidden);
          break;
      case 'TOGGLE_LATENCY_INFO':
          setShowLatency(!isShowLatency);
      default:
          break;
    };
  };

  const openBroadcastSettings = () => {
    mobileView
      ? open_drawer('STREAM_SETTINGS', { chatHidden: isChatHidden, latencyInfoHidden: isShowLatency, handleSettings, viewerSide: true }, 'bottom')
      : open_dialog('STREAM_SETTINGS', { chatHidden: isChatHidden, latencyInfoHidden: isShowLatency, handleSettings, viewerSide: true });
  };

  return (
  <>
  <div className="videoCss position-relative">
    <LiveStreamVideo {...props} openBroadcastSettings={openBroadcastSettings} isShowLatency={isShowLatency} />
    <div className={`comment__sec pl-3 ${isChatHidden ? 'd-none' : ''}`} ref={commentBoxRef}>
      {comments?.length ? comments.map((comment) => (
        <p key={comment.id}><span><b style={{ color: 'bisque' }}>{comment.username}</b> : {comment.message}</span></p>
      )) : <> </>}
    </div>
  </div>
  <style jsx="true">
    {
      `
      .videoCss {
        // height: 100vh;
        height: ${mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh'};
        overflow: hidden;
        overflow-y: auto;
      }
      .comment__sec{
        // -webkit-mask-image: linear-gradient(180deg,rgba(0,0,0,.0001),#000 27.12%,#000 97.12%);
        // mask-image: linear-gradient(180deg,rgba(0,0,0,.0001),#000 27.12%,#000 97.12%);
        position: absolute;
        bottom: ${mobileView ? '75px' : '65px'};
        max-height: 300px;
        align-self: flex-end;
        overflow: hidden;
        overflow-y: auto;
      }

      .comment__sec::-webkit-scrollbar {
        display: none !important; 
      }

      .comment__sec {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .comment__sec p{
        margin-bottom: 0 !important;
      }

      .comment__sec p span{
        color: #ffffff;
        font-size: 12px;
        font-family: 'Roboto',sans-serif !important;
        margin-bottom: 5px;
        background-color: rgb(0 0 0 / 50%);
        padding: 4px 13px;
        border-radius: 20px;
        display: inline-block;
        max-width: ${mobileView ? '70vw' : '31vw'};
        word-break: break-word;
      }
      `
    }
  </style>
  </>
  );
};

export default liveStreamVideoWrapper;
