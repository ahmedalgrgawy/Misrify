import { FormControlLabel, Stack, Switch, Typography, Box } from "@mui/material";
import { ChartContainer, chartsTooltipClasses } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart, AreaPlot, LinePlot, lineElementClasses } from "@mui/x-charts/LineChart";
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
import {
  getMerchantOrderStats,
  getProductsAvgRatings,
  getSalesGrowth,
  getStockLevelsProducts,
  getMerchantSalesTrends,
  getMerchantOrderTrends,
} from "../../features/merchantAnalyticsSlice";
import {
  getOrdersSales,
  getPlatformStats,
  getTotalUsers,
  getMiniChartData,
  getYearlyIncome,
} from "../../features/adminAnalyticsSlice";

const Analytics = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [activePeriod, setActivePeriod] = useState("Monthly");

  const userRole = useSelector((state) => state.auth.user?.role);
  const adminAnalytics = useSelector((state) => state.adminAnalytics);
  const merchantAnalytics = useSelector((state) => state.merchantAnalytics);

  const {
    platformStats = {},
    ordersSales = {},
    totalUsers = {},
    miniChartData = {},
    yearlyIncome: adminYearlyIncome = {},
    totalViewers: adminTotalViewers = {},
    loading: adminLoading,
  } = userRole === "admin" ? adminAnalytics || {} : {};

  const {
    stockLevels = [],
    productRatings = [],
    orderStats = { totalOrders: 0, totalMoneyEarned: 0 },
    salesGrowth = { currentMonthTotal: 0, lastMonthTotal: 0, salesGrowthRate: "0.00" },
    salesTrends = [],
    orderTrends = [],
    yearlyIncome: merchantYearlyIncome = {},
    totalViewers: merchantTotalViewers = {},
    loading: merchantLoading,
  } = userRole === "merchant" ? merchantAnalytics || {} : {};

  const yearlyIncome = userRole === "admin" ? adminYearlyIncome : merchantYearlyIncome;
  const totalViewers = userRole === "admin" ? adminTotalViewers : merchantTotalViewers;
  const loading = userRole === "admin" ? adminLoading : merchantLoading;

  // Derived data
  const totalStock = stockLevels.reduce((sum, product) => sum + (product.quantityInStock || 0), 0, 0);

  const productNames = productRatings.map((p) => p.name || "Unknown");
  const avgRatings = productRatings.map((p) => p.averageRating || 0);
  const totalReviews = productRatings.map((p) => p.totalReviews || 0);

  const orderMonths = orderTrends.map((o) => o.month || "");
  const totalOrders = orderTrends.map((o) => o.totalOrders || 0);
  const totalRevenue = orderTrends.map((o) => o.totalRevenue || 0);

  const salesXData = salesTrends.map((s) => s.month || "");
  const salesData = salesTrends.map((s) => s.totalSales || 0);
  const totalSales = salesData.reduce((sum, val) => sum + val, 0);
  const growthRate = salesGrowth.salesGrowthRate || "0.00";

  const handleTooltipChange = (event) => {
    setShowTooltip(event.target.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole === "merchant") {
          await Promise.all([
            dispatch(getMerchantOrderStats()),
            dispatch(getProductsAvgRatings()),
            dispatch(getSalesGrowth()),
            dispatch(getStockLevelsProducts()),
            dispatch(getMerchantSalesTrends({ year: new Date().getFullYear() })),
            dispatch(getMerchantOrderTrends()),
            dispatch(getYearlyIncome()),
          ]);
        } else if (userRole === "admin") {
          await Promise.all([
            dispatch(getPlatformStats()),
            dispatch(getOrdersSales({ period: activePeriod.toLowerCase() })),
            dispatch(getTotalUsers()),
            dispatch(getMiniChartData()),
            dispatch(getYearlyIncome()),
          ]);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [dispatch, userRole, activePeriod]);

  // Doughnut chart configurations
  const doughnutData = {
    labels: yearlyIncome.labels || ["Sales", "Investments"],
    datasets: [
      {
        data: yearlyIncome.values || [0, 0],
        backgroundColor: ["#2B3D5B", "#A5D8FF"],
        borderWidth: 0,
        cutout: "90%",
        circumference: 300,
        rotation: 210,
        borderRadius: 20,
      },
    ],
  };

  const doughnutOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const viewersData = {
    labels: totalViewers.labels || ["Active", "Inactive", "Offline"],
    datasets: [
      {
        data: totalViewers.values || [0, 0, 0],
        backgroundColor: ["#2B3D5B", "#D1D5DB", "#A5D8FF"],
        borderWidth: 0,
        cutout: "65%",
        circumference: 210,
        rotation: 255,
        borderRadius: 3,
      },
    ],
  };

  const viewersOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Analytics</h3>
        <div>
          <Link to="/analytics" className="text-lg font-semibold text-dark-grey">
            Dashboard
          </Link>
          <span className="mx-2 font-semi text-dark-grey">/</span>
          <Link to="/analytics" className="text-lg font-semibold text-title-blue">
            Analytics
          </Link>
        </div>
      </div>

      {error && <Typography color="error" className="mb-4">{error}</Typography>}

      {userRole === "admin" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 font-inter mx-a">
            {/* Orders Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-2.5 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                    <LuPackageOpen className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Orders Number</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {ordersSales.totalOrders || 0}
                    </span>
                    orders
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <ChartContainer
                    width={380}
                    height={70}
                    margin={{ left: 0, right: 0, top: 0, bottom: 2 }}
                    xAxis={[{ height: 0, position: "none", scaleType: "point", data: miniChartData.labels || [] }]}
                    yAxis={[{ width: 0, position: "none" }]}
                    series={[{ data: miniChartData.orders || [], type: "line", label: "Orders", area: true, stack: "total", color: "url(#Gradient1)" }]}
                    sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(10, 196, 0)", strokeWidth: 2 } }}
                  >
                    <linearGradient id="Gradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0" stopColor="rgba(10, 196, 0, 0)" />
                      <stop offset="1" stopColor="rgba(10, 196, 0, 0.6)" />
                    </linearGradient>
                    <AreaPlot />
                    <LinePlot />
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* Brands Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="py-1.5 px-3.5 text-[#9333EA] bg-[#F3E8FF] rounded-full w-fit">
                    <p className="text-2xl font-bold">B</p>
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Brands Number</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalBrands || 0}
                    </span>
                    brands
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <ChartContainer
                    width={380}
                    height={70}
                    margin={{ left: 0, right: 0, top: 0, bottom: 2 }}
                    xAxis={[{ height: 0, position: "none", scaleType: "point", data: miniChartData.labels || [] }]}
                    yAxis={[{ width: 0, position: "none" }]}
                    series={[{ data: miniChartData.brands || [], type: "line", label: "Brands", area: true, stack: "total", color: "url(#Gradient2)" }]}
                    sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(147, 51, 234)", strokeWidth: 2 } }}
                  >
                    <linearGradient id="Gradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0" stopColor="rgba(147, 51, 234, 0)" />
                      <stop offset="1" stopColor="rgba(147, 51, 234, 0.6)" />
                    </linearGradient>
                    <AreaPlot />
                    <LinePlot />
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* Products Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-2.5 text-[#D97706] bg-[#FEF3C7] rounded-full w-fit">
                    <RxGrid className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Products Number</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalProducts || 0}
                    </span>
                    products
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <ChartContainer
                    width={380}
                    height={70}
                    margin={{ left: 0, right: 0, top: 0, bottom: 2 }}
                    xAxis={[{ height: 0, position: "none", scaleType: "point", data: miniChartData.labels || [] }]}
                    yAxis={[{ width: 0, position: "none" }]}
                    series={[{ data: miniChartData.products || [], type: "line", label: "Products", area: true, stack: "total", color: "url(#Gradient3)" }]}
                    sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(217, 119, 6)", strokeWidth: 2 } }}
                  >
                    <linearGradient id="Gradient3" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0" stopColor="rgba(217, 119, 6, 0)" />
                      <stop offset="1" stopColor="rgba(217, 119, 6, 0.6)" />
                    </linearGradient>
                    <AreaPlot />
                    <LinePlot />
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* Users Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-2.5 text-[#2563EB] bg-[#DBEAFE] rounded-full w-fit">
                    <IoIosPeople className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Users Number</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {totalUsers.totalUsers || 0}
                    </span>
                    users
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <ChartContainer
                    width={380}
                    height={70}
                    margin={{ left: 0, right: 0, top: 0, bottom: 2 }}
                    xAxis={[{ height: 0, position: "none", scaleType: "point", data: miniChartData.labels || [] }]}
                    yAxis={[{ width: 0, position: "none" }]}
                    series={[{ data: miniChartData.users || [], type: "line", label: "Users", area: true, stack: "total", color: "url(#Gradient4)" }]}
                    sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(37, 99, 235)", strokeWidth: 2 } }}
                  >
                    <linearGradient id="Gradient4" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0" stopColor="rgba(37, 99, 235, 0)" />
                      <stop offset="1" stopColor="rgba(37, 99, 235, 0.6)" />
                    </linearGradient>
                    <AreaPlot />
                    <LinePlot />
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* Categories Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-2.5 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                    <FaTags className="text-2xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Categories Number</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                      {platformStats.totalCategories || 0}
                    </span>
                    Categories
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <ChartContainer
                    width={380}
                    height={70}
                    margin={{ left: 0, right: 0, top: 0, bottom: 2 }}
                    xAxis={[{ height: 0, position: "none", scaleType: "point", data: miniChartData.labels || [] }]}
                    yAxis={[{ width: 0, position: "none" }]}
                    series={[{ data: miniChartData.categories || [], type: "line", label: "Categories", area: true, stack: "total", color: "url(#Gradient6)" }]}
                    sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(219, 39, 119)", strokeWidth: 2 } }}
                  >
                    <linearGradient id="Gradient6" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0" stopColor="rgba(219, 39, 119, 0)" />
                      <stop offset="1" stopColor="rgba(219, 39, 119, 0.6)" />
                    </linearGradient>
                    <AreaPlot />
                    <LinePlot />
                  </ChartContainer>
                )}
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="rounded-2xl bg-white my-5 p-8 font-inter">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-[#6E7786] text-lg">Sales {new Date().getFullYear()}</p>
                <h3 className="flex items-center gap-2 text-[#6E7786]">
                  <span className="font-bold text-3xl text-[#1E1B39]">
                    EGP {(ordersSales.totalMoneyPaid || 0).toLocaleString()}
                  </span>
                  <span className="text-[#04CE00] flex items-center gap-1 text-sm">
                    <div className="w-2.5 h-2.5 bg-[#04CE00] rounded-full"></div>
                    {(ordersSales.timeSeries?.length && ordersSales.timeSeries[0].totalMoneyPaid
                      ? ((ordersSales.totalMoneyPaid - ordersSales.timeSeries[0].totalMoneyPaid) /
                        ordersSales.timeSeries[0].totalMoneyPaid * 100).toFixed(1)
                      : 0)}%
                  </span>
                  VS PREVIOUS PERIOD
                </h3>
              </div>
              <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
                <button
                  onClick={() => setActivePeriod("Weekly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Weekly" ? "font-medium text-white bg-title-blue" : ""}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActivePeriod("Monthly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Monthly" ? "font-medium text-white bg-title-blue" : ""}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActivePeriod("Annually")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Annually" ? "font-medium text-white bg-title-blue" : ""}`}
                >
                  Annually
                </button>
              </div>
            </div>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <LineChart
                xAxis={[{ offset: 25, labelOffset: 1, disableTicks: true, disableLine: true, scaleType: "point", data: ordersSales.timeSeries?.map((t) => t.label) || [] }]}
                yAxis={[{
                  offset: 30,
                  disableTicks: true,
                  disableLine: true,
                  position: "right",
                  valueFormatter: (value) => activePeriod === "Monthly" || activePeriod === "Annually"
                    ? (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`)
                    : `${value.toLocaleString()}`
                }]}
                grid={{ horizontal: true }}
                series={[{ curve: "monotoneX", data: ordersSales.timeSeries?.map((t) => t.totalMoneyPaid) || [], area: true, showMark: false, color: "url(#Gradient7)", valueFormatter: (value) => `EGP ${value.toLocaleString()}` }]}
                slotProps={{ tooltip: { sx: { [`& .${chartsTooltipClasses.labelCell}`]: { display: "none" }, [`& .${chartsTooltipClasses.paper}`]: { color: "white !important", backgroundColor: "#15253F", borderRadius: "8px" }, [`& .${chartsTooltipClasses.valueCell}`]: { color: "white !important", fontWeight: "semibold" } } } }}
                sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(21, 37, 63)", strokeWidth: 3 } }}
                height={300}
              >
                <Stack direction="row">
                  <FormControlLabel
                    value="end"
                    control={<Switch checked={showTooltip} onChange={handleTooltipChange} />}
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
            )}
          </div>
        </>
      )}

      {userRole === "merchant" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 font-inter">
            {/* Stock Levels */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#0AC400] bg-[#B3FFBB99] rounded-full w-fit">
                    <LuPackageOpen className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Stock Levels</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue pr-2">{totalStock.toLocaleString()}</span>
                    items in stock
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <BarChart
                    xAxis={[{ scaleType: "band", data: stockLevels.map((p) => p.name || "Unknown") }]}
                    series={[{ data: stockLevels.map((p) => p.quantityInStock || 0), label: "Stock Quantity", color: "#b8f2bc" }]}
                    width={350}
                    height={200}
                  />
                )}
              </div>
            </div>
            {/* Product Average Ratings */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#D97706] bg-[#FEF3C7] rounded-full w-fit">
                    <RxGrid className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Products Average Ratings</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue mr-2">{productRatings.length}</span>
                    products
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <BarChart
                    xAxis={[{ scaleType: "band", data: productNames }]}
                    series={[
                      { data: avgRatings, label: "Average Rating", color: "#ffd096" },
                      { data: totalReviews, label: "Total Reviews", color: "#e27d09" },
                    ]}
                    width={350}
                    height={200}
                  />
                )}
              </div>
            </div>
            {/* Order Stats */}
            <div className="px-4 py-3.5 rounded-2xl bg-white">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                    <FaTags className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Orders Stats</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue mr-2">{orderStats.totalOrders || 0}</span>
                    orders
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <BarChart
                    xAxis={[{ scaleType: "band", data: orderMonths }]}
                    series={[
                      { data: totalOrders, label: "Orders", color: "#f4c6e0" },
                      { data: totalRevenue, label: "Revenue (EGP)", color: "#e1478c" },
                    ]}
                    width={350}
                    height={200}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Sales Growth */}
          <div className="rounded-2xl bg-white my-5 p-8 font-inter">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-[#6E7786] text-lg">Sales {new Date().getFullYear()}</p>
                <h3 className="flex items-center gap-2 text-[#6E7786]">
                  <span className="font-bold text-3xl text-[#1E1B39]">
                    EGP {(totalSales || 0).toLocaleString()}
                  </span>
                  <span className={`flex items-center gap-1 text-sm ${growthRate >= 0 ? "text-[#04CE00]" : "text-[#DC2626]"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${growthRate >= 0 ? "bg-[#04CE00]" : "bg-[#DC2626]"}`}></div>
                    {growthRate}%
                  </span>
                  VS LAST MONTH
                </h3>
              </div>
              <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
                <button className="px-4 py-2.5 text-sm">Daily</button>
                <button className="px-4 py-2.5 text-sm">Weekly</button>
                <button className="px-4 py-2.5 text-sm bg-title-blue rounded-lg font-medium text-white">Annually</button>
              </div>
            </div>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <LineChart
                xAxis={[{ scaleType: "band", data: salesXData, valueFormatter: (val) => val, disableTicks: true, disableLine: true, offset: 25, labelOffset: 1 }]}
                yAxis={[{ offset: 30, disableTicks: true, disableLine: true, position: "right", valueFormatter: (value) => `${(value / 1000).toFixed(0)}K` }]}
                grid={{ horizontal: true }}
                series={[{ curve: "natural", data: salesData, area: true, showMark: false, color: "url(#Gradient7)" }]}
                sx={{ [`& .${lineElementClasses.root}`]: { stroke: "rgba(21, 37, 63)", strokeWidth: 3 } }}
                height={300}
              >
                <Stack direction="row">
                  <FormControlLabel
                    value="end"
                    control={<Switch className="bg-title-blue" checked={showTooltip} onChange={handleTooltipChange} />}
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
            )}
          </div>
        </>
      )}

      <div className="grid gap-8 gap-x-14 font-inter">
        {/* Yearly Income */}
        <div className="rounded-2xl bg-white p-8">
          <div className="pb-2.5 border-b-2 border-[#E5E5EF]">
            <p className="text-[#9291A5] text-lg">Statistics</p>
            <p className="text-title-blue text-xl font-bold">Yearly Income</p>
          </div>
          <div className="mt-5">
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                <Box position="relative" width={240} height={200} mx="auto">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -25%)", textAlign: "center" }}>
                    <Typography variant="body2" color="textSecondary" className="!font-inter !font-normal !text-base">
                      Total Income
                    </Typography>
                    <Typography variant="h6" fontWeight="semibold" className="!text-main-blue !font-inter !font-bold !text-xl">
                      {yearlyIncome.totalIncome ? `${parseInt(yearlyIncome.totalIncome).toLocaleString()} EGP` : "0 EGP"}
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex flex-wrap w-full justify-around mt-5 text-sm">
                  {(doughnutData.labels || []).map((label, index) => (
                    <div className="flex items-center" key={label}>
                      <span className={`w-3 h-3 rounded-full me-0.5`} style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}></span>
                      <span className="text-second-grey text-base font-normal">
                        {label}
                        <span className="text-main-blue font-medium ms-1">
                          {yearlyIncome.values && yearlyIncome.values.reduce((sum, val) => sum + val, 0)
                            ? `${((yearlyIncome.values[index] / yearlyIncome.values.reduce((sum, val) => sum + val, 0)) * 100).toFixed(0)}%`
                            : "0%"}
                        </span>
                      </span>
                    </div>
                  ))}
                </Box>
              </>
            )}
          </div>
        </div>
        {/* Total Viewers */}
        {/* <div className="rounded-2xl bg-white p-8">
          <div className="pb-2.5 border-b-2 border-[#E5E5EF]">
            <p className="text-[#9291A5] text-lg">Statistics</p>
            <p className="text-title-blue text-xl font-bold">Total Viewers</p>
          </div>
          <div className="mt-5">
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                <Box position="relative" width={250} height={200} mx="auto">
                  <Doughnut data={viewersData} options={viewersOptions} />
                  <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, 0%)", textAlign: "center" }}>
                    <Typography variant="body2" color="textSecondary" className="!text-[#615E83] !text-lg">
                      Total Count
                    </Typography>
                    <Typography variant="h6" className="!text-main-blue !font-inter !font-bold !text-4xl">
                      {totalViewers.totalCount ? totalViewers.totalCount.toLocaleString() : 0}
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex justify-around w-full flex-wrap text-sm border-t-2 pt-5 border-[#E5E5EF]">
                  {(viewersData.labels || []).map((label, index) => (
                    <div className="flex items-center" key={label}>
                      <span className={`w-3 h-3 rounded-full me-0.5`} style={{ backgroundColor: viewersData.datasets[0].backgroundColor[index] }}></span>
                      <span className="text-second-grey text-base font-normal">
                        {label}
                        <span className="text-main-blue font-medium ms-1">{totalViewers.values ? totalViewers.values[index] : 0}</span>
                      </span>
                    </div>
                  ))}
                </Box>
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Analytics;