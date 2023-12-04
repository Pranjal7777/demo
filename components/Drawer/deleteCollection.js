import React from "react";
import useLang from "../../hooks/language";
import useCollection from "../../hooks/useCollection";
import {
  close_drawer,
  drawerToast,
  startLoader,
  stopLoader,
} from "../../lib/global";

const DeleteCollection = (props) => {
  const [lang] = useLang();
  const { deleteCollectionData } = useCollection({});
  return (
    <div className="btmModal">
      <div className="modal-dialog">
        <div className="modal-content pb-4 pt-5">
          <div className="col-12  mx-auto">
            <h6 className="mb-0 fntSz24 pb-2 w-100 text-app">
              {lang.dltCollection}
            </h6>

            <div className="fntSz12 bse_dark_text_clr mb-3">
              {lang.dltCollectionCnfrm}
            </div>
            <div className="row pt-4 px-2 align-items-center justify-content-between">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default greyBorderBtn border-red"
                  data-dismiss="modal"
                  data-toggle="modal"
                  onClick={() => {
                    startLoader();
                    deleteCollectionData(props.collectionId, () => {
                      props.onClose();
                      close_drawer("bookmarkPosts");
                      close_drawer("bottomBookmarkMenu");
                      setTimeout(() => {
                        drawerToast({
                          title: lang.collectionDeleted,
                          closeIconVisible: false,
                          titleClass: "max-full",
                          autoClose: true,
                          isMobile: true,
                        });
                        stopLoader();
                        props.getCollectionData && props.getCollectionData();
                      }, 200);
                    });
                  }}
                >
                  {lang.delete}
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default greyBorderBtn"
                  data-dismiss="modal"
                  data-toggle="modal"
                  onClick={props.onClose}
                >
                  {lang.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCollection;
