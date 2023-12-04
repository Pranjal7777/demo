import React, { useEffect, useState } from "react";
import useLang from "../../../hooks/language";
import useCollection from "../../../hooks/useCollection";
import { CHECK } from "../../../lib/config";
import {
  close_dialog,
  close_drawer,
  drawerToast,
  open_dialog,
  startLoader,
  stopLoader,
} from "../../../lib/global";
import Router from "next/router";
import { getBookmarkPosts, remveBookmarkPost } from "../../../services/collection";
import { isAgency } from "../../../lib/config/creds";
import { useSelector } from "react-redux";

const DeleteDialog = (props) => {
  const [lang] = useLang();
  const { deleteCollectionData } = useCollection({});
  const [bookMarkedPost, setBookMarkedPost] = useState([]);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(async () => {
    let obj = {
      offset: 0, 
      collectionId: props.collectionId, 
      limit: 10
    }
    if (isAgency()) {
      obj["userId"] = selectedCreatorId;
    }
    let postIdArray = [];
    const response = await getBookmarkPosts({...obj});
    const posts = response?.data?.data?.data;
    posts?.length > 0 && posts.map((post) => {
      postIdArray.push(post.postId);
    })
    setBookMarkedPost(postIdArray);
  }, [])

  const deleteData = async() => {
    let obj = {
      postIds: [...bookMarkedPost],
      collectionId: props.collectionId,
      isFromCollection: false,
    }

    try{
      // await remveBookmarkPost(obj)
      deleteCollectionData(props.collectionId, () => {
        props.onClose();
        close_dialog;
        setTimeout(() => {
          open_dialog("successfullDialog", {
            title: lang.collectionDeleted,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
          });
          stopLoader();
          props.getCollectionData && props.getCollectionData();
          Router.reload();
        }, 200);
      });
    }catch(error){
      console.error("Error in deleteData", error);
      stopLoader();
    }
  }
  

  return (
    <div>
      <div className="detete-div text-center">
        <div className="delete-title">
          <h5 className="content_heading fntSz22 w-700 px-1 py-2 fntSz26 text-center m-0 ">
            {lang.dltCollection}
          </h5>
        </div>
        <div className="delete-desc fntSz16 text-gray w-330 m-auto mt-2">
          {lang.dltCollectionCnfrm}
        </div>
      </div>
      <div className="row w-330 m-auto pb-4 align-items-center">
        <div className="col">
          <div
            className=" btn button-rounded border-red  w-100"
            onClick={() => {
              if(bookMarkedPost.length == 0){
              startLoader();
              deleteCollectionData(props.collectionId, () => {
                props.onClose();
                close_dialog;
                setTimeout(() => {
                  open_dialog("successfullDialog", {
                    title: lang.collectionDeleted,
                    closeIconVisible: false,
                    titleClass: "max-full",
                    autoClose: true,
                  });
                  stopLoader();
                  props.getCollectionData && props.getCollectionData();
                  Router.reload();
                }, 200);
              });
              }else{
                startLoader();
                deleteData();
              }
            }}
          >
            {lang.delete}
          </div>
        </div>
        <div className="col">
          <div
            className=" btn  border-grey button-rounded text-app  w-100"
            onClick={props.onClose}
          >
            {lang.cancel}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteDialog;
