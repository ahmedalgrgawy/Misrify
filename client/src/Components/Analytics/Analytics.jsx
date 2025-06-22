import { FormControlLabel, Stack, Switch, Typography, Box } from "@mui/material";
import { ChartContainer, chartsTooltipClasses } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart, AreaPlot, LinePlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPackageOpen } from "react-icons/lu";
import { FaDollarSign, FaTags } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
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
import moment from "moment";

const Analytics = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [activePeriod, setActivePeriod] = useState("Annually");

  const userRole = useSelector((state) => state.auth.user?.role);
  const adminAnalytics = useSelector((state) => state.adminAnalytics);
  const merchantAnalytics = useSelector((state) => state.merchantAnalytics);

  const {
    platformStats = {},
    ordersSales = {},
    totalUsers = {},
    miniChartData = {},
    yearlyIncome: adminYearlyIncome = {},
    loading: adminLoading,
  } = userRole === "admin" ? adminAnalytics || {} : {};

  const {
    stockLevels = [],
    productRatings = [],
    salesGrowth = { currentMonthTotal: 0, lastMonthTotal: 0, salesGrowthRate: "0.00" },
    orderTrends = [],
    yearlyIncome: merchantYearlyIncome = {},
    loading: merchantLoading,
  } = userRole === "merchant" ? merchantAnalytics || {} : {};

  const yearlyIncome = userRole === "admin" ? adminYearlyIncome : merchantYearlyIncome;
  const loading = userRole === "admin" ? adminLoading : merchantLoading;

  // Derived data
  const totalStock = stockLevels.reduce((sum, product) => sum + (product.quantityInStock || 0), 0, 0);

  const productNames = productRatings.map((p) => p.name || "Unknown");
  const avgRatings = productRatings.map((p) => p.averageRating || 0);
  const totalReviews = productRatings.map((p) => p.totalReviews || 0);

  const orderMonths = orderTrends.map((o) => o.month || "");
  const totalOrders = orderTrends.map((o) => o.totalOrders || 0);
  const totalRevenue = orderTrends.map((o) => o.totalRevenue || 0);

  const totalSales = salesGrowth.currentMonthTotal || 0;
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
            dispatch(getSalesGrowth({ period: activePeriod.toLowerCase() })),
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
            {/* Total Sales Number */}
            <div className="px-4 py-3.5 rounded-2xl bg-white w-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <div className="p-2.5 text-[rgb(219,216,39)] bg-[#f4f3b1] rounded-full w-fit">
                  <FaDollarSign className="text-2xl" />
                </div>
                <p className="my-4 text-[#6E7786] text-sm font-semibold mx-auto">Total Income</p>
                <h3 className="text-sm font-normal text-[#6E7786] mx-auto">
                  <span className="text-2xl font-bold text-[#0B172A] me-1.5">
                    {yearlyIncome.totalIncome || 0}
                  </span>
                  EGP
                </h3>
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
                  <span
                    className={`flex items-center gap-1 text-sm ${ordersSales.timeSeries?.length &&
                      ordersSales.timeSeries[0].totalMoneyPaid
                      ? (ordersSales.totalMoneyPaid -
                        ordersSales.timeSeries[0].totalMoneyPaid) /
                        ordersSales.timeSeries[0].totalMoneyPaid *
                        100 >=
                        0
                        ? "text-[#04CE00]"
                        : "text-[#DC2626]"
                      : "text-[#04CE00]"
                      }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${ordersSales.timeSeries?.length &&
                        ordersSales.timeSeries[0].totalMoneyPaid
                        ? (ordersSales.totalMoneyPaid -
                          ordersSales.timeSeries[0].totalMoneyPaid) /
                          ordersSales.timeSeries[0].totalMoneyPaid *
                          100 >=
                          0
                          ? "bg-[#04CE00]"
                          : "bg-[#DC2626]"
                        : "bg-[#04CE00]"
                        }`}
                    ></div>
                    {(ordersSales.timeSeries?.length &&
                      ordersSales.timeSeries[0].totalMoneyPaid
                      ? (
                        (ordersSales.totalMoneyPaid -
                          ordersSales.timeSeries[0].totalMoneyPaid) /
                        ordersSales.timeSeries[0].totalMoneyPaid *
                        100
                      ).toFixed(1)
                      : 0)}%
                  </span>
                  VS PREVIOUS PERIOD
                </h3>
              </div>
              <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
                <button
                  onClick={() => setActivePeriod("Weekly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Weekly" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActivePeriod("Monthly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Monthly" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActivePeriod("Annually")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Annually" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Annually
                </button>
              </div>
            </div>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <LineChart
                xAxis={[
                  {
                    labelOffset: 1,
                    tickLabelStyle: { fontSize: 12, fill: "#6E7786" },
                    scaleType: "point",
                    data: ordersSales.timeSeries?.map((t) => t.label) || [],
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: { fontSize: 12, fill: "#6E7786" },
                    valueFormatter: (value) => `${Math.round(value)}`, // Raw EGP
                    min: 0,
                    max:
                      Math.max(
                        ...(ordersSales.timeSeries?.map((t) => t.totalMoneyPaid) || [0]),
                        50
                      ) * 1.2, // 20% headroom
                    tickValues: (() => {
                      const maxData = Math.max(
                        ...(ordersSales.timeSeries?.map((t) => t.totalMoneyPaid) || [0]),
                        50
                      );
                      const baseTicks = [50, 100, 200, 500, 1000];
                      if (maxData > 1000) {
                        let nextTick = 2000;
                        const extendedTicks = [...baseTicks];
                        while (nextTick <= maxData * 1.2) {
                          extendedTicks.push(nextTick);
                          nextTick = nextTick < 5000 ? nextTick * 2.5 : nextTick * 2;
                        }
                        return extendedTicks;
                      }
                      return baseTicks.filter((tick) => tick <= maxData * 1.2);
                    })(),
                    position: "left",
                    margin: { left: 60 }, // Ensure space for labels
                  },
                ]}
                grid={{ horizontal: true }}
                series={[
                  {
                    curve: "linear",
                    data: ordersSales.timeSeries?.map((t) => t.totalMoneyPaid) || [],
                    area: true,
                    showMark: false,
                    color: "url(#Gradient7)",
                    valueFormatter: (value) => `EGP ${value.toLocaleString()}`,
                  },
                ]}
                slotProps={{
                  tooltip: {
                    sx: {
                      [`& .${chartsTooltipClasses.labelCell}`]: { display: "none" },
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
                  [`& .${lineElementClasses.root}`]: { stroke: "rgba(21, 37, 63)", strokeWidth: 3 },
                  "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                    transform: "translateX(-10px)", // Adjust label position
                  },
                }}
                height={300}
                margin={{ top: 20, bottom: 30, left: 60, right: 10 }} // Adjust for y-axis labels
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
                {ordersSales.timeSeries?.every((t) => t.totalMoneyPaid === 0) && (
                  <text x="50%" y="50%" textAnchor="middle" fill="rgba(0, 0, 0, 0.5)" fontSize="14">
                    No Sales Data
                  </text>
                )}
              </LineChart>
            )}
          </div>
        </>
      )}

      {userRole === "merchant" && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 font-inter">
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
                    width={500}
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
                    width={500}
                    height={200}
                  />
                )}
              </div>
            </div>
            {/* Order Stats */}
            <div className="px-4 py-3.5 rounded-2xl bg-white xl:col-span-2 w-full">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="p-3 text-[#DB2777] bg-[#FCE7F3] rounded-full w-fit">
                    <FaTags className="text-3xl" />
                  </div>
                  <p className="my-4 text-[#6E7786] text-sm font-semibold">Paid Orders Stats</p>
                  <h3 className="text-sm font-normal text-[#6E7786]">
                    <span className="text-2xl font-bold text-title-blue mr-2">
                      {totalOrders.reduce((a, b) => a + b, 0) || 0} <span className="font-normal text-xl">Orders</span>
                      <br />
                      {totalRevenue.reduce((a, b) => a + b, 0) || 0} <span className="font-normal text-xl">Revenue</span>
                    </span>

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
                    width={700}
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
                <p className="text-[#6E7786] text-lg">
                  {
                    (activePeriod === "weekly") ? `Sales for ${moment().format("MMMM D, YYYY")} Week` :
                      (activePeriod === "monthly") ? `Sales for ${moment().format("MMMM YYYY")}` :
                        `Sales for ${moment().year()}`
                  }
                </p>
                <h3 className="flex items-center gap-2 text-[#6E7786]">
                  <span className="font-bold text-3xl text-[#1E1B39]">
                    EGP {(totalSales || 0).toLocaleString()}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm ${parseFloat(growthRate || 0) >= 0 ? "text-[#04CE00]" : "text-[#DC2626]"
                      }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${parseFloat(growthRate || 0) >= 0 ? "bg-[#04CE00]" : "bg-[#DC2626]"
                        }`}
                    ></div>
                    {growthRate || 0}%
                  </span>
                  {(activePeriod === "weekly") ? "VS LAST WEEK" :
                    (activePeriod === "monthly") ? "VS LAST MONTH" : "VS LAST YEAR"
                  }
                </h3>
              </div>
              <div className="flex bg-[#F8F9FF] rounded-lg overflow-hidden items-center">
                <button
                  onClick={() => setActivePeriod("Weekly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Weekly" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActivePeriod("Monthly")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Monthly" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActivePeriod("Annually")}
                  className={`px-4 py-2.5 text-sm rounded-lg ${activePeriod === "Annually" ? "font-medium text-white bg-title-blue" : ""
                    }`}
                >
                  Annually
                </button>
              </div>
            </div>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <LineChart
                xAxis={[
                  {
                    labelOffset: 1,
                    tickLabelStyle: { fontSize: 12, fill: "#6E7786" },
                    scaleType: "point",
                    data: salesGrowth.timeSeries?.map((t) => t.label) || [],
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: { fontSize: 12, fill: "#6E7786" },
                    valueFormatter: (value) => `${Math.round(value)}`, // Raw EGP
                    min: 0,
                    max:
                      Math.max(
                        ...(salesGrowth.timeSeries?.map((t) => t.totalMoneyPaid) || [0]),
                        50
                      ) * 1.2, // 20% headroom
                    tickValues: (() => {
                      const maxData = Math.max(
                        ...(salesGrowth.timeSeries?.map((t) => t.totalMoneyPaid) || [0]),
                        50
                      );
                      const baseTicks = [50, 100, 200, 500, 1000];
                      if (maxData > 1000) {
                        let nextTick = 2000;
                        const extendedTicks = [...baseTicks];
                        while (nextTick <= maxData * 1.2) {
                          extendedTicks.push(nextTick);
                          nextTick = nextTick < 5000 ? nextTick * 2.5 : nextTick * 2;
                        }
                        return extendedTicks;
                      }
                      return baseTicks.filter((tick) => tick <= maxData * 1.2);
                    })(),
                    position: "left",
                    margin: { left: 60 }, // Ensure space for labels
                  },
                ]}
                grid={{ horizontal: true }}
                series={[
                  {
                    curve: "linear",
                    data: salesGrowth.timeSeries?.map((t) => t.totalMoneyPaid) || [],
                    area: true,
                    showMark: false,
                    color: "url(#Gradient7)",
                    valueFormatter: (value) => `EGP ${value.toLocaleString()}`,
                  },
                ]}
                slotProps={{
                  tooltip: {
                    sx: {
                      [`& .${chartsTooltipClasses.labelCell}`]: { display: "none" },
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
                  [`& .${lineElementClasses.root}`]: { stroke: "rgba(21, 37, 63)", strokeWidth: 3 },
                  "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                    transform: "translateX(-10px)", // Adjust label position
                  },
                }}
                height={300}
                margin={{ top: 20, bottom: 30, left: 60, right: 10 }} // Adjust for y-axis labels
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
                {salesGrowth.timeSeries?.every((t) => t.totalMoneyPaid === 0) && (
                  <text x="50%" y="50%" textAnchor="middle" fill="rgba(0, 0, 0, 0.5)" fontSize="14">
                    No Sales Data
                  </text>
                )}
              </LineChart>
            )}
          </div>
        </>
      )}


    </div>
  );
};

export default Analytics;