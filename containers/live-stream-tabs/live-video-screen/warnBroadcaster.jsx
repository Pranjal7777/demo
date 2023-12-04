import React from "react";
import Fade from 'react-reveal/Fade';

const warnBroadcaster = ({handleDone, broadcaster = true}) => {

  const handleGotIt = () => {
    handleDone?.(true);
  };

  return (
    <>
    <Fade bottom>
      <div className="warn_message_broadcast_popup w-100 p-3">
        <div className={`warn__message__content text-app ${broadcaster ? 'fntSz14 text-black' : 'fntSz15 txt-heavy'} txt-roman`}>
          {broadcaster && <>
              <span className="fntSz15  txt-heavy d-block">
            We moderate Live broadcasts.
            </span>
            <br />
            Smoking,vulgarity,porn,indecent exposure,child pornography is not
            allowed and will be banned. Live broadcasts are monitored 24 hours a
            day.
            <br />
            <br />
            </>}
        </div>
        <div className="d-flex">
          <button className="gotItButton btn btn-default ml-auto mt-3" onClick={handleGotIt}>
            GOT IT!
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

export default warnBroadcaster;
