import React from "react";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import Img from "../../components/ui/Img/Img";
import {
  CHAT_PLACEHOLDER,
  EMPTY_CHAT_PLACEHOLDER,
  color1
} from "../../lib/config";

const NoChat = (props) => {
  const theme = useTheme();
  return (
    <div className={"no-chat-container text-center " + props.className}>
      <Icon
        icon={`${ EMPTY_CHAT_PLACEHOLDER}#No_chat`}
        color={theme.palette.l_base}
        width={104}
        height={110}
        viewBox="0 0 95.675 95.674"
      />
      {/* <Img height="110px" src={EMPTY_CHAT_PLACEHOLDER}></Img> */}
      <div className="empty-text">
        {props.text || "Select a chat to view conversation"}
      </div>
      <style jsx>{`
        .no-chat-container {
          position: absolute;
          top: 25%;
          // left: ${props.left || "36%"};
          width: 100%;
        }
        .empty-text {
          font-size: 0.9rem;
          margin-top: 12px;
          font-weight: 600;
          color: ${theme.type == "light"
            ? theme.palette.l_app_text
            : theme.palette.d_app_text};
        }
      `}</style>
    </div>
  );
};

export default NoChat;
