import React from "react";
import Wrapper from "../../hoc/Wrapper";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import Icon from "../image/icon";
import * as config from "../../lib/config";
import { deleteFeaturedStoryApi } from "../../services/assets";
import Img from "../ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";

const HighlightStoryOptions = (props) => {
  // console.log('props', props);
  const { onClose, back, featCollectionId, activeStoryId, title, data, coverImage } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();

  const handleEditHighlightStory = async () => {
    if (mobileView) {
      open_drawer(
        "EDIT_HIGHLIGHT_STORY",
        {
          data: data,
          coverImage,
          title,
          featCollectionId,
          activeStoryId,
          handleClose: () => {
            onClose && onClose();
          },
          back: () => back && back(),
        },
        "right"
      );
    } else {
      close_drawer("HIGHLIGHT_STORY");
      open_dialog("EDIT_HIGHLIGHT_STORY", {
        data: data,
        coverImage,
        title,
        featCollectionId,
        activeStoryId,
        handleClose: () => {
          onClose && onClose();
        },
        back: () => back && back(),
        closeAll: true,
      });
    }
  };

  const handleRemoveHighlightStory = async () => {
    if (mobileView) {
      open_drawer(
        "confirmDrawer",
        {
          title: lang.removeHighlight,
          btn_class: "dangerBgBtn",
          cancelT: lang.cancel,
          submitT: lang.remove,
          yes: deleteStoryHandler,
          handleClose: () => {
            // setPause(false);
            onClose && onClose();
          },
          subtitle: "",
        },
        "bottom"
      );
    } else {
      close_drawer("HIGHLIGHT_STORY");
      open_dialog("confirmDialog", {
        title: lang.removeHighlight,
        btn_class: "dangerBgBtn",
        cancelT: lang.cancel,
        submitT: lang.remove,
        yes: deleteStoryHandler,
        handleClose: () => {
          onClose && onClose();
        },
        subtitle: "",
        closeAll: true,
      });
    }
  };

  const deleteStoryHandler = (flag) => {
    startLoader();
    deleteFeaturedStoryApi(featCollectionId)
      .then((res) => {
        stopLoader();
        // Commented By Bhavleen on 10th-April => Please remove it when BE response is proper
        // Toast(
        //   (res && res.data && res.data.message) ||
        //   "Featured story removed successfully!",
        //   "success"
        // );
        Toast("Featured story removed successfully!", "success");

        if (mobileView) {
          back && back();
        } else {
          back && back();
          close_dialog("confirmDialog");
        }
      })
      .catch((error) => {
        stopLoader();
        console.error("deleteFeaturedStoryApi - error - ", error);
        Toast(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
          "Failed to add Featured story!",
          "error"
        );
      });
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className={mobileView ? "modal-dialog" : ""}>
          <div className={mobileView ? "modal-content pt-4 pb-4" : ""}>
            <div className="col-12 w-330 mx-auto" style={{ color: "#242a37" }}>
              <ul className="p-0 m-0">
                <li
                  className={
                    mobileView ? "d-flex pb-3" : "d-flex pt-3 cursorPtr"
                  }
                  onClick={handleEditHighlightStory}
                >
                  <Img
                    src={config.EDIT_GREY}
                    width={16}
                    alt="edit"
                    style={mobileView ? {} : { cursor: "pointer" }}
                  />
                  <p
                    className={`mb-0 fntSz16 pl-3 pointer dt__el ${mobileView ? "" : "cursorPtr"
                      }`}
                    onClick={() => { }}
                  >
                    {lang.editHighlight}
                  </p>
                </li>
                <li
                  className={
                    mobileView ? "d-flex pb-3" : "d-flex py-3 cursorPtr"
                  }
                >
                  <Img
                    src={config.CANCEL_GREY}
                    width={16}
                    alt="close"
                    style={mobileView ? {} : { cursor: "pointer" }}
                  />
                  <p
                    className={`mb-0 fntSz16 pl-3 pointer dt__el ${mobileView ? "" : "cursorPtr"
                      }`}
                    onClick={handleRemoveHighlightStory}
                  >
                    {lang.dltHighlight}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .maxWidth70 {
            max-width: 70%;
          }
          li:active {
            transform: scale(0.98);
          }
          :global(.MuiDialog-container) {
            height: unset;
            outline: 0;
            display: flex;
            // justify-content: flex-end;
            padding-top: 44px;
          }
          :global(.MuiDialog-paper) {
            min-width: fit-content !important;
          }
          .dt__el{
            color: var(--l_app_text) !important;
          }
        `}
      </style>
    </Wrapper>
  );
};
export default HighlightStoryOptions;
