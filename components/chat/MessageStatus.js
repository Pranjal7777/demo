import React from "react";
import { ChatTick } from "./chatWrapper/chatWrapper";
import { LIGHT_GRAY, PRIMARY } from "../../lib/config";

const MessageStatus = ({ status }) => {

    switch (status) {
        case 1:
            return (
                <React.Fragment>
                    <ChatTick color={LIGHT_GRAY} />
                </React.Fragment>
            );
        case 2:
            return (
                <div className="doubleTick">
                    <ChatTick color={LIGHT_GRAY} />
                    <ChatTick
                        className="margin-left-minus"
                        color={LIGHT_GRAY}
                    />
                </div>
            );
        case 3:
            return (
                <div className="doubleTick">
                    <ChatTick color={PRIMARY} />
                    <ChatTick className="margin-left-minus " color={PRIMARY} />
                </div>
            );
        case 5:
            return (
                <React.Fragment />
            );
        default:
            return <ChatTick color={LIGHT_GRAY} />;
    }
};

export default MessageStatus;