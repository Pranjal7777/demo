import dayjs from 'dayjs';
import React from 'react'
import { useTheme } from 'react-jss';
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import Button from '../button/button';
const ScheduledButton = (props) => {
  const { isScheduled,
    creationTs,
    currentTime } = props;
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  return (
    <div>
      <div className="d-flex position-absolute align-items-center justify-content-around text-white  mt-3 fntSz12 " style={!mobileView ? { opacity: "0.95", bottom: props.isVideo ? "85%" : "90%", left: "4%", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)", zIndex: "999" } : { opacity: "0.95", bottom: props.isVideo ? "82%" : "90%", left: "10px", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <DateRangeOutlinedIcon style={{ width: "15px", height: "15px" }} />
        <p className="m-0 py-3">Scheduled for {dayjs(creationTs).format("MMM DD, h:mm A")} </p>
      </div>
      <div style={{
        position: "absolute",
        bottom: props.isVideo ? "0%" : "0%",
        left: "45%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
      }}>
        <Button
          type="button"
          cssStyles={theme.blueButton}
          fclassname={`postBtn__btn p-2  disableBtn`}
          btnSpanClass="fntSz15 px-3"
          isDisabled={currentTime > creationTs ? false : true}
          onClick={(e) => props.makePostActive(e, { postId: props?.postId, userId: props?.userId })}
        >
          {lang.makeActive}
        </Button>
      </div>
      <style jsx>{`
           :global(.disableBtn:disabled){
            background:var(--l_base) !important;
            border:none !important;
            padding:8px 5px !important;
            font-weight:500;
            border-radius: 30px;
            // opacity:50%;
          }
          `}</style>
    </div>
  )
}
export default ScheduledButton