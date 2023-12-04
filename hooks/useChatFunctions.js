import * as React from 'react';
import { startLoader, stopLoader } from '../lib/global';
import { startChat } from '../lib/chat';
import { getCookie } from '../lib/session';
import { getProfile } from '../services/profile';
import useProfileData from './useProfileData';
import { useRouter } from 'next/router';
import { open_dialog, open_drawer } from '../lib/global/loader';
import isMobile from './isMobile';

export const useChatFunctions = (props) => {
  const [profile] = useProfileData()
  const [mobileView] = isMobile()
  const router = useRouter()

  const getChatDetails = async (userId) => {
    try {
      startLoader()
      const profileRes = await getProfile(userId, getCookie('token'), getCookie('selectedCreatorId'))
      const profileData = profileRes.data?.data;
      let convo = await startChat({ userId: profileData.isometrikUserId, userName: profileData.username, userProfileImage: "/default-pic.png", searchableTags: [profile.username, profileData.username] }, true)
      return { conversation: convo, otherProfile: profileData };
    } catch (e) {
      console.log("errro", e)
      stopLoader()
      return {
        conversation: { newConversation: false }
      }
    }
  }

  const handleChat = async (props) => {
    const pRes = await getChatDetails(props?.userId)
    const convo = pRes?.conversation
    const otherProfile = pRes?.otherProfile
    if (profile?.userTypeCode == 2 && otherProfile?.userTypeCode == 2) {
      return router.push(`/chat?c=${convo?.conversationId}`);
    }
    if (!convo?.newConversation) {
      return router.push(`/chat?c=${convo?.conversationId}`);
    } else {
      if (mobileView) {
        return open_drawer(
          "VIP_MESSAGE_POPUP",
          {
            handleSubmit: (vipChat) => {
              // dispatch({type: "UPDATE_VIP_COUNT", payload: vipChat})
              router.push(`/chat?c=${convo?.conversationId}`);
            },
            userName: otherProfile?.usrname || props?.userName || props?.username,
            chatId: convo?.conversationId,
            creatorId: props?.userId,
          },
          "bottom"
        );
      } else {
        return open_dialog("VIP_MESSAGE_POPUP", {
          handleSubmit: (vipChat) => {
            // dispatch({type: "UPDATE_VIP_COUNT", payload: vipChat})
            router.push(`/chat?c=${convo?.conversationId}`);
          },
          userName: props?.userName || props?.username,
          chatId: convo?.conversationId,
          creatorId: props?.userId,
        });
      }
    }

  };

  return { getChatDetails: getChatDetails, handleChat };
};