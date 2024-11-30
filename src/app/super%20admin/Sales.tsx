import React, { useState } from "react";
import SalesBarChart from "../components/SalesBarChart";
import SalesSummary from "../components/SalesSummary";
import SalesDetails from "../components/SalesDetails";
import SalesToday from "../components/SalesToday";
import { SaleProps } from "../Types";

const Sales = () => {
  const [sales, setSales] = useState<SaleProps>({
    yesterdaySales: 0,
    todaySales: 0,
    yesterdayOrders: 0,
    todayOrders: 0,
    yesterdayProductsSold: 0,
    todayProductsSold: 0,
    lastWeekSales: 0,
    thisWeekSales: 0,
    lastMonthSales: 0,
    thisMonthSales: 0,
    lastYearSales: 0,
    thisYearSales: 0,
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  return (
    <div className="w-full flex flex-col gap-8 px-4 lg:px-12">
      {/* Top Section: Sales and Details */}
      <div className="lg:flex lg:gap-12 lg:mb-10">
        <div className="lg:w-3/4 w-full">
          <h1 className="text-3xl font-semibold mb-6">Sales</h1>
          <SalesBarChart setSales={setSales} />
        </div>
        <div className="lg:w-1/3 w-full flex flex-col gap-6">
          <h1 className="text-3xl font-semibold mb-6">Details</h1>
          <SalesDetails sales={sales} />
        </div>
      </div>

      {/* Bottom Section: Summary and Today's Sales */}
      <div className="lg:flex lg:gap-12">
        <div className="lg:w-1/2 w-full px-6 py-8 border-2 border-foreground/30 rounded-2xl mb-6 lg:mb-0">
          <SalesSummary sales={sales} />
        </div>
        <div className="lg:w-1/2 w-full p-6 bg-foreground/30 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Today&apos;s Sales</h1>
          <p className="mb-4">Sales Summary</p>
          <SalesToday sales={sales} />
        </div>
      </div>
    </div>
  );
};

export default Sales;
