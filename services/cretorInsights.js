import moment from 'moment'
import { get } from '../lib/request'
export const getGeneralStats = ({ startTime, endTime, userId }) => {
    let url = `/creator/dashboard/general-stats?start_timestamp=${startTime}&end_timestamp=${endTime}&timezone=${moment.tz.guess()}`
    if (userId) {
        url += `&userId=${userId}`
    }
    return get(url)
}

export const getEarningStats = ({ startTime, endTime, userId }) => {
    let url = `/creator/dashboard/earning-stats?start_timestamp=${startTime}&end_timestamp=${endTime}&timezone=${moment.tz.guess()}`
    if (userId) {
        url += `&userId=${userId}`
    }
    return get(url)
}

export const getChartIndights = ({ startTime, endTime, groupBy = 1, userId }) => {
    let url = `/creator/dashboard/chart-earning?start_timestamp=${startTime}&end_timestamp=${endTime}&group_by=${groupBy}&timezone=${moment.tz.guess()}`
    if (userId) {
        url += `&userId=${userId}`
    }
    return get(url)
}

export const getTotalEarning = ({ yearWise, userId }) => {
    let url = `/creator/dashboard/total-earning?timezone=${moment.tz.guess()}`
    if (yearWise) {
        url += `&yearWise=true`
    }

    if (userId) {
        url += `&userId=${userId}`
    }
    return get(url)
}

export const getTopStats = ({ startTime, endTime, userId }) => {
    let url = `/creator/dashboard/top-posts?start_timestamp=${startTime}&end_timestamp=${endTime}&timezone=${moment.tz.guess()}`
    if (userId) {
        url += `&userId=${userId}`
    }
    return get(url)
}