import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { backNavMenu, close_dialog, close_drawer, goBack, open_dialog, open_drawer, signOut } from "../../lib/global";
import { useTheme } from "react-jss";
import { deleteComment } from "../../services/comments";
import { Toast } from "../../lib/global/loader";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";

export default function CommentOptions(props) {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang()
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);


  const handleEditComment = () => {
    props.setEditComment(true)
    props.setEditPostId(props?.data?._id)
    props.setInputComment(props.data.comments)
    backNavMenu(props)
  }

  const deleteChatDialog = (success, cancel) => {
    return {
      title: "",
      subTitle: "Are you sure want to delete this comment ?",
      button: [
        {
          class: "btn btn-default blueBgBtn-border",
          loader: true,
          text: "Yes",
          onClick: () => {
            success();
          },
        },
        {
          class: "btn btn-default blueBgBtn",
          text: "No",
          onClick: () => {
            cancel();
          },
        },
      ],
    };
  };

  const deleteMessage = () => {
    let payload = {
      commentId: [props.data._id]
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    deleteComment(payload).then((res) => {
      Toast(res.data.message)
      props.handleDeletedComments(props.data._id)

    }).catch((err) => {
      console.log(err)
    })

    if (mobileView) {
      close_drawer("DELETE_CHAT")
      close_drawer("CommentOptions")
    } else {
      close_dialog("DELETE_CHAT")
      close_dialog("CommentOptions")
    }
  }

  const deleteDialog = () => {
    mobileView ? open_drawer("DELETE_CHAT",
      deleteChatDialog(deleteMessage, close_drawer),
      "bottom"
    ) :
      open_dialog("DELETE_CHAT",
        deleteChatDialog(deleteMessage, close_dialog),
        "bottom"
      );
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog rounded">
          <div
            className={`${mobileView ? "modal-content-mobile" : "modal-content"
              } `}
          >
            <div>
              <div className="d-flex flex-column align-items-center justify-content-between">
                {props.isEditable && <p className="mb-0 w-100 p-3 text-center b-bottom pointer editColor" onClick={() => { handleEditComment() }} >{lang.editComment}</p>}
                <p className="mb-0 w-100 p-3 text-center b-bottom pointer deleteColor" onClick={deleteDialog}>{lang.deleteComment}</p>
                <p className="mb-0 w-100 p-3 text-center pointer" onClick={() => backNavMenu(props)}>{lang.cancel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
            .b-bottom{
                border-bottom: ${theme.type === "light" ? "1px solid #e9e1e1 !important" : "1px solid #353030 !important"};
            }

            :global(.CommentOptions){
                border-radius:10px;
            }
            :global(.CommentOptions > div){
                border-radius: 10px;
                overflow: hidden;
            }
            .pointer{
                cursor:pointer;
            }
            .deleteColor{
                color:#FC495D;
            }
            .editColor{
                color: var(--l_base);
            }
            `}</style>
    </Wrapper>
  );
}
