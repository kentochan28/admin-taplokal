import React from "react";
import { SaleProps } from "../Types";

const SalesSummary = ({ sales }: { sales: SaleProps }) => {
  const {
    thisWeekSales,
    lastWeekSales,
    thisMonthSales,
    lastMonthSales,
    thisYearSales,
    lastYearSales,
  } = sales;

  const renderComparisonIcon = (current: number, previous: number) => {
    const isHigher = (previous ?? 0) < (current ?? 0);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-8 ${isHigher ? "stroke-green-500" : "stroke-red-500"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            isHigher
              ? "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              : "M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
          }
        />
      </svg>
    );
  };

  const renderPeriod = (
    label: string,
    thisPeriod: number,
    lastPeriod: number
  ) => (
    <div className="flex flex-row justify-between my-4">
      <h1 className="text-base font-bold">{label}</h1>
      <div className="flex flex-row items-center gap-2 w-36">
        {renderComparisonIcon(thisPeriod, lastPeriod)}
        <div>
          <h1 className="text-sm font-bold">{`Last ${label}`}</h1>
          <p className="text-xs">₱{lastPeriod.toLocaleString()}.00</p>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-sm font-bold">{`This ${label}`}</h1>
        <p className="text-xs">₱{thisPeriod.toLocaleString()}.00</p>
      </div>
    </div>
  );

  return (
    <div>
      {renderPeriod("Week", thisWeekSales, lastWeekSales)}
      <hr />
      {renderPeriod("Month", thisMonthSales, lastMonthSales)}
      <hr />
      {renderPeriod("Year", thisYearSales, lastYearSales)}
    </div>
  );
};

export default SalesSummary;
