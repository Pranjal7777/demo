import * as React from 'react';
import "chart.js/auto";
import Select from 'react-select'
import { useTheme } from 'react-jss';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
Chart.defaults.scale.grid.drawOnChartArea = false
import { Line } from "react-chartjs-2";
import { convertCurrencyLocale } from '../../lib/global';
import useLang from '../../hooks/language';
import CustomDataLoader from '../loader/custom-data-loading';
import isMobile from '../../hooks/isMobile';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
export const InsightChart = ({ title, labels = [], values = [], xTitle = "Days", yTitle = "Total Earning", getFilterList, selectedSort, handleSortBy, loading = false }) => {
    const [lang] = useLang()
    const theme = useTheme()
    const [mobileView] = isMobile()
    React.useEffect(() => {
        Chart.defaults.color = theme?.type === 'light' ? '#5F596B' : '#836B8A';
    }, [theme])
    const data = {
        labels: labels,
        datasets: [
            {
                label: title || "Sales",
                fill: 'start',
                lineTension: 0.1,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
                    gradient.addColorStop(0.0997, 'rgba(211, 58, 255, 0.4)');
                    gradient.addColorStop(0.9597, 'rgba(255, 113, 164, 0.16)');
                    return gradient;
                },
                borderColor: "#D33AFF",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "D33AFF",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "D33AFF",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: values
            }
        ]
    };

    //const myRef = React.createRef();
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: mobileView ? true : false,
        aspectRatio: mobileView ? 1 : 7 / 3,
        scales: {
            x: {
                title: {
                    display: true,
                    text: xTitle,
                    font: {
                        size: 16,
                    }
                },
                ticks: {
                    font: {
                        size: 15,
                    }
                },
                border: {
                    color: theme?.type === 'light' ? '#5F596B' : '#836B8A'
                },
                grid: {
                    display: false,
                }
            },
            y: {
                // stacked: true,
                min: 0,
                title: {
                    display: true,
                    text: yTitle,
                    font: {
                        size: 16,
                    }
                },
                grid: {
                    display: false,
                },
                border: {
                    color: theme?.type === 'light' ? '#5F596B' : '#836B8A'
                },
                ticks: {
                    count: 6,
                    beginAtZero: true,
                    // Return an empty string to draw the tick line but hide the tick label
                    // Return `null` or `undefined` to hide the tick line entirely
                    callback(value) {
                        // Convert the number to a string and splite the string every 3 charaters from the end
                        value = value;
                        value = convertCurrencyLocale(value);

                        // Convert the array to a string and format the output
                        return `$${value}`;
                    },
                    font: {
                        size: 16,
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 16,
                    }
                }
            },
        },
    };

    return (
        <div className='insChart p-3'>
            <div className='d-flex align-items-center justify-content-between'>
                {title ? <h3 className='secTitle'>
                    {title}
                </h3> : ""}
                <div className='d-flex align-items-center'>
                    <p className='my-0 mr-2'>Group By:</p>
                    <Select
                        styles={{
                            control: (provided) => ({ ...provided, backgroundColor: "var(--l_profileCard_bgColor)", borderColor: "var(--l_border)", color: "var(--l_light_grey)", borderRadius: '20px', ":hover": { borderColor: 'var(--l_border)', outline: 'none !important', boxShadow: 'none' }, ":focus-within": { borderColor: 'var(--l_border)', outline: 'none !important', boxShadow: 'none' } }),
                            placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
                            option: (provided, { data, isDisabled, isFocused, isSelected }) => ({ ...provided, backgroundColor: "var(--l_profileCard_bgColor)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400", borderBottom: '1px solid var(--l_border)', ':active': { backgroundColor: "var(--l_profileCard_bgColor)", ':last-child': { borderBottom: '0px !important' } } }),
                            singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                            menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_profileCard_bgColor)", color: "var(--l_app_text)", borderRadius: '8px' }),
                            menu: (provided) => ({ ...provided, zIndex: 2, border: '1px solid var(--l_border)', borderRadius: '8px', boxShadow: 'none', })
                        }}
                        className="selectListSort"
                        value={selectedSort}
                        onChange={(v) => {
                            handleSortBy(v)
                        }}
                        options={getFilterList()}
                    />
                </div>
            </div>
            <div className={`position-relative ${mobileView ? 'chrtMb' : 'chrtDsktp'}`}>
                <Line data={data} options={lineOptions} />
                {
                    loading ? <div className='chartLoader h-100 w-100 d-flex align-items-center justify-content-center'>
                        <CustomDataLoader loading={loading} />
                    </div> : ''
                }
            </div>
            <style jsx>
                {
                    `
                 :global(.selectListSort) {
                    min-width: 100px;
                 }
                 .chartLoader {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: ${theme.type === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.1)'};
                 }
                 .insChart {
                    border: 1px solid var(--l_border);
                    border-radius: 20px;
                    background: ${mobileView ? 'var(--l_lightgrey_bg)' : 'var(--l_app_bg)'}
                 }
                 :global(.selectListSort > div div:last-child span) {
                    display: none;
                 }
                 .chrtDsktp {
                    height: 70vh
                 }
                 `
                }
            </style>
        </div >
    );
};