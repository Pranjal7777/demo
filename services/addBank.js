import { deleteReq, get, patchWithToken, postWithToken } from "../lib/request"

export const addBankDetails = async (data) => {
    return postWithToken(`/bankAccount`, data)
  }

  export const AdditionalBankDetails = async (data) => {
    return get(`/additionalBankFields?countryCode=${data}`)
  }

  export const getBankDetails = async (data) => {
    return get(`/bankAccount/detail/user`)
  }

  export const changeBankDetails = async (data) => {
    return patchWithToken(`/bankAccount`,data)
  }

  export const deleteBankDetails = async (data) => {
    return deleteReq(`/bankAccount`,data)
  }