import React, { useCallback, useEffect, useState } from "react";
import { Toast, UploadImage, UploadVideo } from "../lib/global";
import { addUpdateAsyncTask } from "../lib/rxSubject";
import { getCookiees } from "../lib/session";
import { posting, uploadStory } from "../services/assets";

export const usePostLoader = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const addUpdateAsync = addUpdateAsyncTask.subscribe(handleTask);
    return () => {
      addUpdateAsync && addUpdateAsync.unsubscribe(handleTask);
    };
  }, [posts]);

  useEffect(() => {
    // console.log("asassasa", posts);
  }, [posts]);

  // type:1 : add  type 2:delete
  const handleTask = useCallback(
    ({ type, data, taskId }) => {
      if (type == 1) {
        addTask(taskId, data);
      } else {
        remveFromTask(taskId);
      }
    },
    [posts]
  );

  const addTask = (taskId, data) => {
    setPosts((prevPost) => {
      return { ...prevPost, [taskId]: { ...data } };
    });
  };

  const remveFromTask = (taskId) => {
    const taskList = { ...posts };
    // console.log("Sadasdsad", taskId, posts, taskList[taskId]);
    delete taskList[taskId];
    setPosts(taskList);
  };

  return { postingLoader: Object.keys(posts).length ? true : false };
};
