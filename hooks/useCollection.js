import React, { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../context/context";
import { stopLoader, Toast } from "../lib/global";
import {
  deleteCollection,
  getBookmarkPosts,
  getCollection,
  updateCollection,
} from "../services/collection";
import { isAgency } from "../lib/config/creds";
import { useSelector } from "react-redux";

const useCollection = ({ collection }) => {
  const [collections, setCollection] = useState(collection || null);
  const [pageLoader, setPageLoader] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const getCollectionData = async (requestData = {}) => {
    return new Promise(async (res, rej) => {
      setPageLoader(true);

      const { cb, offset = 0, limit = 10, all } = requestData;
      const creatorId = isAgency() ? selectedCreatorId : ""
      try {
        const apiCalles = [];
        apiCalles.push(getCollection(offset * limit, limit, null, creatorId));

        const [collectionDataFirstSet] = await Promise.all(apiCalles);

        if (all && !offset && collectionDataFirstSet?.status === 200) {
          apiCalles.push(getBookmarkPosts({ offset: 0, limit: 1, userId: creatorId }));
        }
        let data = await Promise.all(apiCalles);
        stopLoader();
        let allPost = {};
        let collectionData = data[0];

        let oldCollections = [];
        if (offset != 0) {
          oldCollections = [...collections];
        }
        if (
          all &&
          !offset &&
          data[1] &&
          data[1].data &&
          data[1].data.data.totalCount
        ) {
          const postData = data[1].data.data.data[0].postData[0];
          allPost = {
            coverImage: postData.type == 1 ? postData.url : postData.thumbnail,
            title: "All",
            totalCount: data[1].data.data.totalCount,
            isVisible: data[1]?.data?.data?.data[0].isVisible || 0
          };

          oldCollections = [allPost];
        }

        setPageLoader(false);
        //   console.log("collectyions  ", collectionData);

        if (collectionData.status != 200) {
          setCollection(oldCollections);
          return rej();
        }

        const updatedList = [...oldCollections, ...collectionData.data.data];
        setCollection(updatedList);
        res();
        cb && cb(updatedList);
      } catch (e) {
        rej();
        console.error("errormr", e);
        setPageLoader(false);
        //   e.response && Toast(e.response.data.messaghnjnhe, "error");
      }
    });
  };

  const deleteCollectionData = async (collectionId, cb) => {
    try {
      const collectionData = await deleteCollection(collectionId);
      //   console.log("collectyions  ", collectionData);

      cb && cb();
      setCollection(data);
    } catch (e) {
      console.error(e);
      //   e.response && Toast(e.response.data.messaghnjnhe, "error");
    }
  };

  const updateCollectionData = async (requestData = {}) => {
    const { cb, requestPayload } = requestData;
    try {
      const collectionData = await updateCollection(requestPayload);
      //   console.log("collectyions  ", collectionData);
      // const data = collectionData.status == 200 ? collectionData.data.data : [];
      cb && cb();
      // setCollection(data);
    } catch (e) {
      e.response && Toast(e.response.data.messaghnjnhe, "error");
    }
  };

  return {
    collections,
    getCollectionData,
    setCollection,
    updateCollectionData,
    deleteCollectionData,
    pageLoader,
  };
};

export default useCollection;

const useCollectionContext = () => {
  const [getCollectionData] = useContext(CollectionContext);

  return { getCollections: getCollectionData };
};
