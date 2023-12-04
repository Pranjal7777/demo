import * as React from 'react';
import { getChartIndights, getEarningStats, getGeneralStats, getTopStats, getTotalEarning } from '../../services/cretorInsights';
import { Toast } from '../../lib/global/loader';
import { formatDate } from '../../lib/date-operation/date-operation';
import { findDateDiff } from '../../lib/helper';
import moment from 'moment-timezone';
import { defaultTimeZone, isAgency } from '../../lib/config/creds';
import { useSelector } from 'react-redux';

const filterList = [
    {
        label: "Hour",
        value: 0
    },
    {
        label: "Days",
        value: 1
    },
    {
        label: "Weeks",
        value: 2
    },
    {
        label: "Months",
        value: 3
    },
    {
        label: "Years",
        value: 5
    },
]

export const useCreatorInsights = (props) => {

    const getStartOftheDay = (date) => {
        return moment(date).tz(moment.tz.guess()).startOf('day').valueOf()
    }

    const getEndOftheDay = (date) => {
        return moment(date).tz(moment.tz.guess()).endOf('day').valueOf()
    }

    const [currentTab, setCurrentTab] = React.useState(1)
    const [genStats, setGenStats] = React.useState()
    const [genStatsLoading, setGenStatsLoading] = React.useState(false)
    const [earningStats, setEarningStats] = React.useState()
    const [earningStatsLoading, setEarningStatsLoading] = React.useState(false)
    const startT = new Date(new Date().setDate((new Date()).getDate() - 30))
    startT.setHours(0, 0, 0, 0);
    const endT = new Date()
    endT.setHours(23, 59, 59, 999);
    const [startTime, setStartTime] = React.useState(getStartOftheDay(startT.getTime()))
    const [endTime, setEndTime] = React.useState(getEndOftheDay(endT.getTime()))
    const [chartData, setChartData] = React.useState()
    const [chartMeta, setChartMeta] = React.useState()
    const [totalEarnings, setTotalEarnings] = React.useState()
    const [moreTotalEarnings, setMoreTotalEarnings] = React.useState()
    const [moreTotalLoading, setMoreTotalLoading] = React.useState(false)
    const [topStats, setTopStats] = React.useState()
    const [topStatsLoading, setTopStatsLoading] = React.useState(false)
    const [selectedSort, setSelectedSort] = React.useState(filterList[1])
    const [chartLoading, setChartLoading] = React.useState(false)
    const [noFetchMore, setNoFetchMore] = React.useState(false)
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
    const fomratTime = (time) => {
        return Math.floor(time / 1000)
    }



    const getStartEndTime = (startTime, endTime) => {
        const startT = new Date(new Date().setDate((new Date()).getDate() - 30))
        startT.setHours(0, 0, 0, 0);
        const endT = new Date()
        endT.setHours(23, 59, 59, 999);
        return {
            startTime: fomratTime(getStartOftheDay(startTime)) || fomratTime(getStartOftheDay(startT.getTime())), endTime: fomratTime(getEndOftheDay(endTime)) || fomratTime(getEndOftheDay(endT.getTime()))
        }
    }

    const fetchGeneralStats = async ({ startTime, endTime }) => {

        return new Promise(async (resolve, reject) => {
            try {
                setGenStatsLoading(true)
                const gRes = await getGeneralStats({ startTime: getStartEndTime(startTime, endTime).startTime, endTime: getStartEndTime(startTime, endTime).endTime, userId: isAgency() ? selectedCreatorId : "" })
                let gnStats = gRes?.data?.data;
                if (gnStats) {
                    const insightList = [
                        {
                            title: 'Post Views',
                            value: gnStats?.totalPostViews || 0.00,
                            unit: 'normal'
                        },
                        {
                            title: 'Likes',
                            value: gnStats?.totalLikes || 0.00,
                            unit: 'normal'
                        },
                        {
                            title: 'Comments',
                            value: gnStats?.totalComments || 0.00,
                            unit: 'normal'
                        },
                        {
                            title: 'Sold Posts',
                            value: gnStats?.totalSoldPosts || 0.00,
                            unit: 'normal'
                        },
                        {
                            title: 'Profile Views',
                            value: gnStats?.totalProfileViews || 0.00,
                            unit: 'normal'
                        },
                        {
                            title: 'Subscribers',
                            value: gnStats?.totalSubscribers || 0.00,
                            unit: 'normal'
                        },

                    ]
                    setGenStats(insightList)
                    setGenStatsLoading(false)
                    return resolve(true)
                }
            } catch (e) {
                setGenStatsLoading(false)
                Toast(e?.respone?.data?.message || e?.message, "error")
                return resolve(false)
            }
        })

    }

    const fetchEarningStats = async ({ startTime, endTime }) => {
        return new Promise(async (resolve, reject) => {
            try {
                setEarningStatsLoading(true)
                const gRes = await getEarningStats({ startTime: getStartEndTime(startTime, endTime).startTime, endTime: getStartEndTime(startTime, endTime).endTime, userId: isAgency() ? selectedCreatorId : "" })
                let erStats = gRes?.data?.data;
                if (erStats) {
                    const insightList = [
                        {
                            title: 'Premium Posts',
                            value: erStats?.premiumPosts || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'VIP Messages',
                            value: erStats?.vipMessages || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Tips',
                            value: erStats?.tips || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Subscriptions',
                            value: erStats?.subscriptions || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Locked Messages',
                            value: erStats?.lockedMessages || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Video Calls',
                            value: erStats?.videoCalls || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Live Stream Tickets',
                            value: erStats?.liveStreamTickets || 0.00,
                            unit: 'currency'
                        },
                        {
                            title: 'Custom Requests',
                            value: erStats?.customRequests || 0.00,
                            unit: 'currency'
                        }

                    ]
                    setEarningStats(insightList)
                    setEarningStatsLoading(false)
                    return resolve(true)
                }
            } catch (e) {
                setEarningStatsLoading(false)
                Toast(e?.respone?.data?.message || e?.message, "error")
                return resolve(false)
            }
        })

    }

    const formatGraphData = (labels, group_by) => {
        let newLabels = [...labels];
        switch (group_by) {
            case 1:
            case 2:
                newLabels = newLabels.map(label => {
                    return moment(label).format("MMM DD YYYY")
                    // return formatDate((new Date(label)).getTime(), "MMM DD YYYY")
                })
                return newLabels;
            case 0:
                newLabels = newLabels.map(label => {
                    return moment(label).format("MMM DD YYYY hh A")
                    // return formatDate((new Date(label)).getTime(), "MMM DD YYYY hh A")
                })
                return newLabels;
            default:
                return labels
        }
    }

    const fetchTotalEarnings = () => {
        new Promise(async (resolve, reject) => {
            try {
                const teRes = await getTotalEarning({ yearWise: false, userId: isAgency() ? selectedCreatorId : "" })
                const tEarning = teRes?.data
                setTotalEarnings(tEarning)
                resolve(true)
            } catch (e) {
                console.log(e)
                reject(false)
            }
        })
    }

    const fetchTopStats = ({ startTime, endTime }) => {
        new Promise(async (resolve, reject) => {
            try {
                setTopStatsLoading(true)
                const teRes = await getTopStats({ startTime: getStartEndTime(startTime, endTime).startTime, endTime: getStartEndTime(startTime, endTime).endTime, userId: isAgency() ? selectedCreatorId : "" })
                const topStatsData = teRes?.data?.data
                setTopStats(topStatsData)
                setTopStatsLoading(false)
                resolve(true)
            } catch (e) {
                console.log(e)
                setTopStatsLoading(false)
                reject(false)
            }
        })
    }

    const fetchMoreTotalEarnings = () => {
        new Promise(async (resolve, reject) => {
            try {
                setMoreTotalLoading(true)
                const teRes = await getTotalEarning({ yearWise: true, userId: isAgency() ? selectedCreatorId : "" })
                if (teRes?.status === 204) {
                    setMoreTotalLoading(false)
                    setNoFetchMore(true)
                    return
                }
                const tEarning = teRes?.data
                setMoreTotalEarnings(tEarning)
                setMoreTotalLoading(false)

                resolve(true)
            } catch (e) {
                setNoFetchMore(true)
                setMoreTotalLoading(false)
                reject(false)
            }
        })
    }

    const fetchChartInsights = async ({ startTime, endTime, selectedSort }) => {
        return new Promise(async (resolve, reject) => {
            try {
                setChartLoading(true)
                const chRes = await getChartIndights({ startTime: getStartEndTime(startTime, endTime).startTime, endTime: getStartEndTime(startTime, endTime).endTime, endTime: fomratTime(endTime) || fomratTime(Date.now()), groupBy: (selectedSort?.value || selectedSort?.value == 0) ? selectedSort?.value : 1, userId: isAgency() ? selectedCreatorId : "" })
                setChartMeta(chRes?.data)
                let graph = chRes?.data?.graph
                if (graph) {
                    let labels = graph.map(g => {
                        return g?.dateTime
                    })
                    labels = formatGraphData(labels, (selectedSort?.value || selectedSort?.value === 0) ? selectedSort?.value : 1)
                    let values = graph.map(g => {
                        return g?.amount
                    })
                    setChartData({ labels: labels, values: values })
                    setChartLoading(false)
                    resolve(true)
                }
            } catch (e) {
                setChartLoading(false)
                resolve(false)
                console.log(e)
            }
        })

    }

    const handleTabChange = (tab) => {
        setCurrentTab(tab)
        setStartTime(new Date(new Date().setDate((new Date()).getDate() - 30)).getTime())
        setEndTime(Date.now())
    }

    const handleSortBy = (v) => {
        setSelectedSort(v)
    }

    const earningStates = {
        "premiumPosts": 10,
        "vipMessages": 140,
        "tips": 0,
        "subscriptions": 140,
        "lockedMessages": 0,
        "videoCalls": 0,
        "liveStreamTickets": 0,
        "customRequests": 0
    }

    const getFilterList = (startTime, endTime) => {
        const newList = []
        const dateDiff = findDateDiff(endTime, startTime);
        if (dateDiff?.months < 1) {
            if (dateDiff.days >= 0 && dateDiff?.days < 2) {
                newList.push(filterList[0])
            }
            if (dateDiff.days > 0) {
                newList.push(filterList[1])
            }
            if (dateDiff.days > 7) {
                newList.push(filterList[2])
            }
        } else if (dateDiff?.months >= 1 && dateDiff?.months < 3) {
            if (dateDiff?.days < 31) {
                return [filterList[1], filterList[2]]
            }
            return [filterList[1], filterList[2], filterList[3]]
        } else if (dateDiff?.months >= 3 && dateDiff?.days < 181) {
            return [filterList[2], filterList[3]]
        } else if (dateDiff?.days > 180 && dateDiff?.days < 365) {
            return [filterList[3]]
        } else if (dateDiff?.days > 365) {
            return [filterList[3], filterList[4]]
        }

        return newList
    }


    return {
        totalEarnings,
        earningStats: earningStats,
        generalStats: genStats,
        activeTab: currentTab,
        genStatsLoading,
        earningStatsLoading,
        chartData,
        startTime,
        endTime,
        selectedSort,
        chartMeta,
        moreTotalEarnings,
        moreTotalLoading,
        topStats,
        topStatsLoading,
        chartLoading,
        noFetchMore,
        filterList: filterList,
        fetchMoreTotalEarnings,
        handleSortBy,
        setSelectedSort,
        getFilterList,
        handleTabChange,
        fetchGeneralStats,
        fetchEarningStats,
        fetchChartInsights,
        fetchTotalEarnings,
        setStartTime: setStartTime,
        setEndTime: setEndTime,
        fetchTopStats,
        getStartOftheDay,
        getEndOftheDay
    };
};