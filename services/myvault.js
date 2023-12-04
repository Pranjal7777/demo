import { deleteReq, get, patchWithToken, postWithToken, putWithToken } from "../lib/request"


export const getMediaVaultDetails = async (data) => {
  let url = `/mediaVaultCollection?offset=${data?.offset}&limit=${data?.limit}`
  if (data.userId) {
    url += `&userId=${data.userId}`
  }
  return get(url);
}

export const getVaultFolderDetailsById = async (data) => {
  let url = `/mediaVaultCollection?offset=${data?.offset}&limit=${data?.limit}&vaultCollectionId=${data.id}`
  if (data.userId) {
    url += `&userId=${data.userId}`
  }
  return get(url)
}

export const getDefaultVaultFolders = async (data) => {
  let url = `/mediaVaultCollection/defaultList`
  if (data.userId) {
    url += `?userId=${data.userId}`
  }
  return get(url)
}
export const getMediaFiles = async (data) => {
  let uri = `/mediaContentInVaultCollections?mediaType=${data?.mediaType}&offset=${data?.offset}&limit=${data?.limit}&sortBy=${data?.sortBy}`;
  if (data.vaultCollectionId) {
    uri += `&vaultCollectionId=${data?.vaultCollectionId}`
  } else if (data?.trigger) {
    uri += `&trigger=${data?.trigger}`
  }
  if (data.sharedTo) {
    uri += `&sharedTo=${data?.sharedTo}`
  }
  if (data.sharedType) {
    uri += `&sharedType=${data?.sharedType}`
  }
  if (data.creatorId) {
    uri += `&userId=${data?.creatorId}`
  }
  return get(uri)
}


export const addFolderDetails = async (data) => {
  return postWithToken(`/mediaVaultCollection`, data)
}
export const addMediafiles = async (data) => {
  return postWithToken(`/mediaToVault`, data)
}

export const moveMediafiles = async (data) => {
  return putWithToken(`/mediaToVault`, data)
}


export const editFolderDetails = async (data) => {
  return patchWithToken(`/mediaVaultCollection`, data)
}


export const deleteFolderDetails = async (vaultId) => {
  return deleteReq(`/mediaVaultCollection`, vaultId)
}
export const deleteMediaFiles = async (data) => {
  return deleteReq(`/mediaFromVault`, data)
}
