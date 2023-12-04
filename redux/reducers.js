// eslint-disable-next-line no-unused-vars
import * as actionTypes from "./actions/actionTypes";
import { updateObject } from "../shared/utility";
import * as actions from "./actions/chat/action";
import {
  newMesageHanlder,
  changeReadStatus,
  changeReachStatus,
  addNewChatList,
  setChat,
  changeReadCount,
  setMessages,
  chatListStatus,
  deleteChat,
  changeUserStatus,
  productData,
  updateChat,
} from "./actions/chat/helper";
import { LEAVE_CURRENT_STREAM, REMOVE_STREAM, SET_CREATED_STREAM_DATA, SET_CURRENT_STREAM_ANALYTICS, SET_CURRENT_STREAM_ID, SET_CURRENT_STREAM_USER_INFO, SET_ISOMETRIK_MQTT_STATUS, SET_LIVE_STREAMS_DATA, SET_MESSAGES_STREAM, STREAM_UNLOCK, VIEWER_JOINED_STREAM, VIEWER_LEFT_STREAM, VIEWER_NUMBER_UPDATE } from "./actions/liveStream/liveStream";
import { GET_FEATURED_CREATORS, GET_LATEST_POSTS, GET_POPULAR_POSTS, CLEAR_ALL_POSTS, UPDATE_ALL_POSTS, SET_HOMEPAGE_DATA, UPDATE_PROFILE_OF_ALL_POSTS, GET_NEWEST_CREATORS, GET_ONLINE_CREATORS, UPDATE_BOOKMARK } from "./actions/dashboard/dashboardAction";
import { setCookie } from "../lib/session";
import { GET_SLOTS_ACTION, GET_SCHEDULE_AVAILABILITY_ACTION } from "./actions/videoCall/videoCallActions";
import { defaultLang } from "../lib/config/creds";

// const languages = LanguageSet;

export const initialState = {
  isTablet: false,
  language: defaultLang,
  guestToken: null,
  // locale: LanguageSet[DEFAULT_LANGUAGE],
  appConfig: {},
  CancelSubscriptionId: '',
  markateplaceData: {
    headerCategories: []
  },
  sidebarDropDown: {},
  desktopData: {
    featuredCreators: {
      data: [],
      page: 0,
      totalCount: null,
      hasMore: true,
      searchTxt: '',
    },
    newestCreators: {
      data: [],
      page: 0,
      totalCount: null,
      hasMore: true,
      searchTxt: '',
    },
    onlineCreators: {
      data: [],
      page: 0,
      totalCount: null,
      hasMore: true,
      searchTxt: '',
    },
    popularPosts: {
      data: [],
      page: 0,
      totalCount: null
    },
    latestPosts: {
      data: [],
      page: 0,
      hasMore: null
    },
    hashtagPage: {
      bannerImgs: [],
      recentSearches: []
    },
    homePageData: {
      data: [],
      page: 0,
      hasMore: true
    }
  },
  CRMSettings: {},
  intro: [],
  profileData: {},
  submitProfile: false,
  cards: null,
  paymentGetway: [],
  cardStatus: null,
  wallet: {
    walletData: [{ balance: 0 }]
  },
  seoSetting: {},
  defaultAddress: null,
  defaultCard: null,
  chat: {
    sale: {},
    // vipChat: {},
    vipChatCount: 0,
    userList: {},
    shopping: {},
    saleProducts: {},
    exchangeRecivedProducts: {},
    exchangeRecived: {},
    exchangeSend: {},
    chats: {},
    Chatshopping: {},
    exchangeRecivedshopping: {},
    ExchangeSendshopping: {},
    saleFetch: false,
    shoppingFetch: false,
    exchangeSendFetch: false,
    exchangeRecivedFetch: false,
    activeChat: "",
    saleFetchSatus: 1, //1:success  , 2:loading ,3:fail
    shoppingFetchStatus: 1, //1:success  , 2:loading ,3:fail,
    productData: {},
    notification: 0,
  },
  ownStories: [],
  createImageBitmap: false,
  subscriptionPlan: null,
  theme: "light",
  notificationCount: null,
  chatNotificationCount: null,
  liveStream: {
    POPULAR_STREAMS: {
      data: [],
      page: 0,
      totalCount: null
    },
    FOLLOWING_STREAMS: {
      data: [],
      page: 0,
      totalCount: null
    },
    UPCOMING_STREAMS: {
      data: [],
      page: 0,
      totalCount: null
    },
    OTHER_STREAMS: {
      data: [],
      page: 0,
      totalCount: null
    },
    CURRENT_STREAM_DATA: {
      streamAnalytics: null,
      metaData: null,
      streamUserInfo: {
        HOST: null,
        viewers: [],
        streamId: null
      },
      streamMessages: {
        data: [],
        isLoaded: false,
        pageToken: null
      }
    },
    mqttState: {
      connected: false
    }
  },
  videoCallSetting: {
    slotData: {
      data: null,
      fetchedAPI: false
    },
    weeklySchedule: {
      data: null,
      fetchedAPI: false
    }
  },
  appUpdateBot: null,
  viewedHashtagPost: {
    hashtagList: [],
    totalPost: 1,
  },
  commonUtility: {
    name: null
  },
  allData: [],
  setSelectedSlot: { extensionCharges: 0 },
  allDataPageNo: 0,
  myAgencyData: [],
  allAgency: [],
  cardsList: [],
  banksList: [],
  userBankDetails: [],
  agencyProfile: [],
  creatorRequest: [],
  selectedEmployee: [],
  creatorAgencyData: [],
  employeeData: {},
  allEmployeeData: [],
  selectedCreator: "",
};

const updateLocale = (state, action) => {
  return updateObject(state, {
    // locale: languages[action.selectedLang],
    language: action.selectedLang,
  });
};

const updatePostDataHelper = (postsArr, postId, data, isDelete) => {
  if (isDelete) {
    const filteredArr = postsArr.filter((item) => item.postId !== postId);
    return filteredArr;
  }
  const dupPostsArr = postsArr.map((item) => {
    if (item.postId === postId) return { ...item, ...data };
    else return item;
  })
  return dupPostsArr;
};
const updateBookmarkHandler = (postsArr, postId) => {
  const updateData = postsArr.map((post) => {
    if (post.postId === postId) {
      return {
        ...post,
        isBookmarked: 1
      }
    }
    return post
  })
  return updateData;
}
// LiveStream Helper ----> Start
const removeDuplicateStream = (prevStreams = [], newStreams = []) => {
  const prevStreamsId = prevStreams.map((stream) => stream.streamId);
  const newStreamsFiltered = newStreams.filter((stream) => !prevStreamsId.includes(stream.streamId));
  return [...prevStreams, ...newStreamsFiltered];
}

const removeParticularStream = (prevStreams = [], streamId, isScheduled = false) => {
  const newStreamsFiltered = prevStreams.filter((stream) => stream[isScheduled ? 'eventId' : 'streamId'] !== streamId);
  return newStreamsFiltered;
}

// to update profile of created post users - Redux State
const updateProfileOfPostDataHelper = (postsArr, userId, data) => {
  const dupPostsArr = postsArr.map((item) => {
    if (item.userId === userId) return { ...item, ...data };
    else return item;
  })
  return dupPostsArr;
};

const unlockParticularStream = (prevStreams = [], streamId, isScheduled = false) => {
  const newUpdatedStream = prevStreams.map((stream) => {
    if (stream[isScheduled ? 'eventId' : 'streamId'] === streamId) {
      const dupStream = { ...stream };
      dupStream.alreadyPaid = true;
      return dupStream;
    } else {
      return stream;
    }
  });
  return newUpdatedStream;
}

const removeViewerFromStream = (prevViewerList = [], viewerData) => {
  const newListToReturn = prevViewerList.length ? prevViewerList.filter((user) => user.viewerId != viewerData.viewerId) : [];
  return newListToReturn;
}

// LiveStream Helper ----> End

const updateWindowView = (state, action) => {
  return updateObject(state, {
    isMobile: action.data,
  });
};

const getDefaultAddress = (data) => {
  return data?.address?.find(add => add.isDefault === true)
};

const getDefaultCard = (data) => {
  const defaultCard = data.cards.find(card => card.isDefault === true)
  if (!defaultCard) {
    data.cards[0].isDefault = true;
  }
  return data.cards.find(card => card.isDefault === true)
};
const updateEmployeeData = (data, employeeId) => {
  const employeeData = data.filter((employee) => employee._id !== employeeId);
  return employeeData;
};
const updateCreatorData = (data, creatorId) => {
  const updatedCreatorData = data.filter((creator) => creator.creatorId !== creatorId);
  return updatedCreatorData;
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_LANGUAGE_CHANGE:
      return updateLocale(state, action);

    case actionTypes.ACTIVE_PROFILE:
      const newStateActiveProfile = {
        ...state,
        profileData: action.data,
        // defaultAddress: getDefaultAddress(action.data),
      };
      setCookie('profileData', JSON.stringify(newStateActiveProfile.profileData));
      return newStateActiveProfile;

    case actionTypes.UPDATE_PROFILE:
      const newStateUpdateProfile = {
        ...state,
        profileData: {
          ...state.profileData,
          ...action.data,
          defaultAddress: getDefaultAddress({
            ...state.profileData,
            ...action.data,
          }),
        },
      };
      setCookie('profileData', JSON.stringify(newStateUpdateProfile.profileData));
      return newStateUpdateProfile;

    // Added By Bhavleen on June 10th, 2021
    case actionTypes.UPDATE_SUB_PLAN_PROFILE:
      const newStateSubPlan = {
        ...state,
        profileData: {
          ...state.profileData,
          subscriptionData: action.data,
        },
      };
      setCookie('profileData', JSON.stringify(newStateSubPlan.profileData));
      return newStateSubPlan;

    case actionTypes.HEADER_CATEGORIES:
      const newStatemarkateData = {
        ...state,
        markateplaceData: {
          ...state.markateplaceData,
          headerCategories: action.payload,
        },
      };
      return newStatemarkateData;

    // Added By Bhavleen on April 19th, 2021
    case actionTypes.UPDATE_PROFILE_FOLLOWING:
      const newStateFollowing = {
        ...state,
        profileData: {
          ...state.profileData,
          totalFollowing: action.data,
        },
      };
      setCookie('profileData', JSON.stringify(newStateFollowing.profileData));
      return newStateFollowing;

    case actionTypes.UPDATE_VIDEOCALL_PRICE:
      const newState = {
        ...state,
        ...state.profileData,
        profileData: {
          ...state.profileData,
          videoCallPrice: action.payload,
        },
      };
      setCookie('profileData', JSON.stringify(newState));
      console.log(newState, "saijdijijijij")
      return newState;

    case actionTypes.SUBMIT_PROFILE:
      return {
        ...state,
        submitProfile: action.data,
      };

    case actionTypes.GET_CARD_SUCCESS:
      return {
        ...state,
        status: action.payload.status,
        cards: [...action.payload.cards],
        defaultCard: action.payload.cards.length > 0
          ? getDefaultCard(action.payload)
          : null,
      };

    case actionTypes.SET_PG:
      return {
        ...state,
        paymentGetway: [...action.paymentGetway],
      };

    case actionTypes.UPDATE_ORDER_COUNT:
      if (action.payload < 0) return state;
      const newUpdateProfileCounty = { ...state?.profileData, orderCount: action?.payload }
      setCookie('profileData', JSON.stringify(newUpdateProfileCounty));
      return {
        ...state,
        profileData: newUpdateProfileCounty,
      };

    case actionTypes.GETADDRESS_SUCCESS:
      return {
        ...state,
        address: action.payload.address ? action.payload.address : [],
        defaultAddress: action.payload.address
          ? getDefaultAddress(action.payload)
          : null,
      };

    case actionTypes.GET_WALLET_SUCCESS:
      return {
        ...state,
        wallet: { ...state.wallet, ...action.payload.wallet },
      };

    case actions.CHAT_INITIAL:
      // console.log("reduct chat state status 1", JSON.stringify(state));
      return initialState;
    case actions.SET_CHAT:
      // console.log("reduct chat state status 2", JSON.stringify(state));
      return { ...state, chat: { ...setChat(state.chat, action.payload) } };
    case actions.SET_MESSAGES:
      // console.log("reduct chat state.chat status 3", JSON.stringify(state.chat));
      return { ...state, chat: { ...setMessages(state.chat, action.payload) } };
    case actions.NEW_MESSAGE:
      // console.log("reduct chat state.chat status 444", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...newMesageHanlder(state.chat, action.payload) },
      };
    case actions.SET_SHOPPING:
      // console.log("reduct chat state.chat status 5", JSON.stringify(state.chat));
      return { ...state, chat: { ...intialState.chat } };
    case actions.SET_EXCHANGE_SEND:
      // console.log("reduct chat state.chat status 6", JSON.stringify(state.chat));
      return { ...state, chat: { ...intialState.chat } };
    case actions.SET_EXCHANGE_RECIVED:
      // console.log("reduct chat state.chat status 7", JSON.stringify(state.chat));
      return { ...state, chat: { ...intialState.chat } };
    case actions.ADD_NEW_CHATLIST:
      // console.log("reduct chat state.chat status 8", JSON.stringify(state.chat));
      let data1 = action.payload;
      return {
        ...state,
        chat: { ...addNewChatList(state.chat, action.payload) },
      };
    case actions.CHANGE_REACH_STATUS:
      // console.log("reduct chat state.chat status 9", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...changeReachStatus(state.chat, action.payload) },
      };
    case actions.CHANGE_READ_STATUS:
      // console.log("reduct chat state.chat status 10", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...changeReadStatus(state.chat, action.payload) },
      };
    case actions.CHANGE_READ_COUNT:
      // console.log("reduct chat state.chat staßßßßtus 11", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...changeReadCount(state.chat, action.payload) },
      };
    case actions.CHAT_LIST_STATUS:
      // console.log("reduct chat state.chat status 12", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...chatListStatus(state.chat, action.payload) },
      };
    case actions.DELETE_CHAT:
      // console.log("reduct chat state.chat status 13", JSON.stringify(state.chat));
      return { ...state, chat: { ...deleteChat(state.chat, action.payload) } };
    case actions.USER_STATUS:
      // console.log("reduct chat state.chat status 14", JSON.stringify(state.chat));
      return {
        ...state,
        chat: { ...changeUserStatus(state.chat, action.payload) },
      };
    case actions.GET_PRODUCT_SUCCESS:
      return { ...state, chat: { ...productData(state.chat, action.payload) } };

    case actionTypes.SET_OWN_STORIES:
      return { ...state, ownStories: action.payload };

    case actionTypes.SET_SEO_SETTINGS:
      return {
        ...state,
        seoSetting: {
          ...action.payload,
        },
      };

    case actionTypes.IS_MOBILE:
      return updateWindowView(state, action);

    case actionTypes.IS_TABLET:
      return {
        ...state,
        isTablet: action.data,
      }

    case "createImageBitmap":
      return {
        ...state,
        createImageBitmap: action.payload,
      };

    case "UPDATE_SUBSCRIPTION_STATUS":
      return {
        ...state,
        profileData: { ...state.profileData, subscribedUser: action.payload },
      };

    case "setActiveChat":
      return {
        ...state,
        chat: {
          ...state.chat,
          activeChat: action.payload,
        },
      };
    case actions.UPDATE_VIP_COUNT:
      return {
        ...state,
        vipChatCount: action.payload,
      };
    case actions.UPDATE_CHAT_OTHER_PROFILE:
      return {
        ...state,
        chatOtherProfile: action.payload,
      };
    // Added By Bhavleen on May 12th, 2021
    case actionTypes.SET_SUBSCRIPTION_PLAN:
      return {
        ...state,
        subscriptionPlan: action.payload,
      };

    case actionTypes.CHANGE_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    // Added By Bhavleen on July 1st, 2021
    case actionTypes.UPDATE_POPULAR_POST:
      return {
        ...state,
        popularPost: action.data,
      };

    // Added By Bhavleen on July 1st, 2021
    case actionTypes.UPDATE_LATEST_POST:
      return {
        ...state,
        latestPost: action.data,
      };
    case actionTypes.SET_CLOUDINARY_CREDS:
      return {
        ...state,
        cloudinaryCreds: action.creds,
      };

    case actionTypes.POST_SHOUTOUT_REQUEST_DATA:
      console.log(data, "dadadadad")
      return {
        ...state,
        intro: action.data
      }

    case actionTypes.GET_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action?.payload
      };
    case actionTypes.GET_CHAT_NOTIFICATION_COUNT:
      return {
        ...state,
        chatNotificationCount: action?.payload
      };

    case actionTypes.SET_APP_CONFIG:
      return {
        ...state,
        appConfig: action.config
      }
    // Desktop Data Cases
    case GET_FEATURED_CREATORS:
      if (action.isAPICall) return state;
      else return {
        ...state,
        desktopData: {
          ...state.desktopData,
          featuredCreators: {
            data: action.searchTxt || state.desktopData.featuredCreators.searchTxt || action.pageCount == 1 ? action.featuredCreatorsList : [...state.desktopData.featuredCreators.data, ...action.featuredCreatorsList],
            page: action.pageCount == undefined ? state.desktopData.featuredCreators.page : action.pageCount,
            totalCount: action.totalCount,
            hasMore: action.hasMore,
            searchTxt: action.searchTxt
          }
        }
      }

    // Desktop Data Cases
    case GET_NEWEST_CREATORS:
      if (action.isAPICall) return state;
      else return {
        ...state,
        desktopData: {
          ...state.desktopData,
          newestCreators: {
            data: action.searchTxt || state.desktopData.newestCreators.searchTxt || action.pageCount == 1 ? action.newestCreatorsList : [...state.desktopData.newestCreators.data, ...action.newestCreatorsList],
            page: action.pageCount == undefined ? state.desktopData.newestCreators.page : action.pageCount,
            totalCount: action.totalCount,
            hasMore: action.hasMore,
            searchTxt: action.searchTxt
          }
        }
      }

    // Desktop Data Cases
    case GET_ONLINE_CREATORS:
      if (action.isAPICall) return state;
      else return {
        ...state,
        desktopData: {
          ...state.desktopData,
          onlineCreators: {
            data: action.searchTxt || state.desktopData.onlineCreators.searchTxt || action.pageCount == 1 ? action.onlineCreatorsList : [...state.desktopData.onlineCreators.data, ...action.onlineCreatorsList],
            page: action.pageCount == undefined ? state.desktopData.onlineCreators.page : action.pageCount,
            totalCount: action.totalCount,
            hasMore: action.hasMore,
            searchTxt: action.searchTxt
          }
        }
      }

    case GET_POPULAR_POSTS:
      if (action.isAPICall) return state;
      else return {
        ...state,
        desktopData: {
          ...state.desktopData,
          popularPosts: {
            data: action.page == 1 ? action.popularPosts : [...state.desktopData.popularPosts.data, ...action.popularPosts],
            page: action.page == undefined ? state.desktopData.popularPosts.page : action.page,
            totalCount: action.totalCount == undefined ? state.desktopData.popularPosts.totalCount : action.totalCount
          }
        }
      }

    case GET_LATEST_POSTS:
      if (action.isAPICall) return state;
      else return {
        ...state,
        desktopData: {
          ...state.desktopData,
          latestPosts: {
            data: action.page == 1 ? action.latestPosts : [...state.desktopData.latestPosts.data, ...action.latestPosts],
            page: action.page == undefined ? state.desktopData.latestPosts.page : action.page,
            hasMore: action.hasMore == undefined ? state.desktopData.latestPosts.hasMore : action.hasMore
          }
        }
      }

    case UPDATE_ALL_POSTS:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          popularPosts: {
            ...state.desktopData.popularPosts,
            data: updatePostDataHelper(state.desktopData.popularPosts.data, action.postId, action.data, action.isDelete)
          },
          latestPosts: {
            ...state.desktopData.latestPosts,
            data: updatePostDataHelper(state.desktopData.latestPosts.data, action.postId, action.data, action.isDelete)
          }
        }
      }

    case actionTypes.RECHARGE_SUCCESS:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          walletData: [{ ...state.wallet.walletData?.[0], balance: Number(state.wallet.walletData?.[0]?.balance) + Number(action.payload) }]
        },
      };
      break

    case actionTypes.PURCHASE_SUCCESS_FROM_WALLET:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          walletData: [{ ...state.wallet.walletData?.[0], balance: Number(state.wallet.walletData?.[0]?.balance) - Number(action.payload) }]
        },
      };
    case CLEAR_ALL_POSTS:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          popularPosts: {
            data: [],
            page: 0,
            totalCount: null
          },
          latestPosts: {
            data: [],
            page: 0,
            hasMore: null
          }
        }
      }

    // LiveStream Cases
    case actionTypes.SET_GUEST_TOKEN:
      return {
        ...state,
        guestToken: action.token
      };
    case SET_LIVE_STREAMS_DATA:
      let toSet = 'OTHER_STREAMS';
      if (action.streamType == 3 && action.streamStatus == 1) toSet = 'POPULAR_STREAMS';
      if (action.streamType == 5 && action.streamStatus == 1) toSet = 'FOLLOWING_STREAMS';
      if (action.streamType == 4 && action.streamStatus == 1) toSet = 'UPCOMING_STREAMS';
      // if (action.streamStatus == 2) toSet = 'UPCOMING_STREAMS';
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          // [toSet]: {data: [...state.liveStream[toSet].data, ...action.streams], page: action.pageCount , totalCount: action.totalCount}
          [toSet]: { data: action.isPagination ? removeDuplicateStream(state.liveStream[toSet].data, action.streams) : action.streams, page: action.pageCount, totalCount: action.totalCount }
        }
      };

    case SET_CURRENT_STREAM_ANALYTICS:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamAnalytics: action.data
          }
        }
      };

    case LEAVE_CURRENT_STREAM:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            streamAnalytics: null,
            metaData: null,
            streamUserInfo: {
              HOST: null,
              viewers: [],
              streamId: null
            },
            streamMessages: {
              data: [],
              isLoaded: false,
              pageToken: null
            }
          }
        }
      };

    case SET_CREATED_STREAM_DATA:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            metaData: { ...state.liveStream.CURRENT_STREAM_DATA.metaData, ...action.streamData }
          }
        }
      };

    case SET_CURRENT_STREAM_ID:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamUserInfo: {
              ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo,
              streamId: action.streamId
            }
          }
        }
      };

    case SET_CURRENT_STREAM_USER_INFO:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamUserInfo: {
              ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo,
              [action.isHost ? 'HOST' : 'viewers']: action.isHost ? {
                ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo.HOST,
                ...action.userInfo
              } : [
                ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo.viewers,
                ...action.userInfo
              ]
            }
          }
        }
      };

    case VIEWER_JOINED_STREAM:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamUserInfo: {
              ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo,
              viewers: [...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo.viewers, action.viewerData]
            }
          }
        }
      };

    case VIEWER_LEFT_STREAM:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamUserInfo: {
              ...state.liveStream.CURRENT_STREAM_DATA.streamUserInfo,
              viewers: removeViewerFromStream(state.liveStream.CURRENT_STREAM_DATA.streamUserInfo.viewers, action.viewerData)
            }
          }
        }
      };

    case VIEWER_NUMBER_UPDATE:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            metaData: {
              ...state.liveStream.CURRENT_STREAM_DATA.metaData,
              viewerCount: action.viewersCount
            }
          }
        }
      };

    case SET_MESSAGES_STREAM:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          CURRENT_STREAM_DATA: {
            ...state.liveStream.CURRENT_STREAM_DATA,
            streamMessages: {
              data: action.isAPI ? [...action.messages, ...state.liveStream.CURRENT_STREAM_DATA.streamMessages.data] : [...state.liveStream.CURRENT_STREAM_DATA.streamMessages.data, ...action.messages],
              isLoaded: true,
              pageToken: action.isAPI ? action.pageToken : state.liveStream.CURRENT_STREAM_DATA.streamMessages.pageToken
            }
          }
        }
      }

    case REMOVE_STREAM:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          POPULAR_STREAMS: {
            ...state.liveStream.POPULAR_STREAMS,
            data: removeParticularStream(state.liveStream.POPULAR_STREAMS.data, action.streamId, action.isScheduled)
          },
          FOLLOWING_STREAMS: {
            ...state.liveStream.FOLLOWING_STREAMS,
            data: removeParticularStream(state.liveStream.FOLLOWING_STREAMS.data, action.streamId, action.isScheduled)
          },
          UPCOMING_STREAMS: {
            ...state.liveStream.UPCOMING_STREAMS,
            data: removeParticularStream(state.liveStream.UPCOMING_STREAMS.data, action.streamId, action.isScheduled)
          }
        }
      }

    case STREAM_UNLOCK:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          POPULAR_STREAMS: {
            ...state.liveStream.POPULAR_STREAMS,
            data: unlockParticularStream(state.liveStream.POPULAR_STREAMS.data, action.streamId, action.isScheduled)
          },
          FOLLOWING_STREAMS: {
            ...state.liveStream.FOLLOWING_STREAMS,
            data: unlockParticularStream(state.liveStream.FOLLOWING_STREAMS.data, action.streamId, action.isScheduled)
          },
          UPCOMING_STREAMS: {
            ...state.liveStream.UPCOMING_STREAMS,
            data: unlockParticularStream(state.liveStream.UPCOMING_STREAMS.data, action.streamId, action.isScheduled)
          }
        }
      }

    case SET_ISOMETRIK_MQTT_STATUS:
      return {
        ...state,
        liveStream: {
          ...state.liveStream,
          mqttState: {
            ...state.liveStream.mqttState,
            connected: action.isConnected
          }
        }
      };

    case actions.UPDATE_CHAT:
      return {
        ...state,
        chat: { ...updateChat(state.chat, action.payload) },
      };


    // Video Call Actions Reducer
    case GET_SLOTS_ACTION:
      if (action.isAPI) return state;
      return {
        ...state,
        videoCallSetting: {
          ...state.videoCallSetting,
          slotData: {
            ...state.videoCallSetting.slotData,
            data: action.dataToSave,
            fetchedAPI: true
          }
        }
      };
    case actionTypes.GET_BANNERS_IMGS:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          hashtagPage: {
            ...state.desktopData.hashtagPage,
            bannerImgs: action.data,
            recentSearches: action.data,
          }
        }
      };

    case GET_SCHEDULE_AVAILABILITY_ACTION:
      if (action.isAPI) return state;
      return {
        ...state,
        videoCallSetting: {
          ...state.videoCallSetting,
          weeklySchedule: {
            ...state.videoCallSetting.weeklySchedule,
            data: action.dataToSave,
            fetchedAPI: true
          }
        }
      };
    case actionTypes.GET_RECENT_SEARCHES:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          hashtagPage: {
            ...state.desktopData.hashtagPage,
            recentSearches: action.data,
          }
        }
      }

    case actionTypes.CRM_CHANGE_SETTING:
      return {
        ...state,
        CRMSettings: { ...action.payload }
      }

    case actionTypes.SET_COMMON_UTILITY:
      return {
        ...state,
        commonUtility: { ...action.payload }
      }

    case actionTypes.OTHER_ALL_DATA:
      return {
        ...state,
        // allData: !state.allData.length ? [...action.payload] : state.allDataPageNo != action.pageNo ? [...state.allData, ...action.payload] : action.payload,
        // allDataPageNo: action.pageNo || 0,
        allData: action.payload
      }

    case actionTypes.UPDATE_OTHER_PROFILE_DATA:
      const updateData = state.allData.map((post) => {
        if (post.postId === action.payload.postId) {
          if (action?.payload.replace) {
            return {
              ...action?.payload?.newData
            }
          }
          return {
            ...post,
            likeCount: action.payload.isLike ? post.likeCount + 1 : post.likeCount - 1,
            isLike: action.payload.isLike,
            description: action.payload.description || post.description,
            postData: action?.payload?.postData || post.postData,
            previewData: action?.payload?.previewData || post.previewData
          }
        }
        return post
      })
      return {
        ...state,
        allData: updateData
      }

    case actionTypes.UPDATE_COMMENT_COUNT_OTHERPROFILE:
      const updatedData = state.allData.map((post) => {
        if (post.postId === action.payload.postId) {
          return {
            ...post,
            commentCount: action.payload.commentCount
          }
        }
        return post
      })

      return {
        ...state,
        allData: updatedData
      }

    case actionTypes.EMPTY_OTHER_PROFILE_DATA:
      return {
        ...state,
        allData: []
      }
    // HomePage Data Reducers
    case SET_HOMEPAGE_DATA:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          homePageData: {
            data: [...action.dataToSave],
            page: action.page,
            hasMore: action.hasMore
          }
        }
      }

    case actionTypes.GET_APP_UPDATE_BOT:
      return {
        ...state,
        appUpdateBot: action?.payload,
      };

    case actionTypes.MARK_UPDATES_STATUS:
      const updatedProfileData = {
        ...state.profileData,
        universalMessageRead: action.flag
      };
      setCookie('profileData', JSON.stringify(updatedProfileData));
      return {
        ...state,
        profileData: updatedProfileData
      };

    case actionTypes.UPDATE_VIEWED_HASHTAG:
      return {
        ...state,
        viewedHashtagPost: action?.payload,  // I will send whole object from dispatch 
      }

    case actionTypes.UPDATE_HASHTAG:
      const hashtagList = state.viewedHashtagPost.hashtagList.map(hashtag => hashtag.postId === action.payload.postId ? ({ ...hashtag, ...action.payload }) : hashtag)
      return {
        ...state,
        viewedHashtagPost: {
          ...state.viewedHashtagPost,
          hashtagList
        },
      }

    case actionTypes.UPDATE_BOOKMARK_POSTSLIDER:
      const updatedBookmark = state.allData.map((post) => {
        if (post.postId === action.payload.postId) {
          return {
            ...post,
            isBookmarked: action.payload.isBookmarked
          }
        }
        return post
      })

      return {
        ...state,
        allData: updatedBookmark
      }

    case actionTypes.UPDATE_PURCHASED_POST:
      const purchasedData = state.allData.map((post) => {
        if (post.postId === action.payload.postId) {
          return {
            ...post,
            isVisible: action.payload.isVisible
          }
        }
        return post
      })
      return { ...state, allData: purchasedData }

    case actionTypes.SEND_PURCHASED_EXCLUSIVE_DATA_TO_REDUX:
      let updatedDataToSend = [...state.allData];
      updatedDataToSend[action.payload.assetIndex].postData = action.payload.data
      return { ...state, allData: updatedDataToSend }

    case actionTypes.SET_CANCEL_SUBSCRIPTION_ID:
      return {
        ...state,
        CancelSubscriptionId: action?.payload,
      }


    case actionTypes.SET_SELECTED_SLOT_EXTENDED_STREAM:
      return {
        ...state,
        setSelectedSlot: { ...action.payload }
      }
    case actionTypes.AGENCY_OWNER_DATA:
      return {
        ...state,
        ownerData: { ...action.payload }
      }
    case actionTypes.AGENCY_CREATOR_REQUEST:
      return {
        ...state,
        creatorRequest: action.payload
      }
    case actionTypes.SELECTED_EMPLOYEE:
      return {
        ...state,
        selectedEmployee: action.payload
      }
    case actionTypes.EMPLOYEE_DATA:
      return {
        ...state,
        employeeData: action.payload
      }
    case actionTypes.ALL_EMPLOYEE_DATA:
      return {
        ...state,
        allEmployeeData: action.payload
      }
    case actionTypes.UPDATE_EMPLOYEE_DATA:
      return {
        ...state,
        allEmployeeData: updateEmployeeData(state.allEmployeeData, action.payload)
      }
    case actionTypes.CREATOR_AGENCY_DATA:
      return {
        ...state,
        creatorAgencyData: action.payload
      }
    case actionTypes.UPADTE_CREATOR_AGENCY_DATA:
      return {
        ...state,
        creatorAgencyData: updateCreatorData(state.creatorAgencyData, action.payload)
      }
    case UPDATE_PROFILE_OF_ALL_POSTS:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          popularPosts: {
            ...state.desktopData.popularPosts,
            data: updateProfileOfPostDataHelper(state.desktopData.popularPosts.data, action.userId, action.data)
          },
          latestPosts: {
            ...state.desktopData.latestPosts,
            data: updateProfileOfPostDataHelper(state.desktopData.latestPosts.data, action.userId, action.data)
          }
        }
      }
    case actionTypes.AGENCY_DATA:
      return {
        ...state,
        allAgency: action?.payload,
      }
    case actionTypes.MY_AGENCY_DATA:
      return {
        ...state,
        myAgencyData: action?.payload,
      }

    case actionTypes.SETTOGGLE_SIDEBAR_DROPDOWN:
      return {
        ...state,
        sidebarDropDown: {
          ...state.sidebarDropDown,
          [action.payload.dropDownType]: action.payload.isOpen,
        }
      }
    case actionTypes.CARDS_LIST:
      return {
        ...state,
        cardsList: action.payload,
      };

    case actionTypes.UPDATE_CARDS_LIST:
      if (!state.cardsList) {
        return {
          ...state,
          cardsList: [action.payload],
        };
      } else {
        return {
          ...state,
          cardsList: [
            ...state.cardsList,
            action.payload,
          ],
        };
      }

    case actionTypes.SELECT_CREATOR:
      return {
        ...state,
        selectedCreator: action.payload,
      };

    case actionTypes.AGENCY_PROFILE_DATA:
      const agencyData = {
        ...state,
        agencyProfile: { ...action.payload }
      };
      setCookie('agencyProfileData', JSON.stringify(agencyData.agencyProfile));
      return agencyData;

    case UPDATE_BOOKMARK:
      return {
        ...state,
        desktopData: {
          ...state.desktopData,
          popularPosts: {
            ...state.desktopData.popularPosts,
            data: updateBookmarkHandler(state.desktopData.popularPosts.data, action.postId)
          },
          latestPosts: {
            ...state.desktopData.latestPosts,
            data: updateBookmarkHandler(state.desktopData.latestPosts.data, action.postId)
          }
        }
      }
    default:
      return state;
  }
};

export default reducer;
