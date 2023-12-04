import React from 'react'
import { AccordionSummary, Typography } from "@material-ui/core";
import { BOMBSCOIN_LOGO } from '../lib/config/logo';
import Icon from './image/icon';

const DvOtherProfileAbout = ({ handleChange, lang, isLoading, profile, router, handleBookVideoCall, isRequestVideocall, handleShoutOut, socialLnkArr, getSocialLink, theme, mobileView }) => {
    return (
        <div>
            <div
                className='pt-2'
                onChange={handleChange()}
            >
                <AccordionSummary
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className="w-100">

                        <h6 className="mb-2">{lang.virtualRequests} </h6>
                        {!!profile?.videoCallPrice?.price
                            && <>
                                <div className="my-1 mb-3">
                                    <div className="requestShoutout cursorPtr btnGradient_bg rounded-pill" onClick={handleBookVideoCall}>
                                        <div className="d-flex justify-content-between fntSz13 align-items-center">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col-auto ml-1">
                                                </div>
                                                <div className="col pl-1">
                                                    {lang.requestShoutoutVideo}
                                                </div>
                                            </div>
                                            <div className=" pr-1 d-flex flex-row">
                                                {profile?.videoCallPrice?.price}
                                                <Icon
                                                    icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                                    size={18}
                                                    class="ml-1"
                                                    alt="follow icon"
                                                    viewBox="0 0 18 18"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        {!!profile?.shoutoutPrice?.isEnable
                            && <>
                                <div className="mt-1 mb-3 ">
                                    <div className={`requestShoutout cursorPtr btnGradient_bg rounded-pill`}
                                        onClick={handleShoutOut}
                                    >
                                        <div className="d-flex justify-content-between fntSz13">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col-auto">

                                                </div>
                                                <div className="col pl-2">
                                                    {lang.requestAShoutout}
                                                </div>
                                            </div>
                                            <div className="pr-1 d-flex flex-row">
                                                {profile?.shoutoutPrice?.price}
                                                <Icon
                                                    icon={`${BOMBSCOIN_LOGO}#bombscoin`}
                                                    size={18}
                                                    class="ml-1"
                                                    alt="follow icon"
                                                    viewBox="0 0 18 18"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </Typography>
                </AccordionSummary >
            </div>

            <style jsx>{`
    
        .stickyInfoDiv::-webkit-scrollbar { 
          display: none !important;  /* Safari and Chrome */
      }
        
        :global(.requestShoutout) {
            height: "3.5rem";
            padding: 8px 10px;
            border-radius: 5px;
            line-height: 1.5;
        }
        :global(.MuiDivider-middle){
            margin-left: 1px;
            margin-right: 1px;
            background-color: ${theme.palette.l_light_grey};
        }
        .background {
            background: ${theme.appColor};
            border: 1px solid ${theme.appColor};
            color: white;
        }
        .shoutout_btn_sticky{
          position: fixed;
          width:100%;
          z-index: 100;
          bottom:0;
       }
       :global(.MuiPaper-elevation1){
        box-shadow:none !important;
       }
       :global(.MuiAccordionSummary-content.Mui-expanded){
        margin:0 !important;
       }
       :global(.MuiTypography-body1){
        width:100% !important;
       }
       :global(.MuiAccordionDetails-root){
        padding-left:16px !important;
        padding-right:16px !important;
       }
       :global(.MuiAccordionSummary-content){
        margin:5px 0px !important;
       }
       .shoutout_btn{
         border:1px solid var(--l_base);
         background-color: ${theme.type == "light" ? "#fff" : "#000"};
       }
       :global(.websiteContainer.other_profile){
       text-align: center !important;
       }
    :global(.MuiAccordionSummary-expandIcon){
      position:absolute !important;
      top: 0px;
      left: 20vw;
    }
    .categoryBtn{
      border: 1px solid #777777;
      padding: 5px 10px;
      border-radius: 20px;
      color: #777777;
    }
    :global(.MuiAccordionSummary-root) {
        padding: 0px !important;
    }
  
      `}</style>

        </div>
    )
}

export default DvOtherProfileAbout