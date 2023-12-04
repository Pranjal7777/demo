import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import { P_CLOSE_ICONS } from "../../../lib/config";

import AcUnitIcon from '@material-ui/icons/AcUnit';
import { makeStyles } from "@material-ui/core";
import Img from "../../ui/Img/Img";

const useStyles = makeStyles({
  bgEffect: {
    backgroundColor: "lightblue",
    padding: "10px",
    borderRadius: "100%",
    marginRight: "20px",
  },
})

const HowItWorks = ({ title, subtitle, onClose }) => {
  const shoutoutDays = useSelector((state)=>state.appConfig.shoutoutDays)
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const classes = useStyles();

  const txtArray = [
    `${lang.shoutoutTxt1} ${shoutoutDays} days`,
    lang.shoutoutTxt2,
    lang.shoutoutTxt3,
    `${lang.shoutoutTxt4} ${shoutoutDays} ${lang.refundMsg}`,
  ]

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div className={`text-center modal-content ${mobileView ? "p-4" : "py-3 px-5"}`} style={{background : `${theme?.background}`}}>
            <div>
              <button
                type="button"
                className="close dv_modal_close textCommonCss"
                data-dismiss="modal"
                onClick={onClose}>
                {lang.btnX}
              </button>
              <h6 className={
                mobileView
                  ? "fntSz22 bold textCommonCss"
                  : "dv__fnt30 appTextColor mx-auto pb-2"
              }
              >
                {title}
              </h6>

              <p className="fntSz16 bold text-muted textCommonCss">{subtitle}</p>

              {txtArray?.map((arr, index) => (
                <div style={{height: index==0 ? "60px" : index == 1 ? "104px" : '90px'}} className="d-flex" key={index}>
                  <div className={`${index == txtArray?.length-1 ? '': "custom__highlighter"} bgEffect d-flex justify-content-center align-items-center`} >
                    {/* <AcUnitIcon fontSize="small" style={{color : `${theme?.appColor}`}}/> */}
                    <p fontSize="small" className="p-4 mt-3 text-black">{index+1}</p>
                  </div>
                  <div className="text-left textCommonCss">{arr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        
              .textCommonCss{
                color : ${theme?.text}
              }
        `}
      </style>
    </Wrapper>
  );
}

export default HowItWorks;
