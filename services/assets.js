import { BITLY_KEY } from "../lib/config/creds";
import { getMyIP } from "../lib/global/getMyIP";
import { ParseToken } from "../lib/parsers/token-parser";
import { deleteReq, get, patchWithToken, postWithToken } from "../lib/request";
import { getCookie } from "../lib/session";

export const posting = (data) => {
  delete data.mediaType;
  if (!data.videoDuration) {
    delete data.videoDuration
  }
  return postWithToken("/posts/", data);
};

export const uploadStory = (data) => {
  const storyPayload = { ...data };
  Object.keys(storyPayload).map((payload) => {
    if (payload == "mediaCount") {
      delete storyPayload["mediaCount"]
    }
    if (payload == "mediaType") {
      delete storyPayload["mediaType"]
    }
  })
  return postWithToken("/story", storyPayload);
};

export const updatePost = (pdata) => {
  const data = { ...pdata }
  delete data.mediaType;
  if (!data.videoDuration) {
    delete data.videoDuration
  }
  return patchWithToken("/posts/", data);
};

export const getPost = async (payload) => {
  let url = `/posts?filter=${payload.filter}&offset=${payload.offset}&limit=${payload.limit}`
  if (payload.userId) {
    url += `&creatorId=${payload.userId}`
  }
  return get(url);
};

export const getPopularFeedPost = async (page = 1, userId = "", token) => {
  let url = `/popularPosts/?page=${page}`
  if (userId) {
    url = url + `&userId=${userId}`
  }
  if (token) {
    let headers = {
      authorization: await ParseToken(token),
    };
    return get(url, headers);
  }
  return get(url);
};

export const getTeaserPostsApi = async ({ page = 1, postType = 3 }) => {
  return get(`/popularPosts/?page=${page}&postType=${postType}`);
};

export const getPostById = async (postId) => {
  return get(`/assets/?userId=${getCookie("uid")}&postId=${postId}`);
};

export const getSharedPost = async (postId, referId, token) => {
  let headers = {
    authorization: await ParseToken(token),
  };
  return get(
    `/assets/?page=1&status=1&refferId=${referId}&postId=${postId}`,
    headers
  );
};

export const getLikedPostsApi = (query) => {
  let url = `/posts/likes` +
    `?limit=${query.limit || 10}` +
    `&offset=${query.offset || 0}`
  if (query.userId) {
    url += `&creatorId=${query.userId}`
  }
  return get(url);
};

export const getPurchasedPostsApi = (query) => {
  let url = `/posts/purchase` +
    `?size=${query.limit || 10}` +
    `&page=${query.offset || 0}`
  if (query.creatorId) {
    url += `&creatorId=${query.creatorId}`
  }
  return get(url);
};

export const getLikedPurchasedPostApi = (query) => {
  let url = `/userProfile/posts/` +
    `?size=${query.limit || 10}` +
    `&page=${query.offset || 0}` +
    `&sort=${query.sort || 0}`;

  if (query.mediaType) {
    url += `&mediaType=${query.mediaType}`;
  }
  if (query.postType) {
    url += `&type=${query.postType}`;
  }
  if (query.userId) {
    url += `&userId=${query.userId}`;
  }
  return get(url);
};

export const postLikeDislike = async (payload) => {
  return postWithToken(`/likesDislikeAsset/`, payload);
};

export const deletePost = async (payload) => {
  const headers = {
    city: "Banglore",
    country: "India",
    ipaddress: getMyIP(),
    latitude: "14.457700",
    longitude: "75.921980",
  };
  return deleteReq(`/posts/`, payload);
};

export const postTip = (data) => {
  return postWithToken("/tipCreator", data);
};

export const buyPost = (data) => {
  return postWithToken("/purchaseExclusivePost", data);
};

export const reportPostService = (data) => {
  return postWithToken("/report", data);
};

export const getReportReasons = (type) => {
  return get(`/reasons?type=${type}`);
};

export const getProductDetail = async (id, token, address, refId, q, is) => {
  refId = refId ? `&refId=${refId}` : "";
  let newQuery = "";
  newQuery = q ? `&q=${q}&searchIn=${is}` : "";

  return get(
    `/python/assetDetails/?assetId=${id}${refId}${newQuery}`,
    token,
    address
  );
};

export const creatorSearch = (list) => {
  let url = `/tagging/users?limit=10&offset=0&searchText=${list.search || ""}`
  if (list.userId) {
    url += `&creatorId=${list.userId}`
  }
  return get(url);
  // return get(`/creator/suggestion?limit=20${list.search &&'&searchText='+list.search}`)
};

export const getStories = (data) => {
  let url = `/stories?limit=10&offset=${data.skip || 0}`
  if (data.userId) {
    url += `&creatorId=${data.userId}`
  }
  return get(url);
};

export const getAllStories = (userId, creatorId) => {
  let url = `/stories/detail?userId=${userId}`
  if (creatorId) {
    url += `&creatorId=${creatorId}`
  }
  return get(url);
};

export const getOwnStories = (data) => {
  let url = `/story/active`
  if (data.userId) {
    url += `?userId=${data.userId}`
  }
  return get(url);
};

export const getAllOwnStoriesApi = (data) => {
  let url = `/story/active`
  if (data.userId) {
    url += `?userId=${data.userId}`
  }
  return get(url);
}

export const submitViewStory = (id) => {
  return postWithToken("/story/views", { storyId: id });
};

export const storyDeleteApi = (data) => {
  return deleteReq(
    `/story?storyId=${data.storyId}&isFullStory=${data.isFullStory || false}`
  );
};

export const getStoryViewsApi = (data) => {
  let url = `/story/views?storyId=${data.storyId}`
  if (data.userId) {
    url += `&userId=${data.userId}`
  }
  return get(url);
};

export const sharePostOrProfile = (data) => {
  return postWithToken("/shared/", data);
};


//  featured stories apis
export const getAllStoriesToHighlightApi = (list) => {
  let url = `/story/all?offset=${list.offset || 0}&limit=${list.limit || 10}`
  if (list.userId) {
    url += `&userId=${list.userId}`
  }
  return get(url);
}

export const getFeaturedStoryApi = (list = {}, otherHeaders = {}) => {
  let url = `/featuredCollection?userId=${list.userId}&offset=${list.offset || 0}&limit=${list.limit || 10}`
  if (list.creatorId) {
    url += `&creatorId=${list.creatorId}`
  }
  return get(url, otherHeaders)
}

export const getFeaturedStoryDetailsApi = (list) => {
  let url = `/featuredCollection/details?featCollectionId=${list.id}&userId=${list.userId}&offset=${list.offset || 0}&limit=${list.limit || 10}`
  if (list.creatorId) {
    url += `&creatorId=${list.creatorId}`
  }
  return get(url)
}

export const addFeaturedStoryApi = (data) => {
  return postWithToken('/featuredCollection', data)
}

export const updateFeaturedStoryApi = (data) => {
  return patchWithToken('/featuredCollection', data)
}

export const deleteFeaturedStoryApi = (id) => {
  return deleteReq(`/featuredCollection?featCollectionId=${id}`)
}



// export const getShortUrl = (url="") => {
//   const apiUrl = "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyAdyMcxDVzykrmUcclSpmCbzDArb5NPMOM"
//   const data = {
//     "dynamicLinkInfo": {
//       "domainUriPrefix": "https://share.fanzly.app",
//       "link": "https://staging.fanzly.app/otherProfile?userId=5fd89f3ed9925a00c6426d42&status=1"
//     }
//   }
//   fetch('https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyAdyMcxDVzykrmUcclSpmCbzDArb5NPMOM',{
//     method: 'POST',
//     body: JSON.stringify(data)
//   })
//   .then(res=>{
//     console.log('res', res)
//   }).catch(err=>{
//     console.log('err',err)
//   })
// }

export const getBitlyUrl = (longUrl) => {
  return fetch("https://api-ssl.bitly.com/v4/shorten", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BITLY_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      long_url: longUrl,
      domain: "bit.ly",
    }),
  })
    .then(async (res) => {
      const result = await res.json();
      return result.link;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
};


export const postImpressionApi = (data) => {
  console.log("data inside postImpression", data)
  return postWithToken('/post/postImpressions/', data)
}

export const getTaggedPostsApi = (query = {}) => {
  let url = `/assets/?page=${query.offset || 1}&sort=${query.sort || 0}&status=1&tagged=true`
  if (query?.mediaType) {
    url += `&mediaType=${query.mediaType}`
  }
  if (query.creatorId) {
    url += `&creatorId=${query.creatorId}`
  } else {
    url += `&userId=${query.userId}`
  }
  return get(url);
}


export const getConfigURL = async (token) => {
  let headers = {};
  if (token) headers = { authorization: await ParseToken(token) };
  return get("/config", headers);
};

// manage customer lists api 

export const postCreateCustomerList = (data) => {
  return postWithToken('/creatorCustomerLists', data)
}

export const getListDetails = (data) => {
  let url = `/creatorCustomerLists?limit=${data?.limit || 10}&offset=${data?.skip || 0}`
  if (data.searchText) {
    url += `&searchText=${data.searchText}`
  }
  if (data.creatorId) {
    url += `&userId=${data.creatorId}`
  }
  return get(url);
};

export const getCustomerListDetails = (data) => {
  let searchText = data.searchText ? `&searchText=${data.searchText}` : "";
  let type = data.listType ? `&listType=${data.listType}` : ""
  let url = (`/customerLists?listId=${data?.creatorCustomerListId}&limit=${data?.limit || 10}&offset=${data?.skip || 0}${type}`);
  if (searchText) url = url + searchText
  if (data.userId) url += `&userId=${data?.userId}`
  return get(url)
};

export const deleteCustomerList = (data) => {
  return deleteReq(`/creatorCustomerLists`, data)
}


// Add Memeber in exisiting list

export const addMemberInExistingList = (payload) => {
  return postWithToken("/customerLists", payload)
}

export const deleteMemberInExistingList = (payload) => {
  return deleteReq("/customerLists", payload)
}
export const editListDetails = (payload) => {
  return patchWithToken("/creatorCustomerLists", payload)
}