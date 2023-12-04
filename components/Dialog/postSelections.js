import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "react-jss";

import useLang from "../../hooks/language";
import useBookmark from "../../hooks/useBookMark";
import { close_dialog, close_drawer, startLoader, stopLoader, Toast } from "../../lib/global";
import Button from "../button/button";
import Icon from "../image/icon";
import { CROSS_SIMPLE } from "../../lib/config/profile";

const BookmarkSelections = dynamic(() => import("../Drawer/bookmarkSelectonDrawer"), { ssr: false });

const DvPostSelection = (props) => {
  const theme = useTheme();
  const [lang] = useLang();

  const doneButton = useRef(null);
  const unselectAll = useRef(null);
  const removeButton = useRef(null);
  const { title = "All Posts", type } = props;
  const { posts, getBookMark, addBookMarkReq, removeBookmark } = useBookmark();
  const [showButton, setShowButton] = useState(false);
  const [showDoneBtn, setShowDoneBtn] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [multiBookMark, setMultiBookmark] = useState({});

  const handleAddPost = () => {
    if (props.type == 1 || props.type == 2) {
      startLoader();
      let ids = '';
      ids = Object.keys(multiBookMark).map(id => ids.concat("", id))
      addBookMarkReq({
        requestPayload: {
          postId: `${ids}`,
          collectionId: props.collectionId || props.currentcollectionId,
        },
        cb: () => {
          close_drawer("bottomBookmarkMenu");
          props.getPosts && props.getPosts();
          props.onClose();
          stopLoader();
        },
      });
      props.handelChildImage && props.handelChildImage(Object.values(multiBookMark)[0])
      props.getPosts && props.getPosts();
    } else {
      props.onClick
        ? handleBtnClickImage()
        : props.handelChildImage && props.handelChildImage(Object.values(multiBookMark)[0]);
    }
  };

  const handleBtnClickImage = () => {
    props.handelChildImage && props.handelChildImage(Object.values(multiBookMark)[0])
    props.onClick(Object.values(multiBookMark)[0]), props.onClose();
  }

  return (
    <div className="overflow-hidden">
      <div
        className="d-flex flex-column overflow-hidden pb-0 dv__black_color"
        style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 90px)" }}
      >
        <div className="d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 text-center text-app">
            <span className="">{title}</span>
          </h5>

          <div>
            <Icon
              icon={CROSS_SIMPLE + "#Icons_back"}
              color={"var(--l_app_text)"}
              onClick={() => props.onClose()}
              size={36}
              class="cursorPtr"
              viewBox="0 0 36 36"
            />
          </div>
        </div>
        <div className="h-100 overflow-auto">
          <div className="col-11 m-auto">
            {/* Bookmark Selecton Drawer.js - useEffect line #50 */}
            <BookmarkSelections
              click={(refff, refff2, refff3, refff4) => {
                doneButton.current = refff;
                removeButton.current = refff2;
                unselectAll.current = refff4;
              }}
              handleAddPost={handleAddPost}
              setMultiBookmark={setMultiBookmark}
              setShowButton={setShowButton}
              setShowDoneBtn={setShowDoneBtn}
              {...props}
            />
          </div>
        </div>
        <div>
          {props.type != 3 && showButton && (
            <div className="col-4 px-0 mx-auto py-3">
              <button
                ref={removeButton}
                disabled={Object.keys(multiBookMark).length == 0}
                type="button"
                className={" btn  btn-default dv-dialog-profile w-100 px-0"}
                data-dismiss="modal"
                data-toggle="modal"
                onClick={() => {
                  // removeButton.current && removeButton.current();
                  props.type == 1
                    ? handleAddPost()
                    : removeButton.current && removeButton.current()
                }}
              >
                {props.type == 1 ? lang.done : lang.remove}
              </button>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end px-3 py-2" >
          {type == 3
            ? <div>
              <Button
                disabled={!showDoneBtn}
                onClick={() => handleAddPost()}
                fclassname="gradient_bg rounded-pill px-4 py-2"
              >
                {lang.done}
              </Button>
            </div>
            : <div>
              <Button
                ref={isSelectAll ? unselectAll : doneButton}
                fclassname="gradient_bg rounded-pill px-4 py-2 text-nowrap"
                onClick={() => {
                  isSelectAll ? unselectAll.current && unselectAll.current() : doneButton.current && doneButton.current();
                  setIsSelectAll(!isSelectAll);
                }}
              >
                {isSelectAll ? lang.unselectAll : lang.selectAll}
              </Button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default DvPostSelection;
