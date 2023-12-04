import React, { useEffect, useState } from 'react';
import { Picker } from "emoji-mart";
import { PRIMARY } from '../../lib/config';

function Emoji(props) {
    const [postEmoji, setPostEmoji] = useState(props.textPost)

    useEffect(() => {
        if (postEmoji.length <= 300) {
            props.setPostText(postEmoji)
        }
    }, [postEmoji])

    return (
        <div className='h-50'>
            <div
                tabIndex="-1"
                onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                        // togglePicker(false);
                        // sendMessages();
                    }
                }}
            // style={{ position: "absolute", bottom: '0px', right: '5px' }}
            >
                <Picker
                    onClick={(imogi) => {
                        postEmoji.length <= 300
                            ? setPostEmoji(prev => prev + imogi.native)
                            : null
                    }}
                    style={{ width: '100%' }}
                    color={PRIMARY}
                    showPreview={false}
                    showSkinTones={false}
                />
            </div>
        </div>
    )
}

export default Emoji
