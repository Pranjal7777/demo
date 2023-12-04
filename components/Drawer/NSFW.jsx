import React from "react";
import { useTheme } from "react-jss";
import Skeleton from "@material-ui/lab/Skeleton";
import parse from "html-react-parser";

import useLang from "../../hooks/language";
import { close_dialog, close_drawer } from "../../lib/global";
import { getNSFWContent } from "../../services/auth";
import Header from "../header/header";
import isMobile from "../../hooks/isMobile";

const NSFW = (props) => {
  const { isNSFWAllow, handleNSFWChanges } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [NSFWDisclaimer, setNSFWDisclaimer] = React.useState("");

  React.useEffect(() => {
    getNSFWContentFromAdmin();
  }, []);

  const getNSFWContentFromAdmin = async () => {
    const res = await getNSFWContent();
    setNSFWDisclaimer(res?.data?.data?.pageContent)
  }

  const changeNSFWState = (isAllowed) => {
    handleNSFWChanges(isAllowed);
    setTimeout(() => {
      mobileView ? close_drawer("NSFW") : close_dialog("NSFW")
    }, 500)
  }

  const ActionButtons = () => {
    return (
      <div className={`card_bg${mobileView ? " posBtm" : ""}`} style={{ bottom: 0 }}>
        <button
          type="button"
          className={`btn text-left font-weight-bold text-success rounded-pill w-100 my-2 py-3${mobileView ? " fntSz13" : " fntSz16"}`}
          style={{ background:theme.type == "light" ? "#f1f1f1" : "var(--l_input_bg)"}}
        >
          <label className="d-flex m-0 cursorPtr">
            <div className="col-11 p-0">
              {lang.receiveNSFW}
            </div>
            <div className="col-1 p-0 d-flex align-items-center">
              <input type="radio" name="nsfw" checked={isNSFWAllow == true} onChange={() => changeNSFWState(true)} />
            </div>
          </label>
        </button>

        <button
          type="button"
          className={`btn text-left font-weight-bold text-danger rounded-pill my-2 w-100 py-3${mobileView ? " fntSz13" : " fntSz16"}`}
          style={{background:theme.type == "light" ? "#f1f1f1" : "var(--l_input_bg)"}}
        >
          <label className="d-flex m-0 cursorPtr">
            <div className="col-11 p-0">
              {lang.rejectNSFW}
            </div>
            <div className="col-1 p-0 d-flex align-items-center">
              <input type="radio" name="nsfw" checked={isNSFWAllow == false} onChange={() => changeNSFWState(false)} />
            </div>
          </label>
        </button>
      </div>
    )
  }

  return (
    <>
      {mobileView
        ? <>
          <Header
            title={lang.nsfw}
            back={() => close_drawer("NSFW")}
          />
          <div style={{ marginTop: "80px", paddingBottom: "160px" }} className="container">
            <h5 className="w-700 nsfwSub-Title pb-1 text-app">{lang.disclaimer}:</h5>

            {NSFWDisclaimer
              ? parse(NSFWDisclaimer)
              : <Skeleton
                variant="rect"
                width="100%"
                height={250}
                animation="wave"
              />
            }

            <ActionButtons />
          </div>
        </>
        : <div className="py-3 px-5">
          <div className="text-center">
            <h5 className="txt-black dv__fnt30 mb-3">{lang.nsfw}</h5>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>

          <div className="dt__cls">
            {NSFWDisclaimer
              ? parse(NSFWDisclaimer)
              : <Skeleton
                variant="rect"
                width="100%"
                height={250}
                animation="wave"
              />
            }
          </div>


          <ActionButtons />
          <style jsx>
            {`
                :global(.dt__cls p span), :global(.dv_modal_close){
                  color: ${theme.type === "light" ? theme.palette.l_app_text : theme.palette.d_app_text } !important;
                }
              `}
          </style>
        </div>
      }
    </>
  );
};

export default NSFW;
