import React, { useEffect, useState } from "react";
import useLang from "../../../hooks/language";
import useCollection from "../../../hooks/useCollection";
import { CHECK } from "../../../lib/config";
import {
  close_drawer,
  drawerToast,
  startLoader,
  stopLoader,
} from "../../../lib/global";
import { getBookmarkPosts, remveBookmarkPost } from "../../../services/collection";
import { useSelector } from "react-redux";
import { isAgency } from "../../../lib/config/creds";

const DeleteConfirm = (props) => {
  const [lang] = useLang();
  const { deleteCollectionData } = useCollection({});
  const [bookMarkedPost, setBookMarkedPost] = useState([])
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
        close_drawer();
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
    }catch(error){
      console.error("Error in deleteData", error);
      stopLoader();
    }
  }

  return (
    <div className="delete-collection">
      <div className="detete-div text-center">
        <div className="delete-title text-app">{lang.dltCollection}</div>
        <div className="delete-desc fntSz13 text-gray mt-2">
          {lang.dltCollectionCnfrm}
        </div>
      </div>
      <div>
        <div
          className="border-top text-danger btn w-100 py-2"
          onClick={() => {
            if(bookMarkedPost.length == 0){
            startLoader();
            deleteCollectionData(props.collectionId, () => {
              props.onClose();
              close_drawer();
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
            }else{
              startLoader();
              deleteData();
            }
          }}
        >
          {lang.delete}
        </div>
        <div className="border-top btn w-100 py-2" onClick={props.onClose}>
          {lang.cancel}
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirm;
