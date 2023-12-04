import { close_drawer } from "../../lib/global";
import Img from "../ui/Img/Img";
import CancelIcon from "@material-ui/icons/Cancel";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

const FullScreenImgView = (props) => {
  return (
    <div className="bg-dark h-100 d-flex justify-content-center align-items-center">
      <CancelIcon
        className="text-muted close__icon"
        fontSize="large"
        onClick={() => close_drawer("fullScreenImgView")}

      />
      <Img
        className=""
        src={s3ImageLinkGen(props.S3_IMG_LINK, props.Img)}
        alt="View Image FullScreen"
        width="100%"
      />
    </div>
  )
}

export default FullScreenImgView
