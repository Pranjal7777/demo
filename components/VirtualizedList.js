import { useState } from "react";
export const VirtualizedList = (props) => {
    const onScroll = (event) => {
        props.setScrollPosition(event.target.scrollTop);
    };

    return (
        <div
            style={{
                height: props.VISIBLE_ITEMS * props.ITEM_HEIGHT,
                overflow: "auto",
                position: "relative",
            }}
            className="scroll-hide"
            onScroll={onScroll}
        >
            <div
                style={{
                    height: props.TOTAL_ITEMS * props.ITEM_HEIGHT,
                    position: "relative",
                }}
            >
                {props.renderItems()}
            </div>
        </div>
    );
};
