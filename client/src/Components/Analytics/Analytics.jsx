import { FormControlLabel, Stack, Switch } from "@mui/material";
import { ChartContainer } from "@mui/x-charts";
import {
  AreaPlot,
  LineChart,
  LinePlot,
  lineElementClasses,
} from "@mui/x-charts/LineChart";
import { useState } from "react";
import { LuPackageOpen } from "react-icons/lu";
import { FaArrowUpLong, FaTags } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { BsCurrencyDollar } from "react-icons/bs";
import { RxGrid } from "react-icons/rx";

const Analytics = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [xData, setXData] = useState([
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]);

  const handleTooltipChange = (event) => {
    setShowTooltip(event.target.checked);
  };
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];

  return (
    <div>
      <div className="flex justify-between font-inter mb-12">
        <h2 className=" font-bold text-2xl ">Analytics</h2>
        <p className="text-[#64748B]">
          Dashboard /
          <span className="text-title-blue font-semibold">Analytics </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 font-inter">
        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="p-3 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                <LuPackageOpen className="text-3xl" />
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Orders Number
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">1,756</span>
                orders
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 12.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient1)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(10, 196, 0)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(10, 196, 0, 0)" />
                <stop offset="1" stopColor="rgba(10, 196, 0, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="py-1 px-3 text-[#9333EA] bg-[#F3E8FF] rounded-full w-fit">
                <p className="text-3xl font-bold">B</p>
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Brands Number
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">2,421</span>
                brands
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 2.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient2)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(147, 51, 234)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(147, 51, 234, 0)" />
                <stop offset="1" stopColor="rgba(147, 51, 234, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="p-3 text-[#D97706] bg-[#FEF3C7] rounded-full w-fit">
                <RxGrid className="text-3xl" />
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Products Number
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">1,012</span>
                products
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 9.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient3)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(217, 119, 6)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient3" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(217, 119, 6, 0)" />
                <stop offset="1" stopColor="rgba(217, 119, 6, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="p-3 text-[#2563EB] bg-[#DBEAFE] rounded-full w-fit">
                <IoIosPeople className="text-3xl" />
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Users Number
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">2,714</span>
                users
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 21.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient4)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(37, 99, 235)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient4" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(37, 99, 235, 0)" />
                <stop offset="1" stopColor="rgba(37, 99, 235, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="p-3 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                <BsCurrencyDollar className="text-3xl" />
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Total Sales
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">
                  $212,714
                </span>
                revenue
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 17.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(10, 196, 0)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(10, 196, 0, 0)" />
                <stop offset="1" stopColor="rgba(10, 196, 0, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>

        <div className="px-4 py-3.5 rounded-2xl bg-white ">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="p-3 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                <FaTags className="text-3xl" />
              </div>
              <p className="my-4 text-[#6E7786] text-sm font-semibold">
                Categories Number
              </p>

              <h3 className="text-sm font-normal text-[#6E7786]">
                <span className="text-2xl font-bold text-[#0B172A]">95 </span>
                Categories
              </h3>
            </div>
            <p className="text-base font-semibold text-[#22C55E] flex">
              <FaArrowUpLong className="text-xl" /> 5.7%
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <ChartContainer
              width={380}
              height={70}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              xAxis={[
                {
                  height: 0,
                  position: "none",
                  scaleType: "point",
                  data: xLabels,
                },
              ]}
              yAxis={[
                {
                  width: 0,
                  position: "none",
                },
              ]}
              series={[
                {
                  data: uData,
                  type: "line",
                  label: "uv",
                  area: true,
                  stack: "total",
                  color: "url(#Gradient6)",
                },
              ]}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  stroke: "rgba(219, 39, 119)",
                  strokeWidth: 2,
                },
              }}
            >
              <linearGradient id="Gradient6" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0" stopColor="rgba(219, 39, 119, 0)" />
                <stop offset="1" stopColor="rgba(219, 39, 119, 0.6)" />
              </linearGradient>
              <AreaPlot />
              <LinePlot />
            </ChartContainer>
          </div>
        </div>
      </div>

      <div className=" rounded-2xl bg-white my-5 p-8 font-inter">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-[#6E7786] text-lg">Sales 2025</p>

            <h3 className="flex items-center gap-2 text-[#6E7786]">
              <span className="font-bold text-3xl text-[#1E1B39] ">$12.7k</span>
              <span className="text-[#04CE00] flex items-center gap-1 text-sm">
                <div className="w-2.5 h-2.5 bg-[#04CE00] rounded-full"></div>
                1.3%
              </span>
              VS LAST YEAR
            </h3>
          </div>

          <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
            <button className="px-4 py-2.5 text-sm">Daily</button>
            <button className="px-4 py-2.5 text-sm">Weekly</button>
            <button className="px-4 py-2.5 text-sm bg-title-blue rounded-lg font-medium text-white">
              Annually
            </button>
          </div>
        </div>
        <LineChart
          xAxis={[
            {
              offset: 25,
              labelOffset: 1, // Adjust this value
              disableTicks: true,
              disableLine: true,
              data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              valueFormatter: (x) => `${xData[x]}`,
            },
          ]}
          yAxis={[
            {
              offset: 30,
              disableTicks: true,
              disableLine: true,
              position: "right",
              valueFormatter: (value) => `${value / 1000}K`,
            },
          ]}
          grid={{ horizontal: true }}
          series={[
            {
              curve: "natural",
              data: [
                0, 1000, 2000, 3000, 6000, 5000, 6000, 7000, 8000, 9000, 10000,
                11000,
              ],
              area: true,
              showMark: false,
              color: "url(#Gradient7)",
            },
          ]}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              stroke: "rgba(21, 37, 63)",
              strokeWidth: 3,
            },
          }}
          height={300}
        >
          <Stack direction="row">
            <FormControlLabel
              value="end"
              control={
                <Switch
                  className="bg-title-blue "
                  checked={showTooltip}
                  onChange={handleTooltipChange}
                />
              }
              label="showTooltip"
              labelPlacement="end"
            />
          </Stack>
          <linearGradient id="Gradient7" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0" stopColor="rgba(21, 37, 63, 0)" />
            <stop offset="1" stopColor="rgba(21, 37, 63, 0.6)" />
          </linearGradient>
          <AreaPlot />
          <LinePlot />
        </LineChart>
      </div>
    </div>
  );
};
export default Analytics;