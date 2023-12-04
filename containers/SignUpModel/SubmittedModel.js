import { sendMail } from "../../lib/global";
import Button from "../../components/button/button"
import useLang from "../../hooks/language";
import Img from "../../components/ui/Img/Img";
import { DRAWER_CLOSE } from "../../lib/config";

const SubmittedModel = () => {
  const [lang] = useLang();

  return (
    <div className="modal" id="submitted">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <button type="button" className="close dv_modal_close" data-dismiss="modal"><Img src={DRAWER_CLOSE} alt="close_img" /></button>
          <div className="dv_modal_wrap">
            <div className="col-12">
              <div className="dv_modal_title text-center mb-3">{lang.profileSubmitted}</div>
              <div className="txt-book fntSz16 mb-4 dv_upload_txt_color text-center">{lang.unverifiedProfile}</div>
              <Button
                type="button"
                className="btn btn-default dv_bseBtn"
                // If button ui messed up use this.. Bhavleen Added This
                // cssStyles={theme.blueButton}
                onClick={() => sendMail()}
                children={lang.contactUs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmittedModel;