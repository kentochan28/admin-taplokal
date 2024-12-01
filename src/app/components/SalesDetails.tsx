import React from "react";
import { SaleProps } from "../Types";

const SalesDetails = ({ sales }: { sales: SaleProps }) => {
  const { totalSales, totalProducts, totalOrders } = sales;

  const renderDetail = (
    label: string,
    value: number | string,
    isCurrency: boolean = false
  ) => (
    <div className="px-4 py-6 rounded-xl bg-foreground/30">
      <h1 className="text-xl font-bold">{label}</h1>
      <p className="text-base">
        {typeof value === "number"
          ? isCurrency
            ? `₱${value.toLocaleString()}.00`
            : value.toLocaleString()
          : value}
      </p>
    </div>
  );

  return (
    <>
      {renderDetail("Total Sales", totalSales, true)}
      {renderDetail("Total Products Sold", totalProducts)}
      {renderDetail("Total Order", totalOrders)}
    </>
  );
};

export default SalesDetails;
