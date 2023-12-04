import CancelIcon from "@material-ui/icons/Cancel";

import isMobile from "../../hooks/isMobile";
import { handleContextMenu } from "../../lib/helper";

const ImgFullScreenView = ({ onClose, imgLink, imgDescription }) => {
  const [mobileView] = isMobile();

  return (
    <>
      <CancelIcon onClick={onClose} className="close_icon" />
      <div className="vh-100 d-flex justify-content-center align-items-center bg_app_theme">
        <img src={imgLink} alt="Image on Full Screen" onContextMenu={handleContextMenu} className={`${mobileView ? "w-100" : "h-100"} callout-none`} />
      </div>
      <p className="text-capitalize position-absolute text-center w-100 py-3 fntWeight600 text-light" style={{ backgroundColor: "rgb(72 71 71 / 40%)", zIndex: 1, bottom: "10px" }}>{imgDescription}</p>
    </>
  );
};

export default ImgFullScreenView;
