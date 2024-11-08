import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme, Typography } from "@mui/material";
import { 
  useGetChartDataQuery
 } from "state/api";

// Overview Chart
const OverviewChart = ({ isDashboard = false, view }) => {
  // theme
  const theme = useTheme();
  const { data } = useGetChartDataQuery();
  
  const [totalSalesLine] = useMemo(() => {
    if (!data) return [];

    // monthly data
    const { monthlyData } = data;

    // total sales line data
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };

    // factor monthly data
    Object.values(monthlyData).reduce(
      (acc, { month, totalSales }) => {
        const currentSales = totalSales;

        totalSalesLine.data = [
          ...totalSalesLine.data,
          {
            x: month,
            y: currentSales,
          },
        ];

        return { sales: currentSales };
      },
      { sales: 0 }
    );

    return [[totalSalesLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // loader
  if (!data) {
    return (
      <Typography variant="h5" mt="20%" textAlign="center">
        Loading...
      </Typography>
    );
  }

  return (
    // line chart
    <ResponsiveLine
      data={totalSalesLine}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3); // Only show first three letters on dashboard
          return v;
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total Revenue for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;
