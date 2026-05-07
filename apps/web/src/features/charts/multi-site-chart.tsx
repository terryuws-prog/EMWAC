"use client";

import ReactECharts from "echarts-for-react";

const COLORS = ["#0f766e", "#7c3aed", "#c2410c", "#0369a1", "#be185d"];

interface SiteSeries {
  siteName: string;
  points: Array<{ timestamp: string; value: number }>;
}

export function MultiSiteChart({
  title,
  unit,
  range,
  series,
}: {
  title: string;
  unit: string;
  range: [number, number];
  series: SiteSeries[];
}) {
  // Merge all unique timestamps across sites, sorted
  const allTimestamps = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.timestamp)))
  ).sort();

  const timeLabels = allTimestamps.map((t) => t.slice(11, 16));

  return (
    <ReactECharts
      style={{ height: 280 }}
      option={{
        color: COLORS,
        tooltip: { trigger: "axis" },
        legend: {
          data: series.map((s) => s.siteName),
          bottom: 0,
          textStyle: { fontSize: 11 },
        },
        grid: { top: 30, right: 16, bottom: 40, left: 50 },
        xAxis: {
          type: "category",
          data: timeLabels,
          axisLabel: { fontSize: 11 },
        },
        yAxis: {
          type: "value",
          name: unit,
          nameTextStyle: { fontSize: 11 },
          min: range[0] > 0 ? Math.floor(range[0] * 0.8) : undefined,
          axisLabel: { fontSize: 11 },
        },
        series: series.map((s, i) => ({
          name: s.siteName,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2.5 },
          data: allTimestamps.map((t) => {
            const pt = s.points.find((p) => p.timestamp === t);
            return pt ? pt.value : null;
          }),
          markArea:
            i === 0
              ? {
                  silent: true,
                  data: [
                    [
                      { yAxis: range[0], itemStyle: { color: "rgba(16, 185, 129, 0.06)" } },
                      { yAxis: range[1] },
                    ],
                  ],
                }
              : undefined,
        })),
      }}
    />
  );
}
