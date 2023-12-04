import * as React from 'react';
import { useCreatorInsights } from '../../components/creatorInsights/useCreatorInsights';
import { InsightList } from '../../components/creatorInsights/InsightList';
import { InsightChart } from '../../components/creatorInsights/InsightChart';
import { SalesOverView } from '../../components/creatorInsights/SalesOverView';
import { YearWiseInsights } from '../../components/creatorInsights/YearWiseInsights';
import { InsightListLoading } from '../../components/creatorInsights/InsightListLoading';
import useLang from '../../hooks/language';
import { findDateDiff } from '../../lib/helper';
import isMobile from '../../hooks/isMobile';
import { Toast } from '../../lib/global/loader';


export const InsightEarning = ({ startTime, endTime }) => {
    const [lang] = useLang()
    const {
        totalEarnings,
        earningStats,
        fetchEarningStats,
        earningStatsLoading,
        fetchChartInsights,
        chartData,
        chartMeta,
        fetchTotalEarnings,
        selectedSort,
        getFilterList,
        handleSortBy,
        moreTotalEarnings,
        chartLoading,
        fetchMoreTotalEarnings,
        noFetchMore,
        filterList
    } = useCreatorInsights()

    const [mobileView] = isMobile()

    const loadData = async (startTime, endTime) => {
        const dSort = getDefaultSort(startTime, endTime)
        handleSortBy(dSort)
        fetchEarningStats({ startTime: startTime, endTime: endTime })
        fetchChartInsights({ startTime: startTime, endTime: endTime, selectedSort: dSort });
    }
    const handleGetFilters = () => {
        return getFilterList(startTime, endTime)
    }

    React.useEffect(() => {
        fetchTotalEarnings();
        fetchMoreTotalEarnings()
    }, [])

    React.useEffect(() => {
        const dateDiff = findDateDiff(endTime, startTime)
        if (dateDiff?.months <= 0 && dateDiff.days < 0) {
            console.log("date error")
        } else {
            loadData(startTime, endTime)
        }

    }, [startTime, endTime])

    React.useEffect(() => {
        const dateDiff = findDateDiff(endTime, startTime)
        if (dateDiff?.months <= 0 && dateDiff.days < 0) {
            Toast(lang?.startDateErr, 'error')
        }
    }, [startTime])


    React.useEffect(() => {
        const dateDiff = findDateDiff(endTime, startTime)
        if (dateDiff?.months <= 0 && dateDiff.days < 0) {
            Toast(lang?.oldDateErr, 'error')
        }
    }, [endTime])

    const handleSortClick = (v) => {
        fetchChartInsights({ startTime: startTime, endTime: endTime, selectedSort: v || selectedSort });
        handleSortBy(v)
    }

    // React.useEffect(() => {
    //     fetchChartInsights({ startTime: startTime, endTime: endTime, selectedSort: selectedSort });
    // }, [startTime, endTime, selectedSort])

    const getDefaultSort = (startTime, endTime) => {
        if (startTime && endTime) {
            let dateDiff = findDateDiff(endTime, startTime);
            if (dateDiff.months <= 1) {
                if (dateDiff.days < 2) {
                    return filterList[0];
                } else {
                    return filterList[1]
                }
            }
            else if (dateDiff.months > 5) {
                return filterList[3]
            }
            else {
                return filterList[3]
            }
        }

    }

    return (
        <div className='insEarnings'>
            {
                earningStatsLoading ? <InsightListLoading /> : <InsightList items={earningStats} />
            }
            {
                <InsightChart
                    handleSortBy={handleSortClick}
                    getFilterList={handleGetFilters}
                    selectedSort={selectedSort}
                    title={lang?.salesInsights}
                    xTitle={chartMeta?.xaxis?.title}
                    yTitle={chartMeta?.yaxis?.title}
                    labels={chartData?.labels || []}
                    values={chartData?.values || []}
                    loading={chartLoading}
                />
            }
            <div className={`section2 mt-3 ${mobileView ? '' : 'p-3'}`}>
                {
                    totalEarnings ? <SalesOverView lastMonth={totalEarnings?.lastMonth} thisMonth={totalEarnings?.thisMonth} allTime={totalEarnings?.allTime} /> : ""
                }
                {
                    totalEarnings ? <YearWiseInsights list={totalEarnings?.data} moreList={moreTotalEarnings?.data} fetchMore={fetchMoreTotalEarnings} noFetchMore={noFetchMore} /> : ""
                }
            </div>
            <style jsx>
                {
                    `
                .section2 {
                    border: 1px solid var(--l_border);
                    border-radius: 28px;
                    border-width: ${mobileView ? '0px' : '1px'} !important;
                }
                `
                }
            </style>
        </div>
    );
};