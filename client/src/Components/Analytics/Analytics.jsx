import { FormControlLabel, Stack, Switch, Typography, Box } from "@mui/material";
import { ChartContainer, chartsTooltipClasses } from "@mui/x-charts";
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import {
  AreaPlot,
  LineChart,
  LinePlot,
  lineElementClasses,
} from "@mui/x-charts/LineChart";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPackageOpen } from "react-icons/lu";
import { FaArrowUpLong, FaTags } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { BsCurrencyDollar } from "react-icons/bs";
import { RxGrid } from "react-icons/rx";
import { Link } from "react-router-dom";
import { getMerchantOrderStats, getProductsAvgRatings, getSalesGrowth, getStockLevelsProducts }
  from "../../features/merchantAnalyticsSlice";
  import {
    getOrdersSales,
    getPlatformStats,
    getTotalUsers,
  } from "./../../features/adminAnalyticsSlice";
// import features from admin analytics slice >>>>>>>>>>

const Analytics = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role);
  const adminAnalytics = useSelector((state) => state.adminAnalytics);
  const [showTooltip, setShowTooltip] = useState(true);

  // static Data used
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
  const [yData, setYData] = useState([
    0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000,
  ]);
  const [dataChart, setDataChart] = useState([
    350000, 320000, 480000, 550000, 500000, 420000, 380000, 450000, 600000,
    720000, 780000, 850000,
  ]);
  const [activePeriod, setActivePeriod] = useState("Monthly");
  
  const xLabelsMiniCharts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const ordersMiniChartData = [150, 180, 160, 200, 190, 220, 210];
  const brandsMiniChartData = [50, 55, 48, 60, 58, 62, 59];
  const productsMiniChartData = [80, 85, 75, 90, 88, 92, 87];
  const usersMiniChartData = [200, 210, 190, 230, 220, 250, 240];
  const totalSalesMiniChartData = [8500, 9200, 8800, 10500, 10300, 11000, 9800];
  const categoriesMiniChartData = [10, 12, 11, 13, 12, 14, 13];
  
  const handleTooltipChange = (event) => {
    setShowTooltip(event.target.checked);
  };

  const { platformStats, ordersSales, TotalUsers } =
    userRole === "admin" ? adminAnalytics || {} : {};

  const merchantAnalytics = useSelector((state) => state.merchantAnalytics);
  const {
    orderStats: merchantOrderStats,
    salesGrowth: merchantSalesGrowth,
    stockLevels: merchantStockLevels,
    productRatings: merchantProductRatings,
    adminL  } = userRole === "merchant" ? merchantAnalytics || {} : {};

  // Merchant stock levels for products
  useEffect(() => {
    const fetchStockLevelsData = async () => {
      try {
        await dispatch(getStockLevelsProducts()).unwrap();
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    fetchStockLevelsData();
  }, [dispatch]);

  const totalStock = Array.isArray(merchantStockLevels)
    ? merchantStockLevels.reduce((sum, product) => sum + product.quantityInStock, 0)
    : 0;

  // Merchant product ratings average
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        await dispatch(getProductsAvgRatings()).unwrap();
      } catch (err) {
        console.error("Failed to load product ratings:", err);
        setError(err);
      }
    };
    fetchRatings();
  }, [dispatch]);

  // Note for backend>>>>>>>>>> dummy data to show values instead of null
  const productData = [
    { name: "Product A", averageRating: 4.2, totalReviews: 10 },
    { name: "Product B", averageRating: 3.5, totalReviews: 6 },
    { name: "Product C", averageRating: 4.8, totalReviews: 2 },
    { name: "Product D", averageRating: 2.9, totalReviews: 14 },
  ];

  const productNames = productData.map((p) => p.name);
  const avgRatings = productData.map((p) => p.averageRating);
  const totalReviews = productData.map((p) => p.totalReviews);

  // Untill backend adding values 
  // const productData = Array.isArray(merchantProductRatings)
  //   ? merchantProductRatings.map((p) => ({
  //     name: p.name,
  //     averageRating:
  //       typeof p.averageRating === "number"
  //         ? p.averageRating
  //         : p.totalReviews > 0
  //           ? 1
  //           : 0
  //   }))
  //   : dummyProductRatings;

  // const avgRatingsData = productData.map((p) => p.averageRating);
  // const productNames = productData.map((p) => p.name);

  //Merchant Order Stats
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        await dispatch(getMerchantOrderStats()).unwrap();
      } catch (err) {
        console.error("Failed to load merchant order stats:", err);
        setError(err);
      }
    };
    fetchOrderStats();
  }, [dispatch]);

  // Dummy data for orders
  const orderData = [
    { month: "Jan", totalOrders: 60, totalRevenue: 150 },
    { month: "Feb", totalOrders: 55, totalRevenue: 200 },
    { month: "Mar", totalOrders: 80, totalRevenue: 350 },
    { month: "Apr", totalOrders: 50, totalRevenue: 400 },
    { month: "May", totalOrders: 73, totalRevenue: 240 },
    { month: "Jun", totalOrders: 87, totalRevenue: 100 },
  ];

  const orderMonths = orderData.map((o) => o.month);
  const totalOrders = orderData.map((o) => o.totalOrders);
  const totalRevenue = orderData.map((o) => o.totalRevenue);

  // Merchant Growth Sales
  const [growthRate, setGrowthRate] = useState(0);
  const salesXData = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];
  const sales2024 = [4939, 4084, 3164, 4322, 2815, 2191, 3390, 4953, 2094, 1930, 2389, 5300];
  const sales2025 = [5921, 4547, 3910, 5149, 3325, 2717, 4171, 5871, 2452, 1938, 2479, 5795];
  const total2024 = sales2024.reduce((sum, val) => sum + val, 0);
  const total2025 = sales2025.reduce((sum, val) => sum + val, 0);

  // Calculate growth rate
  const salesData = salesXData.map((month, index) => ({
    x: month,
    y: sales2025[index] !== undefined && sales2025[index] !== null ? sales2025[index] : 0
  }));

  useEffect(() => {
    const growth = total2024 === 0 ? 0 : (((total2025 - total2024) / total2024) * 100).toFixed(1);
    setGrowthRate(growth);
  }, [total2024, total2025]);

  // For chart yearly income
  const data = {
    labels: ["Salary", "Investments"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#2B3D5B", "#A5D8FF"],
        borderWidth: 0,
        cutout: "90%",
        circumference: 300,
        rotation: 210,
        borderRadius:20
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const datach2 = {
    labels: ["Active", "Inactive", "Offline"], // Updated labels
    datasets: [
      {
        data: [513, 741, 121], // Updated data from image
        backgroundColor: ["#2B3D5B", "#D1D5DB", "#A5D8FF"], // Updated colors (assuming D1D5DB for inactive)
        borderWidth: 0,
        cutout: "65%",
        circumference: 210,
        rotation: 255,
        borderRadius: 3,
      },
    ],
  };
  const optionsch2 = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole === "merchant") {
          await Promise.all([
            dispatch(getMerchantOrderStats()),
            dispatch(getProductsAvgRatings()),
            dispatch(getSalesGrowth()),
            dispatch(getStockLevelsProducts())
          ]);
        } else if (userRole === "admin") {
          await Promise.all([
            dispatch(getPlatformStats()),
            dispatch(getOrdersSales()),
            dispatch(getTotalUsers()), // add here admin analytics actions >>>>>>>>>>
          ]);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [dispatch, userRole]);


  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Analytics</h3>
        <div>
          <Link
            to="/analytics"
            className="text-lg font-semibold text-dark-grey"
          >
            Dashboard
          </Link>
          <span className="mx-2 font-semi text-dark-grey">/</span>
          <Link
            to="/analytics"
            className="text-lg font-semibold text-title-blue"
          >
            Analytics
          </Link>
        </div>
      </div>

      {userRole === "admin" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 font-inter">
            <div className="px-4 py-3.5 rounded-2xl bg-white ">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-2.5 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                    <LuPackageOpen className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Orders Number
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {ordersSales.totalOrders}
                    </span>
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
                      data: xLabelsMiniCharts,
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
                      data: ordersMiniChartData,
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
                  <linearGradient
                    id="Gradient1"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <div className="py-1.5 px-3.5 text-[#9333EA] bg-[#F3E8FF] rounded-full w-fit">
                    <p className="text-2xl font-bold">B</p>
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Brands Number
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalBrands}
                    </span>
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
                      data: xLabelsMiniCharts,
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
                      data: brandsMiniChartData,
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
                  <linearGradient
                    id="Gradient2"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <div className="p-2.5 text-[#D97706] bg-[#FEF3C7] rounded-full w-fit">
                    <RxGrid className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Products Number
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalProducts}
                    </span>
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
                      data: xLabelsMiniCharts,
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
                      data: productsMiniChartData,
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
                  <linearGradient
                    id="Gradient3"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <div className="p-2.5 text-[#2563EB] bg-[#DBEAFE] rounded-full w-fit">
                    <IoIosPeople className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Users Number
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {TotalUsers.totalUsers}
                    </span>
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
                      data: xLabelsMiniCharts,
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
                      data: usersMiniChartData,
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
                  <linearGradient
                    id="Gradient4"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <div className="p-2.5 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                    <BsCurrencyDollar className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Total Sales
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {ordersSales.totalMoneyPaid.toFixed(0)} EGP
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
                      data: xLabelsMiniCharts,
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
                      data: totalSalesMiniChartData,
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
                  <linearGradient
                    id="Gradient"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <div className="p-2.5 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                    <FaTags className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Categories Number
                  </p>

                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalCategories}
                    </span>
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
                      data: xLabelsMiniCharts,
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
                      data: categoriesMiniChartData,
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
                  <linearGradient
                    id="Gradient6"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
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
                  <span className="font-bold text-3xl text-[#1E1B39] ">
                    EGP 1.2M
                  </span>
                  <span className="text-[#04CE00] flex items-center gap-1 text-sm">
                    <div className="w-2.5 h-2.5 bg-[#04CE00] rounded-full"></div>
                    1.3%
                  </span>
                  VS LAST YEAR
                </h3>
              </div>

              <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
                <button
                  onClick={() => {
                    setXData(["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"]);
                    setYData([0, 5000, 10000, 15000, 20000, 25000]);
                    setDataChart([
                      8000, 12000, 18000, 22000, 24000, 20000, 15000,
                    ]);
                    setActivePeriod("Weekly");
                  }}
                  className={`px-4 py-2.5 text-sm rounded-lg ${
                    activePeriod === "Weekly"
                      ? "font-medium text-white bg-title-blue"
                      : ""
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => {
                    setXData([
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
                    setYData([
                      0, 100000, 200000, 300000, 400000, 500000, 600000, 700000,
                      800000,
                    ]);
                    setDataChart([
                      350000, 320000, 480000, 550000, 500000, 420000, 380000,
                      450000, 600000, 720000, 780000, 850000,
                    ]);
                    setActivePeriod("Monthly");
                  }}
                  className={`px-4 py-2.5 text-sm rounded-lg ${
                    activePeriod === "Monthly"
                      ? "font-medium text-white bg-title-blue"
                      : ""
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => {
                    setXData([
                      "2018",
                      "2019",
                      "2020",
                      "2021",
                      "2022",
                      "2023",
                      "2024",
                      "2025",
                    ]);
                    setYData([0, 1000000, 2000000, 3000000, 4000000, 5000000]);
                    setDataChart([
                      1500000, 1800000, 3300000, 4500000, 4900000, 5400000,
                      6000000, 6900000,
                    ]);
                    setActivePeriod("Annually");
                  }}
                  className={`px-4 py-2.5 text-sm rounded-lg ${
                    activePeriod === "Annually"
                      ? "font-medium text-white bg-title-blue"
                      : ""
                  }`}
                >
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
                  scaleType: "point",
                  data: xData,
                  valueFormatter: (x) => x,
                },
              ]}
              yAxis={[
                {
                  offset: 30,
                  disableTicks: true,
                  disableLine: true,
                  position: "right",
                  data: yData,
                  valueFormatter: (value) => {
                    if (
                      activePeriod === "Monthly" ||
                      activePeriod === "Annually"
                    ) {
                      // Format to K (thousands) or M (millions) for EGP
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                    }
                    return `${value}`; // For weekly, display as is with EGP prefix
                  },
                },
              ]}
              grid={{ horizontal: true }}
              series={[
                {
                  curve: "natural",
                  data: dataChart,
                  area: true,
                  showMark: false,
                  color: "url(#Gradient7)",
                  valueFormatter: (value) => `EGP ${value.toLocaleString()}`,
                },
              ]}
              slotProps={{
                tooltip: {
                  sx: {
                    [`& .${chartsTooltipClasses.labelCell}`]: {
                      display: "none",
                    },
                    [`& .${chartsTooltipClasses.paper}`]: {
                      color: "white !important",
                      backgroundColor: "#15253F",
                      borderRadius: "8px",
                    },
                    [`& .${chartsTooltipClasses.valueCell}`]: {
                      color: "white !important",
                      fontWeight: "semibold",
                    },
                  },
                },
              }}
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

        </>
      )}

      {userRole === "merchant" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 font-inter">
            {/* stock levels  */}
            <div className="px-4 py-3.5 rounded-2xl bg-white ">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                    <LuPackageOpen className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Stock Levels
                  </p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue pr-2">
                      {totalStock}
                    </span>
                    items in stock
                  </h3>
                </div>
                <p className="text-base font-semibold text-[#22C55E] flex">
                  <FaArrowUpLong className="text-xl" /> 12.7%
                </p>
              </div>
              <div className="mt-3 flex justify-center">
                {error && <Typography color="error">{error}</Typography>}
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <>
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: merchantStockLevels.map((p) => p.name),
                        },
                      ]}
                      series={[
                        {
                          data: merchantStockLevels.map(
                            (p) => p.quantityInStock
                          ),
                          label: "Stock Quantity",
                          color: "#b8f2bc",
                        },
                      ]}
                      width={350}
                      height={200}
                    />
                  </>
                )}
              </div>
            </div>
            {/* product average ratings */}
            <div className="px-4 py-3.5 rounded-2xl bg-white ">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#D97706] bg-[#FEF3C7] rounded-full w-fit">
                    <RxGrid className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Products Average Ratings
                  </p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue mr-2">
                      {/* {merchantProductRatings?.length || dummyProductRatings.length} */}
                      {productData?.length}
                    </span>
                    products
                  </h3>
                </div>
                <p className="text-base font-semibold text-[#22C55E] flex">
                  <FaArrowUpLong className="text-xl" /> 9.7%
                </p>
              </div>
              <div className="mt-3 flex justify-center">
                {error && (
                  <Typography color="error">
                    {error.message || error}
                  </Typography>
                )}
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <>
                    <BarChart
                      xAxis={[{ scaleType: "band", data: productNames }]}
                      series={[
                        {
                          data: avgRatings,
                          label: "Average Rating",
                          color: "#ffd096",
                        },
                        {
                          data: totalReviews,
                          label: "Total Reviews",
                          color: "#e27d09",
                        },
                      ]}
                      width={350}
                      height={200}
                    />
                  </>
                )}
              </div>
            </div>
            {/* order stats */}
            <div className="px-4 py-3.5 rounded-2xl bg-white ">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                    <FaTags className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">
                    Orders Stats
                  </p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue mr-2">
                      {orderData?.length}
                    </span>
                    order
                  </h3>
                </div>
                <p className="text-base font-semibold text-[#22C55E] flex">
                  <FaArrowUpLong className="text-xl" /> 5.7%
                </p>
              </div>
              <div className="mt-3 flex justify-center">
                {error && (
                  <Typography color="error">
                    {error.message || error}
                  </Typography>
                )}
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <>
                    <BarChart
                      xAxis={[{ scaleType: "band", data: orderMonths }]}
                      series={[
                        {
                          data: totalOrders,
                          label: "Orders",
                          color: "#f4c6e0",
                        },
                        {
                          data: totalRevenue,
                          label: "Revenue",
                          color: "#e1478c",
                        },
                      ]}
                      width={350}
                      height={200}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          {/* growth sales  */}
          <div className="rounded-2xl bg-white my-5 p-8 font-inter">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-[#6E7786] text-lg">Sales 2025</p>
                <h3 className="flex items-center gap-2 text-[#6E7786]">
                  <span className="font-bold text-3xl text-[#1E1B39] ">
                    ${(total2025 / 1000).toFixed(1)}k
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      growthRate >= 0 ? "text-[#04CE00]" : "text-[#DC2626]"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        growthRate >= 0 ? "bg-[#04CE00]" : "bg-[#DC2626]"
                      }`}
                    ></div>
                    {growthRate}%
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
                  scaleType: "band",
                  data: salesXData,
                  valueFormatter: (val) => val,
                  disableTicks: true,
                  disableLine: true,
                  offset: 25,
                  labelOffset: 1,
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
                  data: sales2025,
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
                      className="bg-title-blue"
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
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-14 font-inter">
        <div className="rounded-2xl bg-white p-8">
          <div className="pb-2.5 border-b-2 border-[#E5E5EF]">
            <p className="text-[#9291A5] text-lg">Statistics</p>
            <p className="text-title-blue text-xl font-bold">Yearly income</p>
          </div>
          <div className="mt-5">
            <Box position="relative" width={240} height={200} mx="auto">
              <Doughnut data={data} options={options} />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -25%)", textAlign: "center" }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="!font-inter !font-normal !text-base"
                >
                  Total income
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="semibold"
                  className="!text-main-blue !font-inter !font-bold !text-xl"
                >
                  750K EGP
                </Typography>
              </Box>
            </Box>
            <Box className="flex flex-wrap w-full justify-around mt-5 text-sm">
              <div className="flex items-center">
                <span className="bg-main-blue w-3 h-3 rounded-full me-0.5"></span>
                <span className="text-second-grey text-base font-normal">
                  Salary
                  <span className="text-main-blue font-medium ms-1">65%</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-[#A5D8FF] w-3 h-3 rounded-full me-0.5"></span>
                <span className="text-second-grey text-base font-normal">
                  Investments
                  <span className="text-main-blue font-medium ms-1">35%</span>
                </span>
              </div>
            </Box>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8">
          <div className="pb-2.5 border-b-2 border-[#E5E5EF]">
            <p className="text-[#9291A5] text-lg">Statistics</p>
            <p className="text-title-blue text-xl font-bold">Total viewers</p>
          </div>
          <div className="mt-5">
            <Box position="relative" width={250} height={200} mx="auto">
              <Doughnut data={datach2} options={optionsch2} />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{
                  transform: "translate(-50%, 0%)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="!text-[#615E83] !text-lg"
                >
                  Total Count
                </Typography>
                <Typography
                  variant="h6"
                  className="!text-main-blue !font-inter !font-bold !text-4xl"
                >
                  1,375
                </Typography>
              </Box>
            </Box>
            <Box className="flex justify-around w-full flex-wrap text-sm border-t-2 pt-5 border-[#E5E5EF]">
              <div className="flex items-center">
                <span className="bg-main-blue w-3 h-3 rounded-full me-0.5"></span>
                <span className="text-second-grey text-base font-normal">
                  Active
                  <span className="text-main-blue font-medium ms-1">513</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-400 w-3 h-3 rounded-full me-0.5"></span>
                <span className="text-second-grey text-base font-normal">
                  Inactive
                  <span className="text-main-blue font-medium ms-1">741</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-[#A5D8FF] w-3 h-3 rounded-full me-0.5"></span>
                <span className="text-second-grey text-base font-normal">
                  Offline
                  <span className="text-main-blue font-medium ms-1">121</span>
                </span>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;