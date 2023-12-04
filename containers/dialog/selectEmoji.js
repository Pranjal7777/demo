import React, { useEffect, useState } from "react";
import { Picker } from "emoji-mart";
import { PRIMARY,CLOSE_ICON_BLACK} from "../../lib/config";
import { close_dialog } from "../../lib/global";
import Image from "../../components/image/image";

function Emoji(props) {
  const [postEmoji, setPostEmoji] = useState(props.value || "");

  useEffect(() => {
    if (postEmoji.length <= 300) {
      props.onChange(postEmoji);
    }
  }, [postEmoji]);

  return (
    <div className="h-50">
      <div className="px-3" style={{ background: "white", color: "#000" }}>
        <div
          className="m-0 py-2 cursorPtr"
          style={{textAlign: "end"}}
          onClick={() => close_dialog("emojiDialog")}
        >
          <Image src={CLOSE_ICON_BLACK} width={20} alt="close icon" className="text-end" />
        </div>
      </div>
      <div tabIndex="-1">
        <Picker
          onClick={(imogi) => {
            postEmoji.length <= 300
              ? setPostEmoji((prev) => prev + imogi.native)
              : null;
          }}
          style={{ width: "100%" }}
          color={PRIMARY}
          showPreview={false}
          showSkinTones={false}
        />
      </div>
      <style jsx>{`
        :global(.emojiDialog .MuiDialog-paper) {
          width: 568px !important;
          height: 240px !important;
          max-width: unset !important;
          min-width: unset !important;
        }
        :global(.emojiDialog .MuiDialog-scrollPaper) {
          align-items: end !important;
        }
      `}</style>
    </div>
  );
}

export default Emoji;
