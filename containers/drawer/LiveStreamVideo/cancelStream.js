import React from 'react';
import isMobile from '../../../hooks/isMobile';
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language"

const cancelStream = (props) => {
  const { onClose, handleCloseStream } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [lang] = useLang();

  const handleStreamClose = () => {
    onClose();
    handleCloseStream?.()
  }
  return (
    <>
    <div className="go__live__ui__close_drawer card_bg">
      <div className="confirm__msg__txt text-center font-weight-500 text-app">
        {lang.areULiveStream}
      </div>
      <div className="all__btns__go__live__close_drawer d-flex justify-content-around pt-3 mt-3">
        <button className="go_live_ui_cancel__btn" onClick={onClose}>{lang.cancel}</button>
        <button className="go_live_ui_end__video__btn text-white" onClick={handleStreamClose}>{lang.endStream}</button>
      </div>
    </div>
    <style jsx> {`
      .go__live__ui__close_drawer {
        height: ${mobileView ? 'calc(125vw / 2.5)' : 'auto'};
        max-width: ${mobileView ? 'unset' : '500px'};
        padding: ${mobileView ? 'unset' : '30px 50px'};
      }
      :global(.go-live-body) {
        filter: blur(4px) !important;
      }
      .confirm__msg__txt {
        padding-top: ${mobileView ? 'calc(26vw / 2.5)' : 'unset'};
        padding-left: ${mobileView ? 'calc(23vw / 2.5)' : 'unset'};
        padding-right: ${mobileView ? 'calc(23vw / 2.5)' : 'unset'};
        font-size: ${mobileView ? 'calc(12vw / 2.5)' : '24px'};
        font-family: 'Roboto';
      }
      .go_live_ui_cancel__btn {
        width: ${mobileView ? 'unset' : '45%'};
        color: #818ca3;
        border-radius: calc(20vw / 2.5);
        border: ${mobileView ? 'calc(0.6vw / 2.5)' : '1px'} solid #818ca3;
        font-size: ${mobileView ? 'calc(9.33vw / 2.5);' : '16px'}
        font-weight: 400;
        padding: ${mobileView ? 'calc(6.6000000000000005vw / 2.5) calc(37vw / 2.5)' : '8px'};
      }
      .go_live_ui_end__video__btn {
        width: ${mobileView ? 'unset' : '45%'};
        background: ${theme.appColor};
        border-radius: calc(20vw / 2.5);
        border: none;
        font-size: ${mobileView ? 'calc(9.33vw / 2.5)' : '16px'};
        font-weight: 400;
        padding: ${mobileView ? 'calc(6.6000000000000005vw / 2.5) calc(30vw / 2.5)' : '8px'};
      }
      `} </style>
    </>
  )
}

export default cancelStream;
