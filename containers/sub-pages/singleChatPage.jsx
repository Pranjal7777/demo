import dynamic from "next/dynamic";
import React from "react";
import * as config from "../../lib/config";
const FigureImage = dynamic(
  () => import("../../components/image/figure-image"),
  { ssr: false }
);
const Image = dynamic(() => import("../../components/image/image"), {
  ssr: false,
});
const Img = dynamic(() => import("../../components/ui/Img/Img"), {
  ssr: false,
});

export default function SingleChatMessage(props) {
  return (
    <div className="dv_wrap_home">
      {/* HEADER */}
      <div
        className="dv_header"
        style={{ borderBottom: "1px solid #242A37 !important", height: "70px" }}
      >
        <div className="col-12 py-2 mv_border_Btm_trans mb-3">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="form-row align-items-center">
                <div className="col-auto">
                  <FigureImage
                    fclassname="mb-0"
                    src={config.backArrow}
                    width={22}
                    alt="backArrow"
                    onClick={() => {
                      props.showSingleChat("");
                    }}
                  />
                </div>
                <div className="col-auto">
                  <Image
                    src="/images/desktop/chats/chat_profile.png"
                    width={44}
                    height={44}
                    className="live"
                  />
                  <span className="mv_online_true" />
                </div>
                <div className="col">
                  <div className="mv_chat_pro_name">Sona</div>
                  <div className="mv_chat_pro_status">Active</div>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="form-row">
                <div className="col-auto">
                  <Image src={config.ATTACH_FILES_ICON} width={15} />
                </div>
                <div className="col-auto">
                  <Image src={config.THREE_DOTS} width={13} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* HEADER */}

      <div className="col-12">
        <div className="row">
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Hello how are you ?</span>
            </div>
            <div className="mv_chat_time">1:59 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Fine
              </span>
            </div>
            <div className="mv_chat_time">
              1:59 pm <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div>
              <span className="mv_chat_txt_sender">Can we meet today.?</span>
            </div>
            <div className="mv_chat_time">2:00 pm</div>
          </div>
          <div className="col-12 mb-2 text-right">
            <div>
              <span className="mv_chat_txt_sender mv_chat_txt_receiver">
                Sure. at what time ?
              </span>
            </div>
            <div className="mv_chat_time">
              2:00 pm
              <Img src="/images/desktop/icons/check.svg" width={7} />
            </div>
          </div>
        </div>
      </div>
      <div className="mv_posBtm">
        <form>
          <div className="form-group mb-0">
            <div className="position-relative">
              <input
                type="text"
                className="form-control mv_search_input_wht mv_search_input_wht_chat"
                placeholder="Message"
              />
              <FigureImage
                fclassName="mb-0"
                cssStyles={theme.searchIcon}
                src={config.Test}
                width={20}
                alt="test_icon"
              />
              <Img
                src="/images/mobile/svg/camera.svg"
                width={37}
                className="mv_pos_abs_right"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
