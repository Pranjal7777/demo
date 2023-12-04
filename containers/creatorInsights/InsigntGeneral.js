import * as React from 'react';
import { useCreatorInsights } from '../../components/creatorInsights/useCreatorInsights';
import { InsightListLoading } from '../../components/creatorInsights/InsightListLoading';
import { InsightList } from '../../components/creatorInsights/InsightList';
import { InsightTopSpenders } from './InsightTopSpenders';
import { InsightTopCountries } from './InsightTopCountries';
import { InsightTopPosts } from './InssightTopPosts';

const InsightGeneral = ({ startTime, endTime }) => {
    const {
        fetchGeneralStats,
        generalStats,
        genStatsLoading,
        fetchTopStats,
        topStats,
        topStatsLoading
    } = useCreatorInsights()

    const loadData = async () => {
        fetchGeneralStats({ startTime: startTime, endTime: endTime })
        fetchTopStats({ startTime: startTime, endTime: endTime })
    }

    React.useEffect(() => {
        loadData()
    }, [startTime, endTime])

    return (
        <div className='generalStats'>
            {
                genStatsLoading ? <InsightListLoading /> : <InsightList items={generalStats} />
            }
            {
                topStatsLoading ? <InsightListLoading /> : <InsightTopPosts topData={topStats} />
            }
            {
                topStatsLoading ? <InsightListLoading /> : <InsightTopSpenders topData={topStats} />
            }
            {
                topStatsLoading ? <InsightListLoading /> : <InsightTopCountries topData={topStats} />
            }

        </div>
    );
};

export default InsightGeneral