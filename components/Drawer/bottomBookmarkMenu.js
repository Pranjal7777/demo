import React from "react";
import { open_dialog, open_drawer } from "../../lib/global";
import { openCollectionEditDialog } from "../../lib/helper";
import useLang from "../../hooks/language"
import isMobile from "../../hooks/isMobile";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";

const BottomBookmarkMenu = (props) => {
  const [lang] = useLang()
  const mobile = isMobile()
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  return (
    <div className="px-4 pb-3 pt-4">
      {props.collectionId && (
        <div
          className="mb-3 dv_primary_color mt-2"
          onClick={() => {
            openCollectionEditDialog({
              collectionId: props.collectionId,
              creatorId: isAgency() ? selectedCreatorId : "",
              getCollectionData: props.getCollectionData,
            });
          }}
        >
          {lang.editCollection}
        </div>
      )}
      {props.collectionId && (
        <div
          className="mb-3 dv_primary_color"
          onClick={() => {
            open_drawer(
              "BookmarkSelections",
              {
                title:props.title,
                type: 1,
                multi: true,
                currentcollectionId: props.collectionId,
                getCollectionData: props.getCollectionData,
                getPosts: props.getPosts,
              },
              "bottom"
            );
          }}
        >
          {lang.addCollection}
        </div>
      )}
      <div
        className="mb-3 dv_primary_color"
        onClick={() => {
          open_drawer(
            "BookmarkSelections",
            {
              title:props.title,
              type: 2,
              multi: true,
              collectionId: props.collectionId,
              getCollectionData: props.getCollectionData,
              getPosts: props.getPosts,
            },
            "bottom"
          );
        }}
      >
        {lang.multiSelect}
      </div>
      {props.collectionId && (
        <div
          className="mb-4 text-danger"
          onClick={() => {
            // props.onClose();
            mobile ? open_drawer(
              "deleteCollection",
              {
                collectionId: props.collectionId,
                getCollectionData: props.getCollectionData,
              },
              "bottom"
            )
              :
              open_dialog(
                "DeleteConfirm",
                {
                  collectionId: props.collectionId,
                  getCollectionData: props.getCollectionData,
                },
                "bottom"
              );
          }}
        >
          {lang.dlt_Collection}
        </div>
      )}
    </div>
  );
};

export default BottomBookmarkMenu;
