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
                    }
                }}
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
            <style jsx>{`
                :global(.emoji .MuiDialog-paper) {
						width: 568px !important;
						height: 240px !important;
                        max-width: unset!important;
					    min-width:  unset!important;
                }
                :global(.emoji .MuiDialog-scrollPaper) {
                    align-items: end !important;
                }
            `}</style>
        </div>
    )
}

export default Emoji
