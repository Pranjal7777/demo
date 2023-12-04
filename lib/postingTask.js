// import { useSelector } from "react-redux";
import { addUpdateAsyncTask, refreshStoryApi } from "./rxSubject";
// import Router from "next/router";
import { Toast, startLoader, stopLoader } from "./global";
import { getCookiees } from "./session";
import { posting, uploadStory } from "../services/assets";
import { FOLDER_NAME_IMAGES } from "./config";
import { getCognitoToken } from "../services/userCognitoAWS";
import fileUploaderAWS from "./UploadAWS/uploadAWS";

export const uploadPost = async (data = {}) => {
  const taskId = Date.now();
  const { requestPayload, lang, fileObject, type, bulkMessages, isStory } = data;
  requestPayload.postType = requestPayload.postType.toString();
  const posts = [];
  const userId = getCookiees("uid");
  const isScheduled = requestPayload?.isScheduled;
  const postCount = fileObject?.length;

  const handleFileUploaderAWSFunc = async (postId, tokenData, isStory = false) => {
    try {
      const awsURLArr = [];
      for (let i = 0; i < fileObject.length; i++) {
        const fileName = isStory ? `${postId}_story_${i + 1}.mp4` : `${postId}_post_${i + 1}.mp4`;
        const awsURL = await fileUploaderAWS(fileObject[i].filesObject, tokenData, fileName);
        awsURLArr.push(awsURL);
      }
    } catch (err) {
      console.error(err, 'in Posting Video API !!!');
    }
  }

  try {
    startLoader();
    const cognitoToken = await getCognitoToken();
    const tokenData = cognitoToken?.data?.data;

    addUpdateAsyncTask.next({
      type: 1, //1 :for add
      data,
      taskId,
    });

    if (type !== 4) {
      console.log({ type });
      const count = 1
      for (let i = 0; i < fileObject.length; i++) {
        const imgFileName = `${Date.now() + fileObject[i]?.filesObject?.name}`;
        const folderName = `${userId}/${isStory ? FOLDER_NAME_IMAGES.story : FOLDER_NAME_IMAGES.post}`;
        let isAddWaterMark = isStory ? false : true;
        let url = type == 1 ? await fileUploaderAWS(fileObject[i].filesObject, tokenData, imgFileName, false, folderName, false, true, null, isAddWaterMark, true, postCount, count) : '';

        var postImage = {
          seqId: i + 1,
          type: parseInt(type),
          url: url,
        };

        if (parseInt(type) == 2) {
          const thumbFolderName = `${userId}/${FOLDER_NAME_IMAGES.videoThumb}`;
          const thumb = await fileUploaderAWS(fileObject[i].files, tokenData, `thumb_${Date.now()}.png`, false, thumbFolderName, true, null, null, null, false, postCount, count);
          postImage["thumbnail"] = thumb;
          // postImage["videoDuration"] = data.videoDuration
          if (isStory) delete postImage.url;
        }

        // if (parseInt(type) == 2 && bulkMessages) {
        //   // To GET THUMBNAIL IMAGE UPLAODED
        //   const thumbFolderName = `${userId}/${FOLDER_NAME_IMAGES.videoThumb}`;
        //   const thumb = await fileUploaderAWS(fileObject[i].files, tokenData, `thumb_${Date.now()}.png`, false, thumbFolderName, true);
        //   postImage["thumbnail"] = thumb;
        //   // TO GET VIDEO UPLOADED ON NON TRANSFORMATION BUCKET
        //   const videoFolderName = `${userId}/${FOLDER_NAME_IMAGES.chatMedia}`;
        //   const videoFileName = `${Date.now()}_${userId}_bulkVideo`;
        //   let vidUrl = await fileUploaderAWS(fileObject[i].filesObject, tokenData, videoFileName, false, videoFolderName, false, 'no');
        //   postImage.url = vidUrl;
        // }
        count++;
        posts.push(postImage);
      }
    }

    if (bulkMessages) {
      return posts;
    }

    if (type == 4) {
      // requestPayload.mediaCount = 0;
      requestPayload.mediaType = type;
      if (!isStory) {
        requestPayload["postData"] = requestPayload.postData;
        // } else {
        //   requestPayload["storyData"] = requestPayload.postData;
      }
      requestPayload["postData"] = requestPayload.postData;
    } else {
      if (!isStory) {
        requestPayload["postData"] = posts;
      } else {
        requestPayload["storyData"] = posts;
      }
    }

    if ((type == 2 || type == 1 || type == 6) && !isStory) {
      // requestPayload.mediaCount = posts.length;
      requestPayload.mediaType = type;
    }

    if (isStory) {
      uploadStory(requestPayload)
        .then((data) => {
          stopLoader()
          if (data.data?.data[0]) {
            const storyId = data.data.data[0]._id;
            handleFileUploaderAWSFunc(storyId, tokenData, true);
            Toast("Story added in queue successfully");
          } else {
            Toast("New story created successfully");
          }
          refreshStoryApi.next({ isUploading: true });
          addUpdateAsyncTask.next({
            type: 2, //2 :for delete
            taskId: taskId,
          });
        })
        .catch((e) => {
          stopLoader();
          addUpdateAsyncTask.next({
            type: 2, //2 :for delete
            taskId: taskId,
          });
          if (e && e.response && e.response.data) {
            Toast(e.response.data.message, "error");
          } else {
            Toast("Failed!", "error");
          }
        });
    } else if (!isStory) {
      posting(requestPayload)
        .then((data) => {
          stopLoader();
          const postId = data.data.postId;
          if (type == 2) {
            handleFileUploaderAWSFunc(postId, tokenData);
            Toast(lang.postAddedInQueue);
          };
          if (type == 1 && !isScheduled) {
            Toast(lang.newPostCreated);
          }
          if (isScheduled) {
            Toast(lang.newSchPostCreated)
          }
          if (type == 6) {
            Toast(lang.newProductUpdated)
          }
          if (type == 4) {
            Toast(lang.newTextPostCreated)
          }
          addUpdateAsyncTask.next({
            type: 2, //2 :for delete
            taskId: taskId,
          });
        })
        .catch((e) => {
          stopLoader();
          addUpdateAsyncTask.next({
            type: 2, //2 :for delete
            taskId: taskId,
          });
          if (e && e.response && e.response.data) {
            Toast(e.response.data.message, "error");
          } else {
            Toast("Failed!", "error");
          }

          console.error("ERROR IN uploadPost", e)
        });
    }
  } catch (e) {
    console.error("ERROR IN Upload Post", e);
    addUpdateAsyncTask.next({
      type: 2, //2 :for delete
      taskId: taskId,
    });
  }
};
