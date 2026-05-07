"use client";

import ReactECharts from "echarts-for-react";

export function MetricLineChart({
  title,
  series,
}: {
  title: string;
  series: Array<{ timestamp: string; value: number }>;
}) {
  return (
    <ReactECharts
      style={{ height: 260 }}
      option={{
        color: ["#0f766e"],
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: series.map((point) => point.timestamp.slice(11, 16)),
        },
        yAxis: { type: "value" },
        series: [
          {
            name: title,
            type: "line",
            smooth: true,
            areaStyle: { opacity: 0.15 },
            data: series.map((point) => point.value),
          },
        ],
      }}
    />
  );
}
