import React from "react";
import Fade from 'react-reveal/Fade';

const WarnStateNotConnected = ({ handleNo, handleYes }) => {

    return (
        <>
            <Fade bottom>
                <div className="warn_message_broadcast_popup w-100 p-3">
                    <div className={`warn__message__content text-app fntSz15 txt-heavy txt-roman`}>

                        <span className="fntSz20 w-700  txt-heavy d-block">
                            ANOTHER SESSION IS ACTIVE!!!
                        </span>
                        <br />
                        It seems like your id is logged in on the same device on a different tab or browser. Please ensure that you have just one id active before entering Live Stream failing which, certain features like - Chat, Tipping, Count and Showering Hearts will fail to function properly. 
                        <br />
                        <br />
                        <span><span>NOTE: </span>You may need to logout of all active sessions on this device and log back in to ensure that you do not see this message again.</span>
                    </div>
                    <div className="d-flex">
                        <button className="gotItButton btn btn-default ml-auto mt-3" onClick={handleNo}>
                            Cancel
                        </button>
                        <button className="gotItButton btn btn-default ml-3 mt-3" onClick={handleYes}>
                            Enter Stream
                        </button>
                    </div>
                </div>
            </Fade>
            <style jsx="true">
                {`
          .warn_message_broadcast_popup {
            position: fixed;
            bottom: 0;
            left: 0;
            background: var(--l_app_bg);
            z-index: 99999;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
          }
          .gotItButton {
            background: var(--l_base) !important;
            color: var(--white) !important;
            padding: 5px 10px !important;
            border-radius: 10px !important;
            font-size: 14px;
          }
        `}
            </style>
        </>
    );
};

export default WarnStateNotConnected;
