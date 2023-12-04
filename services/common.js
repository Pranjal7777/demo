import { get, post } from "../lib/request"

export const getPresignedUrl = async (data) => {
    return post(`/aws/presigneUrl`, data)
}