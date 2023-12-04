import dynamic from "next/dynamic";
import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import { ANALYTICS_PLACEHOLDER_SVG, PRIMARY } from "../../lib/config";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "react-jss";
import Image from "../../components/image/image";

export default function DashboardChart(props) {
  const { yLable = "Likes", chartsData, ...otherProps } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();

  const xaxis = {
    type: "category",
  };

  const options = {
    dataLabels: {
      enabled: false,
    },
    colors: theme.appColor,
    chart: {
      toolbar: {
        show: false,
      },
      id: "basic-bar",
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
      }
    },
  };
  return (
    <Wrapper>
      <div className="app">
        <div className="row">
          <div className="col-12">
            <div className="mixed-chart">
              {props?.chartsData?.length ? (
                <Chart
                  options={{
                    ...options,
                    yaxis: {
                      title: {
                        text: yLable || "",
                        offsetX: 0,
                        style: {
                          fontSize: 15,
                          fontWeight: "400",
                          fontFamily: "Roboto",
                        },
                      },
                    },
                    xaxis: {
                      labels: {
                        rotate: -45,
                        rotateAlways: true,
                      }
                    },
                  }}
                  series={[
                    {
                      name: yLable,
                      data: chartsData.map((item) => {
                        return {
                          x: item.title,
                          y: item.value,
                        };
                      }),
                    },
                  ]}
                  type="bar"
                  width="100%"
                />
              ) : (
                <div className="text-center mt-5">
                  <Image src={ANALYTICS_PLACEHOLDER_SVG} alt="No Data in Insights Placeholder SVG Image" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          :global(.apexcharts-yaxis-label),
          :global(.apexcharts-xaxis-label) {
            fill: ${theme.type === "light" ? "#000" : "#fff"};
            font-family: "Roboto", sans-serif !important;
            font-size: ${mobileView ? "12px !important" : "0.951vw !important"};
          }

          :global(.apexcharts-yaxis-title-text) {
            fill:  ${theme.type === "light" ? "#000" : "#fff"};;
            font-family: "Roboto", sans-serif !important;
            font-size: ${mobileView ? "12px !important" : "0.951vw !important"};
          }
        `}
      </style>
    </Wrapper>
  );
}
