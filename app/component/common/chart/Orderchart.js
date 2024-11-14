"use client"; // Keep this if you're using the app directory

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});

const OrdersChart = () => {
  const [chartData, setChartData] = useState({dateMillisec: [], count: []});
  console.log(chartData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/graphorder");
      const data = await response.json();
      setChartData(data);
    };

    fetchData();
  }, []);

  const options = {
    series: [
      {
        name: "Order Count",
        data: chartData.dateMillisec || [],
      },
    ],
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#34D399"], // Tailwind green-400
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#6EE7B7"], // Lighter green for gradient
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    title: {
      text: "Order Trends",
      align: "center",
      style: {
        color: "#E5E7EB", // Tailwind cool gray-200
        fontSize: "20px",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#D1D5DB", // Tailwind cool gray-400
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#D1D5DB", // Tailwind cool gray-400
        },
      },
    },
    grid: {
      borderColor: "#374151", // Tailwind cool gray-700 for grid lines
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#9CA3AF", // Tailwind cool gray-500
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <ApexChart
        type="area"
        options={options}
        series={options.series}
        height={300}
        width={"100%"}
      />
    </div>
  );
};

export default OrdersChart;
